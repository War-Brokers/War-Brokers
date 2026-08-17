import { weapons } from "@warbrokers/types/src/weapon"
import { describe, expect, test } from "vitest"

import { getWeaponBreakdowns, type WeaponStats } from "./weapons"

const emptyWeaponStats = {
    damage_dealt: null,
    headshots: null,
    kills_per_weapon: null,
    longest_kill: null,
    most_kills_between_deaths: null,
    most_kills_in_round: null,
    shots_fired_unzoomed: null,
    shots_fired_zoomed: null,
    shots_hit_unzoomed: null,
    shots_hit_zoomed: null,
} satisfies WeaponStats

function createWeaponStats(overrides: Partial<WeaponStats>) {
    return { ...emptyWeaponStats, ...overrides }
}

function getBreakdown(id: string, player: WeaponStats) {
    const breakdown = getWeaponBreakdowns(player).find((candidate) => candidate.id === id)

    if (!breakdown) throw new Error(`Missing ${id} breakdown`)

    return breakdown
}

describe("getWeaponBreakdowns", () => {
    test("creates the complete weapon statistics set", () => {
        const breakdowns = getWeaponBreakdowns(emptyWeaponStats)

        expect(breakdowns.map(({ id }) => id)).toEqual([
            "weapon-kills",
            "weapon-shots-fired",
            "weapon-longest-kill",
            "weapon-headshot-frequency",
            "weapon-kills-between-deaths",
            "weapon-kills-in-round",
            "weapon-unzoomed-accuracy",
            "weapon-zoomed-accuracy",
            "weapon-damage-per-shot",
            "weapon-shots-per-kill",
        ])
        expect(breakdowns.map(({ title }) => title)).toEqual([
            "Kills per Weapon",
            "Shots Fired per Weapon",
            "Longest Kill per Weapon",
            "Headshot Frequency per Weapon",
            "Most Kills Between Deaths per Weapon",
            "Most Kills in One Round per Weapon",
            "Unzoomed Accuracy per Weapon",
            "Zoomed Accuracy per Weapon",
            "Damage Dealt per Shot per Weapon",
            "Shots Fired per Kill per Weapon",
        ])
    })

    test("formats integer and decimal statistics", () => {
        const integerBreakdowns = [
            "weapon-kills",
            "weapon-shots-fired",
            "weapon-kills-between-deaths",
            "weapon-kills-in-round",
        ]

        for (const id of integerBreakdowns) {
            expect(getBreakdown(id, emptyWeaponStats).formatValue(1234.6)).toBe("1,235")
        }

        const decimalBreakdowns = [
            ["weapon-longest-kill", "1,234.0 m"],
            ["weapon-headshot-frequency", "1,234.0%"],
            ["weapon-unzoomed-accuracy", "1,234.0%"],
            ["weapon-zoomed-accuracy", "1,234.0%"],
            ["weapon-damage-per-shot", "1,234.0"],
            ["weapon-shots-per-kill", "1,234.0"],
        ] as const

        for (const [id, formattedValue] of decimalBreakdowns) {
            expect(getBreakdown(id, emptyWeaponStats).formatValue(1234)).toBe(formattedValue)
        }
    })

    test("labels, filters, and sorts weapon records", () => {
        const kills = getBreakdown(
            "weapon-kills",
            createWeaponStats({
                kills_per_weapon: { p52: 30, p61: 10, p62: 20, p63: 0, p74: 7, p123: 5 },
            }),
        )

        expect(kills.rows.map(({ key, label, value }) => ({ key, label, value }))).toEqual([
            { key: "p52", label: "Tank Lvl-1", value: 30 },
            { key: "p62", label: "AK Rifle", value: 20 },
            { key: "p61", label: "AR Rifle", value: 10 },
            { key: "p74", label: "Heli Minigun", value: 7 },
            { key: "p123", label: "p123", value: 5 },
        ])
    })

    test("derives frequency, accuracy, damage, and shot metrics", () => {
        const player = createWeaponStats({
            damage_dealt: { p61: 100 },
            headshots: { p61: 10 },
            kills_per_weapon: { p61: 4 },
            shots_fired_unzoomed: { p61: 20, p62: 4 },
            shots_fired_zoomed: { p61: 30 },
            shots_hit_unzoomed: { p61: 5, p62: 0 },
            shots_hit_zoomed: { p61: 15 },
        })

        expect(getBreakdown("weapon-headshot-frequency", player).rows).toMatchObject([
            { key: "p61", value: 20 },
            { key: "p62", value: 0 },
        ])
        expect(getBreakdown("weapon-unzoomed-accuracy", player).rows).toMatchObject([
            { key: "p61", value: 25 },
            { key: "p62", value: 0 },
        ])
        expect(getBreakdown("weapon-zoomed-accuracy", player).rows).toMatchObject([
            { key: "p61", value: 50 },
        ])
        expect(getBreakdown("weapon-damage-per-shot", player).rows).toMatchObject([
            { key: "p61", value: 2 },
            { key: "p62", value: 0 },
        ])
        expect(getBreakdown("weapon-shots-fired", player).rows).toMatchObject([
            { key: "p61", value: 50 },
            { key: "p62", value: 4 },
        ])
        expect(getBreakdown("weapon-shots-per-kill", player).rows).toMatchObject([
            { key: "p61", value: 12.5 },
        ])
    })

    test("converts longest-kill distances from feet to meters", () => {
        const longestKill = getBreakdown(
            "weapon-longest-kill",
            createWeaponStats({ longest_kill: { p61: 100 } }),
        )

        expect(longestKill.rows).toMatchObject([{ key: "p61", value: 30.48 }])
        expect(longestKill.formatValue(longestKill.rows[0]?.value ?? 0)).toBe("30.5 m")
    })

    test("omits ratios without a positive denominator", () => {
        const player = createWeaponStats({
            damage_dealt: { p61: 100 },
            kills_per_weapon: { p61: 0 },
            shots_fired_unzoomed: { p61: 0 },
            shots_hit_unzoomed: { p61: 10 },
        })

        expect(getBreakdown("weapon-unzoomed-accuracy", player).rows).toEqual([])
        expect(getBreakdown("weapon-damage-per-shot", player).rows).toEqual([])
        expect(getBreakdown("weapon-shots-per-kill", player).rows).toEqual([])
    })

    test("assigns stable colors to specific weapons", () => {
        const player = createWeaponStats({
            kills_per_weapon: { p61: 10, p67: 5, p123: 1 },
            longest_kill: { p61: 100 },
        })
        const kills = getBreakdown("weapon-kills", player)
        const longestKill = getBreakdown("weapon-longest-kill", player)

        expect(kills.rows.find(({ key }) => key === "p61")?.colorClass).toBe("text-cyan-400")
        expect(kills.rows.find(({ key }) => key === "p67")?.colorClass).toBe("text-red-300")
        expect(kills.rows.find(({ key }) => key === "p123")?.colorClass).toBe("text-gray-400")
        expect(longestKill.rows[0]?.colorClass).toBe(kills.rows[0]?.colorClass)
    })

    test("assigns a unique color to every known weapon", () => {
        const kills = getBreakdown(
            "weapon-kills",
            createWeaponStats({
                kills_per_weapon: Object.fromEntries(
                    weapons.map((weapon, index) => [weapon, index + 1]),
                ),
            }),
        )
        const colors = kills.rows.map(({ colorClass }) => colorClass)

        expect(colors).toHaveLength(weapons.length)
        expect(new Set(colors).size).toBe(weapons.length)
    })
})
