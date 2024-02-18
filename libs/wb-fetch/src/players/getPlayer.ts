import { type Player, PlayerSchema } from "@warbrokers/types/src/player"

import type { DBAuth, Result } from "../util/types"
import { FailReason } from "../util/types"

export async function getPlayer(
    auth: DBAuth,
    uid: Player["uid"],
): Promise<Result<Player>> {
    const { id, pw, ip } = auth

    const res = await fetch(`http://${ip}/get_player_stats.php?uid=${uid}`, {
        credentials: "include",
        headers: {
            "user-agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            Authorization: `Basic ${btoa(`${id}:${pw}`)}`,
        },
    })

    if (!res.ok)
        return {
            success: false,
            reason: FailReason.DBConnectionFail,
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
