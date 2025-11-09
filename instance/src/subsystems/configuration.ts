import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";

export enum WorkspacesFeatureFlags {
    SlashCommands = "slash_commands",
}

export default class ConfigurationSubsystem extends SubSystem {
    isDevmode: boolean = true;
    databases: {
        postgres: {
            user: string;
            password: string;
            host: string;
            port: number;
            database: string;
        };
    };
    enabledFeatures: WorkspacesFeatureFlags[];

    constructor(instance: Instance) {
        super("configuration", instance);

        this.enabledFeatures = [WorkspacesFeatureFlags.SlashCommands];
        this.databases = {
            postgres: {
                // TODO: actually set these values
                user: "postgres",
                password: "postgres",
                host: "localhost",
                port: 5432,
                database: "tricolor_workspaces",
            },
        };

        return this;
    }

    hasFeature(feature: WorkspacesFeatureFlags | string): boolean {
        if (this.enabledFeatures.find((f) => f === feature)) return true;

        return false;
    }

    async startup(): Promise<boolean> {
        for (const feature in WorkspacesFeatureFlags) {
            this.log.info(`Feature '${feature}' -> ${this.enabledFeatures.includes(feature as WorkspacesFeatureFlags)}`);
        }

        return true;
    }
}
