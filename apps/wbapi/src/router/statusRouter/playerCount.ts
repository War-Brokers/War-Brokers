import { z } from "zod"

import { playerCountURL } from "@/const"
import { string2number } from "@/convert"
import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"
import { FailReason, type Result } from "@/types"

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
            reason: FailReason.WBAPIConnectionFail,
        }

    // looks like "XXX,XXX,XXX"
    const raw = await res.text()

    return {
        success: true,
        data: string2number(raw),
    }
}
