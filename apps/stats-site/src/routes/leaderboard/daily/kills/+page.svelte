<script lang="ts">
    import { dailyKillsLeaderboard } from "../../definitions"
    import PaginatedLeaderboard from "../../PaginatedLeaderboard.svelte"
    import type { PageData } from "./$types"

    export let data: PageData

    const view = {
        definition: dailyKillsLeaderboard,
        ranking: data.dailyKillsRanking,
        playerCount: data.playerCount,
        page: data.page,
        offset: data.offset,
        limit: data.limit,
        range: data.statRange,
    } as const
</script>

<PaginatedLeaderboard {view} />
