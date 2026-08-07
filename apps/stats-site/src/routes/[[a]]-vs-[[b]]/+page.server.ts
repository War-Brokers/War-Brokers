import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

const uidPattern = /^[0-9a-fA-F]{24}$/

const optional = <T>(promise: Promise<T>) => promise.catch(() => undefined)

const getPlayerData = (uid: string | undefined) => {
    if (!uid || !uidPattern.test(uid)) return

    return {
        player: optional(trpc.players.getPlayer.query({ uid })),
        xpPercentile: optional(trpc.players.percentile.xp.query({ uid })),
        killsEloPercentile: optional(trpc.players.percentile.killsElo.query({ uid })),
        gamesEloPercentile: optional(trpc.players.percentile.gamesElo.query({ uid })),
    }
}

export const load = (({ params }) => {
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
