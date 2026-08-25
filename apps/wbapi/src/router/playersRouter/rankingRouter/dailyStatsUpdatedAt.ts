import { z } from "zod"

import { publicProcedure } from "@/trpc"
import { getDailyStatsUpdatedAt } from "@/wbdb"

export default (tags: string[]) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/ranking/dailyStatsUpdatedAt",
                tags,
            },
        })
        .input(z.undefined())
        .output(z.number().int().nonnegative())
        .query(() => getDailyStatsUpdatedAt())
