<script lang="ts" module>
    const rankPopoverEvent = "open"
    const rankPopoverCoordinator = new EventTarget()
</script>

<script lang="ts">
    import { scaleBand, scaleLinear } from "d3-scale"
    import { BarChart, type ChartContextValue } from "layerchart"
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
        getRankMilestonePositionsForWidth,
        rankMarkerBandPadding,
        rankMarkerChartPadding,
        rankMarkerGeometry,
    } from "./rankMarkerGeometry"
    import DistributionAxes from "./DistributionAxes.svelte"
    import DistributionBars from "./DistributionBars.svelte"
    import DistributionOverlay from "./DistributionOverlay.svelte"
    import { getBucketEnd } from "./distributionChartGeometry"
    import type { DistributionLineAxis } from "./distributionChartTypes"

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
    let chartContext = $state<ChartContextValue<ChartBucket>>()

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
            } satisfies DistributionLineAxis,
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

    function getHorizontalValue(bucket: ChartBucket) {
        if (xScaleType === "band") return bucket.start

        return [bucket.start, getBucketEnd(bucket, bucketSize)]
    }

    function getHorizontalTickValues() {
        const ticks = getTickValues(completeBuckets)
        if (xScaleType === "band") return ticks

        const firstBucket = completeBuckets[0]
        const lastBucket = completeBuckets.at(-1)
        const endpoints =
            firstBucket && lastBucket
                ? [firstBucket.start, getBucketEnd(lastBucket, bucketSize)]
                : []

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
                getLogBucketBoundary(getBucketEnd(bucket, bucketSize), logBucketBase),
            )
        }

        return formatBucketRange(bucket.start, getBucketEnd(bucket, bucketSize))
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
                            bind:context={chartContext}
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
                            {#snippet marks()}
                                {#if chartContext}
                                    <DistributionBars
                                        context={chartContext}
                                        buckets={completeBuckets}
                                        {bucketSize}
                                        colorClass={distributionChart.bar.colorClass}
                                    />
                                {/if}
                            {/snippet}
                            {#snippet aboveMarks()}
                                {#if chartContext}
                                    <DistributionOverlay
                                        context={chartContext}
                                        buckets={completeBuckets}
                                        {bucketSize}
                                        lineMetricKey={distributionChart.line.metric.key}
                                        lineAxis={distributionChart.line.axis}
                                        lineColorClass={distributionChart.line.colorClass}
                                    />
                                {/if}
                            {/snippet}
                            {#snippet axis()}
                                {#if chartContext}
                                    <DistributionAxes
                                        context={chartContext}
                                        horizontalTicks={getHorizontalTickValues()}
                                        lineAxis={distributionChart.line.axis}
                                        {formatHorizontalTick}
                                    />
                                {/if}
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
