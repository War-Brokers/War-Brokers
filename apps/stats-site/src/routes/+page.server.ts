import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    let playersOnline: number | undefined
    let playerCount: number | undefined
    let twitchStreams:
        | Awaited<ReturnType<typeof trpc.status.twitchStreams.query>>
        | undefined

    await Promise.allSettled([
        (async () => {
            playersOnline = await trpc.status.playersOnline.query()
        })(),

        (async () => {
            playerCount = await trpc.status.playerCount.query()
        })(),

        (async () => {
            twitchStreams = await trpc.status.twitchStreams.query()
        })(),
    ])

    return {
        playersOnline,
        playerCount,
        twitchStreams,
    }
}) satisfies PageServerLoad
