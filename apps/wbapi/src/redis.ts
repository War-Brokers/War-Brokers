import { Redis } from "@upstash/redis"
import type { Player } from "@warbrokers/types/src/player"

import { env } from "."
import { FailReason, type Result } from "./types"

let redis_leaderboard: Redis
let redis_squad: Redis

export function initRedis() {
    redis_leaderboard = new Redis({
        url: env.LEADERBOARD_REDIS_URL,
        token: env.LEADERBOARD_REDIS_TOKEN,
    })

    redis_squad = new Redis({
        url: env.SQUAD_REDIS_URL,
        token: env.SQUAD_REDIS_TOKEN,
    })
}

export enum LeaderboardKey {
    KILLS_ELO = "kills-elo",
    GAMES_ELO = "games-elo",
    XP = "xp",
}

export function setSquad(uid: string, squadName: string) {
    // squad:<uid> = <squadName> (string)
    // members:<squadName> = [uid1, uid2, ...] (set)

    if (!squadName) {
        redis_squad.del(`squad:${uid}`, squadName)
        redis_squad.srem(`members:${squadName}`, uid)
        return
    }

    redis_squad.set(`squad:${uid}`, squadName)
    redis_squad.sadd(`members:${squadName}`, uid)
}

export async function getSquads(): Promise<string[]> {
    const list = await redis_squad.keys("members:*")

    return list.map((val) => val.slice(8))
}

export async function getSquadMembers(squadName: string): Promise<string[]> {
    return await redis_squad.smembers(`members:${squadName}`)
}

export function setKillsElo(uid: string, killsElo: number) {
    redis_leaderboard.zadd(LeaderboardKey.KILLS_ELO, {
        member: uid,
        score: killsElo,
    })
}

export function setGamesElo(uid: string, gamesElo: number) {
    redis_leaderboard.zadd(LeaderboardKey.GAMES_ELO, {
        member: uid,
        score: gamesElo,
    })
}

export function setXP(uid: string, xp: number) {
    redis_leaderboard.zadd(LeaderboardKey.XP, { member: uid, score: xp })
}

/**
 * Calculates the percentile of a player's statistic.
 * i.e. This player is better than X percent of players.
 */
export async function getPercentile(
    key: LeaderboardKey,
    uid: Player["uid"],
): Promise<Result<number>> {
    const [size, rank] = await Promise.all([
        redis_leaderboard.zcard(key),
        redis_leaderboard.zrank(key, uid),
    ])

    if (rank === null)
        return {
            success: false,
            reason: FailReason.RedisConnectionFail,
        }

    return {
        success: true,
        // rank starts at 0
        data: 100 * ((rank + 1) / size),
    }
}
