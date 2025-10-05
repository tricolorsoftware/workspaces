import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";

export default class UsersSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("users", instance)
        return this;
    }
}