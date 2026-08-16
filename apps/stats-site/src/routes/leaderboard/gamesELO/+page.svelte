<script lang="ts">
    import PageControl from "$lib/components/Paged/PageControl.svelte"
    import DataHeaderCell from "$lib/components/Table/DataHeaderCell.svelte"
    import IndexHeaderCell from "$lib/components/Table/IndexHeaderCell.svelte"
    import Table from "$lib/components/Table/Table.svelte"
    import THead from "$lib/components/Table/THead.svelte"
    import Title from "$lib/components/title.svelte"

    import LoadingRows from "../LoadingRows.svelte"
    import Row from "../Row.svelte"
    import StateRow from "../StateRow.svelte"
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
    <caption class="sr-only">Games Elo leaderboard</caption>
    <THead>
        <IndexHeaderCell>#</IndexHeaderCell>
        <DataHeaderCell>Player</DataHeaderCell>
        <th class="min-w-24">Games ELO</th>
    </THead>
    {#await getGamesEloRanking}
        <tbody
            class="animate-pulse motion-reduce:animate-none"
            aria-busy="true"
            aria-label="Games Elo leaderboard"
        >
            <LoadingRows rows={limit} />
        </tbody>
    {:then getGamesEloRanking}
        <tbody>
            {#if getGamesEloRanking.length === 0}
                <StateRow colspan={3} rows={limit} tone="empty">
                    No ranked players are available on this page.
                </StateRow>
            {:else}
                {#each getGamesEloRanking as { uid, nick, squad, gamesELO }, i (uid)}
                    <Row rank={i + offset + 1} {nick} {squad} {uid} stat={gamesELO.toFixed(2)} />
                {/each}
            {/if}
        </tbody>
    {:catch _}
        <tbody>
            <StateRow colspan={3} rows={limit} tone="error">Failed to load</StateRow>
        </tbody>
    {/await}
</Table>
