import Command, { type ICommandRuntimeParameters } from "../command.js";

export default class ExitCommand extends Command {
    commandId = "useradd";
    flags = {};
    aliases = [];
    shortDescription = "Create a new user";

    async run(parameters: ICommandRuntimeParameters) {
        const self = this;

        let username = "";
        let password = "";
        let fullName = "";
        let email = "";
        let gender = "other";

        const log = self.instance.log.createLogger("useradd_command");
        log._internal_promptMessage("Username -> ");
        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
            username = data.trim();
            if (username !== "") {
                log._internal_promptMessage("Password -> ");
                self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                    password = data.trim();
                    if (password !== "") {
                        log._internal_promptMessage("Full Name -> ");
                        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                            fullName = data.trim();
                            if (fullName !== "") {
                                log._internal_promptMessage("Email -> ");
                                self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                                    email = data.trim();
                                    if (email !== "") {
                                        log._internal_promptMessage("Gender -> ");
                                        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
                                            gender = data.trim();
                                            if (gender !== "") {
                                                if (gender === "male" || gender === "other" || gender === "female") {
                                                    log.rawLog("\n");
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

                                                    await user.setGender(gender);
                                                    let fullNameSplit = fullName.split(" ");
                                                    await user.setFullName(fullNameSplit.shift() || "Unknown", fullNameSplit.join(" "));
                                                    await user.setEmail(email);
                                                    await self.instance.subSystems.authorization.setPassword(user.userId, password);
                                                } else {
                                                    log._internal_promptMessage("Gender -> ");
                                                }
                                            } else {
                                                log._internal_promptMessage("Gender -> ");
                                            }
                                        };
                                    } else {
                                        log._internal_promptMessage("Email -> ");
                                    }
                                };
                            } else {
                                log._internal_promptMessage("Full Name -> ");
                            }
                        };
                    } else {
                        log._internal_promptMessage("Password -> ");
                    }
                };
            } else {
                log._internal_promptMessage("Username -> ");
            }
        };

        return this.continueRun();
    }
}
