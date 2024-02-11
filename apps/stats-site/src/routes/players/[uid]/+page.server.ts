import { error } from "@sveltejs/kit"
import type { Player } from "@warbrokers/types/src/player"
import dayjs from "dayjs"

import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
    const { uid } = params

    if (!uid) error(404, "Not Found")

    try {
        const player: Player = await trpc.players.getPlayer.query({ uid })
        return {
            player,
            timestamp: dayjs(MongoDBObjectId2Date(player.uid)).format(
                "MMMM D, YYYY",
            ),
        }
    } catch {
        error(404, "Not Found")
    }
}) satisfies PageServerLoad

function MongoDBObjectId2Date(s: string) {
    return new Date(parseInt(s.substring(0, 8), 16) * 1000)
}
