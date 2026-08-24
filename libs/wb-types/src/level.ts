/**
 * @see https://war-brokers.fandom.com/wiki/Experience
 */
const xpThresholds = [
    100, 500, 1500, 3000, 5000, 11_000, 18_000, 27_000, 37_000, 48_000, 60_000, 73_000, 87_000,
] as const

/**
 * Converts level to minimum number of XP required for that level.
 */
export function lvl2xp(level: number) {
    if (!Number.isInteger(level) || level < 1) {
        throw new RangeError(`Level must be an integer lower than 1 but got ${level}`)
    }

    if (level >= 24) return level * 25_000 - 350_000
    if (level >= 14) return level * 15_000 - 108_000

    const xp = xpThresholds[level - 1]
    if (xp !== undefined) return xp

    throw new RangeError(`Level can not be lower than 1 but got ${level}`)
}

/**
 * Converts XP to level.
 */
export function xp2lvl(xp: number) {
    if (xp >= lvl2xp(24)) return Math.floor((xp + 350_000) / 25_000)
    if (xp >= lvl2xp(14)) return Math.floor((xp + 108_000) / 15_000)

    const level = xpThresholds.reduce(
        (highestLevel, threshold, index) => (xp >= threshold ? index + 1 : highestLevel),
        0,
    )
    if (level > 0) return level

    throw new RangeError(`XP can not be lower than 100 but got ${xp}`)
}
