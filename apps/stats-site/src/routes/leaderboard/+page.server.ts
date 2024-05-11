import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    return {
        killsEloRanking: trpc.players.getKillsEloRanking.query({
            limit: 10,
            offset: 0,
        }),

        gamesEloRanking: trpc.players.getGamesEloRanking.query({
            limit: 10,
            offset: 0,
        }),

        xpRanking: trpc.players.getXPRanking.query({
            limit: 10,
            offset: 0,
        }),
    }
}) satisfies PageServerLoad
