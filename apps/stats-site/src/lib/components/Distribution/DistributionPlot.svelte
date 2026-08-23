<script lang="ts" module>
    const rankPopoverEvent = "open"
    const rankPopoverCoordinator = new EventTarget()
</script>

<script lang="ts">
    import { scaleBand, scaleLinear } from "d3-scale"
    import { Axis, BarChart, Circle, Rect, Spline } from "layerchart"
    import { onMount } from "svelte"

    import * as Chart from "$lib/components/ui/chart"
    import * as Popover from "$lib/components/ui/popover"

    import {
        addCumulativeValues,
        type ChartBucket,
        type DistributionData,
        type DistributionScale,
        fillMissingBuckets,
        formatBetterThan,
        formatBucketRange,
        formatCompact,
        formatCount,
        formatNumber,
        getLogBucketBoundary,
        getTickValues,
        type LogDistributionData,
    } from "./distributionData"
    import {
        getRankMilestonePath,
        getRankMilestonePositions,
        getRankMilestonePositionsForWidth,
        rankMarkerBandPadding,
        rankMarkerChartPadding,
        rankMarkerGeometry,
    } from "./rankMarkerGeometry"

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
        xScale: DistributionChartScale
        yScale: DistributionChartScale
        yRange: number[]
        tooltip: { data: unknown }
    }

    type DistributionChartScale = ((value: number) => number | undefined) & {
        bandwidth?: () => number
    }

    type Props = {
        id: string
        title: string
        data: DistributionData | LogDistributionData
        compactTooltip?: boolean
        scale?: DistributionScale
    }

    const { id, title, data, compactTooltip = false, scale = "band" }: Props = $props()

    let chartWidth = $state(0)
    let activeRankPopover = $state<string>()

    function isLogDistributionData(
        value: DistributionData | LogDistributionData,
    ): value is LogDistributionData {
        return "bucketBase" in value
    }

    const isLogarithmic = $derived(isLogDistributionData(data))
    const bucketSize = $derived(isLogDistributionData(data) ? 1 : data.bucketSize)
    const logBucketBase = $derived(isLogDistributionData(data) ? data.bucketBase : undefined)
    const plotBuckets = $derived(
        isLogDistributionData(data)
            ? data.buckets.map((bucket) => ({ start: bucket.exponent, count: bucket.count }))
            : data.buckets,
    )
    const xScaleType = $derived(isLogarithmic ? "linear" : scale)

    const completeBuckets = $derived(
        addCumulativeValues(fillMissingBuckets(plotBuckets, bucketSize)),
    )
    const xScale = $derived(
        xScaleType === "band" ? scaleBand<number>().padding(rankMarkerBandPadding) : scaleLinear(),
    )

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
                format: (value) => formatCount(value, compactTooltip),
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
                    format: (value) => formatCount(value, compactTooltip),
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

    function getBucketEnd(bucket: ChartBucket) {
        return bucket.start + bucketSize
    }

    function getHorizontalValue(bucket: ChartBucket) {
        if (xScaleType === "band") return bucket.start

        return [bucket.start, getBucketEnd(bucket)]
    }

    function getHorizontalBucketWidth(scale: DistributionChartScale, bucket: ChartBucket) {
        if (scale.bandwidth) return scale.bandwidth()

        return Math.max(0, Number(scale(getBucketEnd(bucket))) - Number(scale(bucket.start)))
    }

    function getHorizontalBarDimensions(context: DistributionChartContext, bucket: ChartBucket) {
        const x = Number(context.xScale(bucket.start))
        const y = Number(context.yScale(bucket.count))
        const baseline = Number(context.yScale(0))

        return {
            x,
            y,
            width: getHorizontalBucketWidth(context.xScale, bucket),
            height: Math.max(0, baseline - y),
        }
    }

    function getHorizontalTickValues() {
        const ticks = getTickValues(completeBuckets)
        if (xScaleType === "band") return ticks

        const firstBucket = completeBuckets[0]
        const lastBucket = completeBuckets.at(-1)
        const endpoints =
            firstBucket && lastBucket ? [firstBucket.start, getBucketEnd(lastBucket)] : []

        return [...new Set([...ticks, ...endpoints])].sort((left, right) => left - right)
    }

    function formatHorizontalBucketLabel(value: unknown) {
        const values = Array.isArray(value) ? (value as unknown[]) : [value]
        const start = values[0]
        if (typeof start !== "number") return String(start)

        const end = typeof values[1] === "number" ? values[1] : start + bucketSize
        if (isLogarithmic && logBucketBase !== undefined) {
            return formatBucketRange(
                getLogBucketBoundary(start, logBucketBase),
                getLogBucketBoundary(end, logBucketBase),
                compactTooltip,
            )
        }

        return formatBucketRange(start, start + bucketSize, compactTooltip)
    }

    function formatHorizontalTick(value: unknown) {
        const coordinate = Number(value)
        const actualValue =
            isLogarithmic && logBucketBase !== undefined
                ? getLogBucketBoundary(coordinate, logBucketBase)
                : coordinate

        return formatCompact(actualValue)
    }

    function formatTableBucketLabel(bucket: ChartBucket) {
        if (isLogarithmic && logBucketBase !== undefined) {
            return formatBucketRange(
                getLogBucketBoundary(bucket.start, logBucketBase),
                getLogBucketBoundary(getBucketEnd(bucket), logBucketBase),
            )
        }

        return formatBucketRange(bucket.start, getBucketEnd(bucket))
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
                  "yScale" in value &&
                  typeof value.yScale === "function" &&
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
                    class="size-full"
                    role="img"
                    aria-label={`${title} histogram with a cumulative percentile line and colored rank milestone bars. Horizontal scale: ${isLogarithmic ? "logarithmic" : scale === "linear" ? "linear" : "bucketed"}. Data is available in the following table.`}
                >
                    <Chart.Container {id} config={chartConfig} class="size-full">
                        <BarChart
                            data={completeBuckets}
                            {xScale}
                            x={getHorizontalValue}
                            padding={rankMarkerChartPadding}
                            series={barSeries}
                            props={{
                                tooltip: {
                                    context: {
                                        mode: xScaleType === "band" ? "band" : "bisect-x",
                                    },
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
                            {#snippet marks({ context })}
                                {@const chartContext = asDistributionChartContext(context)}
                                {#each completeBuckets as bucket (bucket.start)}
                                    <Rect
                                        {...getHorizontalBarDimensions(chartContext, bucket)}
                                        fill="currentColor"
                                        stroke="none"
                                        motion="none"
                                        class={distributionChart.bar.colorClass}
                                    />
                                {/each}
                            {/snippet}
                            {#snippet aboveMarks({ context })}
                                {@const chartContext = asDistributionChartContext(context)}
                                {@const lineScale = getLineScale(chartContext.yRange)}
                                {@const pathData = completeBuckets
                                    .map(
                                        (bucket, index) =>
                                            `${index === 0 ? "M" : "L"}${Number(chartContext.xScale(bucket.start)) + getHorizontalBucketWidth(chartContext.xScale, bucket) / 2},${lineScale(bucket[distributionChart.line.metric.key])}`,
                                    )
                                    .join(" ")}
                                {@const positionedRankMilestones = getRankMilestonePositions(
                                    completeBuckets,
                                    (bucket) => ({
                                        x: Number(chartContext.xScale(bucket.start)),
                                        width: getHorizontalBucketWidth(
                                            chartContext.xScale,
                                            bucket,
                                        ),
                                    }),
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
                                            chartContext.xScale(chartContext.tooltip.data.start),
                                        ) +
                                            getHorizontalBucketWidth(
                                                chartContext.xScale,
                                                chartContext.tooltip.data,
                                            ) /
                                                2}
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
                                    ticks={getHorizontalTickValues()}
                                    format={formatHorizontalTick}
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
                                <Chart.Tooltip labelFormatter={formatHorizontalBucketLabel} />
                            {/snippet}
                        </BarChart>
                    </Chart.Container>
                </div>
                {#each getRankMilestonePositionsForWidth(completeBuckets, chartWidth, xScaleType, bucketSize) as milestone (milestone.rank)}
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
                                `left: ${rankMarkerChartPadding.left + milestone.iconX - rankMarkerGeometry.iconSize / 2}px`,
                                `top: ${rankMarkerGeometry.focusClearance}px`,
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
                        <td>{formatTableBucketLabel(bucket)}</td>
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
        {title} distribution and cumulative percentile with a {isLogarithmic
            ? "logarithmic"
            : scale} horizontal scale.
    </figcaption>
</figure>
