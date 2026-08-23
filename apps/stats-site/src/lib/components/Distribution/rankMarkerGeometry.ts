import { scaleBand } from "d3-scale"

import { type Rank, rankNamesByPercentile, ranks } from "$lib/rank"

const focusOutlineWidth = 2
const focusOutlineOffset = 2

export type RankMarkerBucket = {
    start: number
    count: number
    playersBelow: number
    percentile: number
}

export type RankMarkerScale = (value: number) => number | undefined

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

function getRankMilestoneX(
    percentile: number,
    buckets: readonly RankMarkerBucket[],
    xScale: RankMarkerScale,
    bandwidth: number,
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

    return Number(xScale(bucket.start)) + bandwidth * bucketProgress
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
    xScale: RankMarkerScale,
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
            (rankMarkerGeometry.iconSize / 2 + rankMarkerGeometry.focusClearance) -
            rankMarkerChartPadding.left,
    )

    return spreadRankIcons(milestones, maximumX)
}

export function getRankMilestonePositionsForWidth(
    buckets: readonly RankMarkerBucket[],
    containerWidth: number,
) {
    if (containerWidth === 0) return []

    const xScale = scaleBand<number>()
        .domain(buckets.map((bucket) => bucket.start))
        // Match LayerChart's padded range so overlay icons and SVG paths share x positions.
        .range([0, containerWidth - rankMarkerChartPadding.left - rankMarkerChartPadding.right])
        .padding(rankMarkerBandPadding)

    return getRankMilestonePositions(buckets, xScale, xScale.bandwidth(), containerWidth)
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
