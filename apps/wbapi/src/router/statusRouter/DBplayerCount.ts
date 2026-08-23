import { z } from "zod"

import { db } from "@/index"
import { publicProcedure } from "@/trpc"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/dbPlayerCount",
                description: "Gets the total number of players in WBAPI DB",
                tags: [tag],
            },
        })
        .input(z.object({ statistic: z.literal("timeAlive").optional() }).optional())
        .output(z.number())
        .query(({ input }) =>
            db.getDBPlayerCount(input?.statistic === "timeAlive" ? "time_alive" : undefined),
        )
