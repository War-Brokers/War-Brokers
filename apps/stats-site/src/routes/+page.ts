import type { Load } from "@sveltejs/kit"

import trpc from "$lib/trpc"

export const load: Load = async () => {
    let playersOnline: number | undefined

    try {
        playersOnline = await trpc.status.playersOnline.query()
    } catch {
        //
    }

    return { playersOnline }
}
