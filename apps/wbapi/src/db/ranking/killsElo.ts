import { desc, isNotNull } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

import type { RankingFunc } from "."

export default (db: PostgresJsDatabase) => {
    return (async (limit: number, offset: number = 0) => {
        return db
            .select({
                uid: players.uid,
                nick: players.nick,
                killsELO: players.killsELO,
            })
            .from(players)
            .where(isNotNull(players.killsELO))
            .orderBy(desc(players.killsELO))
            .limit(limit)
            .offset(offset) as Promise<
            {
                uid: string
                nick: string
                killsELO: number
            }[]
        >
    }) satisfies RankingFunc
}
