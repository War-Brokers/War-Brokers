import { Redis } from "@upstash/redis"
import type {
    ScoreMember,
    ZAddCommandOptions,
    ZAddCommandOptionsWithIncr,
} from "@upstash/redis/types/pkg/commands/zadd"

import env from "@/env"

/**
 * DO NOT EXPORT THIS FUNCTION
 */
function redis() {
    return new Redis({
        url: env.upstash.url.value(),
        token: env.upstash.token.value(),
    })
}

export const keys = {
    sortedSet: {
        xp: "player:xp",
        killsElo: "player:killsELO",
        gamesElo: "player:gamesELO",
    },
} as const

export type SortedSetKey = (typeof keys.sortedSet)[keyof typeof keys.sortedSet]
export type RedisKey = SortedSetKey

export const zadd: <T>(
    ...args:
        | [
              key: RedisKey,
              scoreMember: ScoreMember<T>,
              ...scoreMemberPairs: ScoreMember<T>[],
          ]
        | [
              RedisKey,
              ZAddCommandOptions | ZAddCommandOptionsWithIncr,
              ScoreMember<T>,
              ...ScoreMember<T>[],
          ]
) => ReturnType<typeof Redis.prototype.zadd> = (...args) => {
    return redis().zadd(...args)
}

export const zrevrank: <T>(
    key: RedisKey,
    member: T,
) => ReturnType<typeof Redis.prototype.zrevrank> = (...args) => {
    return redis().zrevrank(...args)
}
