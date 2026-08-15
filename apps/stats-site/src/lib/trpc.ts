import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@warbrokers/wbapi/build/src/router"

import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"

export default createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url:
                env["PUBLIC_WBAPI_URL"] ||
                (dev ? "http://127.0.0.1:5000/trpc" : "https://wbapi.wbpjs.com/trpc"),
        }),
    ],
})
