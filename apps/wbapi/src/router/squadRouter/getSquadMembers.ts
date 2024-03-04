import { z } from "zod"

import { getSquadMembers } from "@/redis"
import { publicProcedure } from "@/trpc"

export const responseSchema = z.array(z.string())
export type Response = z.infer<typeof responseSchema>

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
        .output(responseSchema)
        .query(async ({ input }) => {
            return await getSquadMembers(input.squadName)
        })
