import Command, { type ICommandRuntimeParameters } from "../command.js";

export default class ExitCommand extends Command {
    commandId = "userdel";
    flags = {};
    aliases = [];
    shortDescription = "Delete a user";

    async run(parameters: ICommandRuntimeParameters) {
        const self = this;

        let username = "";

        const log = self.instance.log.createLogger("userdel_command");
        log.prompt("Username -> ");
        self.instance.subSystems.consoleCommands.currentCommandInterface.cb = async (data) => {
            username = data.trim();
            if (username !== "") {
                let user = await self.instance.subSystems.users.getUserByUsername(username)

                if (!user) {
                    username = ""
                    log.prompt("Username -> ");
                    return this.continueRun()
                }

                await user.delete();

                return this.finishRun()
            } else {
                log.prompt("Username -> ");
            }
        };

        return this.continueRun();
    }
}
