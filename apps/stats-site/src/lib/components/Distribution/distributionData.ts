export type Bucket = {
    start: number
    count: number
}

export type DistributionData = {
    buckets: Bucket[]
    bucketSize: number
}

export type LogBucket = {
    exponent: number
    count: number
}

export type LogDistributionData = {
    buckets: LogBucket[]
    bucketBase: number
}

export type DistributionScale = "band" | "linear"

export type ChartBucket = Bucket & {
    playersBelow: number
    percentile: number
}

export function getLogBucketBoundary(exponent: number, bucketBase: number) {
    return bucketBase ** exponent - 1
}

export function getTickValues(buckets: readonly Bucket[]) {
    const interval = Math.max(1, Math.ceil(buckets.length / 8))
    const ticks = buckets.filter((_, index) => index % interval === 0).map((bucket) => bucket.start)

    const lastBucket = buckets.at(-1)

    if (lastBucket && ticks.at(-1) !== lastBucket.start) {
        ticks[ticks.length - 1] = lastBucket.start
    }

    return ticks
}

export function fillMissingBuckets(buckets: readonly Bucket[], bucketSize: number) {
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

export function addCumulativeValues<T extends Bucket>(buckets: readonly T[]) {
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

export function formatCompact(value: number) {
    return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value) satisfies string
}

export function formatNumber(value: number) {
    return value.toLocaleString("en-US")
}

export function formatCount(value: number, compact: boolean) {
    return compact ? formatCompact(value) : value.toLocaleString("en-US", { useGrouping: "min2" })
}

export function formatBetterThan(value: number) {
    const percentile = value.toLocaleString("en-US", { maximumFractionDigits: 3 })

    return `better than ${percentile}%`
}

export function formatBucketRange(start: number, end: number, compact = false) {
    const format = compact
        ? formatCompact
        : (value: number) => value.toLocaleString("en-US", { useGrouping: "min2" })

    return `[${format(start)}, ${format(end)})`
}
