import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";
import * as readline from "readline";
import type Command from "./consoleCommands/command.js";
import type {ICommandRuntimeParameters} from "./consoleCommands/command.js";
import {promises as fs} from "fs"
import path from "path";

export default class ConsoleCommandsSubsytem extends SubSystem {
    rlInterface!: readline.Interface;
    commands: Command[];
    currentCommandInterface!: {active: boolean; cb: (data: string) => void};
    commandHistory: string[][];

    constructor(instance: Instance) {
        super("console_commands", instance)

        this.commands = [];
        this.commandHistory = [];

        return this;
    }

    override startup() {
        if (
            !this.instance.subSystems.configuration.hasFeature(
                "slash_commands"
            )
        )
            return this;

        fs.readdir(
            path.join(this.instance.subSystems.filesystem.SRC_ROOT, "/subsystems/consoleCommands/commands/")
        ).then((commands) => {
            for (const cmd of commands) {
                import(
                    path.join(
                        this.instance.subSystems.filesystem.SRC_ROOT,
                        "/subsystems/consoleCommands/commands/",
                        cmd
                    )
                ).then((cmd) => {
                    this.commands.push(new cmd.default(this.instance));
                });
            }
        });

        const self = this;
        this.currentCommandInterface = {
            active: false,
            cb: () => {}
        };

        (async function () {
            self.rlInterface = readline.createInterface({
                input: process.stdin,
                tabSize: 2
            });

            self.currentCommandInterface.active = false;

            for await (let line of self.rlInterface) {
                if (self.currentCommandInterface.active) {
                    self.currentCommandInterface.cb(line);
                    continue;
                }

                line = line.trim();
                let segments = line.split(" ");
                let cmdId = segments.shift()?.toLowerCase();
                self.log.info("invoked_command", `> ${line}`);

                if (!cmdId) {
                    self.log.info("Invalid CommandId");
                    continue;
                }

                let command = self.commands.find((cmd) => cmd.commandId === cmdId || cmd.aliases.includes(cmdId));

                if (!command) {
                    self.log.info(
                        "command_manager",
                        `Unable to find the command with id '${cmdId}'`
                    );
                    continue;
                }

                if (
                    command.makeDevModeOnly &&
                    !self.instance.subSystems.configuration.isDevmode
                ) {
                    self.log.info(
                        "command_manager",
                        `You are unable to execute the command '${command.commandId}' as this instance is not running in developer mode`
                    );
                    continue;
                }

                self.currentCommandInterface.active = true;
                self.commandHistory.push(line.split(" "));
                await self.executeCommand(cmdId, {
                    arguments: segments,
                    flags: {},
                    rawArgv: line.slice(cmdId.length + 1)
                });
            }
        })();

        return this;
    }

    close() {
        this.rlInterface.close();

        return this;
    }

    async executeCommand(
        commandId: string,
        parameters: ICommandRuntimeParameters
    ) {
        let com = this.commands.find((com) => com.commandId === commandId || com.aliases.includes(commandId));

        if (!com) {
            this.log.error(
                "command_manager",
                `Unable to execute command "${commandId}" as no such command exists.`
            );

            return this;
        }

        await com.run(parameters);

        return this;
    }
}