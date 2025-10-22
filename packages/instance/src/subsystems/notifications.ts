import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";

export default class NotificationsSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("filesystem", instance)

        return this;
    }
}