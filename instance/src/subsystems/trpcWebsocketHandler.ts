/*
Copyright (c) Composer & Copyright © 2025 Tricolor Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import {
    TRPCError,
    callTRPCProcedure,
    getErrorShape,
    getTRPCErrorFromUnknown,
    type inferRouterContext,
    isTrackedEnvelope,
    transformTRPCResponse,
} from "@trpc/server";
import type { AnyRouter } from "@trpc/server";
import { parseConnectionParamsFromUnknown } from "@trpc/server/http";
import type { TRPCRequestInfo } from "@trpc/server/http";
import { isObservable, observableToAsyncIterable } from "@trpc/server/observable";
import { type TRPCClientOutgoingMessage, type TRPCResponseMessage, type TRPCResultMessage, parseTRPCMessage } from "@trpc/server/rpc";
import type { CreateContextCallback } from "@trpc/server";
import type { BaseHandlerOptions } from "@trpc/server/http";
import type { TRPCConnectionParamsMessage } from "@trpc/server/rpc";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import type { MaybePromise } from "@trpc/server/unstable-core-do-not-import";
import type { ServerWebSocket, WebSocketHandler } from "bun";
import type { Instance } from "../index.js";

export type CreateBunWSSContextFnOptions = NodeHTTPCreateContextFnOptions<Request, ServerWebSocket<BunWSClientCtx<AnyRouter>>>;

export type BunWSAdapterOptions<TRouter extends AnyRouter> = BaseHandlerOptions<TRouter, Request> &
    CreateContextCallback<inferRouterContext<TRouter>, (opts: CreateBunWSSContextFnOptions) => MaybePromise<inferRouterContext<TRouter>>>;

export type BunWSClientCtx<TRouter extends AnyRouter> = {
    req: Request;
    abortController: AbortController;
    abortControllers: Map<string | number, AbortController>;
    ctx: Promise<inferRouterContext<TRouter>> | ((params: TRPCRequestInfo["connectionParams"]) => Promise<inferRouterContext<TRouter>>);
};

export function createBunWSHandler<TRouter extends AnyRouter>(instance: Instance): WebSocketHandler<BunWSClientCtx<TRouter>> {
    const respond = (client: ServerWebSocket<unknown>, untransformedJSON: TRPCResponseMessage) => {
        client.data;
        client.send(JSON.stringify(transformTRPCResponse(opts.router._def._config, untransformedJSON)));
    };

    async function createClientCtx(
        client: ServerWebSocket<BunWSClientCtx<inferRouterContext<TRouter>>>,
        url: URL,
        connectionParams: TRPCRequestInfo["connectionParams"],
    ) {
        const router = instance.subSystems.tRPC.registeredRouters.find((rr) => url.pathname.startsWith(rr.basePath));

        const ctxPromise = router?.createContext?.({
            req: client.data.req,
            info: {
                url,
                connectionParams,
                calls: [],
                isBatchCall: false,
                accept: null,
                type: "unknown",
                signal: client.data.abortController.signal,
            },
        });

        try {
            return await ctxPromise;
        } catch (cause) {
            const error = getTRPCErrorFromUnknown(cause);
            opts.onError?.({
                error,
                path: undefined,
                type: "unknown",
                ctx: undefined,
                req: client.data.req,
                input: undefined,
            });
            respond(client, {
                id: null,
                error: getErrorShape({
                    config: router._def._config,
                    error,
                    type: "unknown",
                    path: undefined,
                    input: undefined,
                    ctx: undefined,
                }),
            });
        }
    }

    async function handleRequest(client: ServerWebSocket<BunWSClientCtx<inferRouterContext<TRouter>>>, msg: TRPCClientOutgoingMessage) {
        if (!msg.id) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "`id` is required",
            });
        }

        if (msg.method === "subscription.stop") {
            client.data.abortControllers.get(msg.id)?.abort();
            client.data.abortControllers.delete(msg.id);
            return;
        }

        const { id, method, jsonrpc } = msg;
        const type = method;
        const { path, lastEventId } = msg.params;
        const req = client.data.req;
        const clientAbortControllers = client.data.abortControllers;
        let { input } = msg.params;
        const ctx = await client.data.ctx;

        try {
            if (lastEventId !== undefined) {
                if (isObject(input)) {
                    input = {
                        ...input,
                        lastEventId: lastEventId,
                    };
                } else {
                    input ??= {
                        lastEventId: lastEventId,
                    };
                }
            }

            if (clientAbortControllers.has(id)) {
                // duplicate request ids for client
                throw new TRPCError({
                    message: `Duplicate id ${id}`,
                    code: "BAD_REQUEST",
                });
            }

            const abortController = new AbortController();
            const result = await callTRPCProcedure({
                router,
                path,
                getRawInput: () => Promise.resolve(input),
                ctx,
                type,
                signal: abortController.signal,
            });

            const isIterableResult = isAsyncIterable(result) || isObservable(result);

            if (type !== "subscription") {
                if (isIterableResult) {
                    throw new TRPCError({
                        code: "UNSUPPORTED_MEDIA_TYPE",
                        message: `Cannot return an async iterable or observable from a ${type} procedure with WebSockets`,
                    });
                }
                // send the value as data if the method is not a subscription
                respond(client, {
                    id,
                    jsonrpc,
                    result: {
                        type: "data",
                        data: result,
                    },
                });
                return;
            }

            if (!isIterableResult) {
                throw new TRPCError({
                    message: `Subscription ${path} did not return an observable or a AsyncGenerator`,
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            if (client.readyState !== WebSocket.OPEN) {
                // if the client got disconnected whilst initializing the subscription
                // no need to send stopped message if the client is disconnected
                return;
            }

            const iterable = isObservable(result) ? observableToAsyncIterable(result, abortController.signal) : result;

            const iterator: AsyncIterator<unknown> = iterable[Symbol.asyncIterator]();

            const abortPromise = new Promise<"abort">((resolve) => {
                abortController.signal.onabort = () => resolve("abort");
            });

            clientAbortControllers.set(id, abortController);
            run(async () => {
                while (true) {
                    const next = await Promise.race([iterator.next().catch(getTRPCErrorFromUnknown), abortPromise]);

                    if (next === "abort") {
                        await iterator.return?.();
                        break;
                    }

                    if (next instanceof Error) {
                        const error = getTRPCErrorFromUnknown(next);
                        opts.onError?.({
                            error,
                            path,
                            type,
                            ctx,
                            req,
                            input,
                        });
                        respond(client, {
                            id,
                            jsonrpc,
                            error: getErrorShape({
                                config: router._def._config,
                                error,
                                type,
                                path,
                                input,
                                ctx,
                            }),
                        });
                        break;
                    }

                    if (next.done) {
                        break;
                    }

                    const result: TRPCResultMessage<unknown>["result"] = {
                        type: "data",
                        data: next.value,
                    };

                    if (isTrackedEnvelope(next.value)) {
                        const [id, data] = next.value;
                        result.id = id;
                        result.data = {
                            id,
                            data,
                        };
                    }

                    respond(client, {
                        id,
                        jsonrpc,
                        result,
                    });
                }

                await iterator.return?.();
                respond(client, {
                    id,
                    jsonrpc,
                    result: {
                        type: "stopped",
                    },
                });
            })
                .catch((cause) => {
                    const error = getTRPCErrorFromUnknown(cause);
                    opts.onError?.({ error, path, type, ctx, req, input });
                    respond(client, {
                        id,
                        jsonrpc,
                        error: getErrorShape({
                            config: router._def._config,
                            error,
                            type,
                            path,
                            input,
                            ctx,
                        }),
                    });
                    abortController.abort();
                })
                .finally(() => {
                    clientAbortControllers.delete(id);
                });

            respond(client, {
                id,
                jsonrpc,
                result: {
                    type: "started",
                },
            });
        } catch (cause) {
            // procedure threw an error
            const error = getTRPCErrorFromUnknown(cause);
            opts.onError?.({ error, path, type, ctx, req, input });
            respond(client, {
                id,
                jsonrpc,
                error: getErrorShape({
                    config: router._def._config,
                    error,
                    type,
                    path,
                    input,
                    ctx,
                }),
            });
        }
    }

    return {
        open(client) {
            client.data.abortController = new AbortController();
            client.data.abortControllers = new Map();

            const url = createURL(client);
            client.data.ctx = createClientCtx.bind(null, client, url);

            const connectionParams = url.searchParams.get("connectionParams") === "1";

            if (!connectionParams) {
                client.data.ctx = client.data.ctx(null);
            }
        },

        async close(client) {
            client.data.abortController.abort();
            await Promise.all(Array.from(client.data.abortControllers.values(), (ctrl) => ctrl.abort()));
        },

        async message(client, message) {
            const msgStr = message.toString();

            if (msgStr === "PONG") {
                return;
            }

            if (msgStr === "PING") {
                client.send("PONG");
                return;
            }

            try {
                const msgJSON: unknown = JSON.parse(msgStr);
                const msgs: unknown[] = Array.isArray(msgJSON) ? msgJSON : [msgJSON];

                if (client.data.ctx instanceof Function) {
                    const msg = msgs.shift() as TRPCConnectionParamsMessage;
                    client.data.ctx = client.data.ctx(parseConnectionParamsFromUnknown(msg.data));
                }

                const promises = [];

                for (const raw of msgs) {
                    const msg = parseTRPCMessage(raw, router._def._config.transformer);
                    promises.push(handleRequest(client, msg));
                }

                await Promise.all(promises);
            } catch (cause) {
                const error = new TRPCError({
                    code: "PARSE_ERROR",
                    cause,
                });

                respond(client, {
                    id: null,
                    error: getErrorShape({
                        config: router._def._config,
                        error,
                        type: "unknown",
                        path: undefined,
                        input: undefined,
                        ctx: undefined,
                    }),
                });
            }
        },
    };
}

// util functions of @trpc/server that are not exported, unfortunately
function isAsyncIterable<TValue>(value: unknown): value is AsyncIterable<TValue> {
    return isObject(value) && Symbol.asyncIterator in value;
}

function run<TValue>(fn: () => TValue): TValue {
    return fn();
}

function isObject(value: unknown): value is Record<string, unknown> {
    return !!value && !Array.isArray(value) && typeof value === "object";
}

function createURL(client: ServerWebSocket<BunWSClientCtx<AnyRouter>>): URL {
    try {
        const req = client.data.req;

        const protocol = client && "encrypted" in client && client.encrypted ? "https:" : "http:";

        const host = req.headers.get("host") ?? "localhost";
        return new URL(req.url, `${protocol}//${host}`);
    } catch (cause) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid URL",
            cause,
        });
    }
}
