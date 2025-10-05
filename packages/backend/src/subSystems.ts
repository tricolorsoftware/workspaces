import {Instance} from "./index.js";
import type {Logger} from "./log.js";
import type ConfigurationSubsystem from "./subsystems/configuration.js";
import type ConsoleCommandsSubsytem from "./subsystems/consoleCommands.js";
import type FilesystemSubsystem from "./subsystems/filesystem.js";
import type NotificationsSubsystem from "./subsystems/notifications.js";
import type UsersSubsystem from "./subsystems/users.js";

export type SubSystems = {
    "users": UsersSubsystem,
    "notifications": NotificationsSubsystem,
    "filesystem": FilesystemSubsystem,
    "configuration": ConfigurationSubsystem,
    "consoleCommands": ConsoleCommandsSubsytem
} & {[ key: string ]: SubSystem}

export default abstract class SubSystem {
    instance: Instance
    readonly log: Logger;
    readonly id: string;

    protected constructor(id: string, instance: Instance) {
        this.instance = instance;
        this.id = id;
        this.log = instance.log.createLogger(this.id)

        return this;
    }

    startup() {
        return this;
    }

    stop() {
        this.instance.log.system.info(`Stopping SubSystem ${this.id}`)

        return this;
    }
}
