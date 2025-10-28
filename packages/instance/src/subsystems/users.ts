import { sql } from "bun";
import { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";

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

    getPath(): string {
        return path.join(this.instance.subSystems.filesystem.FS_ROOT, `users/${this.userId}`);
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

    // TODO: set email & gender

    async setAvatar(avatarFile: string): Promise<boolean> {
        await fs.cp(avatarFile, path.join(this.getPath(), "assets/avatar/avatar.png"));

        return true;
    }

    async generateAvatars(override?: boolean): Promise<boolean> {
        const AVATAR_SIZES: { width: number; height: number; name: string }[] = [
            { width: 16, height: 16, name: "xs" },
            { width: 32, height: 32, name: "s" },
            { width: 64, height: 64, name: "m" },
            { width: 128, height: 128, name: "l" },
            { width: 256, height: 256, name: "xl" },
        ];

        try {
            for (const size of AVATAR_SIZES) {
                if (override || !(await fs.exists(path.join(this.getPath(), `assets/avatar/${size.name}.png`)))) {
                    this.instance.subSystems.users.log.info(`Generating avatar for user '${this.userId}' @ ${size.name}`);
                    await sharp(path.join(this.getPath(), "assets/avatar/avatar.png"))
                        .resize(size.width, size.height)
                        .toFile(path.join(this.getPath(), `assets/avatar/${size.name}.png`));
                    this.instance.subSystems.users.log.success(`Generated avatar for user '${this.userId}' @ ${size.name}`);
                }
            }
        } catch (err) {
            this.instance.subSystems.users.log.error("Failed to generate avatar sizes");
        }

        return true;
    }

    async verify() {
        const USER_DIRECTORIES = [
            "/",
            "/fs",
            "/fs/Desktop",
            "/fs/Downloads",
            "/fs/Documents",
            "/fs/Photos",
            "/fs/Music",
            "/fs/Videos",
            "/assets",
            "/assets/avatar",
            "/system",
            "/system/logs",
        ];

        for (const dir of USER_DIRECTORIES) {
            await this.instance.subSystems.filesystem.createDirectoryIfNotExists(
                path.join(this.instance.subSystems.filesystem.FS_ROOT, `users/${this.userId}`, dir),
            );
        }

        if (!(await fs.exists(path.join(this.getPath(), "assets/avatar/avatar.png")))) {
            this.setAvatar(path.join(this.instance.subSystems.filesystem.SRC_ROOT, "assets/placeholder/avatar.png"));
        }

        await this.generateAvatars();

        this.instance.subSystems.users.log.success(`Verified user '${this.userId}'`);

        return true;
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

        // init the users databasecurrentCommandInterface
        //
        // id - permanent unique user id number (number)
        // username - the user's changable username (string)
        // forename - the user's chosen forename (string)
        // surname - the user's chosen surname (string)
        // gender - the user's chosen gender ("female" | "male" | "other")
        // bio - the user's chosen bio (string)
        // storage_quota - the user's storage quota in MB (number)
        // email - the user's chosen contact email (string)
        // is_email_verified - is the user's chosen contact email verified to be theirs (boolean)
        // socials - the user's chosen social media links in the format '[name]:-:[url]' as such, the string ':-:' must not be in either [name] or [url] (string[])
        // hashed_password - the user's password after it has been hashed by bun (string)
        await db`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, forename TEXT, surname TEXT, gender TEXT, bio TEXT, storage_quota BIGINT, email TEXT, is_email_verified BOOL, socials TEXT[], hashed_password TEXT)`;

        let administratorUserId = await this.createUser("admin");

        // if the account is newly-created
        if (administratorUserId !== undefined) {
            const adminUser = await this.getUserById(administratorUserId);

            adminUser?.getFullName("Admin", "Istrator");
        }

        const users = await this.getAllUsers();

        for (const user of users) {
            await user.verify();
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

        const ubi = await this.getUserById(id);

        if (!ubi) {
            this.log.error("Failed during the user creation process.");
            return undefined;
        }

        await ubi.setAvatar(path.join(this.instance.subSystems.filesystem.SRC_ROOT, "assets/placeholder/avatar.png"));

        await ubi.verify();

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

    async getAllUsers(): Promise<WorkspacesUser[]> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        return (await db`SELECT id FROM Users`).map((u: number) => new WorkspacesUser(this.instance, u.id));
    }

    async getUserById(userId: number): Promise<WorkspacesUser | undefined> {
        if (this.doesUserExist(userId) === undefined) return undefined;

        return new WorkspacesUser(this.instance, userId);
    }

    async getUserByUsername(username: string): Promise<WorkspacesUser | undefined> {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

        const userId = (await db`SELECT id FROM Users WHERE username = ${username}`)?.[0]?.id;

        if ((await this.doesUserExist(userId)) === false) return undefined;

        return new WorkspacesUser(this.instance, userId);
    }
}
