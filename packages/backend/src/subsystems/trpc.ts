import { initTRPC } from "@trpc/server";
import { z } from "zod";

export const t = initTRPC.create();

export const workspacesRouter = t.router({
    internals: {
        test: t.procedure.output(z.object({ status: z.string() })).query(() => {
            return {
                status: "ok",
            };
        }),
    },
});

export type WorkspacesTRPCRouter = typeof workspacesRouter;
