import { describe, expect, it } from "vitest"

import {
    addCumulativeValues,
    type Bucket,
    fillMissingBuckets,
    getTickValues,
} from "./distributionData"

describe("distribution data", () => {
    it("fills missing buckets between the first and last bucket", () => {
        const buckets = [
            { start: 10, count: 2 },
            { start: 30, count: 1 },
        ] satisfies Bucket[]

        expect(fillMissingBuckets(buckets, 10)).toEqual([
            { start: 10, count: 2 },
            { start: 20, count: 0 },
            { start: 30, count: 1 },
        ])
    })

    it("adds cumulative player counts and percentiles", () => {
        expect(
            addCumulativeValues([
                { start: 10, count: 2 },
                { start: 20, count: 3 },
            ]),
        ).toEqual([
            { start: 10, count: 2, playersBelow: 0, percentile: 0 },
            { start: 20, count: 3, playersBelow: 2, percentile: 40 },
        ])
    })

    it("keeps the last bucket visible in the tick list", () => {
        const buckets = Array.from({ length: 10 }, (_, start) => ({ start, count: 1 }))

        expect(getTickValues(buckets)).toEqual([0, 2, 4, 6, 9])
    })
})
