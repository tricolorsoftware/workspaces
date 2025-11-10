import path from "path";
import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import fs from "fs";

export default class FilesystemSubsystem extends SubSystem {
    readonly SRC_ROOT = path.resolve("./instance/src/");
    readonly FS_ROOT = path.resolve("./fs/");

    constructor(instance: Instance) {
        super("filesystem", instance);

        fs.mkdirSync(this.FS_ROOT, { recursive: true });

        return this;
    }

    // Create a directory if it does not already exist
    // @returns {true} if created
    // @returns {false} if already exists
    async createDirectoryIfNotExists(path: string): Promise<boolean> {
        if (await fs.promises.exists(path)) {
            return false;
        }

        await fs.promises.mkdir(path, { recursive: true });

        return true;
    }
}
