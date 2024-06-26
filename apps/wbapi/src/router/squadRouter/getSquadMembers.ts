import { z } from "zod"

import { playerSelectSchema } from "@/db/schema"
import { db } from "@/index"
import { publicProcedure } from "@/trpc"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/squad/getSquadMembers",
                description: "Gets the list of squad members",
                tags: [tag],
            },
        })
        .input(
            z.object({
                squadName: z
                    .string()
                    .min(1)
                    .max(10)
                    .refine(
                        (str) => {
                            if (str.includes(" ")) return false
                            return true
                        },
                        { message: "Squad names can't contain spaces" },
                    ),
            }),
        )
        .output(z.array(playerSelectSchema))
        .query(async ({ input }) => await db.getSquadMembers(input.squadName))
