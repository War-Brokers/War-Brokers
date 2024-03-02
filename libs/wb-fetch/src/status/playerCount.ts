import z from "zod"

import { playerCountURL } from "../util/const"
import { string2number } from "../util/convert"
import type { Result } from "../util/types"
import { FailReason } from "../util/types"

export const responseSchema = z.number()
export type Response = z.infer<typeof responseSchema>

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
