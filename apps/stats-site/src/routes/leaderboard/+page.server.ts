import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"
import { SIMPLE_LEADERBOARD_LEN as limit } from "./config"

export const load = (async () => {
    return {
        killsEloRanking: trpc.players.getKillsEloRanking.query({ limit }),
        gamesEloRanking: trpc.players.getGamesEloRanking.query({ limit }),
        xpRanking: trpc.players.getXPRanking.query({ limit }),
    }
}) satisfies PageServerLoad
