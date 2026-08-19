import { describe, expect, it } from "vitest"

import { percentile2rank, ranks } from "$lib/rank"

const ranksByPercentile = Object.entries(ranks).sort(([, a], [, b]) => a.percentile - b.percentile)

describe("percentile2rank", () => {
    it("classifies every configured rank", () => {
        for (const [index, [rank, details]] of ranksByPercentile.entries()) {
            const nextPercentile = ranksByPercentile[index + 1]?.[1].percentile ?? 100
            const percentile = details.percentile + (nextPercentile - details.percentile) / 2

            expect(percentile2rank(percentile)).toEqual({ rank, icon: details.icon })
        }
    })

    it("does not award a rank at its exact threshold", () => {
        for (const [index, [, details]] of ranksByPercentile.entries()) {
            const lowerRank = ranksByPercentile[Math.max(0, index - 1)]?.[0]

            expect(percentile2rank(details.percentile).rank).toBe(lowerRank)
        }
    })
})
