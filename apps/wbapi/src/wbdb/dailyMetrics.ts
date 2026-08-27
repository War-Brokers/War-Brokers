import { GameMode } from "@warbrokers/types/src/gameMode"

import type { DailyFeedRow } from "./dailyFeedParser"

const battleRoyaleMode: string = GameMode.BattleRoyale

export type DailyPlayer = {
    uid: string
    nick: string
    squad: string | null
}

export type DailyMetricPlayers = {
    dailyKills: DailyPlayer & { dailyKills: number }
    dailyClassicModeWins: DailyPlayer & { dailyClassicModeWins: number }
    dailyBattleRoyaleWins: DailyPlayer & { dailyBattleRoyaleWins: number }
}

export type DailyMetricKey = keyof DailyMetricPlayers
export type DailyMetricPlayer<Key extends DailyMetricKey> = DailyMetricPlayers[Key]

export type DailyMetricDefinition<Player extends DailyPlayer> = {
    value: (row: DailyFeedRow) => number | undefined
    toPlayer: (row: DailyFeedRow, value: number) => Player
}

export type DailyMetricRegistry = {
    [Key in DailyMetricKey]: DailyMetricDefinition<DailyMetricPlayer<Key>>
}

function identity(row: DailyFeedRow) {
    return {
        uid: row.uid,
        nick: row.nick,
        squad: row.squad,
    }
}

function sumWins(row: DailyFeedRow, include: (mode: string) => boolean) {
    let total = 0

    for (const [mode, wins] of Object.entries(row.winsByMode)) {
        if (include(mode)) total += wins
    }

    return total
}

export const dailyMetricDefinitions = {
    dailyKills: {
        value: (row) => row.totalKills,
        toPlayer: (row, value) => ({ ...identity(row), dailyKills: value }),
    },
    dailyClassicModeWins: {
        value: (row) => sumWins(row, (mode) => mode !== battleRoyaleMode),
        toPlayer: (row, value) => ({ ...identity(row), dailyClassicModeWins: value }),
    },
    dailyBattleRoyaleWins: {
        value: (row) => row.winsByMode[GameMode.BattleRoyale],
        toPlayer: (row, value) => ({ ...identity(row), dailyBattleRoyaleWins: value }),
    },
} as const satisfies DailyMetricRegistry
