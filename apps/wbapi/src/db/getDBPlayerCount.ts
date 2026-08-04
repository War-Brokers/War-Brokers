import { count } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (): Promise<number> => {
        const [result] = await db.select({ count: count() }).from(players)

        if (!result) throw new Error("Player count query returned no rows")

        return result.count
    }
}
