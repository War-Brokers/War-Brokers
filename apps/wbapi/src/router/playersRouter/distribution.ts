import { z } from "zod"

import { distributionBucketSizes } from "@/db/distribution"
import { cacheUpdateIntervalHours, getCachedDistribution } from "@/distributionCache"
import { publicProcedure } from "@/trpc"

const bucketSchema = z.object({
    start: z.number(),
    count: z.number().int().nonnegative(),
})

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/distribution",
                description: `Gets the cached player distributions for ranked statistics. The cache is updated roughly every ${cacheUpdateIntervalHours} hours.`,
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(
            z.object({
                gamesElo: z.object({
                    bucketSize: z.literal(distributionBucketSizes.gamesElo),
                    buckets: z.array(bucketSchema),
                }),
                killsElo: z.object({
                    bucketSize: z.literal(distributionBucketSizes.killsElo),
                    buckets: z.array(bucketSchema),
                }),
                level: z.object({
                    bucketSize: z.literal(distributionBucketSizes.level),
                    buckets: z.array(bucketSchema),
                }),
                xp: z.object({
                    bucketSize: z.literal(distributionBucketSizes.xp),
                    buckets: z.array(bucketSchema),
                }),
                updatedAt: z.string().datetime(),
                cacheUpdateIntervalHours: z.literal(cacheUpdateIntervalHours),
            }),
        )
        .query(async () => {
            const { gamesElo, killsElo, level, xp, updatedAt } = await getCachedDistribution()

            return {
                gamesElo: {
                    bucketSize: distributionBucketSizes.gamesElo,
                    buckets: gamesElo,
                },
                killsElo: {
                    bucketSize: distributionBucketSizes.killsElo,
                    buckets: killsElo,
                },
                level: {
                    bucketSize: distributionBucketSizes.level,
                    buckets: level,
                },
                xp: {
                    bucketSize: distributionBucketSizes.xp,
                    buckets: xp,
                },
                updatedAt,
                cacheUpdateIntervalHours,
            }
        })
