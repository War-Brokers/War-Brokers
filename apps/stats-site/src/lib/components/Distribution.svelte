<script lang="ts" module>
    const rankPopoverEvent = "open"
    const rankPopoverCoordinator = new EventTarget()
</script>

<script lang="ts">
    import { scaleBand, scaleLinear } from "d3-scale"
    import { Axis, BarChart, Circle, Spline } from "layerchart"
    import { onMount } from "svelte"

    import * as Chart from "$lib/components/ui/chart"
    import * as Popover from "$lib/components/ui/popover"
    import { ranks } from "$lib/rank"

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
        containerWidth: number
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

    // These primitive dimensions drive both chart geometry and trigger styles.
    const rankMarkerGeometry = {
        iconSize: 32,
        leaderLength: 8,
        focusOutlineWidth: 2,
        focusOutlineOffset: 2,
    } as const
    const rankFocusClearance =
        rankMarkerGeometry.focusOutlineWidth + rankMarkerGeometry.focusOutlineOffset
    const bandPadding = 0.06
    const chartPadding = {
        // Reserve space above the plot for the icon, focus outline, and leader.
        top: rankFocusClearance + rankMarkerGeometry.iconSize + rankMarkerGeometry.leaderLength,
        right: 36,
        bottom: 20,
        // Keep the left half of the first icon and its focus outline in view.
        left: rankMarkerGeometry.iconSize / 2 + rankFocusClearance,
    } as const
    const rankMilestones = Object.entries(ranks)
        .map(([rank, details]) => ({ rank, ...details }))
        .sort((a, b) => a.percentile - b.percentile)

    let chartWidth = $state(0)
    let activeRankPopover = $state<string>()

    onMount(() => {
        const closeOtherRankPopover = (event: Event) => {
            if (!(event instanceof CustomEvent) || typeof event.detail !== "string") return
            if (event.detail !== activeRankPopover) activeRankPopover = undefined
        }

        rankPopoverCoordinator.addEventListener(rankPopoverEvent, closeOtherRankPopover)

        return () => {
            rankPopoverCoordinator.removeEventListener(rankPopoverEvent, closeOtherRankPopover)
        }
    })

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
        const ticks = buckets
            .filter((_, index) => index % interval === 0)
            .map((bucket) => bucket.start)

        const lastBucket = buckets.at(-1)

        if (lastBucket && ticks.at(-1) !== lastBucket.start) {
            ticks[ticks.length - 1] = lastBucket.start
        }

        return ticks
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

    function getRankMilestoneX(
        percentile: number,
        buckets: ChartBucket[],
        xScale: DistributionChartContext["xScale"],
        bandwidth: number,
    ) {
        const lastBucket = buckets.at(-1)
        if (!lastBucket) return 0

        const totalCount = lastBucket.playersBelow + lastBucket.count
        const targetCount = (percentile / 100) * totalCount
        const bucket =
            buckets.find((bucket) => bucket.playersBelow + bucket.count >= targetCount) ??
            lastBucket
        const bucketProgress =
            bucket.count === 0
                ? 0
                : Math.min(1, Math.max(0, (targetCount - bucket.playersBelow) / bucket.count))

        return Number(xScale(bucket.start)) + bandwidth * bucketProgress
    }

    function spreadRankIcons(
        milestones: ((typeof rankMilestones)[number] & { x: number })[],
        maximumX: number,
    ) {
        const minimumX = 0
        const spacing = Math.min(
            rankMarkerGeometry.iconSize,
            (maximumX - minimumX) / Math.max(1, milestones.length - 1),
        )
        let previousX = minimumX - spacing
        const positioned = milestones.map((milestone) => {
            const iconX = Math.max(milestone.x, minimumX, previousX + spacing)
            previousX = iconX

            return { ...milestone, iconX }
        })

        for (let index = positioned.length - 1; index >= 0; index -= 1) {
            const nextX = positioned[index + 1]?.iconX ?? maximumX + spacing
            const milestone = positioned[index]
            if (milestone) milestone.iconX = Math.min(milestone.iconX, maximumX, nextX - spacing)
        }

        return positioned
    }

    function getRankMilestonePositions(
        buckets: ChartBucket[],
        xScale: DistributionChartContext["xScale"],
        bandwidth: number,
        containerWidth: number,
    ) {
        const milestones = rankMilestones.map((milestone) => ({
            ...milestone,
            x: getRankMilestoneX(milestone.percentile, buckets, xScale, bandwidth),
        }))
        // Keep the right half of the last icon and its focus outline in view.
        const maximumX = Math.max(
            0,
            containerWidth -
                (rankMarkerGeometry.iconSize / 2 + rankFocusClearance) -
                chartPadding.left,
        )

        return spreadRankIcons(milestones, maximumX)
    }

    function getRankMilestonePositionsForWidth(buckets: ChartBucket[], containerWidth: number) {
        if (containerWidth === 0) return []

        const xScale = scaleBand<number>()
            .domain(buckets.map((bucket) => bucket.start))
            // Match LayerChart's padded range so overlay icons and SVG paths share x positions.
            .range([0, containerWidth - chartPadding.left - chartPadding.right])
            .padding(bandPadding)

        return getRankMilestonePositions(buckets, xScale, xScale.bandwidth(), containerWidth)
    }

    function getRankMilestonePath(
        milestone: (typeof rankMilestones)[number] & { x: number; iconX: number },
        yRange: number[],
    ) {
        const bottom = yRange[0] ?? 0
        const top = yRange[1] ?? 0
        const path = `M${milestone.x},${bottom}V${top}`

        return milestone.iconX === milestone.x
            ? path
            : `${path}L${milestone.iconX},${top - rankMarkerGeometry.leaderLength}`
    }

    function updateRankPopover(rank: string, open: boolean) {
        const popoverId = `${id}-${rank}`

        if (open) {
            activeRankPopover = popoverId
            rankPopoverCoordinator.dispatchEvent(
                new CustomEvent(rankPopoverEvent, { detail: popoverId }),
            )
        } else if (activeRankPopover === popoverId) activeRankPopover = undefined
    }

    function isDistributionChartContext(value: unknown): value is DistributionChartContext {
        return typeof value !== "object" || value === null
            ? false
            : "xScale" in value &&
                  typeof value.xScale === "function" &&
                  "containerWidth" in value &&
                  typeof value.containerWidth === "number" &&
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
                <div class="overflow-x-auto pb-2">
                    <div class="flex h-72 w-full min-w-80 flex-col gap-1">
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
                        <div class="relative min-h-0 w-full flex-1" bind:clientWidth={chartWidth}>
                            <div
                                class="h-full w-full"
                                role="img"
                                aria-label={`${title} histogram with a cumulative percentile line and colored rank milestone bars. Data is available in the following table.`}
                            >
                                <Chart.Container {id} config={chartConfig} class="h-full w-full">
                                    <BarChart
                                        data={completeBuckets}
                                        xScale={scaleBand().padding(bandPadding)}
                                        x="start"
                                        padding={chartPadding}
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
                                            {@const chartContext =
                                                asDistributionChartContext(context)}
                                            {@const lineScale = getLineScale(chartContext.yRange)}
                                            {@const bandwidth =
                                                chartContext.xScale.bandwidth?.() ?? 0}
                                            {@const pathData = completeBuckets
                                                .map(
                                                    (bucket, index) =>
                                                        `${index === 0 ? "M" : "L"}${Number(chartContext.xScale(bucket.start)) + bandwidth / 2},${lineScale(bucket[distributionChart.line.metric.key])}`,
                                                )
                                                .join(" ")}
                                            {@const positionedRankMilestones =
                                                getRankMilestonePositions(
                                                    completeBuckets,
                                                    chartContext.xScale,
                                                    bandwidth,
                                                    chartContext.containerWidth,
                                                )}
                                            {#each positionedRankMilestones as milestone (milestone.rank)}
                                                <Spline
                                                    pathData={getRankMilestonePath(
                                                        milestone,
                                                        chartContext.yRange,
                                                    )}
                                                    stroke={milestone.color}
                                                    strokeWidth={3}
                                                    stroke-linejoin="round"
                                                    opacity={0.75}
                                                    motion="none"
                                                    class="pointer-events-none"
                                                />
                                            {/each}
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
                                            {@const chartContext =
                                                asDistributionChartContext(context)}
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
                                                    distributionChart.line.axis.format(
                                                        Number(value),
                                                    )}
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
                            {#each getRankMilestonePositionsForWidth(completeBuckets, chartWidth) as milestone (milestone.rank)}
                                <Popover.Root
                                    open={activeRankPopover === `${id}-${milestone.rank}`}
                                    onOpenChange={(open) => {
                                        updateRankPopover(milestone.rank, open)
                                    }}
                                >
                                    <Popover.Trigger
                                        type="button"
                                        openOnHover
                                        openDelay={150}
                                        closeDelay={100}
                                        class="absolute z-10 cursor-help rounded-sm focus-visible:outline-orange-400 focus-visible:outline-solid"
                                        style={[
                                            `left: ${chartPadding.left + milestone.iconX - rankMarkerGeometry.iconSize / 2}px`,
                                            `top: ${rankFocusClearance}px`,
                                            `width: ${rankMarkerGeometry.iconSize}px`,
                                            `height: ${rankMarkerGeometry.iconSize}px`,
                                            `outline-width: ${rankMarkerGeometry.focusOutlineWidth}px`,
                                            `outline-offset: ${rankMarkerGeometry.focusOutlineOffset}px`,
                                        ].join("; ")}
                                    >
                                        <img
                                            src={milestone.icon}
                                            alt=""
                                            width={rankMarkerGeometry.iconSize}
                                            height={rankMarkerGeometry.iconSize}
                                            class="block size-full"
                                        />
                                        <span class="sr-only">
                                            Show {milestone.rank} rank threshold
                                        </span>
                                    </Popover.Trigger>
                                    <Popover.Content
                                        side="top"
                                        align="center"
                                        collisionPadding={16}
                                        trapFocus={false}
                                        aria-label={`${milestone.rank} rank threshold`}
                                        class="w-auto max-w-[calc(100vw-2rem)] items-center gap-1 p-3 text-center text-gray-400"
                                        onOpenAutoFocus={(event: Event) => {
                                            event.preventDefault()
                                        }}
                                        onCloseAutoFocus={(event: Event) => {
                                            event.preventDefault()
                                        }}
                                    >
                                        <span class="font-black text-gray-100">
                                            {milestone.rank}
                                        </span>
                                        <span>
                                            better than
                                            <span class="font-black text-gray-100">
                                                {milestone.percentile}%
                                            </span>
                                            of the players
                                        </span>
                                    </Popover.Content>
                                </Popover.Root>
                            {/each}
                        </div>
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
