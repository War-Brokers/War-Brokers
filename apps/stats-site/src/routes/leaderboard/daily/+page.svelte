<script lang="ts">
    import { resolve } from "$app/paths"
    import Title from "$lib/components/title.svelte"

    import { SIMPLE_LEADERBOARD_LEN } from "../config"
    import {
        dailyBattleRoyaleWinsLeaderboard,
        dailyClassicModeWinsLeaderboard,
        dailyKillsLeaderboard,
    } from "../definitions"
    import LeaderboardTable from "../LeaderboardTable.svelte"
    import type { PageData } from "./$types"

    export let data: PageData
    const {
        dailyStatsUpdatedAt,

        dailyKillsRanking,
        dailyKillsRange,

        dailyClassicModeWinsRanking,
        classicModeWinsRange,

        dailyBattleRoyaleWinsRanking,
        battleRoyaleWinsRange,
    } = data
</script>

<Title title="Daily Leaderboards" />

<h2 class="w-full text-center text-3xl font-black">Daily Leaderboards</h2>

<div class="flex w-full flex-col">
    <LeaderboardTable
        definition={dailyKillsLeaderboard}
        ranking={dailyKillsRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={dailyKillsRange}
        updatedAt={dailyStatsUpdatedAt}
        viewMore={resolve(dailyKillsLeaderboard.path)}
        showHeading
    />

    <LeaderboardTable
        definition={dailyClassicModeWinsLeaderboard}
        ranking={dailyClassicModeWinsRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={classicModeWinsRange}
        updatedAt={dailyStatsUpdatedAt}
        viewMore={resolve(dailyClassicModeWinsLeaderboard.path)}
        showHeading
    />

    <LeaderboardTable
        definition={dailyBattleRoyaleWinsLeaderboard}
        ranking={dailyBattleRoyaleWinsRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={battleRoyaleWinsRange}
        updatedAt={dailyStatsUpdatedAt}
        viewMore={resolve(dailyBattleRoyaleWinsLeaderboard.path)}
        showHeading
    />
</div>
