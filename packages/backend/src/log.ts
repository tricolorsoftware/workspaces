import chalk from "chalk";
import { YourDashFeatureFlags } from "../.temp/types/configuration.js";
import { Instance } from "./index.js";

export enum LogType {
    INFO,
    WARNING,
    ERROR,
    SUCCESS,
    DEBUG,
}

class Logger {
    logHistory: {
        type: LogType;
        level: string;
        message: (string | Uint8Array<ArrayBufferLike>)[];
    }[] = [];
    private log: Log;
    private level: string;
    private metaLength = 28;

    constructor(level: string, log: Log) {
        this.level = level;
        this.log = log;

        return this;
    }

    info(level: string, ...message: (string | Uint8Array)[]) {
        if (level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.INFO, level, ...message);
    }

    success(level: string, ...message: (string | Uint8Array)[]) {
        if (level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.SUCCESS, level, ...message);
    }

    warning(level: string, ...message: (string | Uint8Array)[]) {
        if (level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.WARNING, level, ...message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(level: string, ...message: any[]) {
        if (message.length === 0) {
            this.logMessage(LogType.ERROR, "log", new Error("log message is empty").stack);
        }

        this.logMessage(LogType.ERROR, level, ...message);

        return this;
    }

    debug(level: string, ...message: (string | Uint8Array)[]) {
        // if (!this.log.instance.configurationManager.config.isDevMode) {
        //     return this;
        // }

        if (level.length === 0) {
            throw new Error("log level is empty");
        }

        if (message.length === 0) {
            throw new Error("log message is empty");
        }

        return this.logMessage(LogType.DEBUG, level, ...message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private logMessage(type: LogType, level: string, ...message: any[]): this {
        this.logHistory.push({ type: type, level: level, message: message });

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
        }

        this.writeMessage(typeString, level, ...message);

        return this;
    }

    _internal_getWindowSize(): [number, number] {
        let size = process?.stdout?.getWindowSize?.();

        return [size?.[0] || 120, size?.[1] || 60];
    }

    _internal_cursorTo(x: number, y: number, cb: () => void) {
        process?.stdout?.cursorTo?.(x, y, cb);

        return this;
    }

    private writeMessage(typeString: string, level: string, ...message: any[]) {
        if (!this.log.instance.configurationManager?.hasFeature(YourDashFeatureFlags.SlashCommands)) {
            // @ts-ignore
            globalThis._internal_console.log(
                typeString,
                chalk.bold(`${chalk.yellow(level.toUpperCase().slice(0, this.metaLength).padEnd(this.metaLength))} `),
                ...message,
            );

            return this;
        }

        this._internal_cursorTo(0, this._internal_getWindowSize()[1] - 3, () => {
            process.stdout.clearLine(1, () => {
                // @ts-ignore
                globalThis._internal_console.log(
                    typeString,
                    chalk.bold(`${chalk.yellow(level.toUpperCase().slice(0, this.metaLength).padEnd(this.metaLength))} `),
                    ...message.map((msg) => msg.split("\n").join("\n" + " ".repeat(this.metaLength + 6))),
                );

                this._internal_writePrompt();
            });
        });
    }
}

export default class Log {
    allLogHistory: {
        type: LogType;
        level: string;
        message: (string | Uint8Array<ArrayBufferLike>)[];
    }[] = [];
    global: Logger;
    instance: Instance;

    constructor(instance: Instance) {
        this.instance = instance;
        this.global = this.createLogger("global");

        return this;
    }

    createLogger(prefix: string) {
        return new Logger(prefix, this);
    }
}
