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
        log.removeCommandPrompt();
        process.stdout.write("\n");
        log.rawLog("Username -> ");
        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
            username = data.trim();
            if (username !== "") {
                log.rawLog("Password -> ");
                self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                    password = data.trim();
                    if (password !== "") {
                        log.rawLog("Full Name -> ");
                        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                            fullName = data.trim();
                            if (fullName !== "") {
                                log.rawLog("Email -> ");
                                self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                                    email = data.trim();
                                    if (email !== "") {
                                        log.rawLog("Gender -> ");
                                        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                                            gender = data.trim();
                                            if (gender !== "") {
                                                log.info("Creating user...");

                                                let uid = await self.instance.subSystems.users.createUser(username);

                                                if (!uid) {
                                                    log.error("Failed to create user");
                                                    return;
                                                }

                                                let user = await self.instance.subSystems.users.getUserById(uid);

                                                if (!user) {
                                                    log.error("Failed to get created user");
                                                    return;
                                                }

                                                // user.setFullName(...fullName.split(" "))
                                            } else {
                                                log.rawLog("Gender -> ");
                                            }
                                        };
                                    } else {
                                        log.rawLog("Email -> ");
                                    }
                                };
                            } else {
                                log.rawLog("Full Name -> ");
                            }
                        };
                    } else {
                        log.rawLog("Password -> ");
                    }
                };
            } else {
                log.rawLog("Username -> ");
            }
        };

        return this.continueRun();
    }
}
