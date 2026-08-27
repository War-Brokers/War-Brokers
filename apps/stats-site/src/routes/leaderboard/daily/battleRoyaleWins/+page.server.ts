import { redirect } from "@sveltejs/kit"

import { parsePage } from "$lib/components/Paged/pageUtil"
import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

const LIMIT = 50

export const load = (({ url }) => {
    const { page, offset, invalidated } = parsePage(url.searchParams.get("page"), LIMIT)

    if (invalidated && url.searchParams.has("page")) redirect(301, `?page=${page}`)

    return {
        page,
        limit: LIMIT,
        offset,
        dailyBattleRoyaleWinsRanking: trpc.players.ranking.dailyBattleRoyaleWins.query({
            limit: LIMIT,
            offset,
        }),
        dailyStatsUpdatedAt: trpc.players.ranking.dailyStatsUpdatedAt.query(),
        playerCount: trpc.status.dbPlayerCount.query({ statistic: "dailyBattleRoyaleWins" }),
        statRange: trpc.players.range.dailyBattleRoyaleWins.query().catch(() => undefined),
    }
}) satisfies PageServerLoad
