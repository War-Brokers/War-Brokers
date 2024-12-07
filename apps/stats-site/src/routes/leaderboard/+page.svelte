<script lang="ts">
    import DataHeaderCell from "$lib/components/Table/DataHeaderCell.svelte"
    import IndexHeaderCell from "$lib/components/Table/IndexHeaderCell.svelte"
    import LoadingRow from "$lib/components/Table/LoadingRow.svelte"
    import Table from "$lib/components/Table/Table.svelte"
    import THead from "$lib/components/Table/THead.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import { SIMPLE_LEADERBOARD_LEN } from "./config"
    import LeaderboardHeading from "./LeaderboardHeading.svelte"
    import Row from "./Row.svelte"
    import ViewMore from "./ViewMore.svelte"

    export let data: PageData
    const { killsEloRanking, gamesEloRanking, xpRanking } = data
</script>

<Title title="Leaderboard" />

<h2 class="w-full text-center text-3xl font-black">Global Leaderboard</h2>

<div class="flex w-full flex-col">
    <LeaderboardHeading>Kills ELO</LeaderboardHeading>
    <Table>
        <THead>
            <IndexHeaderCell>#</IndexHeaderCell>
            <DataHeaderCell>Player</DataHeaderCell>
            <th class="min-w-24">Kills ELO</th>
        </THead>
        <tbody>
            {#await killsEloRanking}
                {#each { length: SIMPLE_LEADERBOARD_LEN } as _}
                    <LoadingRow />
                {/each}
            {:then killsEloRanking}
                {#each killsEloRanking as { uid, nick, killsELO }, i (uid)}
                    <Row rank={i + 1} {nick} {uid} stat={killsELO.toFixed(2)} />
                {/each}
                <ViewMore href="/leaderboard/killsELO" />
            {/await}
        </tbody>
    </Table>

    <LeaderboardHeading>Games ELO</LeaderboardHeading>
    <Table>
        <THead>
            <IndexHeaderCell>#</IndexHeaderCell>
            <DataHeaderCell>Player</DataHeaderCell>
            <th class="min-w-24">Games ELO</th>
        </THead>
        <tbody>
            {#await gamesEloRanking}
                {#each { length: SIMPLE_LEADERBOARD_LEN } as _}
                    <LoadingRow />
                {/each}
            {:then gamesEloRanking}
                {#each gamesEloRanking as { uid, nick, gamesELO }, i (uid)}
                    <Row rank={i + 1} {nick} {uid} stat={gamesELO.toFixed(2)} />
                {/each}
                <ViewMore href="/leaderboard/gamesELO" />
            {/await}
        </tbody>
    </Table>

    <LeaderboardHeading>XP & Level</LeaderboardHeading>
    <Table>
        <THead>
            <IndexHeaderCell>#</IndexHeaderCell>
            <DataHeaderCell>Player</DataHeaderCell>
            <th class="min-w-32">XP</th>
            <th class="min-w-24">Level</th>
        </THead>
        <tbody>
            {#await xpRanking}
                {#each { length: SIMPLE_LEADERBOARD_LEN } as _}
                    <LoadingRow />
                {/each}
            {:then xpRanking}
                {#each xpRanking as { uid, nick, xp, level }, i (uid)}
                    <Row
                        rank={i + 1}
                        {nick}
                        {uid}
                        stat={xp.toLocaleString("en-US")}
                        stat2={level}
                    />
                {/each}
                <ViewMore href="/leaderboard/xp" />
            {/await}
        </tbody>
    </Table>
</div>
