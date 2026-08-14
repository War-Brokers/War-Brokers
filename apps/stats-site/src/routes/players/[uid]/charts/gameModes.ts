import { GameMode, gameModeName } from "@warbrokers/types/src/gameMode"
import type { Player } from "@warbrokers/types/src/player"

import type { CategoryBreakdownModel } from "$lib/components/charts/categoryBreakdown"

type GameModeStats = Pick<Player, "wins" | "losses">
type GameModeField = keyof GameModeStats

type GameModeBreakdown = {
    field: GameModeField
    id: string
    title: string
    valueLabel: string
    includeZero: boolean
}

const colorByGameMode = {
    [GameMode.DeathMatch]: "text-orange-500",
    [GameMode.DemolitionDerby]: "text-red-400",
    [GameMode.ProtectLeader]: "text-pink-400",
    [GameMode.ResourceCapture]: "text-fuchsia-400",
    [GameMode.Race]: "text-purple-400",
    [GameMode.TankBattle]: "text-violet-400",
    [GameMode.TankKing]: "text-blue-400",
    [GameMode.CapturePoint]: "text-amber-400",
    [GameMode.VehicleEscort]: "text-indigo-400",
    [GameMode.PackageDrop]: "text-emerald-400",
    [GameMode.ScudLaunch]: "text-rose-400",
    [GameMode.BattleRoyale]: "text-cyan-400",
    [GameMode.Competitive]: "text-sky-400",
    [GameMode.LobbyCompetitive]: "text-teal-400",
    [GameMode.LobbyBR]: "text-green-400",
    [GameMode.Count]: "text-lime-400",
} as const satisfies Record<GameMode, string>

const unknownGameModeColor = "text-gray-400"
const gameModeNames = new Map<string, string>(Object.entries(gameModeName))
const gameModeColors = new Map<string, string>(Object.entries(colorByGameMode))

const breakdowns = [
    {
        field: "wins",
        id: "wins",
        title: "Wins by Game Mode",
        valueLabel: "Wins",
        includeZero: false,
    },
    // todo: re-enable when battle royale losses are tracked in WB DB
    // {
    //     field: "losses",
    //     id: "losses",
    //     title: "Losses by Game Mode",
    //     valueLabel: "Losses",
    //     includeZero: false,
    // },
] as const satisfies readonly GameModeBreakdown[]

function createGameModeBreakdown(player: GameModeStats, breakdown: GameModeBreakdown) {
    const rows = Object.entries(player[breakdown.field] ?? {})
        .filter(([, value]) => breakdown.includeZero || value > 0)
        .map(([key, value]) => ({
            key,
            value,
            label: gameModeNames.get(key) ?? key,
            colorClass: gameModeColors.get(key) ?? unknownGameModeColor,
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))

    return {
        id: breakdown.id,
        title: breakdown.title,
        categoryLabel: "Game mode",
        categoryPlural: "game modes",
        valueLabel: breakdown.valueLabel,
        chartKind: "part-to-whole",
        rows,
        formatValue: (value) => value.toLocaleString("en-US"),
    } as const satisfies CategoryBreakdownModel
}

export function getGameModeBreakdowns(player: GameModeStats) {
    return breakdowns.map((breakdown) => createGameModeBreakdown(player, breakdown))
}
