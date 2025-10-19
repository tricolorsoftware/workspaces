import { sql } from "bun";
import { Instance } from "../index.js";
import SubSystem from "../subSystems.js";

export const USERS_DATABASE_CONNECTION_ID = "databases/users";

export interface IUserDatabaseUser {
    id: number;
    username: string;
    forename: string;
    surname: string;
}

// WARNING!: do not call new WorkspacesUser() it is only to be created by the UsersSubsystem
export class WorkspacesUser {
    private instance: Instance;
    userId: number;

    constructor(instance: Instance, userId: number) {
        this.instance = instance;
        this.userId = userId;

        return this;
    }

    // Sets the user's username to username
    // @returns {false} failed to change the username
    // @returns {true} successfully changed the username
    async setUsername(username: string): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        if ((await db`SELECT username FROM Users WHERE username = ${username}`).count !== 0) return false;

        await db`UPDATE Users SET username = ${username} WHERE id = ${this.userId}`;

        return true;
    }

    // Get the user's username
    // @returns {string} the users username
    // @returns {undefined} could not get the user's username
    async getUsername(): Promise<string | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        return (await db`SELECT username FROM Users WHERE id = ${this.userId}`)?.[0]?.username || undefined;
    }

    // Sets the user's forename to forename
    // @returns {false} failed to change the forename
    // @returns {true} successfully changed the forename
    async setForename(forename: string): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        await db`UPDATE Users SET forename = ${forename} WHERE id = ${this.userId}`;

        return true;
    }

    // Get the user's forename
    // @returns {string} the users forename
    // @returns {undefined} could not get the user's forename
    async getForename(): Promise<string | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        return (await db`SELECT forename FROM Users WHERE id = ${this.userId}`)?.[0]?.forename || undefined;
    }

    // Sets the user's surname to surname
    // @returns {false} failed to change the surname
    // @returns {true} successfully changed the surname
    async setSurname(surname: string): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        await db`UPDATE Users SET surname = ${surname} WHERE id = ${this.userId}`;

        return true;
    }

    // Get the user's surname
    // @returns {string} the users surname
    // @returns {undefined} could not get the user's surname
    async getSurname(): Promise<string | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        return (await db`SELECT surname FROM Users WHERE id = ${this.userId}`)?.[0]?.surname || undefined;
    }

    // Sets the user's forename and surname to the provided forename and surname
    // @returns {false} failed to change the surname
    // @returns {true} successfully changed the surname
    async setFullName(forename: string, surname: string): Promise<boolean> {
        let forenameRes = await this.setForename(forename);
        let surnameRes = await this.setSurname(surname);

        return forenameRes && surnameRes;
    }

    // Gets the user's forename and surname
    // @returns {{ forename?: string, surname?: string }}
    async getFullName(forename: string, surname: string): Promise<{ forename?: string; surname?: string }> {
        let forenameRes = await this.getForename();
        let surnameRes = await this.getSurname();

        return { forename: forenameRes, surname: surnameRes };
    }

    // Sets the user's quota to the provided quota
    // @returns {false} failed to set the quota
    // @returns {true} successfully set the quota
    async setQuota(quota: number): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        await db`UPDATE Users SET storage_quota = ${quota} WHERE id = ${this.userId}`;

        return true;
    }

    // Get the user's quota
    // @returns {number} the users quota
    // @returns {undefined} could not get the user's quota
    async getQuota(): Promise<number | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        return (await db`SELECT storage_quota FROM Users WHERE id = ${this.userId}`)?.[0]?.storage_quota || undefined;
    }

    // Sets the user's bio to bio
    // @returns {false} failed to change the bio
    // @returns {true} successfully changed the bio
    async setBio(bio: string): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        await db`UPDATE Users SET bio = ${bio} WHERE id = ${this.userId}`;

        return true;
    }

    // Get the user's bio
    // @returns {string} the users bio
    // @returns {undefined} could not get the user's bio
    async getBio(): Promise<string | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        return (await db`SELECT bio FROM Users WHERE id = ${this.userId}`)?.[0]?.surname || undefined;
    }
}

export default class UsersSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("users", instance);

        return this;
    }

    async startup(): Promise<boolean> {
        await super.startup();

        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        // init the users database
        //
        // id - permanent unique user id number (number)
        // username - the user's changable username (string)
        // forename - the user's chosen forename (string)
        // surname - the user's chosen surname (string)
        // gender - the user's chosen gender ("female" | "male" | "other")
        // bio - the user's chosen bio (string)
        // storage_quota - the user's storage quota in MB (number)
        // email - the user's chosen contact email (string)
        // socials - the user's chosen social media links in the format '[name]:-:[url]' as such, the string ':-:' must not be in either [name] or [url] (string[])
        // hashed_password - the user's password after it has been hashed by bun (string)
        await db`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, forename TEXT, surname TEXT, gender TEXT, bio TEXT, storage_quota BIGINT, email TEXT, socials TEXT[], hashed_password TEXT)`;

        let administratorUserId = await this.createUser("admin");

        // if the account is newly-created
        if (administratorUserId !== undefined) {
            this.getUserById(administratorUserId);
        }

        return true;
    }

    // Create a new Workspaces User
    // @returns {number} the userId of the created user
    // @returns {undefined} the user already exists
    async createUser(username: string): Promise<number | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        if ((await db`SELECT username FROM Users WHERE username = ${username}`).count !== 0) return undefined;

        let user = {
            username,
            forename: "John",
            surname: "Doe",
        };

        let id = (await db`INSERT INTO Users ${sql(user)} RETURNING id`)?.[0]?.id;

        return id;
    }

    // Does a user with the userId exist
    // @returns {true} they exist
    // @returns {false} they do not exist
    async doesUserExist(userId: number): Promise<boolean> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        if ((await db`SELECT username FROM Users WHERE id = ${userId}`).count === 1) return true;

        return false;
    }

    async getUserById(userId: number): Promise<WorkspacesUser | undefined> {
        if (this.doesUserExist(userId) === undefined) return undefined;

        return new WorkspacesUser(this.instance, userId);
    }

    async getUserByUsername(username: string): Promise<WorkspacesUser | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        const userId = (await db`SELECT id FROM Users WHERE username = ${username}`)?.[0]?.id;

        if (this.doesUserExist(userId) === undefined) return undefined;

        return new WorkspacesUser(this.instance, userId);
    }
}
