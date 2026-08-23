import { eq } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => (squadName: string) =>
    db.select().from(players).where(eq(players.squad, squadName))
