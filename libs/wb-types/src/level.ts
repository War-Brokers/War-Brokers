/**
 * @see https://war-brokers.fandom.com/wiki/Experience
 */
export function xp2lv(xp: number) {
    if (xp >= 250_000) return Math.floor((xp + 350_000) / 25_000)
    if (xp >= 102_000) return Math.floor((xp + 108_000) / 15_000)
    if (xp >= 87_000) return 13
    if (xp >= 73_000) return 12
    if (xp >= 60_000) return 11
    if (xp >= 48_000) return 10
    if (xp >= 37_000) return 9
    if (xp >= 27_000) return 8
    if (xp >= 18_000) return 7
    if (xp >= 11_000) return 6
    if (xp >= 5000) return 5
    if (xp >= 3000) return 4
    if (xp >= 1500) return 3
    if (xp >= 500) return 2
    if (xp >= 100) return 1

    throw `XP can not be lower than 100 but got ${xp}`
}
