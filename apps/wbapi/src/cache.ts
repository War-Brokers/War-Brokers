type CachedValue<T> = {
    value: T
    updatedAt: string
    expiresAt: number
}

type CacheOptions<T> = {
    /** How long a cache entry stays fresh, in milliseconds. */
    cacheTimeMs: number
    /** How often to refresh the cache after a successful refresh, in milliseconds. */
    refreshIntervalMs?: number
    /** How long to wait before retrying a failed scheduled refresh, in milliseconds. */
    retryIntervalMs?: number
    /** Whether an expired entry may be returned while a refresh is pending. */
    allowStale?: boolean
    /** Whether reading an expired entry starts a refresh in the background. */
    refreshWhenStale?: boolean
    /** Whether a loaded value should replace the current cached entry. */
    isCacheable?: (value: T) => boolean
}

export function createCache<T>(
    name: string,
    load: (cachedValue: T | undefined) => Promise<T>,
    {
        cacheTimeMs,
        refreshIntervalMs,
        retryIntervalMs = 60 * 1000,
        allowStale = false,
        refreshWhenStale = false,
        isCacheable = () => true,
    }: CacheOptions<T>,
) {
    let cachedValue: CachedValue<T> | undefined
    let refreshPromise: Promise<CachedValue<T>> | undefined
    let started = false

    async function refresh() {
        if (refreshPromise !== undefined) return await refreshPromise

        refreshPromise = load(cachedValue?.value)
            .then((value) => {
                const nextCachedValue = {
                    value,
                    updatedAt: new Date().toISOString(),
                    expiresAt: Date.now() + cacheTimeMs,
                }
                if (isCacheable(value)) cachedValue = nextCachedValue
                return nextCachedValue
            })
            .finally(() => {
                refreshPromise = undefined
            })

        return await refreshPromise
    }

    function scheduleRefreshAfter(delay: number) {
        const timer = setTimeout(runRefreshCycle, delay)
        timer.unref()
    }

    function runRefreshCycle() {
        void refresh().then(
            () => {
                if (refreshIntervalMs !== undefined) scheduleRefreshAfter(refreshIntervalMs)
            },
            (error: unknown) => {
                console.error(`[${name}-refresh-error]`, error)
                if (refreshIntervalMs !== undefined) scheduleRefreshAfter(retryIntervalMs)
            },
        )
    }

    function refreshInBackground() {
        if (refreshPromise !== undefined) return

        void refresh().catch((error: unknown) => {
            console.error(`[${name}-refresh-error]`, error)
        })
    }

    return {
        get: async () => {
            if (cachedValue !== undefined) {
                if (cachedValue.expiresAt > Date.now()) return cachedValue

                if (allowStale) {
                    if (refreshWhenStale) refreshInBackground()
                    return cachedValue
                }
            }

            if (refreshPromise !== undefined) return await refreshPromise

            return await refresh()
        },
        refresh,
        start: () => {
            if (started) return
            started = true
            runRefreshCycle()
        },
    }
}
