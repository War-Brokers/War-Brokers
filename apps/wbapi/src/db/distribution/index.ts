import gamesElo, { bucketSize as gamesEloBucketSize } from "./gamesElo"
import killsElo, { bucketSize as killsEloBucketSize } from "./killsElo"
import level, { bucketSize as levelBucketSize } from "./level"
import timeAlive, { bucketSize as timeAliveBucketSize } from "./timeAlive"
import xp, { bucketSize as xpBucketSize } from "./xp"

export const distributionBucketSizes = {
    gamesElo: gamesEloBucketSize,
    killsElo: killsEloBucketSize,
    level: levelBucketSize,
    timeAlive: timeAliveBucketSize,
    xp: xpBucketSize,
} as const

export type DistributionStatistic = keyof typeof distributionBucketSizes

export type DistributionBucket = {
    start: number
    count: number
}

export type PlayerDistribution = Record<DistributionStatistic, DistributionBucket[]>

export const getGamesEloDistribution = gamesElo
export const getKillsEloDistribution = killsElo
export const getLevelDistribution = level
export const getTimeAliveDistribution = timeAlive
export const getXPDistribution = xp
