import { type Player, PlayerSchema } from "@warbrokers/types/src/player"

import type { DBAuth, Result } from "../util/types"
import { FailReason } from "../util/types"

export async function getPlayer(
    auth: DBAuth,
    uid: Player["uid"],
): Promise<Result<Player>> {
    const { id, pw, ip } = auth

    const res = await fetch(`http://${ip}/get_player_stats.php?uid=${uid}`, {
        method: "GET",
        headers: {
            Authorization:
                "Basic " + Buffer.from(`${id}:${pw}`).toString("base64"),
        },
    })

    if (!res.ok) {
        console.log(
            `failed to get player stats of ${uid}. DB responded:`,
            await res.text(),
        )
        return {
            success: false,
            reason: FailReason.DBConnectionFail,
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await res.json()

    // this check works on both null and undefined values because JS
    if (raw["time_alive_longest"] != null)
        raw["time_alive_longest"] = Number(raw["time_alive_longest"])

    const parseResult = PlayerSchema.safeParse(raw)
    if (!parseResult.success)
        return {
            success: false,
            reason: FailReason.SchemaValidationFail,
        }

    return {
        success: true,
        data: parseResult.data,
    }
}
