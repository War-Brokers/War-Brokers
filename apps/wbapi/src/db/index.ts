import type { Player } from "@warbrokers/types/src/player"
import { eq, sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "@/index"
import type { Result } from "@/types"
import { FailReason } from "@/types"

import type { PlayerSelect } from "./schema"
import { players } from "./schema"

let client: postgres.Sql
let db: PostgresJsDatabase

export async function initDB() {
    client = postgres(
        env.DATABASE_URL,
        // Disable prefetch as it is not supported for "Transaction" pool mode
        { prepare: false },
    )
    db = drizzle(client)
}

export async function setPlayer(player: Player) {
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

export async function getSquads(): Promise<string[]> {
    return (
        await db
            .selectDistinct({ squad: players.squad })
            .from(players)
            .orderBy(players.squad)
    )
        .map(({ squad }) => squad)
        .filter((x) => x) // remove empty string
}

export async function getSquadMembers(
    squadName: string,
): Promise<PlayerSelect[]> {
    return await db.select().from(players).where(eq(players.squad, squadName))
}

/**
 * Calculates the percentile of a player's statistic.
 * i.e. This player is better than X percent of players.
 */
export async function getPercentile(
    key: "xp" | "gamesELO" | "killsELO",
    uid: Player["uid"],
): Promise<Result<number>> {
    let rank: number
    let count: number

    {
        const subQuery = db
            .select({
                uid: players.uid,
                rank: sql
                    .raw(`RANK() OVER (ORDER BY "${key}" DESC)`)
                    .as<number>("rank"),
            })
            .from(players)
            .as("sq")

        const arr = await db
            .select({ rank: subQuery.rank })
            .from(subQuery)
            .where(eq(subQuery.uid, uid))

        if (arr.length < 1)
            return {
                success: false,
                reason: FailReason.PlayerNotFound,
            }

        rank = arr[0].rank
    }

    {
        const arr = await db
            .select({ count: sql<number>`count(*)` })
            .from(players)

        count = arr[0].count
    }

    return {
        success: true,
        data: 1 - 100 * (rank / count),
    }
}
