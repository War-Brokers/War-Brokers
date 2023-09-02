/**
 * Redis
 */

import { Redis } from "@upstash/redis"

import env from "@/env"

export function redis() {
    return new Redis({
        url: env.upstash.url.value(),
        token: env.upstash.token.value(),
    })
}
