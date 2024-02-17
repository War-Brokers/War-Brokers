import { PlayerSchema } from "@warbrokers/types/src/player"
import z from "zod"

import type { Result } from "../util/types"
import { FailReason } from "../util/types"

export const responseSchema = z.array(
    z.object({
        nick: PlayerSchema.shape.nick,
        uid: PlayerSchema.shape.uid,
    }),
)

export type Response = z.infer<typeof responseSchema>

export async function searchPlayerByName(
    name: string,
): Promise<Result<Response>> {
    const res = await fetch(
        `https://stats.warbrokers.io/players/search?term=${name.toLowerCase()}`,
    )

    const schema = z.array(
        z.tuple([PlayerSchema.shape.nick, PlayerSchema.shape.uid]),
    )

    const parseResult = schema.safeParse(await res.json())
    if (!parseResult.success)
        return { success: false, reason: FailReason.SchemaValidationFail }

    const result: Response = []
    for (const data of parseResult.data) {
        result.push({
            nick: data[0],
            uid: data[1],
        })
    }

    return { success: true, data: result }
}
