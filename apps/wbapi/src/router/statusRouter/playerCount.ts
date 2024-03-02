import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"
import { playerCountURL } from "@/util/const"
import { string2number } from "@/util/convert"
import { FailReason, type Result } from "@/util/types"

export const responseSchema = z.number()
export type Response = z.infer<typeof responseSchema>

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/playerCount",
                description: "Gets the total number of registered accounts",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(responseSchema)
        .query(async () => {
            const res = await playerCount()

            if (!res.success) throw reason2TRPCError(res.reason)

            return res.data
        })

export async function playerCount(): Promise<Result<Response>> {
    const res = await fetch(playerCountURL())
    if (!res.ok)
        return {
            success: false,
            reason: FailReason.APIConnectionFail,
        }

    // looks like "XXX,XXX,XXX"
    const raw = await res.text()

    return {
        success: true,
        data: string2number(raw),
    }
}
