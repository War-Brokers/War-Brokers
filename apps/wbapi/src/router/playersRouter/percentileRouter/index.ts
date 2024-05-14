import { createTRPCRouter } from "@/trpc"

import gamesElo from "./gamesElo"
import killsElo from "./killsElo"
import xp from "./xp"

export const tag = "percentile"

export default (parentTag: string) =>
    createTRPCRouter({
        killsElo: killsElo([parentTag, tag]),
        gamesElo: gamesElo([parentTag, tag]),
        xp: xp([parentTag, tag]),
    })
