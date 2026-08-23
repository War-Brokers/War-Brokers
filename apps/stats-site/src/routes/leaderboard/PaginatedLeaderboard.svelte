<script lang="ts">
    import PageControl from "$lib/components/Paged/PageControl.svelte"
    import DataHeaderCell from "$lib/components/Table/DataHeaderCell.svelte"
    import IndexHeaderCell from "$lib/components/Table/IndexHeaderCell.svelte"
    import Table from "$lib/components/Table/Table.svelte"
    import THead from "$lib/components/Table/THead.svelte"
    import Title from "$lib/components/title.svelte"

    import LoadingRows from "./LoadingRows.svelte"
    import Row from "./Row.svelte"
    import StateRow from "./StateRow.svelte"
    import type { LeaderboardView } from "./types"

    export let view: LeaderboardView
</script>

<Title title={view.title} />

<h2 class="mb-10 w-full text-center text-3xl font-black">
    {view.title}
</h2>

<PageControl currentPage={view.page} total={view.playerCount} visible={view.limit} />

<Table>
    <caption class="sr-only">{view.caption}</caption>
    <THead>
        <IndexHeaderCell>#</IndexHeaderCell>
        <DataHeaderCell>Player</DataHeaderCell>
        {#each view.headers as header, index (index)}
            <th class={header.class}>{header.label}</th>
        {/each}
    </THead>
    {#await view.ranking}
        <tbody
            class="animate-pulse motion-reduce:animate-none"
            aria-busy="true"
            aria-label={view.caption}
        >
            <LoadingRows rows={view.limit} headers={view.headers} />
        </tbody>
    {:then ranking}
        <tbody>
            {#if ranking.length === 0}
                <StateRow colspan={view.headers.length + 2} rows={view.limit} tone="empty">
                    No ranked players are available on this page.
                </StateRow>
            {:else}
                {#each ranking as player, i (player.uid)}
                    <Row
                        rank={i + view.offset + 1}
                        nick={player.nick}
                        squad={player.squad}
                        uid={player.uid}
                        percentile={player.percentile}
                        stats={player.stats}
                    />
                {/each}
            {/if}
        </tbody>
    {:catch _}
        <tbody>
            <StateRow colspan={view.headers.length + 2} rows={view.limit} tone="error">
                Failed to load
            </StateRow>
        </tbody>
    {/await}
</Table>
