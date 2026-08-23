import { desc, isNotNull } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

import type { RankingFunc } from "."

export default (db: PostgresJsDatabase) => {
    return (async (limit: number, offset: number = 0) => {
        return (
            await db
                .select({
                    uid: players.uid,
                    nick: players.nick,
                    squad: players.squad,
                    time_alive: players.time_alive,
                })
                .from(players)
                .where(isNotNull(players.time_alive))
                .orderBy(desc(players.time_alive))
                .limit(limit)
                .offset(offset)
        ).filter((row): row is typeof row & { time_alive: number } => row.time_alive !== null)
    }) satisfies RankingFunc
}
