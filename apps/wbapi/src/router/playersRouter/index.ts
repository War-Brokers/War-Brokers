import { z } from "zod"

import { createTRPCRouter } from "@/trpc"

import gamesEloPercentile from "./gamesEloPercentile"
import getGamesEloRanking from "./getGamesEloRanking"
import getKillsEloRanking from "./getKillsEloRanking"
import getPlayer from "./getPlayer"
import getXPRanking from "./getXPRanking"
import killsEloPercentile from "./killsEloPercentile"
import searchByName from "./searchByName"
import xpPercentile from "./xpPercentile"

export const tag = "player"

export const rankingInput = z.object({
    limit: z.number().min(3).max(100),
    offset: z.number().nonnegative().optional(),
})

export default createTRPCRouter({
    getPlayer: getPlayer(tag),
    searchByName: searchByName(tag),

    // percentile
    killsEloPercentile: killsEloPercentile(tag),
    gamesEloPercentile: gamesEloPercentile(tag),
    xpPercentile: xpPercentile(tag),

    // ranking
    getKillsEloRanking: getKillsEloRanking(tag),
    getGamesEloRanking: getGamesEloRanking(tag),
    getXPRanking: getXPRanking(tag),
})
