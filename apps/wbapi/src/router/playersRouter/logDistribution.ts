import { z } from "zod"

import { logBucketBase } from "@/db/distribution"
import { cacheUpdateIntervalHours, getCachedLogDistribution } from "@/distributionCache"
import { publicProcedure } from "@/trpc"

const bucketSchema = z.object({
    exponent: z.number().int(),
    count: z.number().int().nonnegative(),
})

const distributionSchema = z.object({
    bucketBase: z.literal(logBucketBase),
    buckets: z.array(bucketSchema),
})

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/logDistribution",
                description: `Gets cached player distributions with logarithmic buckets. The cache is updated roughly every ${cacheUpdateIntervalHours} hours.`,
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(
            z.object({
                level: distributionSchema,
                timeAlive: distributionSchema,
                xp: distributionSchema,
                updatedAt: z.string().datetime(),
                cacheUpdateIntervalHours: z.literal(cacheUpdateIntervalHours),
            }),
        )
        .query(async () => {
            const { level, timeAlive, xp, updatedAt } = await getCachedLogDistribution()

            return {
                level: { bucketBase: logBucketBase, buckets: level },
                timeAlive: { bucketBase: logBucketBase, buckets: timeAlive },
                xp: { bucketBase: logBucketBase, buckets: xp },
                updatedAt,
                cacheUpdateIntervalHours,
            }
        })
