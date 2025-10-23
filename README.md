# Tricolor Workspaces
---

A working environment for professionals and Home-Lab users.

### Links
- Discord -> https://discord.gg/jcJeGEAYhY
- Git -> https://git.tcsw.uk/tricolor/workspaces
- Git (Mirror) -> https://github.com/tcswuk/workspaces

> [!IMPORTANT]
> Pull requests and issues not reported on https://git.tcsw.uk/tricolor/workspaces will be ignored.

## Installation Guide for Production Environments
---
### Dependencies

| Dependency | External Installation Guide | Optional |
| ---------- | --------------------------- | -------- |
| Docker     | https://www.docker.com/     | No       |

### Installation
1. Ensure all dependencies are installed before continuing
2. Ensure that the installation environment is running a supported version of Linux
3. `cd /`
4. create a directory to house the Workspaces filesystem root e.g.: `sudo mkdir /tricolor/workspaces`
5. change into the newly created directory `cd /tricolor/workspaces`
6. clone the workspaces docker configuration from git `git clone ssh://git@git.tcsw.uk:9000/tricolor/workspaces-docker.git .`
7. edit `docker-compose.yaml` to your desired configuration from [Insert link to relevant documentation here] before continuing.
8. run `docker-compose up` to start the workspaces docker image and install all remaining dependencies
9. open your browser and head to `https://[server-ip]` and follow the on-screen instructions to complete the setup.
10. Enjoy! :D



## Installation Guide for Development Environments
---
> [!WARNING]
> Ignore this section if you are using the pre-built docker container image, this is only for local development outside of a docker environment
### Dependencies

| Dependency      | NPM Package               | External Installation Guide | Optional |     |
| --------------- | ------------------------- | --------------------------- | -------- | --- |
| SolidJS         | solid                     |                             | No       |     |
| Vite            | vite                      |                             | No       |     |
| UIKit           | @tcsw/uikit-mv3-solid     |                             | No       |     |
| Bun             |                           | https://bun.sh              | No       |     |
| Docker          |                           | https://www.docker.com/     | Yes      |     |
| PostgreSQL      |                           | https://www.postgresql.org/ | No       |     |

### Installation
1. Ensure all submodules are cloned/up-to-date with `git submodule update --init
2. Choose either the `Full-Stack` or `UIKit` section to continue
#### Full-Stack (Workspaces)
1. Ensure all non-NPM dependencies are installed before continuing
2. Run `bun install` to install all NPM dependencies
3. Run `bun run web` and `bun run backend` to start up the web interface and backend in development mode
4. Enjoy! :D
#### UIKit (UI Library dev page)
1. Ensure all non-NPM dependencies are installed before continuing
2. Run `bun install` to install all NPM dependencies
3. cd into the UIKit directory `cd ./packages/uikit-mv3-solid`
4. Run `bun run dev-web` to start up the web interface and backend in development mode
5. Enjoy! :D


# Project Core Functionality Roadmap
- backend
	- notifications
	- authentication
	- filesystem
	- users
	- teams
- web
	- login / signup flow
	- Application-Frame layout
	- Notification visuals


How do applications work?

Backend starts up
Backend verifies the filesystem
Backend creates a Applications.tsx file in /fs
Web starts up
Web uses /fs/Applications.tsx as the router for /app

Applications can now be accessed by /app/[application-id]/

Applications can be external or located in /fs/applications/
Only applications specified in /fs/applications.json as enabled will be loaded
Any number of unloaded applications can also be specified in /fs/applications.json and they will be enablable by the administrator
