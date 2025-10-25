import { SQL } from "bun";
import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import path from "path";

export default class DatabaseSubsystem extends SubSystem {
    databaseConnections: { [connectionId: string]: SQL };

    constructor(instance: Instance) {
        super("database", instance);

        this.databaseConnections = {};

        return this;
    }

    async startup(): Promise<boolean> {
        await this.instance.subSystems.filesystem.createDirectoryIfNotExists(
            path.join(this.instance.subSystems.filesystem.FS_ROOT, "databases"),
        );

        return true;
    }

    getConnection(connectionId: string) {
        if (this.databaseConnections[connectionId]) return this.databaseConnections[connectionId];

        return this.createConnection(connectionId);
    }

    private createConnection(connectionId: string) {
        let conPath = "sqlite://" + path.join(this.instance.subSystems.filesystem.FS_ROOT, connectionId) + ".sqlite";

        let con = new SQL({
            // NOTE: use SQLite for now, in the future we should switch to postgres / a better alternative
            adapter: "sqlite",
            readwrite: true,
            create: true,
            filename: conPath,
        });

        this.databaseConnections[connectionId] = con;

        return con;
    }
}
