import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
    let playersOnline: number | undefined
    try {
        playersOnline = await trpc.status.playersOnline.query()
    } catch {
        //
    }

    let playerCount: number | undefined
    try {
        playerCount = await trpc.status.playerCount.query()
    } catch {
        //
    }

    let twitchStreams:
        | Awaited<ReturnType<typeof trpc.status.twitchStreams.query>>
        | undefined
    try {
        twitchStreams = await trpc.status.twitchStreams.query()
    } catch {
        //
    }

    return {
        playersOnline,
        playerCount,
        twitchStreams,
    }
}
