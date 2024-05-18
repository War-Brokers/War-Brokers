import { like } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"
import type { Response } from "@/router/playersRouter/searchByName"

export default (db: PostgresJsDatabase) => {
    /**
     * case-agnostic player search by nickname
     */
    return async (query: string): Promise<Response> => {
        return await db
            .select({
                uid: players.uid,
                nick: players.nick,
            })
            .from(players)
            // I know this is shit code but it does its job and is quite performant
            .where(like(players.nicklower, `%${query.toLocaleLowerCase()}%`))
            .limit(20)
    }
}
