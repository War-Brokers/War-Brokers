import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

const getPlayerData = (uid: string | undefined) => {
    if (!uid) return

    return {
        player: trpc.players.getPlayer.query({ uid }),
        xpPercentile: trpc.players.percentile.xp.query({ uid }),
        killsEloPercentile: trpc.players.percentile.killsElo.query({ uid }),
        gamesEloPercentile: trpc.players.percentile.gamesElo.query({ uid }),
    }
}

export const load = (async ({ params }) => {
    const a = getPlayerData(params.a)
    const b = getPlayerData(params.b)

    return {
        aUid: params.a,
        bUid: params.b,
        a: a?.player,
        b: b?.player,
        aXpPercentile: a?.xpPercentile,
        bXpPercentile: b?.xpPercentile,
        aKillsEloPercentile: a?.killsEloPercentile,
        bKillsEloPercentile: b?.killsEloPercentile,
        aGamesEloPercentile: a?.gamesEloPercentile,
        bGamesEloPercentile: b?.gamesEloPercentile,
    }
}) satisfies PageServerLoad
