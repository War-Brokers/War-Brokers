<script lang="ts">
    import { timeAliveLeaderboard } from "../definitions"
    import PaginatedLeaderboard from "../PaginatedLeaderboard.svelte"
    import type { PageData } from "./$types"

    export let data: PageData

    const view = {
        definition: timeAliveLeaderboard,
        ranking: data.timeAliveRanking,
        playerCount: data.playerCount,
        page: data.page,
        offset: data.offset,
        limit: data.limit,
        range: data.statRange,
    } as const
</script>

<PaginatedLeaderboard {view} />
