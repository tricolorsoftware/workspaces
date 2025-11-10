import { createTRPCContext, procedure } from "@tcsw/workspaces-instance/src/subsystems/trpc/trpc";
import { initTRPC } from "@trpc/server";
import z from "zod";

const log = instance.log.createLogger("uk.tcsw.store");

export const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

const router = t.router({
    homepage: {},
});

export type TRPCRouter = typeof router;

instance.subSystems.tRPC.registeredRouters.push({
    basePath: "/app/uk.tcsw.store",
    router: router,
    createContext: createTRPCContext(instance),
});
