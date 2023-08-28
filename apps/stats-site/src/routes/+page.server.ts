import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    let playersOnline: number | undefined
    let twitchStreams:
        | Awaited<ReturnType<typeof trpc.status.twitchStreams.query>>
        | undefined

    await Promise.allSettled([
        (async () => {
            playersOnline = await trpc.status.playersOnline.query()
        })(),

        (async () => {
            twitchStreams = await trpc.status.twitchStreams.query()
        })(),
    ])

    return {
        playersOnline,
        twitchStreams,
    }
}) satisfies PageServerLoad
