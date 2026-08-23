import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"
import { SIMPLE_LEADERBOARD_LEN as limit } from "./config"

export const load = (() => {
    return {
        killsEloRanking: trpc.players.ranking.killsElo.query({ limit }),
        gamesEloRanking: trpc.players.ranking.gamesElo.query({ limit }),
        timeAliveRanking: trpc.players.ranking.timeAlive.query({ limit }),
        xpRanking: trpc.players.ranking.xp.query({ limit }),
    }
}) satisfies PageServerLoad
