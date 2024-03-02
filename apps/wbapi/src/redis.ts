import { Redis } from "@upstash/redis"
import type { Player } from "@warbrokers/types/src/player"

import { env } from "."
import { FailReason, type Result } from "./types"

let redis: Redis

export function initRedis() {
    redis = new Redis({
        url: env.REDIS_ENDPOINT,
        token: env.REDIS_PW,
    })
}

enum RedisKey {
    KILLS_ELO = "kills-elo",
    GAMES_ELO = "games-elo",
    XP = "xp",
}

export function setKillsElo(uid: string, killsElo: number) {
    // https://redis.io/commands/zadd
    redis.zadd(RedisKey.KILLS_ELO, { member: uid, score: killsElo })
}

export function setGamesElo(uid: string, gamesElo: number) {
    // https://redis.io/commands/zadd
    redis.zadd(RedisKey.GAMES_ELO, { member: uid, score: gamesElo })
}

export function setXP(uid: string, xp: number) {
    // https://redis.io/commands/zadd
    redis.zadd(RedisKey.GAMES_ELO, { member: uid, score: xp })
}

/**
 * Calculates the percentile of a player's statistic.
 * i.e. This player is better than X percent of players.
 */
export async function getPercentile(
    key: RedisKey,
    uid: Player["uid"],
): Promise<Result<number>> {
    const [size, rank] = await Promise.all([
        // https://redis.io/commands/scard
        redis.scard(key),

        // https://redis.io/commands/zrank
        redis.zrevrank(key, uid),
    ])

    if (rank === null)
        return {
            success: false,
            reason: FailReason.RedisConnectionFail,
        }

    return {
        success: true,
        // rank starts at 0
        data: 100 * (rank + 1 / size),
    }
}
