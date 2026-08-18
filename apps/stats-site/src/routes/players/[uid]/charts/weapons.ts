import type { Player } from "@warbrokers/types/src/player"
import { Weapon, weaponIDSchema, WeaponName } from "@warbrokers/types/src/weapon"

import type { CategoryBreakdownModel } from "$lib/components/charts/categoryBreakdown"

export type WeaponStats = Pick<
    Player,
    | "deaths"
    | "damage_dealt"
    | "damage_received"
    | "headshots"
    | "kills_per_weapon"
    | "longest_kill"
    | "most_kills_between_deaths"
    | "most_kills_in_round"
    | "shots_fired_unzoomed"
    | "shots_fired_zoomed"
    | "shots_hit_unzoomed"
    | "shots_hit_zoomed"
>

type WeaponValues = Readonly<Record<string, number>> | null | undefined

const unknownWeaponColor = "text-gray-400"
const metersPerFoot = 0.3048
const weaponNames = WeaponName satisfies Readonly<Record<Weapon, string>>
const weaponColors = {
    [Weapon.AirStrike]: "text-orange-500",
    [Weapon.BGM]: "text-red-400",
    [Weapon.TankLvl1]: "text-pink-400",
    [Weapon.APCLvl1]: "text-fuchsia-400",
    [Weapon.HeliLvl1]: "text-purple-400",
    [Weapon.TankLvl2]: "text-violet-400",
    [Weapon.APCLvl2]: "text-blue-400",
    [Weapon.HeliLvl2]: "text-amber-400",
    [Weapon.TankLvl3]: "text-indigo-400",
    [Weapon.APCLvl3]: "text-emerald-400",
    [Weapon.HeliLvl3]: "text-rose-400",
    [Weapon.ARRifle]: "text-cyan-400",
    [Weapon.AKRifle]: "text-sky-400",
    [Weapon.Pistol]: "text-teal-400",
    [Weapon.HuntingRifle]: "text-green-400",
    [Weapon.RPG]: "text-lime-400",
    [Weapon.Shotgun]: "text-orange-300",
    [Weapon.SniperRifle]: "text-red-300",
    [Weapon.SMG]: "text-pink-300",
    [Weapon.Homing]: "text-fuchsia-300",
    [Weapon.Grenade]: "text-purple-300",
    [Weapon.HeliMinigun]: "text-violet-300",
    [Weapon.TankMinigun]: "text-blue-300",
    [Weapon.Knife]: "text-amber-300",
    [Weapon.Revolver]: "text-indigo-300",
    [Weapon.Minigun]: "text-emerald-300",
    [Weapon.GrenadeLauncher]: "text-rose-300",
    [Weapon.SmokeGrenade]: "text-cyan-300",
    [Weapon.Jet1Rockets]: "text-sky-300",
    [Weapon.Jet1Homing]: "text-teal-300",
    [Weapon.Jet1MachineGun]: "text-green-300",
    [Weapon.Jet2Rockets]: "text-lime-300",
    [Weapon.Jet2Homing]: "text-orange-400",
    [Weapon.Jet2MachineGun]: "text-red-500",
    [Weapon.Fists]: "text-pink-500",
    [Weapon.VSS]: "text-fuchsia-500",
    [Weapon.FiftyCalSniper]: "text-purple-500",
    [Weapon.MGTurret]: "text-violet-500",
    [Weapon.Crossbow]: "text-blue-500",
    [Weapon.SCAR]: "text-amber-500",
    [Weapon.TacticalShotgun]: "text-indigo-500",
    [Weapon.VEK]: "text-emerald-500",
    [Weapon.Desert]: "text-rose-500",
    [Weapon.Auto]: "text-cyan-500",
    [Weapon.LMG]: "text-sky-500",
    [Weapon.KBAR]: "text-teal-500",
    [Weapon.Mace]: "text-green-500",
    [Weapon.RubberChicken]: "text-lime-500",
    [Weapon.Butterfly]: "text-orange-600",
    [Weapon.Chainsaw]: "text-red-600",
    [Weapon.AKSMG]: "text-pink-600",
    [Weapon.AutoSniper]: "text-fuchsia-600",
    [Weapon.AR3]: "text-purple-600",
    [Weapon.SawedOff]: "text-violet-600",
    [Weapon.HealingPistol]: "text-blue-600",
    [Weapon.MP7]: "text-amber-600",
    [Weapon.ImplosionGrenade]: "text-indigo-600",
    [Weapon.LaserTripMine]: "text-emerald-600",
    [Weapon.ConcussionGrenade]: "text-rose-600",
    [Weapon.G3A3]: "text-cyan-600",
    [Weapon.MarksmansRifle]: "text-sky-600",
    [Weapon.Mutant]: "text-teal-600",
} as const satisfies Readonly<Record<Weapon, string>>

function getWeaponPresentation(key: string) {
    const result = weaponIDSchema.safeParse(key)

    if (!result.success) return { label: key, colorClass: unknownWeaponColor } as const

    return {
        label: weaponNames[result.data],
        colorClass: weaponColors[result.data],
    }
}

function formatInteger(value: number) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

function formatDecimal(value: number) {
    return value.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function formatPercentage(value: number) {
    return `${formatDecimal(value)}%`
}

function formatMeters(value: number) {
    return `${formatDecimal(value)} m`
}

function addValues(...records: WeaponValues[]) {
    const sums: Record<string, number> = {}

    for (const record of records) {
        for (const [key, value] of Object.entries(record ?? {})) {
            sums[key] = (sums[key] ?? 0) + value
        }
    }

    return sums
}

function divideValues(numerators: WeaponValues, denominators: WeaponValues, factor = 1) {
    return Object.fromEntries(
        Object.entries(denominators ?? {})
            .filter(([, denominator]) => denominator > 0)
            .map(([key, denominator]) => [key, ((numerators?.[key] ?? 0) / denominator) * factor]),
    )
}

function scaleValues(values: WeaponValues, factor: number) {
    return Object.fromEntries(
        Object.entries(values ?? {}).map(([key, value]) => [key, value * factor]),
    )
}

function createRows(values: WeaponValues, includeZero = false) {
    return Object.entries(values ?? {})
        .filter(([, value]) => Number.isFinite(value) && (includeZero || value > 0))
        .map(([key, value]) => ({
            key,
            value,
            ...getWeaponPresentation(key),
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
}

export function getWeaponBreakdowns(player: WeaponStats) {
    const shotsFired = addValues(player.shots_fired_unzoomed, player.shots_fired_zoomed)

    return [
        {
            id: "weapon-kills",
            title: "Kills per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Kills",
            chartKind: "part-to-whole",
            rows: createRows(player.kills_per_weapon),
            formatValue: formatInteger,
        },
        {
            id: "weapon-damage-dealt",
            title: "Damage Dealt per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Damage dealt",
            chartKind: "part-to-whole",
            rows: createRows(player.damage_dealt),
            formatValue: formatDecimal,
        },
        {
            id: "weapon-shots-per-kill",
            title: "Shots Fired per Kill per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Shots per kill",
            chartKind: "ranked-values",
            rows: createRows(divideValues(shotsFired, player.kills_per_weapon), true),
            formatValue: formatDecimal,
        },
        {
            id: "weapon-damage-per-shot",
            title: "Damage Dealt per Shot per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Damage per shot",
            chartKind: "ranked-values",
            rows: createRows(divideValues(player.damage_dealt, shotsFired), true),
            formatValue: formatDecimal,
        },
        {
            id: "weapon-deaths",
            title: "Deaths per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Deaths",
            chartKind: "part-to-whole",
            rows: createRows(player.deaths),
            formatValue: formatInteger,
        },
        {
            id: "weapon-damage-received",
            title: "Damage Received per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Damage received",
            chartKind: "part-to-whole",
            rows: createRows(player.damage_received),
            formatValue: formatDecimal,
        },
        {
            id: "weapon-shots-fired",
            title: "Shots Fired per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Shots fired",
            chartKind: "part-to-whole",
            rows: createRows(shotsFired),
            formatValue: formatInteger,
        },
        {
            id: "weapon-headshot-frequency",
            title: "Headshot Frequency per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Headshot frequency",
            chartKind: "ranked-values",
            rows: createRows(divideValues(player.headshots, shotsFired, 100), true),
            formatValue: formatPercentage,
        },
        {
            id: "weapon-unzoomed-accuracy",
            title: "Unzoomed Accuracy per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Accuracy",
            chartKind: "ranked-values",
            rows: createRows(
                divideValues(player.shots_hit_unzoomed, player.shots_fired_unzoomed, 100),
                true,
            ),
            formatValue: formatPercentage,
        },
        {
            id: "weapon-zoomed-accuracy",
            title: "Zoomed Accuracy per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Accuracy",
            chartKind: "ranked-values",
            rows: createRows(
                divideValues(player.shots_hit_zoomed, player.shots_fired_zoomed, 100),
                true,
            ),
            formatValue: formatPercentage,
        },
        {
            id: "weapon-kills-between-deaths",
            title: "Most Kills Between Deaths per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Kills",
            chartKind: "ranked-values",
            rows: createRows(player.most_kills_between_deaths),
            formatValue: formatInteger,
        },
        {
            id: "weapon-kills-in-round",
            title: "Most Kills in One Round per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Kills",
            chartKind: "ranked-values",
            rows: createRows(player.most_kills_in_round),
            formatValue: formatInteger,
        },
        {
            id: "weapon-longest-kill",
            title: "Longest Kill per Weapon",
            categoryLabel: "Weapon",
            categoryPlural: "weapons",
            valueLabel: "Distance",
            chartKind: "ranked-values",
            rows: createRows(scaleValues(player.longest_kill, metersPerFoot)),
            formatValue: formatMeters,
        },
    ] as const satisfies CategoryBreakdownModel[]
}
