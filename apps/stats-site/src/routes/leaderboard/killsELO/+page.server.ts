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
        killsEloRanking: withPercentile(
            trpc.players.ranking.killsElo.query({
                limit: LIMIT,
                offset,
            }),
            "killsElo",
        ),
        playerCount: trpc.status.dbPlayerCount.query(),
    }
}) satisfies PageServerLoad
