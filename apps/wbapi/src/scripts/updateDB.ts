/**
 * Run this script to update the WBP mirror DB with the latest data from the official WB DB.
 *
 * ```shell
 * mise exec -C apps/wbapi -- bun src/scripts/updateDB.ts
 * ```
 */

import { readFile } from "node:fs/promises"

import { initDB } from "@/db"
import { fetchPlayer } from "@/fetchPlayer"

if (import.meta.main) {
    const UIDs = [
        // Set is used to dedupe UIDs.
        ...new Set(
            // cspell:ignore uids
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            JSON.parse(await readFile(new URL("uids.json", import.meta.url), "utf8")) as string[],
        ),
    ]
    const playerCount = UIDs.length

    const db = initDB()

    try {
        let i = 0
        for (const uid of UIDs) {
            const playerResult = await fetchPlayer(uid)

            if (!playerResult.success) {
                console.error(`failed to parse player ${uid}: ${playerResult.reason}`)
                process.exit(1)
            }

            await db.setPlayer(playerResult.data)

            const percent = 100 * (++i / playerCount)
            console.log(`[${uid}] ${percent.toFixed(2)}% complete (${i} / ${playerCount})`)
        }

        console.log(`${i} out of ${playerCount} done!`)
    } finally {
        await db.close()
    }
}
