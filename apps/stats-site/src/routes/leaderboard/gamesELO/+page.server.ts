import { redirect } from "@sveltejs/kit"

import { parsePage } from "$lib/components/Paged/pageUtil"
import trpc from "$lib/trpc"

import { withPercentile } from "../withPercentile"
import type { PageServerLoad } from "./$types"

const LIMIT = 50

export const load = (({ url }) => {
    const { page, offset, invalidated } = parsePage(url.searchParams.get("page"), LIMIT)

    if (invalidated) redirect(301, `?page=${page}`)

    return {
        page,
        limit: LIMIT,
        offset,
        getGamesEloRanking: withPercentile(
            trpc.players.ranking.gamesElo.query({
                limit: LIMIT,
                offset,
            }),
            "gamesElo",
        ),
        playerCount: trpc.status.dbPlayerCount.query(),
        statRange: trpc.players.range.gamesElo.query().catch(() => undefined),
    }
}) satisfies PageServerLoad
