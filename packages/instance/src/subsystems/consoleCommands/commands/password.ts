import { USERS_DATABASE_CONNECTION_ID } from "../../users.js";
import Command, { type ICommandRuntimeParameters } from "../command.js";

export default class ExitCommand extends Command {
    commandId = "password";
    flags = {};
    aliases = ["passwd"];
    shortDescription = "Set a user's password";

    async run(parameters: ICommandRuntimeParameters) {
        const self = this;

        let username = "";
        let password = "";

        const log = self.instance.log.createLogger("useradd_command");
        log.prompt("Username -> ");
        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
            username = data.trim();
            if (username !== "") {
                log.prompt("Password -> ");
                self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                    password = data.trim();
                    if (password !== "") {
                        const db = this.instance.subSystems.database.getConnection(USERS_DATABASE_CONNECTION_ID);

                        const { id: userId } = (await db`SELECT id FROM Users WHERE username = ${username}`)?.[0] || { id: undefined };

                        if (!userId) {
                            log.error(`No such user ${username}`);
                            return this.finishRun();
                        }

                        this.instance.subSystems.authorization.setPassword(userId, password);
                        log.success(`Set password for ${username}(${userId}) to '${password}'`);

                        return this.finishRun();
                    } else {
                        log.prompt("Password -> ");
                    }
                };
            } else {
                log.prompt("Username -> ");
            }
        };

        return this.continueRun();
    }
}
