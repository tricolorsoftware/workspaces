import { Server } from "bun";
import { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import { TRPCBuiltRouter } from "@trpc/server";

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

    serve(options: object) {
        // TODO: this
        return { ...options };
    }
}
