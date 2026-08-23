import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"
import { SIMPLE_LEADERBOARD_LEN as limit } from "./config"
import { withPercentile } from "./withPercentile"

export const load = (() => {
    return {
        killsEloRanking: withPercentile(trpc.players.ranking.killsElo.query({ limit }), "killsElo"),
        gamesEloRanking: withPercentile(trpc.players.ranking.gamesElo.query({ limit }), "gamesElo"),
        timeAliveRanking: withPercentile(
            trpc.players.ranking.timeAlive.query({ limit }),
            "timeAlive",
        ),
        xpRanking: withPercentile(trpc.players.ranking.xp.query({ limit }), "xp"),
        gamesEloRange: trpc.players.range.gamesElo.query().catch(() => undefined),
        killsEloRange: trpc.players.range.killsElo.query().catch(() => undefined),
        timeAliveRange: trpc.players.range.timeAlive.query().catch(() => undefined),
        xpRange: trpc.players.range.xp.query().catch(() => undefined),
    }
}) satisfies PageServerLoad
