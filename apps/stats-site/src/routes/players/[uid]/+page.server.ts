import { error } from "@sveltejs/kit"

import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"
import { getPlayerBadges } from "./badge"

export const load = (async ({ params }) => {
    const { uid } = params

    if (!uid) error(404, "Not Found")

    const player = await trpc.players.getPlayer.query({ uid })

    return {
        player: player,
        badges: getPlayerBadges(player.uid),
        totalKills: Object.values(player.kills_per_vehicle ?? {}).reduce(
            (total, kills) => total + kills,
            0,
        ),
        totalDeaths: Object.values(player.deaths ?? {}).reduce(
            (total, deaths) => total + deaths,
            0,
        ),
        xpPercentile: trpc.players.percentile.xp.query({ uid }),
        killsEloPercentile: trpc.players.percentile.killsElo.query({ uid }),
        gamesEloPercentile: trpc.players.percentile.gamesElo.query({ uid }),
    }
}) satisfies PageServerLoad
