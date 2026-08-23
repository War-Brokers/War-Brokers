import type { Player } from "@warbrokers/types/src/player"
import { eq, isNotNull, sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"
import { FailReason, type Result } from "@/types"

export default (db: PostgresJsDatabase) => {
    /**
     * Calculates the percentile of a player's statistic.
     * i.e. This player is better than X percent of players.
     */
    return async (
        key: "xp" | "gamesELO" | "killsELO" | "time_alive",
        uid: Player["uid"],
    ): Promise<Result<number>> => {
        let n: number // number of players with worse stats than the player we're comparing with
        let N: number // total number of players

        {
            const subQuery = db
                .select({
                    uid: players.uid,
                    n: sql<number>`RANK() OVER (ORDER BY ${players[key]} ASC)`.as("n"),
                })
                .from(players)
                .where(isNotNull(players[key]))
                .as("sq")

            const arr = await db
                .select({ n: subQuery.n })
                .from(subQuery)
                .where(eq(subQuery.uid, uid))

            const [rank] = arr

            if (!rank)
                return {
                    success: false,
                    reason: FailReason.PlayerNotFound,
                }

            n = rank.n - 1 // exclude self
        }

        {
            const [count] = await db
                .select({ N: sql<number>`count(*)` })
                .from(players)
                .where(isNotNull(players[key]))

            if (!count) throw new Error("Player count query returned no rows")

            N = count.N
        }

        return {
            success: true,
            data: 100 * (n / N),
        }
    }
}
