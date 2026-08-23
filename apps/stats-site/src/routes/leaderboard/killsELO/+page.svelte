<script lang="ts">
    import { scaleBarWidth } from "../barWidth"
    import PaginatedLeaderboard from "../PaginatedLeaderboard.svelte"
    import type { LeaderboardView } from "../types"
    import type { PageData } from "./$types"

    export let data: PageData

    const view = {
        title: "Kills ELO Leaderboard",
        caption: "Kills Elo leaderboard",
        headers: [{ label: "Kills ELO", class: "min-w-24", skeletonClass: "w-20" }],
        ranking: data.killsEloRanking.then((players) =>
            players.map(({ uid, nick, squad, percentile, killsELO }) => ({
                uid,
                nick,
                squad,
                percentile,
                barWidth: data.statRange.then((range) => scaleBarWidth(killsELO, range)),
                stats: [killsELO.toFixed(2)] as const,
            })),
        ),
        playerCount: data.playerCount,
        page: data.page,
        offset: data.offset,
        limit: data.limit,
    } as const satisfies LeaderboardView
</script>

<PaginatedLeaderboard {view} />
