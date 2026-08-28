<script lang="ts">
    import { Circle, Spline } from "layerchart"

    import type { ChartBucket } from "./distributionData"
    import { getHorizontalBucketWidth, getLineScale } from "./distributionChartGeometry"
    import type { DistributionChartContext, DistributionLineAxis } from "./distributionChartTypes"
    import { getRankMilestonePath, getRankMilestonePositions } from "./rankMarkerGeometry"

    type SeriesKey = Exclude<keyof ChartBucket, "start">

    type Props = {
        context: DistributionChartContext
        buckets: readonly ChartBucket[]
        bucketSize: number
        lineMetricKey: SeriesKey
        lineAxis: DistributionLineAxis
        lineColorClass: string
    }

    let { context, buckets, bucketSize, lineMetricKey, lineAxis, lineColorClass }: Props = $props()

    const lineScale = $derived(getLineScale(context.yRange, lineAxis.domain))
    const pathData = $derived(
        buckets
            .map(
                (bucket, index) =>
                    `${index === 0 ? "M" : "L"}${Number(context.xScale(bucket.start)) + getHorizontalBucketWidth(context.xScale, bucket, bucketSize) / 2},${lineScale(bucket[lineMetricKey])}`,
            )
            .join(" "),
    )
    const positionedRankMilestones = $derived(
        getRankMilestonePositions(
            buckets,
            (bucket) => ({
                x: Number(context.xScale(bucket.start)),
                width: getHorizontalBucketWidth(context.xScale, bucket, bucketSize),
            }),
            context.containerWidth,
        ),
    )
</script>

{#each positionedRankMilestones as milestone (milestone.rank)}
    <Spline
        pathData={getRankMilestonePath(milestone, context.yRange)}
        stroke={milestone.color}
        strokeWidth={3}
        stroke-linejoin="round"
        opacity={0.75}
        motion="none"
        class="pointer-events-none"
    />
{/each}
<Spline {pathData} stroke="currentColor" strokeWidth={2} motion="none" class={lineColorClass} />
{#if context.tooltip.data !== null}
    {@const tooltipData = context.tooltip.data}
    <Circle
        cx={Number(context.xScale(tooltipData.start)) +
            getHorizontalBucketWidth(context.xScale, tooltipData, bucketSize) / 2}
        cy={lineScale(tooltipData[lineMetricKey])}
        r={3.5}
        fill="currentColor"
        strokeWidth={2}
        motion="none"
        class={`stroke-gray-900 ${lineColorClass}`}
    />
{/if}
