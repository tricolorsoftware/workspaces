import Command, { type ICommandRuntimeParameters } from "../command.js";

export default class ExitCommand extends Command {
    commandId = "exit";
    flags = {};
    aliases = [];
    shortDescription = "Terminate the Workspaces instance";

    async run(parameters: ICommandRuntimeParameters) {
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();

        process.exit(0);

        // Note: do not remove this line of code or Typescript will complain
        return this.finishRun();
    }
}
