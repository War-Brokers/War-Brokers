import { z } from "zod"

import { getDBPlayerCount } from "@/db"
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
        .input(z.undefined())
        .output(z.number())
        .query(async () => await getDBPlayerCount())
