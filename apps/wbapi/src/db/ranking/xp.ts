import { and, desc, isNotNull } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

import type { RankingFunc } from "."

export default (db: PostgresJsDatabase) => {
    return (async (limit: number, offset: number = 0) => {
        return db
            .select({
                uid: players.uid,
                nick: players.nick,
                xp: players.xp,
                level: players.level,
            })
            .from(players)
            .where(and(isNotNull(players.xp), isNotNull(players.level)))
            .orderBy(desc(players.xp))
            .limit(limit)
            .offset(offset) as Promise<
            {
                uid: string
                nick: string
                xp: number
                level: number
            }[]
        >
    }) satisfies RankingFunc
}
