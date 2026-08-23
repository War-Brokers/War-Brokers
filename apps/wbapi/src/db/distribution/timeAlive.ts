import { sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

import type { DistributionBucket } from "."

export const secondsPerHour = 60 * 60
export const bucketSize = 25

export const timeAliveCondition = sql`
    ${players.time_alive} IS NOT NULL AND ${players.time_alive} >= 0
`

export default (db: PostgresJsDatabase) => {
    return async (): Promise<DistributionBucket[]> => {
        return await db.execute<DistributionBucket>(sql`
            SELECT
                floor(${players.time_alive}::numeric / ${secondsPerHour} / ${bucketSize})::double precision
                    * ${bucketSize} AS start,
                count(*)::integer AS count
            FROM ${players}
            WHERE ${timeAliveCondition}
            GROUP BY 1
            ORDER BY 1
        `)
    }
}
