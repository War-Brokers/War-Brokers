import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"
import { isValidPlayerUid, loadPlayerSlot } from "./playerSlot"

const optional = <T>(promise: Promise<T>) => promise.catch(() => undefined)

const getPlayerData = (uid: string | undefined) => {
    const slot = loadPlayerSlot(uid, (uid) => trpc.players.getPlayer.query({ uid }))

    if (!isValidPlayerUid(uid)) return { slot }

    return {
        slot,
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
        a: a.slot,
        b: b.slot,
        aXpPercentile: a.xpPercentile,
        bXpPercentile: b.xpPercentile,
        aKillsEloPercentile: a.killsEloPercentile,
        bKillsEloPercentile: b.killsEloPercentile,
        aGamesEloPercentile: a.gamesEloPercentile,
        bGamesEloPercentile: b.gamesEloPercentile,
    }
}) satisfies PageServerLoad
