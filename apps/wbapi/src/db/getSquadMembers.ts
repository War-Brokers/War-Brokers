import { eq } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import type { PlayerSelect } from "@/db/schema"
import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (squadName: string): Promise<PlayerSelect[]> => {
        return await db
            .select()
            .from(players)
            .where(eq(players.squad, squadName))
    }
}
