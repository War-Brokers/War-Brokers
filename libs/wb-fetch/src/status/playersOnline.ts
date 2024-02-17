import { playersOnlineURL } from "../util/const"
import z from "zod"
import { string2number } from "../util/convert"
import { FailReason, Result } from "../util/types"

export const responseSchema = z.number()
export type Response = z.infer<typeof responseSchema>

export async function playersOnline(): Promise<Result<Response>> {
    const res = await fetch(playersOnlineURL())
    if (!res.ok)
        return {
            success: false,
            reason: FailReason.APIConnectionFail,
        }

    // looks like "X,XXX"
    const raw = await res.text()

    return {
        success: true,
        data: string2number(raw),
    }
}
