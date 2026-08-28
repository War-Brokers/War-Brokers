import { scaleLinear } from "d3-scale"

import type { ChartBucket } from "./distributionData"
import type { DistributionChartContext } from "./distributionChartTypes"

export function getBucketEnd(bucket: ChartBucket, bucketSize: number) {
    return bucket.start + bucketSize
}

export function getLineScale(
    range: DistributionChartContext["yRange"],
    domain: readonly [number, number],
) {
    return scaleLinear().domain(domain).range(range)
}

export function getHorizontalBucketWidth(
    scale: DistributionChartContext["xScale"],
    bucket: ChartBucket,
    bucketSize: number,
) {
    if (scale.bandwidth) return scale.bandwidth()

    return Math.max(
        0,
        Number(scale(getBucketEnd(bucket, bucketSize))) - Number(scale(bucket.start)),
    )
}

export function getHorizontalBarDimensions(
    context: DistributionChartContext,
    bucket: ChartBucket,
    bucketSize: number,
) {
    const x = Number(context.xScale(bucket.start))
    const y = Number(context.yScale(bucket.count))
    const baseline = Number(context.yScale(0))

    return {
        x,
        y,
        width: getHorizontalBucketWidth(context.xScale, bucket, bucketSize),
        height: Math.max(0, baseline - y),
    }
}
