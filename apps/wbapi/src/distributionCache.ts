import type { PlayerDistribution } from "@/db/distribution"
import { db } from "@/index"

export const cacheUpdateIntervalHours = 24

export type CachedPlayerDistribution = PlayerDistribution & {
    updatedAt: string
}

let cachedDistribution: CachedPlayerDistribution | undefined
let refreshPromise: Promise<CachedPlayerDistribution> | undefined
let refreshTimer: NodeJS.Timeout | undefined
let started = false

async function refreshDistribution(): Promise<CachedPlayerDistribution> {
    if (refreshPromise) return await refreshPromise

    refreshPromise = Promise.all([
        db.getGamesEloDistribution(),
        db.getKillsEloDistribution(),
        db.getLevelDistribution(),
        db.getTimeAliveDistribution(),
        db.getXPDistribution(),
    ])
        .then(([gamesElo, killsElo, level, timeAlive, xp]) => {
            cachedDistribution = {
                gamesElo,
                killsElo,
                level,
                timeAlive,
                xp,
                updatedAt: new Date().toISOString(),
            }

            return cachedDistribution
        })
        .finally(() => {
            refreshPromise = undefined
        })

    return await refreshPromise
}

function scheduleRefreshAfter(delay: number) {
    refreshTimer = setTimeout(runRefreshCycle, delay)
    refreshTimer.unref()
}

function runRefreshCycle() {
    void refreshDistribution().then(
        () => {
            scheduleRefreshAfter(cacheUpdateIntervalHours * 60 * 60 * 1000)
        },
        (error: unknown) => {
            console.error("[player-distribution-refresh-error]", error)
            scheduleRefreshAfter(60 * 1000) // 1 minute
        },
    )
}

export function startDistributionCache() {
    if (started) return
    started = true

    runRefreshCycle()
}

export async function getCachedDistribution(): Promise<CachedPlayerDistribution> {
    if (cachedDistribution) return cachedDistribution
    if (refreshPromise) return await refreshPromise

    // startDistributionCache is called on server startup so this should mostly be unreachable
    throw new Error("Player distribution cache is unavailable")
}
