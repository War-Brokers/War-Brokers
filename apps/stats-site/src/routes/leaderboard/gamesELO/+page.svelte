<script lang="ts">
    import PageControl from "$lib/components/Paged/PageControl.svelte"
    import DataHeaderCell from "$lib/components/Table/DataHeaderCell.svelte"
    import IndexHeaderCell from "$lib/components/Table/IndexHeaderCell.svelte"
    import LoadingRow from "$lib/components/Table/LoadingRow.svelte"
    import Table from "$lib/components/Table/Table.svelte"
    import THead from "$lib/components/Table/THead.svelte"
    import Title from "$lib/components/title.svelte"

    import Row from "../Row.svelte"
    import type { PageData } from "./$types"

    const title = "Games ELO Leaderboard"

    export let data: PageData
    const { getGamesEloRanking, offset, page, playerCount, limit } = data
</script>

<Title {title} />

<h2 class="mb-10 w-full text-center text-3xl font-black">
    {title}
</h2>

<PageControl currentPage={page} total={playerCount} visible={limit} />

<Table>
    <THead>
        <IndexHeaderCell>#</IndexHeaderCell>
        <DataHeaderCell>Player</DataHeaderCell>
        <th class="min-w-24">Games ELO</th>
    </THead>
    <tbody>
        {#await getGamesEloRanking}
            {#each { length: limit } as _}
                <LoadingRow />
            {/each}
        {:then getGamesEloRanking}
            {#each getGamesEloRanking as { uid, nick, gamesELO }, i (uid)}
                <Row
                    rank={i + offset + 1}
                    {nick}
                    {uid}
                    stat={gamesELO.toFixed(2)}
                />
            {/each}
        {/await}
    </tbody>
</Table>
