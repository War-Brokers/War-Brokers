import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@warbrokers/wbapi/build/router"

import { dev } from "$app/environment"

export default createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: dev
                ? "http://127.0.0.1:5000/trpc"
                : "https://wbapi.wbpjs.com/trpc",
        }),
    ],
})
