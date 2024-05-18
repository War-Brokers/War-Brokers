import { count } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (): Promise<number> => {
        return (await db.select({ count: count() }).from(players))[0].count
    }
}
