import { and, asc, count, isNotNull, ne, sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => () =>
    db
        .select({ squad: sql<string>`coalesce(${players.squad}, '')`, memberCount: count() })
        .from(players)
        .where(and(isNotNull(players.squad), ne(players.squad, "")))
        .groupBy(players.squad)
        .orderBy(asc(players.squad))
