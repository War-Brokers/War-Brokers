import { z } from "zod"

import { createTRPCRouter } from "@/trpc"

import gamesElo from "./gamesElo"
import killsElo from "./killsElo"
import xp from "./xp"

export const tag = "ranking"

export const rankingInput = z.object({
    limit: z.number().min(3).max(100),
    offset: z.number().nonnegative().optional(),
})

export default (parentTag: string) =>
    createTRPCRouter({
        killsElo: killsElo([parentTag, tag]),
        gamesElo: gamesElo([parentTag, tag]),
        xp: xp([parentTag, tag]),
    })
