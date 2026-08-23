export type LeaderboardValue = string | number

export type LeaderboardHeader = {
    label: string
    class?: string
    skeletonClass?: string
}

export type LeaderboardRow = {
    uid: string
    nick: string
    squad: string | null
    percentile: Promise<number | undefined>
    barWidth: Promise<number>
    stats: readonly [LeaderboardValue, ...LeaderboardValue[]]
}

export type LeaderboardView = {
    title: string
    caption: string
    headers: readonly [LeaderboardHeader, ...LeaderboardHeader[]]
    ranking: Promise<readonly LeaderboardRow[]>
    playerCount: Promise<number>
    page: number
    offset: number
    limit: number
}
