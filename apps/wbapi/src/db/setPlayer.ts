import type { Player } from "@warbrokers/types/src/player"
import { eq } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

export default (db: PostgresJsDatabase) => {
    return async (player: Player) => {
        const newPlayer = {
            nick: player.nick,
            nicklower: player.nicklower,
            gamesELO: player.gamesELO,
            killsELO: player.killsELO,
            level: player.level,
            xp: player.xp,
            squad: player.squad,
            coins: player.coins,
            steam: player.steam,
            number_of_jumps: player.number_of_jumps,
        }

        return await db
            .insert(players)
            .values({
                uid: player.uid,
                ...newPlayer,
            })
            .onConflictDoUpdate({
                target: players.uid,
                set: newPlayer,
                where: eq(players.uid, player.uid),
            })
    }
}
