import { SubSystems } from "./subSystems.js";
import Log from "./log.js";
import ConfigurationSubsystem from "./subsystems/configuration.js";
import FilesystemSubsystem from "./subsystems/filesystem.js";
import NotificationsSubsystem from "./subsystems/notifications.js";
import UsersSubsystem from "./subsystems/users.js";
import ConsoleCommandsSubsytem from "./subsystems/consoleCommands.js";
import DatabaseSubsystem from "./subsystems/database.js";

export enum InstanceStatus {
    Online,
    Offline,
    StartingUp,
    Stopping,
}

class Instance {
    subSystems: SubSystems;
    log: Log;
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

        this.log.system.info("Startup complete");

        return this;
    }
}

const INSTANCE = new Instance();

export default INSTANCE;
export type { Instance };

INSTANCE.startup();
