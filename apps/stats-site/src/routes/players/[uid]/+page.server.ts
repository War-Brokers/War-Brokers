import { error } from "@sveltejs/kit"

import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"
import { getPlayerBadges } from "./badge"

function sum(values: Readonly<Record<string, number>> | null | undefined) {
    return Object.values(values ?? {}).reduce((total, value) => total + value, 0)
}

export const load = (async ({ params }) => {
    const { uid } = params

    if (!uid) error(404, "Not Found")

    const player = await trpc.players.getPlayer.query({ uid })

    return {
        player: player,
        badges: getPlayerBadges(player.uid),
        totalKills: sum(player.kills_per_vehicle),
        totalDeaths: sum(player.deaths),
        totalDamageDealt: sum(player.damage_dealt),
        totalDamageReceived: sum(player.damage_received),
        xpPercentile: trpc.players.percentile.xp.query({ uid }),
        killsEloPercentile: trpc.players.percentile.killsElo.query({ uid }),
        gamesEloPercentile: trpc.players.percentile.gamesElo.query({ uid }),
        timeAlivePercentile: player.time_alive
            ? trpc.players.percentile.timeAlive.query({ uid })
            : undefined,
    }
}) satisfies PageServerLoad
