import {Instance} from "./index.js";

export type SubSystems = "users" | "notifications" | "filesystem"

export default abstract class SubSystem {
    instance: Instance
    abstract id: string;

    protected constructor(instance: Instance) {
        this.instance = instance;

        return this;
    }

    init() {
        return this;
    }

    stop() {
        this.instance.log.info(`Stopping SubSystem ${this.id}`)

        return this;
    }
}
