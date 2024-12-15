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
    <THead>
        <IndexHeaderCell>#</IndexHeaderCell>
        <DataHeaderCell>Player</DataHeaderCell>
        <th class="min-w-32">XP</th>
        <th class="min-w-24">Level</th>
    </THead>
    <tbody>
        {#await XPRanking}
            {#each { length: limit } as _}
                <LoadingRow />
            {/each}
        {:then XPRanking}
            {#each XPRanking as { uid, nick, xp, level }, i (uid)}
                <Row
                    rank={i + offset + 1}
                    {nick}
                    {uid}
                    stat={xp.toLocaleString("en-US")}
                    stat2={level}
                />
            {/each}
        {/await}
    </tbody>
</Table>
