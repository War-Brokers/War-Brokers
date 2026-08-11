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

    const title = "XP & Level Leaderboard"

    export let data: PageData
    const { XPRanking, offset, page, playerCount, limit } = data
</script>

<Title {title} />

<h2 class="mb-10 w-full text-center text-3xl font-black">
    {title}
</h2>

<PageControl currentPage={page} total={playerCount} visible={limit} />

<Table>
    <caption class="sr-only">XP and level leaderboard</caption>
    <THead>
        <IndexHeaderCell>#</IndexHeaderCell>
        <DataHeaderCell>Player</DataHeaderCell>
        <th class="min-w-32">XP</th>
        <th class="min-w-24">Level</th>
    </THead>
    {#await XPRanking}
        <tbody
            class="animate-pulse motion-reduce:animate-none"
            aria-busy="true"
            aria-label="XP and level leaderboard"
        >
            <LoadingRows rows={limit} secondaryStat />
        </tbody>
    {:then XPRanking}
        <tbody>
            {#if XPRanking.length === 0}
                <StateRow colspan={4} rows={limit} tone="empty">
                    No ranked players are available on this page.
                </StateRow>
            {:else}
                {#each XPRanking as { uid, nick, xp, level }, i (uid)}
                    <Row
                        rank={i + offset + 1}
                        {nick}
                        {uid}
                        stat={xp.toLocaleString("en-US")}
                        stat2={level}
                    />
                {/each}
            {/if}
        </tbody>
    {:catch _}
        <tbody>
            <StateRow colspan={4} rows={limit} tone="error">Failed to load</StateRow>
        </tbody>
    {/await}
</Table>
