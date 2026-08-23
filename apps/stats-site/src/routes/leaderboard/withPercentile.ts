import trpc from "$lib/trpc"

const percentileQueries = {
    gamesElo: (uid: string) => trpc.players.percentile.gamesElo.query({ uid }),
    killsElo: (uid: string) => trpc.players.percentile.killsElo.query({ uid }),
    timeAlive: (uid: string) => trpc.players.percentile.timeAlive.query({ uid }),
    xp: (uid: string) => trpc.players.percentile.xp.query({ uid }),
} as const

export function withPercentile<T extends { uid: string }>(
    ranking: Promise<readonly T[]>,
    statistic: keyof typeof percentileQueries,
) {
    return ranking.then((players) =>
        players.map((player) => ({
            ...player,
            percentile: percentileQueries[statistic](player.uid).catch(() => undefined),
        })),
    )
}
