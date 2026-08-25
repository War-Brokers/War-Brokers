<script lang="ts">
    import { Icon } from "svelte-awesome"
    import arrowRight from "svelte-awesome/icons/arrowRight"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import { SIMPLE_LEADERBOARD_LEN } from "./config"
    import {
        gamesEloLeaderboard,
        killsEloLeaderboard,
        timeAliveLeaderboard,
        xpLeaderboard,
    } from "./definitions"
    import LeaderboardTable from "./LeaderboardTable.svelte"

    export let data: PageData
    const {
        gamesEloRange,
        gamesEloRanking,
        killsEloRange,
        killsEloRanking,
        timeAliveRange,
        timeAliveRanking,
        xpRange,
        xpRanking,
    } = data
</script>

<Title title="Leaderboard" />

<h2 class="w-full text-center text-3xl font-black">Global Leaderboard</h2>

<div class="mt-6 flex justify-center">
    <A href={resolve("/leaderboard/daily")}>
        View daily leaderboards &nbsp; <Icon data={arrowRight} aria-hidden="true" />
    </A>
</div>

<div class="flex w-full flex-col">
    <LeaderboardTable
        definition={killsEloLeaderboard}
        ranking={killsEloRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={killsEloRange}
        viewMore={resolve(killsEloLeaderboard.path)}
        showHeading
    />

    <LeaderboardTable
        definition={gamesEloLeaderboard}
        ranking={gamesEloRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={gamesEloRange}
        viewMore={resolve(gamesEloLeaderboard.path)}
        showHeading
    />

    <LeaderboardTable
        definition={timeAliveLeaderboard}
        ranking={timeAliveRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={timeAliveRange}
        viewMore={resolve(timeAliveLeaderboard.path)}
        showHeading
    />

    <LeaderboardTable
        definition={xpLeaderboard}
        ranking={xpRanking}
        visibleRows={SIMPLE_LEADERBOARD_LEN}
        range={xpRange}
        viewMore={resolve(xpLeaderboard.path)}
        showHeading
    />
</div>
