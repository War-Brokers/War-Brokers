import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (() => {
    return {
        playersOnline: trpc.status.playersOnline.query(),
        twitchStreams: trpc.status.twitchStreams.query(),
    }
}) satisfies PageServerLoad
