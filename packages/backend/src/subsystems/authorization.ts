import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";

export const AUTHORIZATION_SESSIONS_DATABASE_CONNECTION_ID = "databases/authorization_sessions";

export default class AuthorizationSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("authorization", instance)
        return this;
    }

    async isAuthorized(userId: string, sessionToken: string): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(AUTHORIZATION_SESSIONS_DATABASE_CONNECTION_ID);

        if ((await db`SELECT token FROM Users WHERE id = ${userId} AND token = ${sessionToken}`).count !== 0) return false;

        return false
    }

    async startup() {
        // loop through all users, check for any session tokens which are expired and remove them from the user's valud sessions pool

        return false;
    }
}
