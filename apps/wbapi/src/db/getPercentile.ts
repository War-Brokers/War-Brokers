import type { Player } from "@warbrokers/types/src/player"
import { eq, sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"
import { FailReason, type Result } from "@/types"

export default (db: PostgresJsDatabase) => {
    /**
     * Calculates the percentile of a player's statistic.
     * i.e. This player is better than X percent of players.
     */
    return async (
        key: "xp" | "gamesELO" | "killsELO",
        uid: Player["uid"],
    ): Promise<Result<number>> => {
        let n: number // number of players with worse stats than the player we're comparing with
        let N: number // total number of players

        {
            const subQuery = db
                .select({
                    uid: players.uid,
                    n: sql
                        .raw(`RANK() OVER (ORDER BY "${key}" ASC)`)
                        .as<number>("n"),
                })
                .from(players)
                .as("sq")

            const arr = await db
                .select({ n: subQuery.n })
                .from(subQuery)
                .where(eq(subQuery.uid, uid))

            if (arr.length < 1)
                return {
                    success: false,
                    reason: FailReason.PlayerNotFound,
                }

            n = arr[0].n - 1 // exclude self
        }

        {
            const arr = await db
                .select({ N: sql<number>`count(*)` })
                .from(players)

            N = arr[0].N
        }

        return {
            success: true,
            data: 100 * (n / N),
        }
    }
}
