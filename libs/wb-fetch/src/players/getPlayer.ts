import { type Player, PlayerSchema } from "@warbrokers/types/src/player"

import type { DBAuth, Result } from "../util/types"
import { FailReason } from "../util/types"
import axios from "axios"

export async function getPlayer(
    auth: DBAuth,
    uid: Player["uid"],
): Promise<Result<Player>> {
    const { id: username, pw: password, ip } = auth

    const { data, status } = await axios.get<Player>(
        `http://${ip}/get_player_stats.php?uid=${uid}`,
        { auth: { username, password } },
    )

    if (status !== 200) {
        console.log(
            `failed to get player stats of ${uid}. DB responded ${status}`,
        )

        return {
            success: false,
            reason: FailReason.DBConnectionFail,
        }
    }

    // this check works on both null and undefined values because JS
    if (data["time_alive_longest"] != null)
        data["time_alive_longest"] = Number(data["time_alive_longest"])

    const parseResult = PlayerSchema.safeParse(data)
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
