import { initTRPC } from "@trpc/server";
import z from "zod";
import { Instance } from "../index.js";
import { AuthorizedDeviceType } from "./authorization.js";

export const t = initTRPC.create();

export const publicProcedure = t.procedure;

export const workspacesRouter = (instance: Instance) =>
    t.router({
        authorization: {
            signup: publicProcedure
                .input(
                    z.object({
                        username: z.string(),
                        password: z.string(),
                        emailAddress: z.string(),
                        emailCode: z.string(),
                        displayName: z.string(),
                        gender: z.string(),
                        bio: z.string(),
                    }),
                )
                .output(
                    z.union([
                        z.object({ type: z.literal("error"), message: z.string() }),
                        z.object({ type: z.literal("success"), sessionToken: z.string() }),
                    ]),
                )
                .mutation(async (opt) => {
                    // TODO: implement this

                    if (opt.input.emailCode !== "[WHATEVER IT WAS]")
                        return {
                            type: "error",
                            message: "The email code did not match!",
                        };

                    const uid = await instance.subSystems.users.createUser(opt.input.username);

                    if (uid === undefined)
                        return {
                            type: "error",
                            message: "Failed to create the user",
                        };

                    const user = await instance.subSystems.users.getUser(uid);

                    let splitDisplayName = opt.input.displayName.split(" ");
                    await user.setFullName(splitDisplayName[0], splitDisplayName.slice(1).join(" "));

                    await user.setQuota(20);

                    await instance.subSystems.authorization.setPassword(user.userId, opt.input.password);

                    const session = await instance.subSystems.authorization.createSession(
                        user.userId,
                        opt.input.password,
                        AuthorizedDeviceType.UnknownBrowser,
                    );

                    if (session === undefined) {
                        return {
                            type: "error",
                            message: "Failed to create a session?",
                        };
                    }

                    return {
                        type: "success",
                        sessionToken: session,
                    };
                }),
        },
    });

export type WorkspacesTRPCRouter = ReturnType<typeof workspacesRouter>;
