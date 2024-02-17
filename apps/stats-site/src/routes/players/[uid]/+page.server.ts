import { error } from "@sveltejs/kit"
import { getPlayer } from "@warbrokers/fetch/src/players/getPlayer"
import dayjs from "dayjs"
import DOMPurify from "isomorphic-dompurify"

import { WB_DB_ID, WB_DB_IP, WB_DB_PW } from "$env/static/private"

import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
    const { uid } = params

    if (!uid) error(404, "Not Found")

    const res = await getPlayer(
        { id: WB_DB_ID, pw: WB_DB_PW, ip: WB_DB_IP },
        uid,
    )

    if (!res.success) error(500, res.reason)

    const player = res.data

    // prevent XSS (hopefully)
    player.nick = DOMPurify.sanitize(player.nick)
    player.nicklower = DOMPurify.sanitize(player.nicklower)

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
