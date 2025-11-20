import { createTRPCContext, procedure } from "@tcsw/workspaces-instance/src/subsystems/trpcRouter";
import { initTRPC } from "@trpc/server";
import z from "zod";

const log = instance.log.createLogger("uk.tcsw.dashboard");

export const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

const router = t.router({
    widgets: {
        user: {
            profile: procedure
                .output(
                    z.object({
                        displayName: z.string(),
                        username: z.string(),
                    }),
                )
                .query(async (opt) => {
                    const db = instance.subSystems.database.db();

                    const { forename, surname, username } = (
                        await db`SELECT forename, surname, username FROM Users WHERE id = ${opt.ctx.userId}`
                    )?.[0] || { forename: "Unknown", surname: "", username: "@unknown" };

                    return {
                        displayName: `${forename} ${surname}`,
                        username: username,
                    };
                }),
        },
    },
});

export type TRPCRouter = typeof router;

instance.subSystems.tRPC.registeredRouters.push({
    basePath: "/app/uk.tcsw.dashboard",
    router: router,
    createContext: createTRPCContext(instance),
});
