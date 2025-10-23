import path from "path";
import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import { promises as fs } from "fs";
import { WorkspacesApplication } from "./applications/application.js";
import { WorkspacesApplicationServiceStatus } from "./applications/serviceStatus.js";

const APPLICATIONS_CONFIG_FILE_PATH = (subsystem: SubSystem) =>
    path.join(subsystem.instance.subSystems.filesystem.FS_ROOT, "applications.json");

export default class ApplicationsSubsystem extends SubSystem {
    availableApplications: {
        path: string;
        enabled: boolean;
        status?: WorkspacesApplicationServiceStatus[];
        manifest?: WorkspacesApplication;
    }[];
    enabledApplications: string[];

    constructor(instance: Instance) {
        super("applications", instance);

        this.availableApplications = [];
        this.enabledApplications = [];

        return this;
    }

    async startup(): Promise<boolean> {
        try {
            if (!(await fs.exists(APPLICATIONS_CONFIG_FILE_PATH(this))))
                await fs.writeFile(APPLICATIONS_CONFIG_FILE_PATH(this), JSON.stringify([]));

            // TODO: maybe check if the `applications.json` file is valid JSON?

            let applicationsConfig = JSON.parse((await fs.readFile(APPLICATIONS_CONFIG_FILE_PATH(this))).toString());

            this.availableApplications = applicationsConfig;

            for (const app of this.availableApplications) {
                await this.loadApplication(app.path);
            }

            for (const app of this.availableApplications) {
                this.log.info(`application '${app.manifest?.id}' is ${app.enabled ? "enabled" : "disabled"}`);
            }

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    private async saveApplicationsConfig(): Promise<this> {
        let data = this.availableApplications.map((a) => {
            return {
                path: a.path,
                enabled: a.enabled,
            };
        });

        await fs.writeFile(APPLICATIONS_CONFIG_FILE_PATH(this), JSON.stringify(data));

        return this;
    }

    // Install an application (fetch all files & add it to /fs/applications.json)
    // Supports the following URIs 'file', 'ssh' & 'https'
    // file - adds to /fs/applications.json, the application is not copied
    // ssh - clones as a git repository to /fs/applicatons & adds to /fs/applications.json
    // https - downloads as a zip file and extracts to /fs/applications & adds to /fs/applications.json
    async installApplication(applicationURI: string): Promise<boolean> {
        let applicationPath: string = path.join(this.instance.subSystems.filesystem.FS_ROOT, "application-failed-to-install");

        if (applicationURI.startsWith("file:")) {
            applicationPath = applicationURI.slice("file:".length);
        }

        if (applicationURI.startsWith("ssh:")) {
            this.log.warning("installApplication() is Unimplemented for 'ssh:'.");
            return false;
        }

        if (applicationURI.startsWith("https:")) {
            this.log.warning("installApplication() is Unimplemented for 'https:'.");
            return false;
        }

        if (this.availableApplications.find((a) => a.path === applicationPath)) {
            this.log.warning(`Cannot install application at path -> '${applicationPath}' as it is already installed!`);
            return false;
        }

        this.log.info(`Installing application at path -> '${applicationPath}'`);

        await this.loadApplication(applicationPath);

        await this.saveApplicationsConfig();

        return true;
    }

    // Load an application into Workspaces by it's installation path
    // This does NOT enable the application, just registers it as available to enable
    async loadApplication(applicationPath: string): Promise<boolean> {
        const APPLICATION_MANIFEST_PATH = path.join(applicationPath, "manifest.json");

        let applicationManifest = JSON.parse((await fs.readFile(APPLICATION_MANIFEST_PATH)).toString());

        let alreadyRegisteredAppliction = this.availableApplications.find((a) => a.path === applicationPath);

        if (alreadyRegisteredAppliction) {
            alreadyRegisteredAppliction.manifest = applicationManifest;
            alreadyRegisteredAppliction.path = applicationPath;
            alreadyRegisteredAppliction.status = [];

            return true;
        }

        this.availableApplications.push({
            enabled: false,
            path: applicationPath,
            manifest: applicationManifest,
            status: [],
        });

        return true;
    }

    // Enable an application by it's id
    // Loads the specified backend and web frontend
    async enableApplication(applicationId: string): Promise<boolean> {
        let app = this.availableApplications.find((a) => a.manifest?.id === applicationId);

        if (app) {
            app.enabled = true;
            this.log.info(`Enabled application '${applicationId}'`);
        } else {
            this.log.error(`Couldn't find application with id '${applicationId}'`);
        }

        await this.saveApplicationsConfig();

        return false;
    }

    // Disable an application by it's id
    // doesn't take effect until the instance is restarted. When finished, it will prompt the administrator to restart
    async disableApplication(applicationId: string): Promise<boolean> {
        let app = this.availableApplications.find((a) => a.manifest?.id === applicationId);

        if (app) {
            app.enabled = false;
            this.log.info(`Disabled application '${applicationId}'`);
            await this.instance.promptForRestart(`Disable application '${applicationId}'`);
        } else {
            this.log.error(`Couldn't find application with id '${applicationId}'`);
        }

        await this.saveApplicationsConfig();

        return false;
    }
}
