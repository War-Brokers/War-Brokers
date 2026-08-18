import type { Player } from "@warbrokers/types/src/player"
import { Vehicle, VehicleName, vehicleSchema } from "@warbrokers/types/src/vehicle"

import type { CategoryBreakdownModel } from "$lib/components/charts/categoryBreakdown"

export type VehicleStats = Pick<
    Player,
    "distance_driven" | "distance_driven_count" | "kills_per_vehicle" | "self_destructs"
>

type VehicleValues = Readonly<Record<string, number>> | null | undefined

const unknownVehicleColor = "text-gray-400"
const vehicleNames = VehicleName satisfies Readonly<Record<Vehicle, string>>
const vehicleColors = {
    [Vehicle.TankLvl1]: "text-orange-500",
    [Vehicle.TankLvl2]: "text-red-400",
    [Vehicle.TankLvl3]: "text-pink-400",
    [Vehicle.APCLvl1]: "text-fuchsia-400",
    [Vehicle.APCLvl2]: "text-purple-400",
    [Vehicle.APCLvl3]: "text-violet-400",
    [Vehicle.Car]: "text-blue-400",
    [Vehicle.UNKNOWN_VEHICLE_14]: "text-amber-400",
    [Vehicle.Jet1FinMachineGun]: "text-indigo-400",
    [Vehicle.UNKNOWN_VEHICLE_16]: "text-emerald-400",
    [Vehicle.UNKNOWN_VEHICLE_17]: "text-rose-400",
    [Vehicle.UNKNOWN_VEHICLE_18]: "text-cyan-400",
    [Vehicle.UNKNOWN_VEHICLE_19]: "text-sky-400",
    [Vehicle.HeliLvl1]: "text-teal-400",
    [Vehicle.HeliLvl2]: "text-green-400",
    [Vehicle.HeliLvl3]: "text-lime-400",
    [Vehicle.HeliNoWeapon]: "text-orange-300",
    [Vehicle.Player]: "text-red-300",
    [Vehicle.Jet1Fin]: "text-pink-300",
    [Vehicle.Jet2Fin]: "text-fuchsia-300",
    [Vehicle.MachineGunTurret]: "text-purple-300",
    [Vehicle.UFO]: "text-violet-300",
    [Vehicle.UNKNOWN_VEHICLE_110]: "text-blue-300",
    [Vehicle.UNKNOWN_VEHICLE_111]: "text-amber-300",
    [Vehicle.UNKNOWN_VEHICLE_112]: "text-indigo-300",
    [Vehicle.UNKNOWN_VEHICLE_113]: "text-emerald-300",
} as const satisfies Readonly<Record<Vehicle, string>>

function getVehiclePresentation(key: string) {
    const result = vehicleSchema.safeParse(key)

    if (!result.success) return { label: key, colorClass: unknownVehicleColor } as const

    return {
        label: vehicleNames[result.data],
        colorClass: vehicleColors[result.data],
    }
}

function formatInteger(value: number) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

function formatMeters(value: number) {
    return `${value.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })} m`
}

function divideValues(numerators: VehicleValues, denominators: VehicleValues) {
    return Object.fromEntries(
        Object.entries(denominators ?? {})
            .filter(([, denominator]) => denominator > 0)
            .map(([key, denominator]) => [key, (numerators?.[key] ?? 0) / denominator]),
    )
}

function createRows(values: VehicleValues, includeZero = false) {
    return Object.entries(values ?? {})
        .filter(([, value]) => Number.isFinite(value) && (includeZero || value > 0))
        .map(([key, value]) => ({
            key,
            value,
            ...getVehiclePresentation(key),
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
}

export function getVehicleBreakdowns(player: VehicleStats) {
    return [
        {
            id: "vehicle-kills",
            title: "Kills per Vehicle",
            categoryLabel: "Vehicle",
            categoryPlural: "vehicles",
            valueLabel: "Kills",
            chartKind: "part-to-whole",
            rows: createRows(player.kills_per_vehicle),
            formatValue: formatInteger,
        },
        {
            id: "vehicle-distance-driven",
            title: "Distance Driven per Vehicle",
            categoryLabel: "Vehicle",
            categoryPlural: "vehicles",
            valueLabel: "Distance driven",
            chartKind: "part-to-whole",
            rows: createRows(player.distance_driven),
            formatValue: formatMeters,
        },
        {
            id: "vehicle-usage-count",
            title: "Vehicle Usage Count",
            categoryLabel: "Vehicle",
            categoryPlural: "vehicles",
            valueLabel: "Uses",
            chartKind: "part-to-whole",
            rows: createRows(player.distance_driven_count),
            formatValue: formatInteger,
        },
        {
            id: "vehicle-distance-per-usage",
            title: "Distance Driven per Vehicle Usage",
            categoryLabel: "Vehicle",
            categoryPlural: "vehicles",
            valueLabel: "Distance per usage",
            chartKind: "ranked-values",
            rows: createRows(
                divideValues(player.distance_driven, player.distance_driven_count),
                true,
            ),
            formatValue: formatMeters,
        },
        {
            id: "vehicle-self-destructs",
            title: "Self Destructs per Vehicle",
            categoryLabel: "Vehicle",
            categoryPlural: "vehicles",
            valueLabel: "Self destructs",
            chartKind: "part-to-whole",
            rows: createRows(player.self_destructs),
            formatValue: formatInteger,
        },
    ] as const satisfies CategoryBreakdownModel[]
}
