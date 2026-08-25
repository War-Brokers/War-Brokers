import trpc from "$lib/trpc"

import { SIMPLE_LEADERBOARD_LEN } from "../config"
import type { PageServerLoad } from "./$types"

export const load = (() => {
    return {
        dailyKillsRanking: trpc.players.ranking.dailyKills.query({ limit: SIMPLE_LEADERBOARD_LEN }),
        dailyStatsUpdatedAt: trpc.players.ranking.dailyStatsUpdatedAt.query(),
        statRange: trpc.players.range.dailyKills.query().catch(() => undefined),
    }
}) satisfies PageServerLoad
