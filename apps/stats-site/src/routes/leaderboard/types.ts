import type { ResolvedPathname } from "$app/types"

import type { StatRange } from "./barWidth"

export type LeaderboardValue = string | number

export type LeaderboardColumnHeader = {
    label: string
    class?: string
    skeletonClass?: string
}

export type LeaderboardPlayer = {
    uid: string
    nick: string
    squad: string | null
    percentile?: Promise<number | undefined>
}

export type LeaderboardColumn<Player extends LeaderboardPlayer> = LeaderboardColumnHeader & {
    value: (player: Player) => LeaderboardValue
}

export type LeaderboardDefinition<Player extends LeaderboardPlayer> = {
    heading: string
    title: string
    caption: string
    path: string
    columns: readonly [LeaderboardColumn<Player>, ...LeaderboardColumn<Player>[]]
    barValue?: (player: Player) => number
}

export type LeaderboardTableView<Player extends LeaderboardPlayer> = {
    definition: LeaderboardDefinition<Player>
    ranking: Promise<readonly Player[]>
    visibleRows: number
    rankOffset?: number
    range?: Promise<StatRange | undefined>
    viewMore?: ResolvedPathname
    emptyMessage?: string
}

export type LeaderboardView<Player extends LeaderboardPlayer> = {
    definition: LeaderboardDefinition<Player>
    ranking: Promise<readonly Player[]>
    playerCount: Promise<number>
    page: number
    offset: number
    limit: number
    range?: Promise<StatRange | undefined>
}
