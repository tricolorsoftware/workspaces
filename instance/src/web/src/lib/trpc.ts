import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { WorkspacesTRPCRouter } from "../../../subsystems/trpcRouter";

const trpc = createTRPCClient<WorkspacesTRPCRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3563/instance/workspaces/trpc",
            fetch(input, init) {
                return fetch(input, { credentials: "include", ...init });
            },
        }),
    ],
});

export default trpc;
