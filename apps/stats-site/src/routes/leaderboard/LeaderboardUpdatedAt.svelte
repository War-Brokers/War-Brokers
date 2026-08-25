<script lang="ts">
    export let updatedAt: Promise<number>
</script>

{#await updatedAt}
    <span class="skeleton-reveal" aria-busy="true">
        <span
            class="block h-4 w-40 max-w-full animate-pulse rounded bg-gray-700 motion-reduce:animate-none"
            aria-hidden="true"
        ></span>
    </span>
{:then updatedAtTimestamp}
    {@const updatedAtDate = new Date(updatedAtTimestamp * 1000)}
    {@const hoursAgo = Math.max(0, Math.floor((Date.now() - updatedAtDate.getTime()) / 3_600_000))}
    <span class="text-sm font-normal text-gray-400 tabular-nums">
        <time datetime={updatedAtDate.toISOString()} title={updatedAtDate.toISOString()}>
            Updated {hoursAgo}
            {hoursAgo === 1 ? "hour" : "hours"} ago
        </time>
    </span>
{:catch _}
    <span class="text-sm font-normal text-red-400">Update time unavailable</span>
{/await}
