import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";

export default class ConfigurationSubsystem extends SubSystem {
    isDevmode: boolean = true;

    constructor(instance: Instance) {
        super("configuration", instance)

        return this;
    }

    // TODO: implement this :3
    hasFeature(feature: string): boolean {
        if (feature === "slash_commands") return true

        return false
    }
}