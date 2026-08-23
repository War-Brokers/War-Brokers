<script lang="ts">
    type Props = {
        title: string
        updatedAt: string | Promise<string>
        cacheUpdateIntervalHours: number | Promise<number>
    }

    const { title, updatedAt, cacheUpdateIntervalHours }: Props = $props()
</script>

<header
    class="flex flex-col gap-1 border-b border-gray-700 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-6"
>
    <h3 class="text-lg font-semibold text-gray-100">{title}</h3>
    {#await Promise.all([updatedAt, cacheUpdateIntervalHours])}
        <span class="skeleton-reveal" aria-busy="true">
            <span
                class="block h-3 w-52 max-w-full animate-pulse rounded bg-gray-700 motion-reduce:animate-none"
                aria-hidden="true"
            ></span>
        </span>
    {:then [updatedAt, cacheUpdateIntervalHours]}
        {@const now = Date.now()}
        {@const hoursAgo = Math.max(0, Math.floor((now - Date.parse(updatedAt)) / 3_600_000))}
        {@const refreshesInHours = Math.max(
            0,
            Math.ceil(
                (Date.parse(updatedAt) + cacheUpdateIntervalHours * 3_600_000 - now) / 3_600_000,
            ),
        )}
        <span class="text-xs text-gray-400 tabular-nums">
            <time datetime={updatedAt} title={updatedAt}>
                Updated {hoursAgo} {hoursAgo === 1 ? "hour" : "hours"} ago</time
            >, refreshes in {refreshesInHours}
            {refreshesInHours === 1 ? "hour" : "hours"}
        </span>
    {:catch _}
        <span class="text-xs text-red-400">Update time unavailable</span>
    {/await}
</header>
