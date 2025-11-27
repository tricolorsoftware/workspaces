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
import utils from "node:util";

export type CreateBunWSSContextFnOptions = NodeHTTPCreateContextFnOptions<Request, ServerWebSocket<BunWSClientCtx<AnyRouter>>>;

export type BunWSAdapterOptions<TRouter extends AnyRouter> = BaseHandlerOptions<TRouter, Request> &
    CreateContextCallback<inferRouterContext<TRouter>, (opts: CreateBunWSSContextFnOptions) => MaybePromise<inferRouterContext<TRouter>>>;

export type BunWSClientCtx<TRouter extends AnyRouter> = {
    req: Request;
    abortController: AbortController;
    abortControllers: Map<string | number, AbortController>;
    ctx: Promise<inferRouterContext<TRouter>> | ((params: TRPCRequestInfo["connectionParams"]) => Promise<inferRouterContext<TRouter>>);
    url?: URL;
};

export function createBunWSHandler<TRouter extends AnyRouter>(
    instance: Instance,
    opts: BunWSAdapterOptions<TRouter>,
): WebSocketHandler<BunWSClientCtx<TRouter>> {
    // helper to pick the registered router whose basePath best matches (longest match)
    function findBestRouter(url: URL) {
        const registered = instance.subSystems.tRPC.registeredRouters ?? [];
        let best: any = undefined;
        let bestLen = -1;
        for (const rr of registered) {
            if (typeof rr.basePath !== "string") continue;
            if (url.pathname.startsWith(rr.basePath) && rr.basePath.length > bestLen) {
                best = rr;
                bestLen = rr.basePath.length;
            }
        }
        return best;
    }

    // Build a minimal TRPC error shape for cases where we don't have access to a router config
    function buildMinimalErrorShape(e: unknown, codeFallback = "INTERNAL_SERVER_ERROR") {
        const err = e as any;
        const code = typeof err?.code === "string" ? err.code : codeFallback;
        const message = typeof err?.message === "string" ? err.message : String(err ?? "");
        const data = err?.data ?? null;
        return { code, message, data };
    }

    // respond: if a router config is provided, we transform the response as tRPC expects;
    // otherwise we send the raw message.
    const respond = (client: ServerWebSocket<unknown>, untransformedJSON: TRPCResponseMessage, config?: any) => {
        // guard for client already closed
        try {
            if (config) {
                client.send(JSON.stringify(transformTRPCResponse(config, untransformedJSON)));
            } else {
                client.send(JSON.stringify(untransformedJSON));
            }
        } catch {
            // swallowing, nothing else we can do
        }
    };

    async function createClientCtx(
        client: ServerWebSocket<BunWSClientCtx<inferRouterContext<TRouter>>>,
        url: URL,
        connectionParams: TRPCRequestInfo["connectionParams"],
    ) {
        const router = findBestRouter(url);

        if (!router) {
            const msg = `No tRPC router is registered to handle path ${url.pathname}`;
            respond(client, {
                id: null,
                error: buildMinimalErrorShape({ message: msg, code: "NOT_FOUND" }),
            });
            try {
                client.close();
            } catch {
                // ignore
            }
            // throw so callers know it failed
            throw new TRPCError({
                code: "NOT_FOUND",
                message: msg,
            });
        }

        const ctxPromise = router.createContext?.({
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
            respond(
                client,
                {
                    id: null,
                    error: getErrorShape({
                        config: router._def._config,
                        error,
                        type: "unknown",
                        path: undefined,
                        input: undefined,
                        ctx: undefined,
                    }),
                },
                router._def._config,
            );
            throw error;
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

        // find router for this client's url
        const url = client.data.url ?? createURL(client as any);
        const router = findBestRouter(url);
        if (!router) {
            const error = new TRPCError({
                code: "NOT_FOUND",
                message: `No tRPC router is registered to handle path ${url.pathname}`,
            });
            opts.onError?.({ error, path, type, ctx: undefined, req, input });
            respond(client, {
                id,
                jsonrpc,
                error: buildMinimalErrorShape(error),
            });
            return;
        }

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
                respond(
                    client,
                    {
                        id,
                        jsonrpc,
                        result: {
                            type: "data",
                            data: result,
                        },
                    },
                    router._def._config,
                );
                return;
            }

            if (!isIterableResult) {
                throw new TRPCError({
                    message: `Subscription ${path} did not return an observable or a AsyncGenerator`,
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            // determine WebSocket OPEN state; fall back to 1 if WebSocket isn't available in this environment
            const WS_OPEN = (globalThis as any).WebSocket?.OPEN ?? 1;
            if (client.readyState !== WS_OPEN) {
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
                        respond(
                            client,
                            {
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
                            },
                            router._def._config,
                        );
                        break;
                    }

                    if (next.done) {
                        break;
                    }

                    const resultMessage: TRPCResultMessage<unknown>["result"] = {
                        type: "data",
                        data: next.value,
                    };

                    if (isTrackedEnvelope(next.value)) {
                        const [envelopeId, data] = next.value;
                        resultMessage.id = envelopeId;
                        resultMessage.data = {
                            id: envelopeId,
                            data,
                        };
                    }

                    respond(
                        client,
                        {
                            id,
                            jsonrpc,
                            result: resultMessage,
                        },
                        router._def._config,
                    );
                }

                await iterator.return?.();
                respond(
                    client,
                    {
                        id,
                        jsonrpc,
                        result: {
                            type: "stopped",
                        },
                    },
                    router._def._config,
                );
            })
                .catch((cause) => {
                    const error = getTRPCErrorFromUnknown(cause);
                    opts.onError?.({ error, path, type, ctx, req, input });
                    respond(
                        client,
                        {
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
                        },
                        router._def._config,
                    );
                    abortController.abort();
                })
                .finally(() => {
                    clientAbortControllers.delete(id);
                });

            respond(
                client,
                {
                    id,
                    jsonrpc,
                    result: {
                        type: "started",
                    },
                },
                router._def._config,
            );
        } catch (cause) {
            // procedure threw an error
            const error = getTRPCErrorFromUnknown(cause);
            opts.onError?.({ error, path, type, ctx, req, input });
            const url = client.data.url ?? createURL(client as any);
            const router = findBestRouter(url);
            respond(
                client,
                {
                    id,
                    jsonrpc,
                    error: router
                        ? getErrorShape({
                              config: router._def._config,
                              error,
                              type,
                              path,
                              input,
                              ctx,
                          })
                        : buildMinimalErrorShape(error),
                },
                router?._def._config,
            );
        }
    }

    return {
        open(client) {
            client.data.abortController = new AbortController();
            client.data.abortControllers = new Map();

            const url = createURL(client as any);
            client.data.url = url;
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

                // ensure we have a url assigned (open should have set it, but be defensive)
                if (!client.data.url) {
                    client.data.url = createURL(client as any);
                }

                // Determine router for parsing (needs transformer's presence)
                const router = findBestRouter(client.data.url);
                if (!router) {
                    respond(client, {
                        id: null,
                        error: buildMinimalErrorShape({
                            message: `No tRPC router is registered to handle path ${client.data.url.pathname}`,
                            code: "NOT_FOUND",
                        }),
                    });
                    return;
                }

                if (client.data.ctx instanceof Function) {
                    const msg = msgs.shift() as TRPCConnectionParamsMessage;
                    client.data.ctx = client.data.ctx(parseConnectionParamsFromUnknown(msg.data));
                }

                const promises: Promise<void>[] = [];

                for (const raw of msgs) {
                    const msg = parseTRPCMessage(raw, router._def._config.transformer);
                    promises.push(handleRequest(client as any, msg));
                }

                await Promise.all(promises);
            } catch (cause) {
                const url =
                    client.data.url ??
                    (() => {
                        try {
                            return createURL(client as any);
                        } catch {
                            return new URL("http://localhost/");
                        }
                    })();

                const router = findBestRouter(url);
                const error = new TRPCError({
                    code: "PARSE_ERROR",
                    cause,
                });

                respond(
                    client,
                    {
                        id: null,
                        error: router
                            ? getErrorShape({
                                  config: router._def._config,
                                  error,
                                  type: "unknown",
                                  path: undefined,
                                  input: undefined,
                                  ctx: undefined,
                              })
                            : buildMinimalErrorShape(error),
                    },
                    router?._def._config,
                );
            }
        },
    };
}

// util functions of @trpc/server that are not exported, unfortunately
function isAsyncIterable<TValue>(value: unknown): value is AsyncIterable<TValue> {
    return isObject(value) && Symbol.asyncIterator in (value as any);
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

        const protocol = client && "encrypted" in client && (client as any).encrypted ? "https:" : "http:";

        // keep for debugging / to avoid unused import error
        utils.inspect(req);

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
