<script lang="ts">
    import type { DistributionData } from "./distributionData"
    import DistributionHeader from "./DistributionHeader.svelte"
    import DistributionPlot from "./DistributionPlot.svelte"

    type Props = {
        id: string
        title: string
        data: DistributionData | Promise<DistributionData>
        updatedAt: string | Promise<string>
        cacheUpdateIntervalHours: number | Promise<number>
        compactTooltip?: boolean
    }

    const {
        id,
        title,
        data,
        updatedAt,
        cacheUpdateIntervalHours,
        compactTooltip = false,
    }: Props = $props()
</script>

<article class="overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
    <DistributionHeader {title} {updatedAt} {cacheUpdateIntervalHours} />

    {#await data}
        <figure class="animate-pulse px-2 py-5 motion-reduce:animate-none sm:px-4" aria-busy="true">
            <div class="skeleton-reveal pb-2">
                <div class="h-72 rounded-md bg-gray-800/60" aria-hidden="true"></div>
            </div>
            <figcaption class="sr-only">{title} chart</figcaption>
        </figure>
    {:then { buckets, bucketSize }}
        {#if buckets.length === 0}
            <p
                class="flex min-h-84 items-center justify-center px-4 text-sm text-gray-400"
                role="status"
            >
                No {title} distribution data is available.
            </p>
        {:else}
            <DistributionPlot {id} {title} {buckets} {bucketSize} {compactTooltip} />
        {/if}
    {:catch _}
        <p class="flex min-h-84 items-center justify-center px-4 text-sm font-bold text-red-400">
            Failed to load
        </p>
    {/await}
</article>
