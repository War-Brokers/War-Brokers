<script lang="ts">
    import { dailyBattleRoyaleWinsLeaderboard } from "../../definitions"
    import PaginatedLeaderboard from "../../PaginatedLeaderboard.svelte"
    import type { PageData } from "./$types"

    export let data: PageData

    const view = {
        definition: dailyBattleRoyaleWinsLeaderboard,
        ranking: data.dailyBattleRoyaleWinsRanking,
        playerCount: data.playerCount,
        page: data.page,
        offset: data.offset,
        limit: data.limit,
        range: data.statRange,
        updatedAt: data.dailyStatsUpdatedAt,
    } as const
</script>

<PaginatedLeaderboard {view} />
