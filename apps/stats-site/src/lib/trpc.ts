import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@warbrokers/wbapi/build/src/router"

import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"

// The client bundle can omit the dynamic public-env object at runtime.
function isPublicEnv(value: unknown): value is { PUBLIC_WBAPI_URL?: unknown } {
    return typeof value === "object" && value !== null
}

function getPublicWbApiUrl(value: unknown) {
    if (!isPublicEnv(value)) return

    return typeof value.PUBLIC_WBAPI_URL === "string" ? value.PUBLIC_WBAPI_URL : undefined
}

export default createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url:
                getPublicWbApiUrl(env) ||
                (dev ? "http://127.0.0.1:5000/trpc" : "https://wbapi.wbpjs.com/trpc"),
        }),
    ],
})
