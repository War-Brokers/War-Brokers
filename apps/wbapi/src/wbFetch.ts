/**
 * node-fetch + War Brokers DB Wrapper
 */

import type { Player } from "@warbrokers/types/src/player"
import fetch from "node-fetch"

import env from "@/env"

export async function getPlayer(
    uid: Player["uid"],
): Promise<ReturnType<typeof fetch>> {
    const id = env.wb.id.value()
    const pw = env.wb.pw.value()
    const url = `${env.wb.domain.value()}/get_player_stats.php?uid=${uid}`

    return fetch(url, {
        headers: {
            Authorization: `Basic ${btoa(`${id}:${pw}`)}`,
        },
    })
}
