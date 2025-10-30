import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import * as readline from "readline";
import type Command from "./consoleCommands/command.js";
import type { ICommandRuntimeParameters } from "./consoleCommands/command.js";
import { promises as fs } from "fs";
import path from "path";

export default class ConsoleCommandsSubsytem extends SubSystem {
    rlInterface!: readline.Interface;
    commands: Command[];
    currentCommandInterface!: { active: boolean; cb: (data: string) => void };
    commandHistory: string[][];

    constructor(instance: Instance) {
        super("console_commands", instance);

        this.commands = [];
        this.commandHistory = [];

        return this;
    }

    override async startup() {
        if (!this.instance.subSystems.configuration.hasFeature("slash_commands")) return true;

        fs.readdir(path.join(this.instance.subSystems.filesystem.SRC_ROOT, "/subsystems/consoleCommands/commands/")).then((commands) => {
            for (const cmd of commands) {
                import(path.join(this.instance.subSystems.filesystem.SRC_ROOT, "/subsystems/consoleCommands/commands/", cmd)).then(
                    (cmd) => {
                        this.commands.push(new cmd.default(this.instance));
                    },
                );
            }
        });

        const self = this;
        this.currentCommandInterface = {
            active: false,
            cb: () => {},
        };

        (async function () {
            readline.emitKeypressEvents(process.stdin);
            self.rlInterface = readline.createInterface({
                input: process.stdin,
                tabSize: 2,
                terminal: false,
                historySize: 30,
            });

            process.stdin.setRawMode(true);
            self.currentCommandInterface.active = false;

            let cursorPos = 36;
            let line = "";

            process.stdin.on("data", async (key) => {
                let keyStr = key.toString();

                if (keyStr === "\u0003") {
                    self.instance.shutdown();
                    return;
                }
            });

            process.stdin.on("keypress", async (str, key) => {
                if (key.name === "up") {
                    console.log("Prev command");
                    return;
                } else if (key.name === "down") {
                    console.log("Next command");
                    return;
                } else if (key.name === "left") {
                    if (cursorPos <= 36) {
                        return;
                    }
                    cursorPos--;
                    process.stdout.moveCursor(-1, 0);
                    return;
                } else if (key.name === "right") {
                    if (cursorPos - 36 >= line.length) {
                        return;
                    }

                    cursorPos++;
                    process.stdout.moveCursor(1, 0);
                    return;
                } else if (key.name === "enter" || key.name === "return") {
                    cursorPos = 36;
                    process.stdout.cursorTo(36, 0);
                    process.stdout.write("\n");

                    if (self.currentCommandInterface.active) {
                        self.currentCommandInterface.cb(line);
                        line = "";
                        return;
                    }

                    line = line.trim();
                    let segments = line.split(" ");
                    let cmdId = segments.shift()?.toLowerCase();
                    // self.log.info("invoked_command", `> ${line}`);

                    if (!cmdId) {
                        self.log.info("Invalid CommandId");
                        line = "";
                        return;
                    }

                    let command = self.commands.find((cmd) => cmd.commandId === cmdId || cmd.aliases.includes(cmdId));

                    if (!command) {
                        self.log.info("command_manager", `Unable to find the command with id '${cmdId}'`);
                        line = "";
                        return;
                    }

                    if (command.makeDevModeOnly && !self.instance.subSystems.configuration.isDevmode) {
                        self.log.info(
                            "command_manager",
                            `You are unable to execute the command '${command.commandId}' as this instance is not running in developer mode`,
                        );
                        line = "";
                        return;
                    }

                    self.currentCommandInterface.active = true;
                    self.commandHistory.push(line.split(" "));
                    await self.executeCommand(cmdId, {
                        arguments: segments,
                        flags: {},
                        rawArgv: line.slice(cmdId.length + 1),
                    });

                    line = "";
                    return;
                } else if (key.name === "backspace") {
                    if (cursorPos <= 36) {
                        return;
                    }
                    cursorPos--;
                    line = line.slice(0, cursorPos - 36) + line.slice(cursorPos - 35);
                    process.stdout.cursorTo(36);
                    process.stdout.clearLine(1);
                    process.stdout.write(line);
                    process.stdout.cursorTo(cursorPos);
                    return;
                } else if (key.name === "space") {
                    cursorPos++;
                    process.stdout.write(" ");
                    line += " ";
                    return;
                }

                cursorPos++;
                line += key.name;
                process.stdout.write(key.name);
            });
        })();

        return true;
    }

    close() {
        this.rlInterface.close();

        return this;
    }

    async executeCommand(commandId: string, parameters: ICommandRuntimeParameters) {
        let com = this.commands.find((com) => com.commandId === commandId || com.aliases.includes(commandId));

        if (!com) {
            this.log.error("command_manager", `Unable to execute command "${commandId}" as no such command exists.`);

            return this;
        }

        await com.run(parameters);

        return this;
    }
}
