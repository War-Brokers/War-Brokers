import trpc from "$lib/trpc"

import { SIMPLE_LEADERBOARD_LEN } from "../config"
import type { PageServerLoad } from "./$types"

export const load = (() => {
    return {
        dailyStatsUpdatedAt: trpc.players.ranking.dailyStatsUpdatedAt.query(),

        dailyKillsRanking: trpc.players.ranking.dailyKills.query({ limit: SIMPLE_LEADERBOARD_LEN }),
        dailyKillsRange: trpc.players.range.dailyKills.query().catch(() => undefined),

        dailyClassicModeWinsRanking: trpc.players.ranking.dailyClassicModeWins.query({
            limit: SIMPLE_LEADERBOARD_LEN,
        }),
        classicModeWinsRange: trpc.players.range.dailyClassicModeWins
            .query()
            .catch(() => undefined),

        dailyBattleRoyaleWinsRanking: trpc.players.ranking.dailyBattleRoyaleWins.query({
            limit: SIMPLE_LEADERBOARD_LEN,
        }),
        battleRoyaleWinsRange: trpc.players.range.dailyBattleRoyaleWins
            .query()
            .catch(() => undefined),
    }
}) satisfies PageServerLoad
