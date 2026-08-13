<script lang="ts">
    import { scaleBand, scaleLinear } from "d3-scale"
    import { Axis, BarChart, Circle, Spline } from "layerchart"

    import * as Chart from "$lib/components/ui/chart"

    type Bucket = {
        start: number
        count: number
    }

    type DistributionData = {
        buckets: Bucket[]
        bucketSize: number
    }

    type ChartBucket = Bucket & {
        playersBelow: number
        percentile: number
    }

    type SeriesKey = Exclude<keyof ChartBucket, "start">

    type DistributionMetric = {
        key: SeriesKey
        label: string
        format: (value: number) => string
        tableFormat: (value: number) => string
    }

    type DistributionVisual = {
        metric: DistributionMetric
        details?: DistributionMetric[]
        colorClass: string
    }

    type DistributionChart = {
        bar: DistributionVisual
        line: DistributionVisual & {
            axis: {
                placement: "right"
                domain: [number, number]
                ticks: number[]
                format: (value: number) => string
                tickMarks: false
            }
        }
    }

    type DistributionChartContext = {
        xScale: ((value: number) => number | undefined) & { bandwidth?: () => number }
        yRange: number[]
        tooltip: { data: unknown }
    }

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

    const distributionChart = $derived({
        bar: {
            colorClass: "text-orange-400",
            details: [],
            metric: {
                key: "count",
                label: "Players in this bucket",
                format: formatCount,
                tableFormat: formatNumber,
            },
        },
        line: {
            colorClass: "text-sky-400",
            metric: {
                key: "percentile",
                label: "Percentile",
                format: formatBetterThan,
                tableFormat: formatBetterThan,
            },
            details: [
                {
                    key: "playersBelow",
                    label: "Players below this bucket",
                    format: formatCount,
                    tableFormat: formatNumber,
                },
            ],
            axis: {
                placement: "right",
                domain: [0, 100],
                ticks: [0, 25, 50, 75, 100],
                format: (value: number) => `${value}%`,
                tickMarks: false,
            },
        },
    } satisfies DistributionChart)

    const visualSeries: DistributionVisual[] = $derived([
        distributionChart.bar,
        distributionChart.line,
    ])
    const chartMetrics = $derived(
        visualSeries.flatMap((series) => [...(series.details ?? []), series.metric]),
    )
    const chartConfig = $derived(
        visualSeries.flatMap((series) =>
            [...(series.details ?? []), series.metric].map((metric) => ({
                key: metric.key,
                label: metric.label,
                colorClass: series.colorClass,
                format: (value: unknown) => metric.format(Number(value)),
            })),
        ),
    )
    const barSeries = $derived([
        {
            key: distributionChart.bar.metric.key,
            label: distributionChart.bar.metric.label,
            color: "currentColor",
            props: { class: distributionChart.bar.colorClass },
        },
    ])

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

    function addCumulativeValues(buckets: Bucket[]): ChartBucket[] {
        const totalCount = buckets.reduce((total, bucket) => total + bucket.count, 0)
        let playersBelow = 0

        return buckets.map((bucket) => {
            const cumulativeBucket = {
                ...bucket,
                playersBelow,
                percentile: totalCount === 0 ? 0 : (playersBelow / totalCount) * 100,
            }

            playersBelow += bucket.count

            return cumulativeBucket
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

    function formatNumber(value: number): string {
        return value.toLocaleString("en-US")
    }

    function formatCount(value: number): string {
        return compactTooltip
            ? formatCompact(value)
            : value.toLocaleString("en-US", { useGrouping: "min2" })
    }

    function formatBetterThan(value: number): string {
        const percentile = value.toLocaleString("en-US", { maximumFractionDigits: 3 })

        return `better than ${percentile}%`
    }

    function isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null
    }

    function isChartBucket(value: unknown): value is ChartBucket {
        return (
            isRecord(value) &&
            typeof value["start"] === "number" &&
            chartMetrics.every((metric) => typeof value[metric.key] === "number")
        )
    }

    function getLineScale(range: number[]) {
        return scaleLinear().domain(distributionChart.line.axis.domain).range(range)
    }

    function isDistributionChartContext(value: unknown): value is DistributionChartContext {
        return typeof value !== "object" || value === null
            ? false
            : "xScale" in value &&
                  typeof value.xScale === "function" &&
                  "yRange" in value &&
                  Array.isArray(value.yRange) &&
                  value.yRange.every((item) => typeof item === "number") &&
                  "tooltip" in value &&
                  typeof value.tooltip === "object" &&
                  value.tooltip !== null &&
                  "data" in value.tooltip
    }

    function asDistributionChartContext(value: unknown): DistributionChartContext {
        if (!isDistributionChartContext(value)) {
            throw new Error("Invalid distribution chart context")
        }

        return value
    }
</script>

<article class="overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
    <header
        class="flex flex-col gap-1 border-b border-gray-700 px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-6"
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
        {:catch _}
            <span class="text-xs text-red-400">Update time unavailable</span>
        {/await}
    </header>

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
                class="flex min-h-[21rem] items-center justify-center px-4 text-sm text-gray-400"
                role="status"
            >
                No {title} distribution data is available.
            </p>
        {:else}
            {@const completeBuckets = addCumulativeValues(fillMissingBuckets(buckets, bucketSize))}
            <figure class="px-2 py-5 sm:px-4">
                <div
                    class="overflow-x-auto pb-2"
                    role="img"
                    aria-label={`${title} histogram with a cumulative percentile line. Data is available in the following table.`}
                >
                    <div class="flex h-72 w-full flex-col gap-1">
                        <div
                            class="flex shrink-0 justify-end gap-4 px-1 text-xs text-gray-400"
                            aria-hidden="true"
                        >
                            {#each [distributionChart.bar, distributionChart.line] as series, index (series.metric.key)}
                                <span class="flex items-center gap-1.5">
                                    <span
                                        class={index === 1
                                            ? `w-4 border-t-2 border-current ${series.colorClass}`
                                            : `size-2.5 bg-current ${series.colorClass}`}
                                    ></span>
                                    {series.metric.label}
                                </span>
                            {/each}
                        </div>
                        <Chart.Container {id} config={chartConfig} class="min-h-0 w-full flex-1">
                            <BarChart
                                data={completeBuckets}
                                xScale={scaleBand().padding(0.06)}
                                x="start"
                                padding={{ top: 4, right: 28, bottom: 20, left: 0 }}
                                series={barSeries}
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
                                }}
                            >
                                {#snippet aboveMarks({ context })}
                                    {@const chartContext = asDistributionChartContext(context)}
                                    {@const lineScale = getLineScale(chartContext.yRange)}
                                    {@const bandwidth = chartContext.xScale.bandwidth?.() ?? 0}
                                    {@const pathData = completeBuckets
                                        .map(
                                            (bucket, index) =>
                                                `${index === 0 ? "M" : "L"}${Number(chartContext.xScale(bucket.start)) + bandwidth / 2},${lineScale(bucket[distributionChart.line.metric.key])}`,
                                        )
                                        .join(" ")}
                                    <Spline
                                        {pathData}
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        motion="none"
                                        class={distributionChart.line.colorClass}
                                    />
                                    {#if isChartBucket(chartContext.tooltip.data)}
                                        <Circle
                                            cx={Number(
                                                chartContext.xScale(
                                                    chartContext.tooltip.data.start,
                                                ),
                                            ) +
                                                bandwidth / 2}
                                            cy={lineScale(
                                                chartContext.tooltip.data[
                                                    distributionChart.line.metric.key
                                                ],
                                            )}
                                            r={3.5}
                                            fill="currentColor"
                                            strokeWidth={2}
                                            motion="none"
                                            class={`stroke-gray-900 ${distributionChart.line.colorClass}`}
                                        />
                                    {/if}
                                {/snippet}
                                {#snippet axis({ context })}
                                    {@const chartContext = asDistributionChartContext(context)}
                                    <Axis
                                        placement="bottom"
                                        scale={chartContext.xScale}
                                        ticks={getTickValues(completeBuckets)}
                                        format={(value) => formatCompact(Number(value))}
                                    />
                                    <Axis
                                        placement={distributionChart.line.axis.placement}
                                        scale={getLineScale(chartContext.yRange)}
                                        ticks={distributionChart.line.axis.ticks}
                                        format={(value) =>
                                            distributionChart.line.axis.format(Number(value))}
                                        tickMarks={distributionChart.line.axis.tickMarks}
                                    />
                                {/snippet}
                                {#snippet tooltip()}
                                    <Chart.Tooltip
                                        labelFormatter={(value) =>
                                            formatBucketLabel(
                                                Number(value),
                                                bucketSize,
                                                compactTooltip,
                                            )}
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
                                {#each chartMetrics as metric (metric.key)}
                                    <th scope="col">{metric.label}</th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each completeBuckets as bucket (bucket.start)}
                                <tr>
                                    <td>{formatBucketLabel(bucket.start, bucketSize)}</td>
                                    {#each chartMetrics as metric (metric.key)}
                                        <td>
                                            {metric.tableFormat(bucket[metric.key])}
                                        </td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <figcaption class="sr-only">
                    {title} distribution and cumulative percentile.
                </figcaption>
            </figure>
        {/if}
    {:catch _}
        <p
            class="flex min-h-[21rem] items-center justify-center px-4 text-sm font-bold text-red-400"
        >
            Failed to load
        </p>
    {/await}
</article>
