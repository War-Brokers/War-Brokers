import { sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import { players } from "@/db/schema"

import type { DistributionBucket } from "."

export const bucketSize = 25

export default (db: PostgresJsDatabase) => {
    return async (): Promise<DistributionBucket[]> => {
        return await db.execute<DistributionBucket>(sql`
            SELECT
                floor(${players.killsELO} / ${bucketSize}) * ${bucketSize} AS start,
                count(*)::integer AS count
            FROM ${players}
            GROUP BY 1
            ORDER BY 1
        `)
    }
}
