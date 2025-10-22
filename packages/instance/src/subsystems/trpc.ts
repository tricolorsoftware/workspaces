import { initTRPC, TRPCError } from "@trpc/server";
import z from "zod";
import { Instance } from "../index.js";
import { AuthorizedDeviceType } from "./authorization.js";
import { BunRequest } from "bun";
import { USERS_DATABASE_CONNECTION_ID } from "./users.js";

export const createTRPCContext = (opt: { rawRequest: { req: BunRequest; resHeaders: Headers }; instance: Instance }) => {
    return {
        rawRequest: {
            req: opt.rawRequest.req,
            resHeaders: opt.rawRequest.resHeaders,
        },
        instance: opt.instance,
    };
};

export const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

export const publicProcedure = t.procedure.use(async (opt) => {
    return opt.next({
        ctx: {
            userId: "THIS CAN ONLY BE ACCESSED FROM A NON-PUBLIC PROCEDURE",
        },
    });
});
export const procedure = t.procedure.use(async (opt) => {
    // console.log(opt.ctx.req.headers);

    /*
    if (!ctx.user?.isAdmin) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    */

    const cookieString = opt.ctx.rawRequest.req.headers?.get("cookie");

    if (cookieString === null) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "missing auth cookie" });
    }

    const parsedCookie = Bun.Cookie.parse(cookieString);

    let userId = await opt.ctx.instance.subSystems.authorization.verifySession(decodeURIComponent(parsedCookie.value));

    if (userId === undefined) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "invalid session" });
    }

    return opt.next({
        ctx: {
            userId: userId,
        },
    });
});

export const workspacesRouter = t.router({
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

                if (opt.input.emailCode !== "a")
                    return {
                        type: "error",
                        message: "The email code did not match!",
                    };

                const uid = await opt.ctx.instance.subSystems.users.createUser(opt.input.username);

                if (uid === undefined)
                    return {
                        type: "error",
                        message: "Failed to create the user",
                    };

                const user = await opt.ctx.instance.subSystems.users.getUserById(uid);

                if (user === undefined)
                    return {
                        type: "error",
                        message: "Failed to fetch the user",
                    };

                let splitDisplayName = opt.input.displayName.split(" ");
                await user.setFullName(splitDisplayName[0], splitDisplayName.slice(1).join(" "));

                await user.setQuota(20);

                await opt.ctx.instance.subSystems.authorization.setPassword(user.userId, opt.input.password);

                const session = await opt.ctx.instance.subSystems.authorization.createSession(
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
        signin: publicProcedure
            .input(z.object({ username: z.string(), password: z.string() }))
            .output(
                z.union([
                    z.object({ type: z.literal("error"), message: z.string() }),
                    z.object({ type: z.literal("success"), sessionToken: z.string() }),
                ]),
            )
            .mutation(async (opt) => {
                const user = await opt.ctx.instance.subSystems.users.getUserByUsername(opt.input.username);

                if (user === undefined)
                    return {
                        type: "error",
                        message: "Failed to find the user",
                    };

                const session = await opt.ctx.instance.subSystems.authorization.createSession(
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

                opt.ctx.rawRequest.resHeaders.set("set-cookie", Bun.Cookie.from("Authorization", session, { secure: true }).serialize());

                return {
                    type: "success",
                    sessionToken: session,
                };
            }),
        isAuthenticated: procedure.output(z.object({ authenticated: z.boolean() })).query(() => {
            return {
                authenticated: true,
            };
        }),
    },
    app: {
        navigation: {
            user: {
                name: procedure.output(z.object({ username: z.string(), forename: z.string(), surname: z.string() })).query(async (opt) => {
                    const db = opt.ctx.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

                    const user = (await db`SELECT username, forename, surname FROM Users WHERE id = ${opt.ctx.userId};`)?.[0];

                    if (!user) {
                        throw new TRPCError({ code: "NOT_FOUND", cause: { message: "User does not exist" } });
                    }

                    return {
                        username: user.username || "@",
                        forename: user.forename || "Unknown",
                        surname: user.surname || "",
                    };
                }),
            },
        },
    },
});

export type WorkspacesTRPCRouter = typeof workspacesRouter;
