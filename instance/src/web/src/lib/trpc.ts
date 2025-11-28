import { createTRPCClient, httpBatchLink, httpSubscriptionLink, splitLink } from "@trpc/client";
import type { WorkspacesTRPCRouter } from "../../../subsystems/trpcRouter";

const trpc = createTRPCClient<WorkspacesTRPCRouter>({
    links: [
        splitLink({
            condition: (op: { type: string }) => op.type === "subscription",
            true: httpSubscriptionLink({
                url: "http://localhost:3563/instance/workspaces/trpc",
                eventSourceOptions: {
                    withCredentials: true,
                },
            }),
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
