import { createTRPCClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import type { WorkspacesTRPCRouter } from "../../../subsystems/trpcRouter";

const wsClient = createWSClient({
    url: "ws://localhost:3563/instance/workspaces/trpc",
});

const trpc = createTRPCClient<WorkspacesTRPCRouter>({
    links: [
        splitLink({
            condition: (op: { type: string }) => op.type === "subscription",
            true: wsLink<WorkspacesTRPCRouter>({ client: wsClient }),
            false: httpBatchLink({
                url: "http://localhost:3563/instance/workspaces/trpc",
                fetch(input, init) {
                    return fetch(input, { credentials: "include", ...init });
                },
            }),
        }),
    ],
});

export default trpc;
