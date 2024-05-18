import { z } from "zod"

import { db } from "@/index"
import { publicProcedure } from "@/trpc"

export const responseSchema = z.array(z.string())
export type Response = z.infer<typeof responseSchema>

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/squad/getSquadList",
                description: "Gets the list of squads",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(responseSchema)
        .query(async () => {
            return await db.getSquads()
        })
