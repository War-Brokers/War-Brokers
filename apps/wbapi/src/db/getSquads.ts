import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (): Promise<string[]> => {
        return (
            await db
                .selectDistinct({ squad: players.squad })
                .from(players)
                .orderBy(players.squad)
        )
            .map(({ squad }) => squad)
            .filter((x) => x) // remove empty string
    }
}
