<script lang="ts">
    import { resolve } from "$app/paths"
    import Title from "$lib/components/title.svelte"

    import { SIMPLE_LEADERBOARD_LEN } from "../config"
    import { dailyKillsLeaderboard } from "../definitions"
    import LeaderboardTable from "../LeaderboardTable.svelte"
    import type { PageData } from "./$types"

    export let data: PageData
    const { dailyKillsRanking, statRange } = data
</script>

<Title title="Daily Leaderboards" />

<h2 class="w-full text-center text-3xl font-black">Daily Leaderboards</h2>

<div class="flex w-full flex-col">
    <LeaderboardTable
        definition={dailyKillsLeaderboard}
        ranking={dailyKillsRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={statRange}
        viewMore={resolve(dailyKillsLeaderboard.path)}
        showHeading
    />
</div>
