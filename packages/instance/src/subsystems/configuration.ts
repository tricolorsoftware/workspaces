import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";

export enum WorkspacesFeatureFlags {
    SlashCommands = "slash_commands",
}

export default class ConfigurationSubsystem extends SubSystem {
    isDevmode: boolean = true;
    enabledFeatures: WorkspacesFeatureFlags[];

    constructor(instance: Instance) {
        super("configuration", instance);

        this.enabledFeatures = [];

        return this;
    }

    // TODO: IMPLEMENT THIS
    hasFeature(feature: string): boolean {
        if (feature === "slash_commands") return true;

        return false;
    }
}
