import { describe, expect, it } from "vitest"

import {
    getRankMilestonePath,
    getRankMilestonePositions,
    getRankMilestonePositionsForWidth,
    type PositionedRankMilestone,
    type RankMarkerBucket,
    rankMarkerGeometry,
    rankMilestones,
} from "./rankMarkerGeometry"

const buckets = [
    { start: 0, count: 10, playersBelow: 0, percentile: 0 },
    { start: 10, count: 10, playersBelow: 10, percentile: 50 },
] satisfies RankMarkerBucket[]

function getPosition(rank: string, positions: PositionedRankMilestone[]) {
    const position = positions.find((milestone) => milestone.rank === rank)

    if (!position) throw new Error(`Missing ${rank} marker`)

    return position
}

describe("rank marker geometry", () => {
    it("interpolates each rank within its distribution bucket", () => {
        const positions = getRankMilestonePositions(buckets, (value) => value * 10, 10, 500)

        expect(getPosition("Novice", positions)).toMatchObject({ x: 0, iconX: 0 })
        expect(getPosition("Adequate", positions)).toMatchObject({ x: 102, iconX: 102 })
        expect(getPosition("Competent", positions)).toMatchObject({ x: 106, iconX: 134 })
    })

    it("does not divide by a zero-count bucket", () => {
        const positions = getRankMilestonePositions(
            [
                { start: 0, count: 10, playersBelow: 0, percentile: 0 },
                { start: 10, count: 0, playersBelow: 10, percentile: 50 },
                { start: 20, count: 10, playersBelow: 10, percentile: 50 },
            ],
            (value) => value,
            10,
            500,
        )

        expect(getPosition("Adequate", positions).x).toBe(22)
    })

    it("spreads overlapping markers across the available width", () => {
        const positions = getRankMilestonePositions(
            [{ start: 0, count: 100, playersBelow: 0, percentile: 0 }],
            () => 0,
            0,
            100,
        )

        expect(positions.map(({ iconX }) => iconX)).toEqual([
            0, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60,
        ])
    })

    it("keeps the width helper empty before the chart has a width", () => {
        expect(getRankMilestonePositionsForWidth(buckets, 0)).toEqual([])
    })

    it("builds a leader path only when a marker moved", () => {
        const rank = rankMilestones[0]
        if (!rank) throw new Error("At least one rank must be configured")

        const aligned = { ...rank, x: 10, iconX: 10 } satisfies PositionedRankMilestone
        const moved = { ...rank, x: 10, iconX: 20 } satisfies PositionedRankMilestone

        expect(getRankMilestonePath(aligned, [100, 20])).toBe("M10,100V20")
        expect(getRankMilestonePath(moved, [100, 20])).toBe("M10,100V20L20,12")
        expect(rankMarkerGeometry.leaderLength).toBe(8)
    })
})
