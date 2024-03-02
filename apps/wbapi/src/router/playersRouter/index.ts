import { createTRPCRouter } from "@/trpc"

import gamesEloPercentile from "./gamesEloPercentile"
import getPlayer from "./getPlayer"
import killsEloPercentile from "./killsEloPercentile"
import searchByName from "./searchByName"
import xpPercentile from "./xpPercentile"

export const tag = "player"

export default createTRPCRouter({
    getPlayer: getPlayer(tag),
    searchByName: searchByName(tag),
    killsEloPercentile: killsEloPercentile(tag),
    gamesEloPercentile: gamesEloPercentile(tag),
    xpPercentile: xpPercentile(tag),
})
