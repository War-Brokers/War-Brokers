import { error } from "@sveltejs/kit"
import { FailReason } from "@warbrokers/fetch/src/util/types"
import { PlayerSchema } from "@warbrokers/types/src/player"
import dayjs from "dayjs"
import xss from "xss"

import env from "$lib/env"

import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
    const { uid } = params

    if (!uid) error(404, "Not Found")

    const res = await fetch(
        `http://${env.WB_DB_IP}/get_player_stats.php?uid=${uid}`,
        {
            method: "GET",
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(`${env.WB_DB_ID}:${env.WB_DB_PW}`).toString(
                        "base64",
                    ),
            },
        },
    )

    if (!res.ok) {
        console.log(
            `failed to get player stats of ${uid}. DB responded:`,
            await res.text(),
        )
        return error(500, FailReason.DBConnectionFail)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await res.json()

    // this check works on both null and undefined values because JS
    if (raw["time_alive_longest"] != null)
        raw["time_alive_longest"] = Number(raw["time_alive_longest"])

    const parseResult = PlayerSchema.safeParse(raw)
    if (!parseResult.success) return error(500, FailReason.SchemaValidationFail)

    const player = parseResult.data

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
