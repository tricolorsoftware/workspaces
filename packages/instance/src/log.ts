import chalk from "chalk";
import { Instance } from "./index.js";
import { WorkspacesFeatureFlags } from "./subsystems/configuration.js";
import util from "node:util";

export enum LogType {
    INFO,
    WARNING,
    ERROR,
    SUCCESS,
    DEBUG,
    RAW,
}

class Logger {
    logHistory: {
        type: LogType;
        level: string;
        message: (string | Uint8Array<ArrayBufferLike>)[];
    }[] = [];
    private log: Log;
    private level: string;

    constructor(level: string, log: Log) {
        this.level = level;
        this.log = log;

        global.console.log = (...data: any[]): void => {
            new Promise((res) => {
                setTimeout(() => {
                    res(true);
                }, 500);
            }).then(() => {
                process.stdout.cursorTo(0, this._internal_getWindowSize()[1] - 3);
                new Promise((res) => {
                    setTimeout(() => {
                        res(true);
                    }, 500);
                }).then(() => {
                    process.stdout.clearScreenDown();

                    new Promise((res) => {
                        setTimeout(() => {
                            res(true);
                        }, 500);
                    }).then(() => {
                        for (const d of data) {
                            if (d.toString !== undefined) {
                                process.stdout.write(util.format(d));
                            } else {
                                process.stdout.write(util.inspect(d));
                            }
                            process.stdout.write(" ");
                        }
                        process.stdout.write("\n");

                        new Promise((res) => {
                            setTimeout(() => {
                                res(true);
                            }, 500);
                        }).then(() => {
                            this._internal_writePrompt();
                        });
                    });
                });
            });
        };

        return this;
    }

    emphasis(...message: (string | Uint8Array)[]) {
        return chalk.bold.magenta(message);
    }

    rawLog(...message: (string | Uint8Array)[]) {
        if (this.level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.RAW, ...message);
    }

    removeCommandPrompt() {
        process.stdout.cursorTo(0, process.stdout.getWindowSize()[1] - 3, () => {
            process.stdout.clearScreenDown();
        });

        return this;
    }

    info(...message: (string | Uint8Array)[]) {
        if (this.level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.INFO, ...message);
    }

    success(...message: (string | Uint8Array)[]) {
        if (this.level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.SUCCESS, ...message);
    }

    warning(...message: (string | Uint8Array)[]) {
        if (this.level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.WARNING, ...message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(...message: any[]) {
        if (message.length === 0) {
            this.logMessage(LogType.ERROR, "log", new Error("log message is empty").stack);
        }

        this.logMessage(LogType.ERROR, ...message);

        return this;
    }

    debug(...message: (string | Uint8Array)[]) {
        // if (!this.log.instance.configurationManager.config.isDevMode) {
        //     return this;
        // }

        if (this.level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.DEBUG, ...message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private logMessage(type: LogType, ...message: any[]): this {
        this.logHistory.push({ type: type, level: this.level, message: message });

        let typeString = "";

        switch (type) {
            case LogType.INFO:
                typeString = chalk.bold(`${chalk.white("[")}${chalk.blue("INF")}${chalk.white("]")}`);
                break;
            case LogType.WARNING:
                typeString = chalk.bold(`${chalk.white("[")}${chalk.yellow("WAR")}${chalk.white("]")}`);
                break;
            case LogType.ERROR:
                typeString = chalk.bold(`${chalk.white("[")}${chalk.red("ERR")}${chalk.white("]")}`);
                break;
            case LogType.SUCCESS:
                typeString = chalk.bold(`${chalk.white("[")}${chalk.green("SUC")}${chalk.white("]")}`);
                break;
            case LogType.DEBUG:
                typeString = chalk.bold(`${chalk.white("[")}${chalk.magenta("DBG")}${chalk.white("]")}`);
                break;
            case LogType.RAW:
                typeString = ``;
                break;
        }

        this.writeMessage(typeString, ...message);

        return this;
    }

    _internal_getWindowSize(): [number, number] {
        let size = process?.stdout?.getWindowSize?.();

        return [size?.[0] || 120, size?.[1] || 60];
    }

    _internal_writePrompt() {
        if (!this.log.instance?.subSystems.configuration?.hasFeature(WorkspacesFeatureFlags.SlashCommands)) return this;

        // move cursor to the last row, 1st column
        process.stdout.cursorTo(0, this._internal_getWindowSize()[1], () => {
            // scroll view down 1 row
            process.stdout.write("-".repeat(this._internal_getWindowSize()[0]) + "\n", () => {
                // move the cursor to the 3rd last row, 1st column
                process.stdout.cursorTo(0, this._internal_getWindowSize()[1] - 1, () => {
                    // write the separator line to the stdout
                    // move the cursor to the 2nd last row, 1st column
                    process.stdout.cursorTo(0, this._internal_getWindowSize()[1], () => {
                        // write the branding to the stdout
                        process.stdout.write(
                            `Workspaces Pre-Alpha ${
                                this.log.instance.subSystems.configuration?.isDevmode ? `[${this.emphasis("Dev Mode")}] ` : ""
                            }`,
                            () => {
                                // move the cursor to the metaLen+6th column of the 2nd from the bottom row
                                process.stdout.cursorTo(this.log.META_LENGTH + 6, this._internal_getWindowSize()[1], () => {
                                    if (this.log.instance.subSystems.configuration?.hasFeature(WorkspacesFeatureFlags.SlashCommands)) {
                                        // write the prompt indicator to the stdout
                                        process.stdout.write(`> ${this.log.instance.subSystems.consoleCommands?.rlInterface?.line}`);
                                    } else {
                                        process.stdout.write("  ");
                                    }
                                });
                            },
                        );
                    });
                });
            });
        });
    }

    private writeMessage(typeString: string, ...message: any[]) {
        // rawLog only
        if (typeString === "") {
            process.stdout.write(
                chalk.bold(
                    `      ${chalk.yellow(this.level.toUpperCase().slice(0, this.log.META_LENGTH).padEnd(this.log.META_LENGTH))}  `,
                ) + message.join(" "),
            );

            return this;
        }

        console.log(
            typeString,
            chalk.bold(`${chalk.yellow(this.level.toUpperCase().slice(0, this.log.META_LENGTH).padEnd(this.log.META_LENGTH))} `),
            ...message,
        );

        return this;
    }
}

export type { Logger };

export default class Log {
    allLogHistory: {
        type: LogType;
        level: string;
        message: (string | Uint8Array<ArrayBufferLike>)[];
    }[] = [];
    system: Logger;
    instance: Instance;
    readonly META_LENGTH = 28;

    constructor(instance: Instance) {
        this.instance = instance;
        this.system = this.createLogger("system");

        return this;
    }

    createLogger(prefix: string): Logger {
        return new Logger(prefix, this);
    }
}
