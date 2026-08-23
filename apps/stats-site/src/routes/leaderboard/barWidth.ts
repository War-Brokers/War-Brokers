export type StatRange = {
    min: number
    max: number
}

export function scaleBarWidth(value: number, range: StatRange | undefined) {
    if (range === undefined) return 0
    if (range.max === range.min) return range.max > 0 ? 100 : 0
    if (range.max < range.min) return 0

    return Math.min(100, Math.max(0, ((value - range.min) / (range.max - range.min)) * 100))
}
