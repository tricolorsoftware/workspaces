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

    getConnection(connectionId: string) {
        if (this.databaseConnections[connectionId]) return this.databaseConnections[connectionId];

        return this.createConnection(connectionId);
    }

    private createConnection(connectionId: string) {
        let conPath = "sqlite://" + path.join(this.instance.subSystems.filesystem.FS_ROOT, connectionId) + ".sqlite";

        console.log(conPath);

        let con = new SQL({
            // NOTE: use SQLite for now, in the future we should switch to postgres / a better alternative
            adapter: "sqlite",
            readonly: false,
            readwrite: true,
            create: true,
            filename: conPath,
        });

        this.databaseConnections[connectionId] = con;

        return con;
    }
}
