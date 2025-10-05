import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";

export default class AuthorizationSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("authorization", instance)
        return this;
    }

    // TODO: implement me :3
    async isAuthorized(username: string, sessionToken: string): Promise<boolean> {
        return false
    }

    async startup() {
        // loop through all users, check for any session tokens which are expired and remove them from the user's valud sessions pool

        return false;
    }
}