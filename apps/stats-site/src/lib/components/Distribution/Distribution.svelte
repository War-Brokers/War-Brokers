<script lang="ts">
    import { Switch } from "$lib/components/ui/switch"

    import type {
        DistributionData,
        DistributionScale,
        LogDistributionData,
    } from "./distributionData"
    import DistributionHeader from "./DistributionHeader.svelte"
    import DistributionPlot from "./DistributionPlot.svelte"

    type Props = {
        id: string
        title: string
        data: DistributionData | Promise<DistributionData>
        logData?: LogDistributionData | Promise<LogDistributionData> | undefined
        updatedAt: string | Promise<string>
        cacheUpdateIntervalHours: number | Promise<number>
        compactTooltip?: boolean
        scale?: DistributionScale
    }

    const {
        id,
        title,
        data,
        logData,
        updatedAt,
        cacheUpdateIntervalHours,
        compactTooltip = false,
        scale = "band",
    }: Props = $props()

    let logScale = $state(logData !== undefined)
    const activeData = $derived(logScale && logData ? logData : data)
    const scaleSwitchId = `${id}-scale-switch`
</script>

<article class="overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
    <DistributionHeader {title} {updatedAt} {cacheUpdateIntervalHours}>
        {#snippet controls()}
            {#if logData}
                <label
                    for={scaleSwitchId}
                    class="flex cursor-pointer items-center gap-1.5 text-xs text-gray-400"
                >
                    <span aria-hidden="true">Linear</span>
                    <Switch
                        id={scaleSwitchId}
                        checked={logScale}
                        onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") logScale = checked
                        }}
                        aria-label="Use logarithmic horizontal scale"
                    />
                    <span aria-hidden="true">Log</span>
                </label>
            {/if}
        {/snippet}
    </DistributionHeader>

    {#await activeData}
        <figure class="animate-pulse px-2 py-5 motion-reduce:animate-none sm:px-4" aria-busy="true">
            <div class="skeleton-reveal pb-2">
                <div class="h-72 rounded-md bg-gray-800/60" aria-hidden="true"></div>
            </div>
            <figcaption class="sr-only">{title} chart</figcaption>
        </figure>
    {:then selectedData}
        {#if selectedData.buckets.length === 0}
            <p
                class="flex min-h-84 items-center justify-center px-4 text-sm text-gray-400"
                role="status"
            >
                No {title} distribution data is available.
            </p>
        {:else}
            <DistributionPlot {id} {title} data={selectedData} {compactTooltip} {scale} />
        {/if}
    {:catch _}
        <p class="flex min-h-84 items-center justify-center px-4 text-sm font-bold text-red-400">
            Failed to load
        </p>
    {/await}
</article>
