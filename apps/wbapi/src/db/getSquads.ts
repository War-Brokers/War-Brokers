import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (): Promise<string[]> => {
        return (
            await db.selectDistinct({ squad: players.squad }).from(players).orderBy(players.squad)
        )
            .map(({ squad }) => squad)
            .filter((squad): squad is string => Boolean(squad)) // remove null and empty string
    }
}
