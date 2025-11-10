import path from "path";
import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import { promises as fs } from "fs";
import { WorkspacesApplication } from "./applications/application.js";
import { WorkspacesApplicationServiceStatus } from "./applications/serviceStatus.js";

const APPLICATIONS_CONFIG_FILE_PATH = (subsystem: SubSystem) =>
    path.join(subsystem.instance.subSystems.filesystem.FS_ROOT, "applications.json");

interface AvailableWorkspacesApplication {
    path: string;
    enabled: boolean;
    status?: WorkspacesApplicationServiceStatus[];
    manifest?: WorkspacesApplication;
}

export default class ApplicationsSubsystem extends SubSystem {
    availableApplications: AvailableWorkspacesApplication[];
    enabledApplications: string[];

    constructor(instance: Instance) {
        super("applications", instance);

        this.availableApplications = [];
        this.enabledApplications = [];

        return this;
    }

    getEnabledApplications(): AvailableWorkspacesApplication[] {
        const apps = this.enabledApplications
            .map((a) => this.availableApplications.find((aa) => aa.manifest?.id === a))
            .filter((a) => a !== undefined);

        return apps;
    }

    async updateWebRouter() {
        let applicationsInfill = ``;
        for (const app of this.availableApplications) {
            if (this.enabledApplications.find((a) => a === app.manifest?.id)) {
                if (app.manifest?.modules.web) {
                    applicationsInfill += `<Route path="${app.manifest.id}/*" component={lazy(() => import("${path.relative(path.join(this.instance.subSystems.filesystem.FS_ROOT), path.join(app.path, app.manifest.modules.web.path, "/App.tsx")).replaceAll("\\", "/")}"))} />
`;
                }
            }
        }

        if (this.availableApplications.length === 0) {
            applicationsInfill = `<Route path="*" component={() => <>How peculiar. You have no applications installed, please ask an administrator to install some via the command-line interface.</>}/>`
        }

            let applicationsWebRouterTemplate = `import { Route } from "@solidjs/router";
import { type Component, lazy } from "solid-js";

const ApplicationsRouter: Component = () => {
    return (
        <>
            ${applicationsInfill}       </>
    );
};

export default ApplicationsRouter`;

        await fs.writeFile(path.join(this.instance.subSystems.filesystem.FS_ROOT, "Applications.tsx"), applicationsWebRouterTemplate);

        return true
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

                if (app.enabled) {
                    await this.enableApplication(app.manifest!.id);
                }
            }

            for (const app of this.availableApplications) {
                this.log.info(`application '${app.manifest?.id}' is ${app.enabled ? "enabled" : "disabled"}`);
            }

            await this.updateWebRouter()

            if (!(await fs.exists(path.join(this.instance.subSystems.filesystem.FS_ROOT, "package.json")))) {
                await fs.writeFile(
                    path.join(this.instance.subSystems.filesystem.FS_ROOT, "package.json"),
                    `{
    "name": "workspaces-fs",
    "author": "Tricolor Software",
    "dependencies": {
        "@solidjs/router": "^0.15.3",
        "solid-js": "^1.9.8",
        "vite": "^7.1.2",
        "vite-plugin-solid": "^2.11.8"
    }
}`,
                );

                const child = Bun.spawn({
                    cwd: this.instance.subSystems.filesystem.FS_ROOT,
                    cmd: ["bun", "install"],
                    stdout: "pipe",
                    stderr: "pipe",
                });

                for await (const msg of child.stdout) {
                    this.log.info("Applications Initial Startup -> " + Buffer.from(msg).toString());
                }

                for await (const msg of child.stderr) {
                    this.log.error("Applications Initial Startup -> " + Buffer.from(msg).toString());
                }

                await fs.cp(
                    path.join(this.instance.subSystems.filesystem.SRC_ROOT, "web/tsconfig.app.json"),
                    path.join(this.instance.subSystems.filesystem.FS_ROOT, "tsconfig.json"),
                );
                await fs.writeFile(
                    path.join(this.instance.subSystems.filesystem.FS_ROOT, "tsconfig.json"),
                    (await fs.readFile(path.join(this.instance.subSystems.filesystem.FS_ROOT, "tsconfig.json")))
                        .toString()
                        .replace(`"include": ["src"]`, `"include": ["./Applications.tsx"]`),
                );
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

            if (!this.enabledApplications.find((a) => a === app.manifest?.id)) {
                this.enabledApplications.push(app.manifest?.id!);
            }

            this.log.info(`Enabled application '${applicationId}'`);
        } else {
            this.log.error(`Couldn't find application with id '${applicationId}'`);
        }

        await this.saveApplicationsConfig();
        await this.updateWebRouter()

        if (app?.manifest?.modules.bun) {
            try {
                // @ts-ignore
                globalThis.instance = this.instance;
                await import(path.join(app.path, app.manifest.modules.bun.path));
            } catch (err) {
                console.error("problem with application's bun module ->", err);
            }
        }

        if (app?.manifest?.modules.script) {
            let child = Bun.spawn({
                stderr: "pipe",
                stdout: "pipe",
                stdin: "pipe",
                cmd: [app.manifest.modules.script.path],
                cwd: app.path,
                env: process.env,
            });

            const MODULE_LOG_PREFIX = `${app.manifest.id} -> `;

            for await (const msg of child.stdout) {
                let bufMsg = MODULE_LOG_PREFIX + Buffer.from(msg).toString();

                if (bufMsg.endsWith("\n")) {
                    bufMsg = bufMsg.slice(0, -1);
                }

                this.log.info(bufMsg);
            }

            for await (const msg of child.stderr) {
                let bufMsg = MODULE_LOG_PREFIX + Buffer.from(msg).toString();

                if (bufMsg.endsWith("\n")) {
                    bufMsg = bufMsg.slice(0, -1);
                }

                this.log.error(bufMsg);
            }
        }

        return true;
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
        await this.updateWebRouter()

        return false;
    }
}
