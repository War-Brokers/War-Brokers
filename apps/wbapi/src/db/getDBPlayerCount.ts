import { count, isNotNull } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (key?: "time_alive") => {
        const query = db.select({ count: count() }).from(players)
        const [result] = await (key === undefined ? query : query.where(isNotNull(players[key])))

        if (!result) throw new Error("Player count query returned no rows")

        return result.count
    }
}
