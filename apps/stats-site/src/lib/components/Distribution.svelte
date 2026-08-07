<script lang="ts">
    import { scaleBand } from "d3-scale"
    import { BarChart } from "layerchart"

    import * as Chart from "$lib/components/ui/chart"

    type Bucket = {
        start: number
        count: number
    }

    type DistributionData = {
        buckets: Bucket[]
        bucketSize: number
    }

    type Props = {
        id: string
        title: string
        data: DistributionData | Promise<DistributionData>
        updatedAt: string | Promise<string>
        cacheUpdateIntervalHours: number | Promise<number>
        countLabel?: string
        compactTooltip?: boolean
    }

    const {
        id,
        title,
        data,
        updatedAt,
        cacheUpdateIntervalHours,
        countLabel = "Count",
        compactTooltip = false,
    }: Props = $props()

    const chartConfig = $derived({
        count: {
            label: countLabel,
            color: "oklch(75% 0.183 55.934)", // orange-400
        },
    } as const satisfies Chart.ChartConfig)

    function getTickValues(buckets: Bucket[]): number[] {
        const interval = Math.max(1, Math.ceil(buckets.length / 8))

        return buckets
            .filter((_, index) => index % interval === 0 || index === buckets.length - 1)
            .map((bucket) => bucket.start)
    }

    function fillMissingBuckets(buckets: Bucket[], bucketSize: number): Bucket[] {
        if (buckets.length < 2) return buckets

        const bucketsByStart = new Map(buckets.map((bucket) => [bucket.start, bucket]))
        const firstBucket = buckets[0]
        const lastBucket = buckets.at(-1)
        if (!firstBucket || !lastBucket) return buckets

        const firstStart = firstBucket.start
        const lastStart = lastBucket.start
        const bucketCount = Math.round((lastStart - firstStart) / bucketSize) + 1

        return Array.from({ length: bucketCount }, (_, index) => {
            const start = firstStart + index * bucketSize

            return bucketsByStart.get(start) ?? { start, count: 0 }
        })
    }

    function formatBucketLabel(start: number, size: number, compact = false): string {
        const end = start + size - 1
        const format = compact
            ? formatCompact
            : (value: number) => value.toLocaleString("en-US", { useGrouping: "min2" })

        return `${format(start)}-${format(end)}`
    }

    function formatCompact(value: number) {
        return Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value) satisfies string
    }
</script>

<article class="overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
    <header
        class="flex flex-col gap-1 border-b border-gray-700 px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-6"
    >
        <h3 class="text-lg font-semibold text-gray-100">{title}</h3>
        {#await Promise.all( [updatedAt, cacheUpdateIntervalHours] ) then [updatedAt, cacheUpdateIntervalHours]}
            {@const now = Date.now()}
            {@const hoursAgo = Math.max(0, Math.floor((now - Date.parse(updatedAt)) / 3_600_000))}
            {@const refreshesInHours = Math.max(
                0,
                Math.ceil(
                    (Date.parse(updatedAt) + cacheUpdateIntervalHours * 3_600_000 - now) /
                        3_600_000,
                ),
            )}
            <span class="text-xs tabular-nums text-gray-500">
                <time datetime={updatedAt} title={updatedAt}>
                    Updated {hoursAgo} {hoursAgo === 1 ? "hour" : "hours"} ago</time
                >, refreshes in {refreshesInHours}
                {refreshesInHours === 1 ? "hour" : "hours"}
            </span>
        {/await}
    </header>

    {#await data}
        <figure class="px-2 py-5 sm:px-4" aria-busy="true">
            <div class="pb-2">
                <div class="h-72 rounded-md bg-gray-800/40"></div>
            </div>
            <figcaption class="sr-only">Loading {title} chart.</figcaption>
        </figure>
    {:then { buckets, bucketSize }}
        {#if buckets.length === 0}
            <p class="flex h-[21rem] items-center justify-center px-4 text-sm text-gray-400">
                No distribution data available.
            </p>
        {:else}
            {@const completeBuckets = fillMissingBuckets(buckets, bucketSize)}
            <figure class="px-2 py-5 sm:px-4">
                <div
                    class="overflow-x-auto pb-2"
                    role="img"
                    aria-label={`${title} histogram. Data is available in the following table.`}
                >
                    <div class="w-full">
                        <Chart.Container {id} config={chartConfig} class="h-72 w-full">
                            <BarChart
                                data={completeBuckets}
                                xScale={scaleBand().padding(0.06)}
                                x="start"
                                axis="x"
                                series={[
                                    {
                                        key: "count",
                                        label: chartConfig.count.label,
                                        color: chartConfig.count.color,
                                    },
                                ]}
                                props={{
                                    bars: {
                                        stroke: "none",
                                        rounded: "none",
                                    },
                                    highlight: {
                                        area: {
                                            fill: "oklch(55.1% 0.027 264.364)", // gray-500
                                            fillOpacity: 0.25,
                                        },
                                        motion: "none",
                                    },
                                    xAxis: {
                                        ticks: getTickValues(completeBuckets),
                                        format: (value) => formatCompact(Number(value)),
                                    },
                                }}
                            >
                                {#snippet tooltip()}
                                    <Chart.Tooltip
                                        labelFormatter={(value) =>
                                            formatBucketLabel(
                                                Number(value),
                                                bucketSize,
                                                compactTooltip,
                                            )}
                                        valueFormatter={compactTooltip
                                            ? (value) => formatCompact(Number(value))
                                            : undefined}
                                    />
                                {/snippet}
                            </BarChart>
                        </Chart.Container>
                    </div>
                </div>
                <div class="sr-only">
                    <table>
                        <caption>{title} distribution data</caption>
                        <thead>
                            <tr>
                                <th scope="col">Range</th>
                                <th scope="col">{countLabel}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each completeBuckets as bucket (bucket.start)}
                                <tr>
                                    <td>{formatBucketLabel(bucket.start, bucketSize)}</td>
                                    <td>{bucket.count.toLocaleString("en-US")}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <figcaption class="sr-only">{title} distribution.</figcaption>
            </figure>
        {/if}
    {:catch _}
        <p class="flex h-[21rem] items-center justify-center px-4 text-sm text-red-600">ERROR</p>
    {/await}
</article>
