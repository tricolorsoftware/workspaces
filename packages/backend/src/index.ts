import SubSystem, {SubSystems} from "./subSystems.js";
import Log from "./log.js";

export enum InstanceStatus {
    Online,
    Offline,
    StartingUp,
    Stopping
}

class Instance {
    subSystems: { [key in SubSystems]: SubSystem }
    log: Log;
    status: InstanceStatus;

    constructor() {
        this.log = new Log()
        // @ts-ignore
        this.subSystems = {}
        this.status = InstanceStatus.Offline

        return this;
    }

    initialiseSubSystems() {
        const SUB_SYSTEMS_TO_INITIALISE: SubSystems[] = [
            "users",
            "filesystem",
            "notifications"
        ]

        return this;
    }

    startup() {
        if (this.status !== InstanceStatus.Offline) {
            this.log.info("Cannot stop")
            return this;
        }

        return this;
    }
}

const INSTANCE = new Instance()

export default INSTANCE
export type { Instance }

INSTANCE.startup();
