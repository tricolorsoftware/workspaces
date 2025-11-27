import { WorkspacesNotificationPriority } from "../../notifications.js";
import Command, { type ICommandRuntimeParameters } from "../command.js";

export default class RestartCommand extends Command {
    commandId = "notify";
    flags = {};
    aliases = [];
    shortDescription = "Send a notification to all administrators";

    async run(parameters: ICommandRuntimeParameters) {
        for (const userId of (await this.instance.subSystems.users.getAllUsers()).map((u) => u.userId)) {
            this.instance.subSystems.notifications.send(userId, "commands.nofify", WorkspacesNotificationPriority.Important, {
                title: "Notification Test 1",
                body: "This is a sample notification from the console!",
                icon: "person",
            });
        }

        return this.finishRun();
    }
}
