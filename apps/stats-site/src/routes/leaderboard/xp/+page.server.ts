import { redirect } from "@sveltejs/kit"

import { parsePage } from "$lib/components/Paged/pageUtil"
import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

const LIMIT = 50

export const load = (async ({ url }) => {
    const { page, offset, invalidated } = parsePage(
        url.searchParams.get("page"),
        LIMIT,
    )

    if (invalidated) redirect(301, `?page=${page}`)

    return {
        page,
        limit: LIMIT,
        offset,
        XPRanking: trpc.players.ranking.xp.query({ limit: LIMIT, offset }),
        playerCount: trpc.status.dbPlayerCount.query(),
    }
}) satisfies PageServerLoad
