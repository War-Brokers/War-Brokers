import { z } from "zod"

import { playersOnlineURL } from "@/const"
import { string2number } from "@/convert"
import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"
import type { Result } from "@/types"
import { FailReason } from "@/types"

export const responseSchema = z.number()
export type Response = z.infer<typeof responseSchema>

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/playersOnline",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(responseSchema)
        .query(async () => {
            const res = await playersOnline()

            if (!res.success) throw reason2TRPCError(res.reason)

            return res.data
        })

export async function playersOnline(): Promise<Result<Response>> {
    const res = await fetch(playersOnlineURL())
    if (!res.ok)
        return {
            success: false,
            reason: FailReason.WBAPIConnectionFail,
        }

    // looks like "X,XXX"
    const raw = await res.text()

    return {
        success: true,
        data: string2number(raw),
    }
}
