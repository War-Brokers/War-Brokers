/**
 * Run this script from your computer to update the WBP mirror DB with the
 * latest data from WB's own DB. Remember to use production environment
 * variables.
 *
 * deno apps/wbapi/src/scripts/updateDB.ts
 */

import z from "zod"

import { db, env } from "@/index"
import { getPlayer } from "@/router/playersRouter/getPlayer"

const playerListSchema = z.array(
    z.object({
        uid: z.string(),
        nick: z.string(),
        nicklower: z.string().optional(),
        squad: z.string().optional(),
    }),
)

const playerListRaw = await (
    await fetch(`${env.WB_DB_BASE}/get_player_list.php`, {
        headers: {
            Authorization:
                "Basic " +
                Buffer.from(`${env.WB_DB_ID}:${env.WB_DB_PW}`).toString(
                    "base64",
                ),
        },
    })
).json()
const playerListResult = playerListSchema.safeParse(playerListRaw)

if (!playerListResult.success) {
    console.error(`Failed to parse player list.
raw:
${playerListRaw}

error:
${playerListResult.error}`)
    process.exit(1)
}

const playerList = playerListResult.data
playerList.pop() // remove { nick: "end_of_list", uid: "000000000000000000000000" }
const playerCount = playerList.length

let i = 0
for (const { uid } of playerList) {
    const playerResult = await getPlayer(uid)

    if (!playerResult.success) {
        console.error(`failed to parse player ${uid}: ${playerResult.reason}`)
        process.exit(1)
    }

    await db.setPlayer(playerResult.data)

    console.log(
        `${100 * (++i / playerCount)}% complete (${i} / ${playerCount})\n`,
    )
}

console.log("done!")
