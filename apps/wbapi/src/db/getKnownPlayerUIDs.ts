import { inArray } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (uids: readonly string[]) => {
        if (uids.length === 0) return []

        const rows = await db
            .select({ uid: players.uid })
            .from(players)
            .where(inArray(players.uid, uids))

        return rows.map(({ uid }) => uid)
    }
}
