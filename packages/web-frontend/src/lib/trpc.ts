import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { WorkspacesTRPCRouter } from "../../../backend/src/subsystems/trpc";

const trpc = createTRPCClient<WorkspacesTRPCRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3563/trpc",
            // You can pass any HTTP headers you wish here
            async headers() {
                return {
                    authorization: "Nothing for now TM",
                };
            },
        }),
    ],
});

export default trpc;
