import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { WorkspacesTRPCRouter } from "../../../subsystems/trpc";

const trpc = createTRPCClient<WorkspacesTRPCRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3563/trpc",
            fetch(input, init) {
                return fetch(input, { credentials: "include", ...init });
            },
        }),
    ],
});

export default trpc;
