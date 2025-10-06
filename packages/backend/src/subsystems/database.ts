import {SQL} from "bun";
import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";

export default class DatabaseSubsystem extends SubSystem {
    databaseConnections: {[connectionId: string]: SQL}

    constructor(instance: Instance) {
        super("database", instance);

        this.databaseConnections = {}

        return this;
    }

    getConnection(connectionId: string) {
        if (this.databaseConnections[ connectionId ])
            return this.databaseConnections[ connectionId ]

        return this.createConnection(connectionId)
    }

    createConnection(connectionId: string) {
        let con = new SQL(connectionId, {
            // NOTE: for now, in the future we should switch to postgres / a better alternative
            adapter: "sqlite",
            readonly: false
        })

        this.databaseConnections[ connectionId ] = con;

        return con;
    }
}
