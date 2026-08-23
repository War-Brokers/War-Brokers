import { sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

import type { DistributionBucket } from "."

const secondsPerHour = 60 * 60
export const bucketSize = 25

export default (db: PostgresJsDatabase) => {
    return async (): Promise<DistributionBucket[]> => {
        return await db.execute<DistributionBucket>(sql`
            SELECT
                floor(${players.time_alive}::numeric / ${secondsPerHour} / ${bucketSize})::double precision
                    * ${bucketSize} AS start,
                count(*)::integer AS count
            FROM ${players}
            WHERE ${players.time_alive} IS NOT NULL
            GROUP BY 1
            ORDER BY 1
        `)
    }
}
