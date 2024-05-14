import { createTRPCRouter } from "@/trpc"

import getPlayer from "./getPlayer"
import percentileRouter from "./percentileRouter"
import rankingRouter from "./rankingRouter"
import searchByName from "./searchByName"

export const tag = "player"

export default createTRPCRouter({
    getPlayer: getPlayer(tag),
    searchByName: searchByName(tag),

    percentile: percentileRouter(tag),
    ranking: rankingRouter(tag),
})
