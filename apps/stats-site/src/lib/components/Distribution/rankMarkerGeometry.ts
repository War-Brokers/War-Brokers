import { scaleBand, scaleLinear } from "d3-scale"

import { type Rank, rankNamesByPercentile, ranks } from "$lib/rank"

import type { DistributionScale } from "./distributionData"

const focusOutlineWidth = 2
const focusOutlineOffset = 2

export type RankMarkerBucket = {
    start: number
    count: number
    playersBelow: number
    percentile: number
}

export const rankMarkerGeometry = {
    iconSize: 32,
    leaderLength: 8,
    focusOutlineWidth,
    focusOutlineOffset,
    focusClearance: focusOutlineWidth + focusOutlineOffset,
} as const

export const rankMarkerBandPadding = 0.06

export const rankMarkerChartPadding = {
    // Reserve space above the plot for the icon, focus outline, and leader.
    top:
        rankMarkerGeometry.focusClearance +
        rankMarkerGeometry.iconSize +
        rankMarkerGeometry.leaderLength,
    right: 36,
    bottom: 20,
    // Keep the left half of the first icon and its focus outline in view.
    left: rankMarkerGeometry.iconSize / 2 + rankMarkerGeometry.focusClearance,
} as const

export const rankMilestones = [...rankNamesByPercentile]
    .reverse()
    .map((rank) => ({ rank, ...ranks[rank] })) satisfies readonly {
    rank: Rank
    icon: string
    color: string
    percentile: number
}[]

type RankMilestone = (typeof rankMilestones)[number]
export type PositionedRankMilestone = RankMilestone & { x: number; iconX: number }
type RankMarkerBucketPosition = {
    x: number
    width: number
}
type RankMarkerBucketPositioner = (bucket: RankMarkerBucket) => RankMarkerBucketPosition

function getRankMilestoneX(
    percentile: number,
    buckets: readonly RankMarkerBucket[],
    getBucketPosition: RankMarkerBucketPositioner,
) {
    const lastBucket = buckets.at(-1)
    if (!lastBucket) return 0

    const totalCount = lastBucket.playersBelow + lastBucket.count
    const targetCount = (percentile / 100) * totalCount
    const bucket =
        buckets.find((bucket) => bucket.playersBelow + bucket.count >= targetCount) ?? lastBucket
    const bucketProgress =
        bucket.count === 0
            ? 0
            : Math.min(1, Math.max(0, (targetCount - bucket.playersBelow) / bucket.count))

    const { x, width } = getBucketPosition(bucket)

    return x + width * bucketProgress
}

function spreadRankIcons(milestones: Array<RankMilestone & { x: number }>, maximumX: number) {
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

export function getRankMilestonePositions(
    buckets: readonly RankMarkerBucket[],
    getBucketPosition: RankMarkerBucketPositioner,
    containerWidth: number,
) {
    const milestones = rankMilestones.map((milestone) => ({
        ...milestone,
        x: getRankMilestoneX(milestone.percentile, buckets, getBucketPosition),
    }))
    // Keep the right half of the last icon and its focus outline in view.
    const maximumX = Math.max(
        0,
        containerWidth -
            (rankMarkerGeometry.iconSize / 2 + rankMarkerGeometry.focusClearance) -
            rankMarkerChartPadding.left,
    )

    return spreadRankIcons(milestones, maximumX)
}

export function getRankMilestonePositionsForWidth(
    buckets: readonly RankMarkerBucket[],
    containerWidth: number,
    scale: DistributionScale = "band",
    bucketSize = 0,
) {
    if (containerWidth <= 0) return []

    const range = [0, containerWidth - rankMarkerChartPadding.left - rankMarkerChartPadding.right]

    if (scale === "band") {
        const xScale = scaleBand<number>()
            .domain(buckets.map((bucket) => bucket.start))
            // Match LayerChart's padded range so overlay icons and SVG paths share x positions.
            .range(range)
            .padding(rankMarkerBandPadding)

        return getRankMilestonePositions(
            buckets,
            (bucket) => ({
                x: Number(xScale(bucket.start)),
                width: xScale.bandwidth(),
            }),
            containerWidth,
        )
    }

    const firstBucket = buckets[0]
    const lastBucket = buckets.at(-1)
    if (!firstBucket || !lastBucket) return []

    const domainStart = firstBucket.start
    const domainEnd = lastBucket.start + bucketSize
    if (domainEnd <= domainStart) return []

    const domain = [domainStart, domainEnd]

    const xScale = scaleLinear().domain(domain).range(range)

    return getRankMilestonePositions(
        buckets,
        (bucket) => {
            const x = xScale(bucket.start)

            return { x, width: xScale(bucket.start + bucketSize) - x }
        },
        containerWidth,
    )
}

export function getRankMilestonePath(
    milestone: PositionedRankMilestone,
    yRange: readonly number[],
) {
    const bottom = yRange[0] ?? 0
    const top = yRange[1] ?? 0
    const path = `M${milestone.x},${bottom}V${top}`

    return milestone.iconX === milestone.x
        ? path
        : `${path}L${milestone.iconX},${top - rankMarkerGeometry.leaderLength}`
}
