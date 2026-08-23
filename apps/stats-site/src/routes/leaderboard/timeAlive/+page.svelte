<script lang="ts">
    import { formatTimeAlive } from "$lib/formatting"

    import PaginatedLeaderboard from "../PaginatedLeaderboard.svelte"
    import type { LeaderboardView } from "../types"
    import type { PageData } from "./$types"

    export let data: PageData

    const view = {
        title: "Time Alive Leaderboard",
        caption: "Time Alive leaderboard",
        headers: [{ label: "Time Alive", class: "min-w-32", skeletonClass: "w-24" }],
        ranking: data.timeAliveRanking.then((players) =>
            players.map(({ uid, nick, squad, percentile, time_alive }) => ({
                uid,
                nick,
                squad,
                percentile,
                stats: [formatTimeAlive(time_alive)] as const,
            })),
        ),
        playerCount: data.playerCount,
        page: data.page,
        offset: data.offset,
        limit: data.limit,
    } as const satisfies LeaderboardView
</script>

<PaginatedLeaderboard {view} />
