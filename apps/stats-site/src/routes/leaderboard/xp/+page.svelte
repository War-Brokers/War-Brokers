<script lang="ts">
    import { scaleBarWidth } from "../barWidth"
    import PaginatedLeaderboard from "../PaginatedLeaderboard.svelte"
    import type { LeaderboardView } from "../types"
    import type { PageData } from "./$types"

    export let data: PageData

    const view = {
        title: "XP & Level Leaderboard",
        caption: "XP and level leaderboard",
        headers: [
            { label: "XP", class: "min-w-32", skeletonClass: "w-20" },
            { label: "Level", class: "min-w-24", skeletonClass: "w-12" },
        ],
        ranking: data.XPRanking.then((players) =>
            players.map(({ uid, nick, squad, percentile, xp, level }) => ({
                uid,
                nick,
                squad,
                percentile,
                barWidth: data.statRange.then((range) => scaleBarWidth(xp, range)),
                stats: [xp.toLocaleString("en-US"), level] as const,
            })),
        ),
        playerCount: data.playerCount,
        page: data.page,
        offset: data.offset,
        limit: data.limit,
    } as const satisfies LeaderboardView
</script>

<PaginatedLeaderboard {view} />
