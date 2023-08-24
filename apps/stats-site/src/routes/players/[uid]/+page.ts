import type { Load } from "@sveltejs/kit"
import { error } from "@sveltejs/kit"
import type { Player } from "@warbrokers/types/src/player"

import trpc from "$lib/trpc"

export const load: Load = async ({ params }) => {
    const { uid } = params

    if (!uid) throw error(404, "Not Found")

    try {
        const player: Player = await trpc.players.getPlayer.query({ uid })
        return { player }
    } catch {
        throw error(404, "Not Found")
    }
}
