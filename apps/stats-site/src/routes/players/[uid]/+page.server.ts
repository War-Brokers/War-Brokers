import { error } from "@sveltejs/kit"
import dayjs from "dayjs"
import xss from "xss"

import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"
import { getPlayerBadges } from "./badge"

export const load = (async ({ params }) => {
    const { uid } = params

    if (!uid) error(404, "Not Found")

    const player = await trpc.players.getPlayer.query({ uid })

    // prevent XSS (hopefully)
    player.nick = xss(player.nick)
    player.nicklower = xss(player.nicklower)

    return {
        player: player,
        badges: getPlayerBadges(player.uid),
        xpPercentile: trpc.players.percentile.xp.query({ uid }),
        killsEloPercentile: trpc.players.percentile.killsElo.query({ uid }),
        gamesEloPercentile: trpc.players.percentile.gamesElo.query({ uid }),
        playingSince: dayjs(MongoDBObjectId2Date(player.uid)).format(
            "MMMM D, YYYY",
        ),
    }
}) satisfies PageServerLoad

function MongoDBObjectId2Date(s: string) {
    return new Date(parseInt(s.substring(0, 8), 16) * 1000)
}
