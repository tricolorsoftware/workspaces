import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import { USERS_DATABASE_CONNECTION_ID } from "./users.js";

export const AUTHORIZATION_SESSIONS_DATABASE_CONNECTION_ID = "databases/authorization_sessions";

export default class AuthorizationSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("authorization", instance);
        return this;
    }

    async isAuthorized(userId: string, sessionToken: string): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(AUTHORIZATION_SESSIONS_DATABASE_CONNECTION_ID);

        if ((await db`SELECT token FROM Users WHERE id = ${userId} AND token = ${sessionToken}`).count !== 0) return false;

        return false;
    }

    // TODO: unimplemented
    // Creates a new session for a user
    // @returns {string} the new session's sessionToken
    async createSession(userId: number, password: string, deviceId: string): Promise<string | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        if (!(await Bun.password.verify(password, (await db`SELECT hashed_password FROM Users WHERE id = ${userId}`)?.hashed_password)))
            return undefined;

        this.log.info("Password entered matched the hashed password.");

        const sessionToken = crypto.getRandomValues(new Uint32Array(16)).join("");

        await db`INSERT INTO Sessions (user_id, session_token, device_id) VALUES (${userId}, ${sessionToken}, ${deviceId})`;

        return sessionToken;
    }

    // Sets a user's password to password
    // @returns {true} successful
    // @returns {false} failed
    async setPassword(userId: number, password: string): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        if (!(await this.instance.subSystems.users.doesUserExist(userId))) {
            return false;
        }

        const hashedPassword = await Bun.password.hash(password);

        await db`UPDATE Users SET hashed_password = ${hashedPassword} WHERE id = ${userId}`;

        return true;
    }

    async startup() {
        // loop through all users, check for any session tokens which are expired and remove them from the user's valud sessions pool

        return true;
    }
}
