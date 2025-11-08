import { BunRequest, Server } from "bun";
import { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import { TRPCBuiltRouter } from "@trpc/server";
import { createTRPCContext } from "./trpc/trpc.js";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export default class TRPCSubsystem extends SubSystem {
    registeredRouters: { basePath: string; router: TRPCBuiltRouter<any, any> }[];

    constructor(instance: Instance) {
        super("trpc", instance);

        this.registeredRouters = [];

        return this;
    }

    async startup(): Promise<boolean> {
        return true;
    }

    /*
    createBunServeHandler(
        {
            router: workspacesRouter,
            endpoint: "/trpc",
            onError: (...p: any[]) => {
                // Do nothing as the error is most-likely from bun.serve for tRPC contentType, (i have no clue why as everything else is working)
                if (p[0].type === "unknown") return;
                if (p[0].error.code === "UNAUTHORIZED") return;

                console.error(p[0].error);
                this.log.system.error("^");
            },
            createContext(opt: { req: BunRequest; resHeaders: Headers }) {
                return createTRPCContext({ rawRequest: { req: opt.req, resHeaders: opt.resHeaders }, instance: self });
            },
            responseMeta() {
                return {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "http://localhost:5173", // TODO: change this according to a config file
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                        "Access-Control-Allow-Credentials": "true",
                    },
                };
            },
            batching: { enabled: true },
            emitWsUpgrades: false,
        },
    */

    private attemptTRPCRequest(req: BunRequest, server: Server<ReturnType<typeof createTRPCContext>>) {
        const url = new URL(req.url);

        for (const router of this.registeredRouters) {
            if (!url.pathname.startsWith(router.basePath)) {
                continue;
            }

            if (server.upgrade(req, { data: { instance: this.instance, rawRequest: { req: req, resHeaders: new Headers() } } })) {
                return new Response(null, { status: 101 });
            }

            return fetchRequestHandler({
                createContext: () => ({}) as never,
                req,
                endpoint: router.basePath ?? "",
            });
        }

        return;
    }

    serve(options: { routes: object; fetch(request: any, server: any): Response; development: boolean }) {
        const self = this;

        return {
            ...options,
            async fetch(req: BunRequest, server: Server<ReturnType<typeof createTRPCContext>>) {
                let trpcResponse = self.attemptTRPCRequest(req, server);

                if (trpcResponse) {
                    return trpcResponse;
                }

                return options?.fetch?.call(server, req, server);
            },
            // TODO: implement websocket transport support
            // websocket: createBunWSHandler(opts),
        };
    }
}
