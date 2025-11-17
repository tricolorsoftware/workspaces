import { createTRPCContext, procedure } from "@tcsw/workspaces-instance/src/subsystems/trpc/trpc";
import { initTRPC } from "@trpc/server";
import z from "zod";

const log = instance.log.createLogger("uk.tcsw.store");

export const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

const router = t.router({
    homepage: {},
    manageInstalled: {
        getApplications: procedure
            .output(
                z.object({
                    applications: z
                        .object({
                            id: z.string(),
                            displayName: z.string(),
                            version: z.string(),
                        })
                        .array(),
                    installed: z.string().array(),
                }),
            )
            .query(async () => {
                return {
                    applications: instance.subSystems.applications.availableApplications
                        .map((app) => {
                            if (!app.manifest) return undefined;

                            return {
                                id: app.manifest.id,
                                displayName: app.manifest.displayName || app.manifest.id,
                                version: app.manifest.version || "rolling",
                            };
                        })
                        .filter((a) => a !== undefined),
                    installed: [],
                };
            }),
    },
});

export type TRPCRouter = typeof router;

instance.subSystems.tRPC.registeredRouters.push({
    basePath: "/app/uk.tcsw.store",
    router: router,
    createContext: createTRPCContext(instance),
});
