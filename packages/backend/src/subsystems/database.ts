import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";

export default class DatabaseSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("database", instance);
        return this;
    }

    createConnection(tableId: string) {

    }
}
