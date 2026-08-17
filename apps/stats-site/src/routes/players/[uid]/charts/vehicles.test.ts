import { vehicles } from "@warbrokers/types/src/vehicle"
import { describe, expect, test } from "vitest"

import { getVehicleBreakdowns, type VehicleStats } from "./vehicles"

const emptyVehicleStats = {
    distance_driven: null,
    distance_driven_count: null,
    kills_per_vehicle: null,
    self_destructs: null,
} satisfies VehicleStats

function createVehicleStats(overrides: Partial<VehicleStats>) {
    return { ...emptyVehicleStats, ...overrides }
}

function getBreakdown(id: string, player: VehicleStats) {
    const breakdown = getVehicleBreakdowns(player).find((candidate) => candidate.id === id)

    if (!breakdown) throw new Error(`Missing ${id} breakdown`)

    return breakdown
}

describe("getVehicleBreakdowns", () => {
    test("creates vehicle statistics in the requested order", () => {
        const breakdowns = getVehicleBreakdowns(emptyVehicleStats)

        expect(breakdowns.map(({ id, title }) => ({ id, title }))).toEqual([
            { id: "vehicle-kills", title: "Kills per Vehicle" },
            { id: "vehicle-distance-driven", title: "Distance Driven per Vehicle" },
            { id: "vehicle-usage-count", title: "Vehicle Usage Count" },
            {
                id: "vehicle-distance-per-usage",
                title: "Distance Driven per Vehicle Usage",
            },
            { id: "vehicle-self-destructs", title: "Self Destructs per Vehicle" },
        ])
    })

    test("formats count and distance statistics", () => {
        expect(getBreakdown("vehicle-kills", emptyVehicleStats).formatValue(1234.6)).toBe("1,235")
        expect(getBreakdown("vehicle-distance-driven", emptyVehicleStats).formatValue(1234)).toBe(
            "1,234.0 m",
        )
        expect(
            getBreakdown("vehicle-distance-per-usage", emptyVehicleStats).formatValue(1234),
        ).toBe("1,234.0 m")
    })

    test("labels, filters, and sorts vehicle records", () => {
        const kills = getBreakdown(
            "vehicle-kills",
            createVehicleStats({
                kills_per_vehicle: { v00: 10, v13: 30, v20: 20, v21: 0, v99: 5 },
            }),
        )

        expect(kills.rows.map(({ key, label, value }) => ({ key, label, value }))).toEqual([
            { key: "v13", label: "Car", value: 30 },
            { key: "v20", label: "Heli Lvl-1", value: 20 },
            { key: "v00", label: "Tank Lvl-1", value: 10 },
            { key: "v99", label: "v99", value: 5 },
        ])
    })

    test("derives distance driven per positive vehicle usage count", () => {
        const distancePerUsage = getBreakdown(
            "vehicle-distance-per-usage",
            createVehicleStats({
                distance_driven: { v00: 100, v01: 50 },
                distance_driven_count: { v00: 4, v01: 0, v02: 2 },
            }),
        )

        expect(distancePerUsage.rows).toMatchObject([
            { key: "v00", value: 25 },
            { key: "v02", value: 0 },
        ])
    })

    test("assigns one stable color to each known vehicle and a fallback to unknown IDs", () => {
        const kills = getBreakdown(
            "vehicle-kills",
            createVehicleStats({
                kills_per_vehicle: {
                    ...Object.fromEntries(vehicles.map((vehicle) => [vehicle, 1])),
                    v99: 1,
                },
            }),
        )
        const knownRows = kills.rows.filter(({ key }) => key !== "v99")

        expect(knownRows).toHaveLength(vehicles.length)
        expect(new Set(knownRows.map(({ colorClass }) => colorClass)).size).toBe(vehicles.length)
        expect(kills.rows.find(({ key }) => key === "v99")?.colorClass).toBe("text-gray-400")
    })
})
