import { gameModes } from "@warbrokers/types/src/gameMode"
import { describe, expect, test } from "vitest"

import { getGameModeBreakdowns } from "./gameModes"

function getBreakdown(id: string, player: Parameters<typeof getGameModeBreakdowns>[0]) {
    const breakdown = getGameModeBreakdowns(player).find((candidate) => candidate.id === id)

    if (!breakdown) throw new Error(`Missing ${id} breakdown`)

    return breakdown
}

describe("getGameModeBreakdowns", () => {
    test("normalizes, labels, filters, and sorts game mode records", () => {
        const wins = getBreakdown("wins", {
            wins: { m00: 10, m11: 20, m07: 0, m99: 5 },
            losses: null,
        })

        expect(wins.rows.map(({ key, label, value }) => ({ key, label, value }))).toEqual([
            { key: "m11", label: "Battle Royale", value: 20 },
            { key: "m00", label: "Team Death Match", value: 10 },
            { key: "m99", label: "m99", value: 5 },
        ])
    })

    test("creates an empty model for missing and zero-only data", () => {
        expect(getBreakdown("wins", { wins: null, losses: { m00: 0 } }).rows).toEqual([])
        expect(getBreakdown("losses", { wins: null, losses: { m00: 0 } }).rows).toEqual([])
    })

    test("uses one stable color for each known game mode", () => {
        const values = Object.fromEntries(gameModes.map((gameMode) => [gameMode, 1]))
        const first = getBreakdown("wins", { wins: values, losses: null })
        const second = getBreakdown("wins", { wins: values, losses: null })

        expect(new Set(first.rows.map((row) => row.colorClass)).size).toBe(gameModes.length)
        expect(second.rows).toEqual(first.rows)
    })
})
