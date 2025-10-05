import chalk from "chalk";

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
                typeString = chalk.bold(
                    `${chalk.white("[")}${chalk.blue("INF")}${chalk.white("]")}`
                );
                break;
            case LogType.WARNING:
                typeString = chalk.bold(
                    `${chalk.white("[")}${chalk.yellow("WAR")}${chalk.white("]")}`
                );
                break;
            case LogType.ERROR:
                typeString = chalk.bold(
                    `${chalk.white("[")}${chalk.red("ERR")}${chalk.white("]")}`
                );
                break;
            case LogType.SUCCESS:
                typeString = chalk.bold(
                    `${chalk.white("[")}${chalk.green("SUC")}${chalk.white("]")}`
                );
                break;
            case LogType.DEBUG:
                typeString = chalk.bold(
                    `${chalk.white("[")}${chalk.magenta("DBG")}${chalk.white("]")}`
                );
                break;
        }

        logTheMessage(typeString, level, ...message);

        return this;
    }
}

export default class Log {
    allLogHistory: {
        type: LogType;
        level: string;
        message: (string | Uint8Array<ArrayBufferLike>)[];
    }[] = [];
    global: Logger;

    constructor() {
        this.global = this.createLogger("global", this)

        return this;
    }

    createLogger() {
        return this;
    }
}
