import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (() => {
    return {
        playerCount: trpc.status.dbPlayerCount.query(),
        distribution: trpc.players.distribution.query(),
        playersOnline: trpc.status.playersOnline.query(),
        twitchStreams: trpc.status.twitchStreams.query(),
    }
}) satisfies PageServerLoad
