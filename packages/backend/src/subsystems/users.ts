import {sql} from "bun";
import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";

export const USERS_DATABASE_CONNECTION_ID = "databases/users"

export interface IUserDatabaseUser {
    id: number,
    username: string,
    forename: string,
    surname: string
}

export default class UsersSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("users", instance)

        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID)

        db`CREATE TABLE Users (id INT, username TEXT, forename TEXT, surname TEXT)`

        this.createUser("alyssarx")

        return this;
    }

    async createUser(username: string) {
        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID)

        let user = {
            username,
            forename: "Alyssa",
            surname: "Ratcliffe"
        }

        await db`INSERT INTO Users ${sql(user)}`
    }
}