import { sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

const statColumns = {
    gamesElo: players.gamesELO,
    killsElo: players.killsELO,
    level: players.level,
    timeAlive: players.time_alive,
    xp: players.xp,
} as const

export type StatRangeStatistic = keyof typeof statColumns

export default (db: PostgresJsDatabase) => {
    return async (statistic: StatRangeStatistic) => {
        const column = statColumns[statistic]
        const [result] = await db
            .select({
                min: sql<number>`coalesce(min(${column}), 0)::double precision`,
                max: sql<number>`coalesce(max(${column}), 0)::double precision`,
            })
            .from(players)

        if (!result) throw new Error("Stat range query returned no rows")

        return result
    }
}
