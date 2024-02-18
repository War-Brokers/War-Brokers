import { error } from "@sveltejs/kit"
import { getPlayer } from "@warbrokers/fetch/src/players/getPlayer"
import dayjs from "dayjs"
import xss from "xss"

import env from "$lib/env"

import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
    const { uid } = params

    if (!uid) error(404, "Not Found")

    const res = await getPlayer(
        {
            id: env.WB_DB_ID,
            pw: env.WB_DB_PW,
            base: env.WB_DB_BASE,
        },
        uid,
    )

    if (!res.success) error(500, res.reason)

    const player = res.data

    // prevent XSS (hopefully)
    player.nick = xss(player.nick)
    player.nicklower = xss(player.nicklower)

    return {
        player: player,
        timestamp: dayjs(MongoDBObjectId2Date(player.uid)).format(
            "MMMM D, YYYY",
        ),
    }
}) satisfies PageServerLoad

function MongoDBObjectId2Date(s: string) {
    return new Date(parseInt(s.substring(0, 8), 16) * 1000)
}
