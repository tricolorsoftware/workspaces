import path from "path";
import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";
import fs from "fs"

export default class FilesystemSubsystem extends SubSystem {
    readonly SRC_ROOT = path.resolve("./src/")
    readonly FS_ROOT = path.resolve("./fs/")

    constructor(instance: Instance) {
        super("filesystem", instance)

        fs.mkdirSync(this.FS_ROOT, { recursive: true })

        return this;
    }
}