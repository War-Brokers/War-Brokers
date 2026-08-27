import { createCache } from "@/cache"

import { type DailyFeedRow, parseDailyFeed } from "./dailyFeedParser"
import {
    type DailyMetricDefinition,
    dailyMetricDefinitions,
    type DailyMetricKey,
    type DailyMetricPlayer,
    type DailyPlayer,
} from "./dailyMetrics"

export type DailyRange = {
    min: number
    max: number
}

type DailyRanking<Player extends DailyPlayer> = {
    players: Player[]
    range: DailyRange
}

type DailyLeaderboardSnapshot = {
    [Key in DailyMetricKey]: DailyRanking<DailyMetricPlayer<Key>>
}

function createDailyRanking<Player extends DailyPlayer>(
    rows: readonly DailyFeedRow[],
    definition: DailyMetricDefinition<Player>,
) {
    const ranked = rows.flatMap((row) => {
        const value = definition.value(row)
        if (value === undefined || !Number.isFinite(value) || value <= 0) return []

        return [{ player: definition.toPlayer(row, value), value }]
    })

    ranked.sort(
        (left, right) =>
            right.value - left.value || left.player.uid.localeCompare(right.player.uid),
    )

    const highestRankedPlayer = ranked[0]
    const lowestRankedPlayer = ranked.at(-1)

    return {
        players: ranked.map(({ player }) => player),
        range:
            highestRankedPlayer === undefined || lowestRankedPlayer === undefined
                ? { min: 0, max: 0 }
                : {
                      min: lowestRankedPlayer.value,
                      max: highestRankedPlayer.value,
                  },
    } satisfies DailyRanking<Player>
}

function createDailyLeaderboardSnapshot(rows: readonly DailyFeedRow[]) {
    return {
        dailyKills: createDailyRanking(rows, dailyMetricDefinitions.dailyKills),
        dailyClassicModeWins: createDailyRanking(rows, dailyMetricDefinitions.dailyClassicModeWins),
        dailyBattleRoyaleWins: createDailyRanking(
            rows,
            dailyMetricDefinitions.dailyBattleRoyaleWins,
        ),
    } satisfies DailyLeaderboardSnapshot
}

async function loadDailyLeaderboardSnapshot(loadFeed: DailyLeaderboardSource) {
    const response = await loadFeed()
    if (!response.ok) throw new Error(`Daily stats request failed with status ${response.status}`)

    return createDailyLeaderboardSnapshot(await parseDailyFeed(response))
}

export type DailyLeaderboardSource = () => Promise<Response>

export type DailyLeaderboard<Key extends DailyMetricKey> = {
    ranking: (limit: number, offset?: number) => Promise<DailyMetricPlayer<Key>[]>
    count: () => Promise<number>
    range: () => Promise<DailyRange>
}

export type DailyLeaderboards = {
    [Key in DailyMetricKey]: DailyLeaderboard<Key>
}

const DAILY_LEADERBOARD_CACHE_TIME_MS = 24 * 60 * 60 * 1000

function createDailyMetricLeaderboard<Key extends DailyMetricKey>(
    getRanking: () => Promise<DailyRanking<DailyMetricPlayer<Key>>>,
) {
    const dailyLeaderboard = {
        ranking(limit: number, offset: number = 0) {
            return getRanking().then(({ players }) => players.slice(offset, offset + limit))
        },
        count() {
            return getRanking().then(({ players }) => players.length)
        },
        range() {
            return getRanking().then(({ range }) => range)
        },
    } satisfies DailyLeaderboard<Key>

    return dailyLeaderboard
}

export function createDailyLeaderboards(loadFeed: DailyLeaderboardSource) {
    const cache = createCache<DailyLeaderboardSnapshot>(
        "daily-leaderboards",
        () => loadDailyLeaderboardSnapshot(loadFeed),
        { cacheTimeMs: DAILY_LEADERBOARD_CACHE_TIME_MS },
    )

    const getSnapshot = () => cache.get().then(({ value }) => value)
    const dailyLeaderboards = {
        dailyKills: createDailyMetricLeaderboard<"dailyKills">(() =>
            getSnapshot().then((snapshot) => snapshot.dailyKills),
        ),
        dailyClassicModeWins: createDailyMetricLeaderboard<"dailyClassicModeWins">(() =>
            getSnapshot().then((snapshot) => snapshot.dailyClassicModeWins),
        ),
        dailyBattleRoyaleWins: createDailyMetricLeaderboard<"dailyBattleRoyaleWins">(() =>
            getSnapshot().then((snapshot) => snapshot.dailyBattleRoyaleWins),
        ),
    } satisfies DailyLeaderboards

    return dailyLeaderboards
}
