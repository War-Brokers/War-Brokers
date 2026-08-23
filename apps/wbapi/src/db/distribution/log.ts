import { sql, type SQLWrapper } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

import { secondsPerHour, timeAliveCondition } from "./timeAlive"

export const logBucketBase = 2

export type LogDistributionBucket = {
    exponent: number
    count: number
}

function logBuckets(db: PostgresJsDatabase, column: SQLWrapper, condition: SQLWrapper) {
    return async () => {
        return await db.execute<LogDistributionBucket>(sql`
            WITH bucket_exponents AS (
                SELECT floor(log(${logBucketBase}, (${column}::numeric + 1))) AS exponent
                FROM ${players}
                WHERE ${condition}
            )
            SELECT
                exponent::integer AS exponent,
                count(*)::integer AS count
            FROM bucket_exponents
            GROUP BY exponent
            ORDER BY exponent
        `)
    }
}

export const getLogLevelDistribution = (db: PostgresJsDatabase) =>
    logBuckets(db, players.level, sql`${players.level} >= 0`)

export const getLogTimeAliveDistribution = (db: PostgresJsDatabase) =>
    logBuckets(db, sql`(${players.time_alive}::numeric / ${secondsPerHour})`, timeAliveCondition)

export const getLogXPDistribution = (db: PostgresJsDatabase) =>
    logBuckets(db, players.xp, sql`${players.xp} >= 0`)
