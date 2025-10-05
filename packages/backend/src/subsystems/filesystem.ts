import path from "path";
import type {Instance} from "../index.js";
import SubSystem from "../subSystems.js";

export default class FilesystemSubsystem extends SubSystem {
    readonly SRC_ROOT = path.resolve("./src/")

    constructor(instance: Instance) {
        super("filesystem", instance)
        return this;
    }
}