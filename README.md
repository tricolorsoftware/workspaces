# Tricolor Workspaces
---

A working environment for professionals and Home-Lab users.

### Links
- Discord -> https://discord.gg/jcJeGEAYhY
- Source Code (git) -> https://github.com/tricolorsoftware/workspaces

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
6. clone the workspaces docker configuration from git `git clone git@github.com:tricolorsoftware/workspaces-docker.git .`
7. edit `docker-compose.yaml` to your desired configuration from [Insert link to relevant documentation here] before continuing.
8. run `docker-compose up` to start the workspaces docker image and install all remaining dependencies
9. open your browser and head to `https://[server-ip]` and follow the on-screen instructions to complete the setup.
10. Enjoy! :D

## Installation Guide for Development Environments
---
> [!WARNING]
> Ignore this section if you are planning to use workspaces in production, instead please follow the `Installation Guide for Production Environments` section.
### Dependencies

| Dependency      | NPM Package               | External Installation Guide | Optional |
| --------------- | ------------------------- | --------------------------- | -------- |
| SolidJS         | solid                     |                             | No       |
| Vite            | vite                      |                             | No       |
| UIKit           | @tcsw/uikit-solid         |                             | No       |
| Bun             |                           | https://bun.sh              | No       |
| Docker          |                           | https://www.docker.com/     | Yes      |
| PostgreSQL      |                           | https://www.postgresql.org/ | No       |

### Installation
1. Choose either the `Full-Stack` or `UIKit` section to continue
#### Full-Stack (Workspaces)
1. Ensure all non-NPM dependencies are installed before continuing
2. Run `bun install` to install all NPM dependencies
3. Run `bun run web` and `bun run backend` to start up the web interface and backend in development mode
4. Enjoy! :D
#### UIKit (UI Library dev page)
1. Ensure all non-NPM dependencies are installed before continuing
2. Run `bun install` to install all NPM dependencies
3. cd into the UIKit directory `cd ./packages/uikit-solid`
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
