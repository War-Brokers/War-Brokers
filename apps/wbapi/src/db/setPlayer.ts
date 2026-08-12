import type { Player } from "@warbrokers/types/src/player"
import { eq } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (player: Player) => {
        return await db
            .insert(players)
            .values(player)
            .onConflictDoUpdate({
                target: players.uid,
                set: player,
                where: eq(players.uid, player.uid),
            })
    }
}
