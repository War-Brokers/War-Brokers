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

    export let data: PageData
    const { killsEloRanking, gamesEloRanking, xpRanking } = data

    /**
     * https://stackoverflow.com/a/2901298/12979111
     */
    function numberWithCommas(x: number): string {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
</script>

<Title title="Leaderboard" />

<h2 class="w-full text-center text-3xl font-black">Global Leaderboard</h2>

<div class="flex w-full flex-col">
    <LeaderboardHeading href="/leaderboard/killsELO">
        Kills ELO
    </LeaderboardHeading>
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
                    <Row rank={i + 1} {nick} {uid} stat={killsELO} />
                {/each}
            {/await}
        </tbody>
    </Table>

    <LeaderboardHeading href="/leaderboard/gamesELO">
        Games ELO
    </LeaderboardHeading>
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
                    <Row rank={i + 1} {nick} {uid} stat={gamesELO} />
                {/each}
            {/await}
        </tbody>
    </Table>

    <LeaderboardHeading href="/leaderboard/xp">XP & Level</LeaderboardHeading>
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
                        stat={numberWithCommas(xp)}
                        stat2={level}
                    />
                {/each}
            {/await}
        </tbody>
    </Table>
</div>
