import { eq } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (uid: string) => {
        return await db.delete(players).where(eq(players.uid, uid))
    }
}
