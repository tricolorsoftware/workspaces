import { SubSystems } from "./subSystems.js";
import Log from "./log.js";
import ConfigurationSubsystem from "./subsystems/configuration.js";
import FilesystemSubsystem from "./subsystems/filesystem.js";
import NotificationsSubsystem from "./subsystems/notifications.js";
import UsersSubsystem from "./subsystems/users.js";
import ConsoleCommandsSubsytem from "./subsystems/consoleCommands.js";
import DatabaseSubsystem from "./subsystems/database.js";
import AuthorizationSubsystem from "./subsystems/authorization.js";
// https://github.com/cah4a/trpc-bun-adapter/blob/main/src/createBunHttpHandler.ts TODO: patch this and merge into the instance package
import { BunWSClientCtx, createBunServeHandler } from "trpc-bun-adapter";
import { AnyRouter } from "@trpc/server";
import { createTRPCContext, workspacesRouter } from "./subsystems/trpc.js";
import { BunRequest, file } from "bun";
import ApplicationsSubsystem from "./subsystems/applications.js";
import path from "path";

export enum InstanceStatus {
    Online,
    Offline,
    StartingUp,
    Stopping,
}

class Instance {
    subSystems: SubSystems;
    log: Log;
    webServer!: Bun.Server<BunWSClientCtx<AnyRouter>>;
    status: InstanceStatus;

    constructor() {
        this.log = new Log(this);

        // @ts-ignore Don't know, don't care
        this.subSystems = {};

        this.subSystems.configuration = new ConfigurationSubsystem(this);
        this.subSystems.filesystem = new FilesystemSubsystem(this);
        this.subSystems.notifications = new NotificationsSubsystem(this);
        this.subSystems.consoleCommands = new ConsoleCommandsSubsytem(this);
        this.subSystems.database = new DatabaseSubsystem(this);
        this.subSystems.users = new UsersSubsystem(this);
        this.subSystems.authorization = new AuthorizationSubsystem(this);
        this.subSystems.applications = new ApplicationsSubsystem(this);

        this.status = InstanceStatus.Offline;

        return this;
    }

    async startup() {
        if (this.status !== InstanceStatus.Offline) {
            this.log.system.info("Cannot stop");
            return this;
        }

        for (const sys of Object.values(this.subSystems)) {
            let subSystemState = await sys.startup();

            if (subSystemState === true) {
                sys.log.success("Startup Complete...");
            } else {
                sys.log.error("Startup Failed!");
            }
        }

        const self = this;

        this.webServer = Bun.serve(
            // TODO: change this so that multiple applications can have their own tRPC on separate routes e.g: /app/uk.tcsw.dashboard/trpc
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
                {
                    port: 3563,
                    routes: {
                        "/api/user/me/avatar/:size": {
                            GET: async (req: BunRequest) => {
                                const size = (req.params as { size: string }).size;

                                const cookieString = req.headers?.get("cookie");

                                if (cookieString === null) {
                                    throw Response.json({ code: "UNAUTHORIZED", message: "missing auth cookie" });
                                }

                                const parsedCookie = Bun.Cookie.parse(cookieString);

                                let userId = await self.subSystems.authorization.verifySession(decodeURIComponent(parsedCookie.value));

                                if (userId === undefined) {
                                    throw Response.json({ code: "UNAUTHORIZED", message: "invalid session" });
                                }

                                switch (size) {
                                    case "xs":
                                    case "s":
                                    case "m":
                                    case "l":
                                    case "xl":
                                        // do nothing
                                        break;
                                    default:
                                        return new Response(
                                            file(path.join(self.subSystems.filesystem.FS_ROOT, `users/${userId}/assets/avatar/xs.png`)),
                                        );
                                }

                                return new Response(
                                    file(path.join(self.subSystems.filesystem.FS_ROOT, `users/${userId}/assets/avatar/${size}.png`)),
                                );
                            },
                        },
                    },
                    fetch(request, server) {
                        // will be executed if it's not a TRPC request
                        return new Response("Unknown path");
                    },
                    development: this.subSystems.configuration.isDevmode,
                },
            ),
        );
        this.log.system.success(`Listening for requests on port ${3563}`);

        this.log.system.info("Startup complete");

        return this;
    }

    async promptForRestart(reason: string): Promise<this> {
        this.log.system.warning(
            `Hey Server Admin, THE INSTANCE HAS BEEN PROMPTED FOR RESTART DUE TO '${reason}' please restart when possible.`,
        );
        return this;
    }

    async shutdown() {
        this.subSystems.consoleCommands.currentCommandInterface.active = true;
        this.subSystems.consoleCommands.currentCommandInterface.cb = () => 0;
        this.log.system.info("Shutting down...");

        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        process.exit(0);

        return this;
    }
}

const INSTANCE = new Instance();

export default INSTANCE;
export type { Instance };

await INSTANCE.startup();
