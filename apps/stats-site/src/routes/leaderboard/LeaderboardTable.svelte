<script lang="ts" generics="Player extends LeaderboardPlayer">
    import A from "$lib/components/A.svelte"
    import Table from "$lib/components/Table/Table.svelte"

    import { scaleBarWidth } from "./barWidth"
    import LoadingRows from "./LoadingRows.svelte"
    import Row from "./Row.svelte"
    import StateRow from "./StateRow.svelte"
    import type { LeaderboardPlayer, LeaderboardTableView } from "./types"

    export let definition: LeaderboardTableView<Player>["definition"]
    export let ranking: LeaderboardTableView<Player>["ranking"]
    export let visibleRows: LeaderboardTableView<Player>["visibleRows"]
    export let rankOffset = 0
    export let range: LeaderboardTableView<Player>["range"] = undefined
    export let viewMore: LeaderboardTableView<Player>["viewMore"] = undefined
    export let emptyMessage: LeaderboardTableView<Player>["emptyMessage"] =
        "No ranked players are available."
    export let showHeading = false

    $: columnCount = definition.columns.length + 2
    $: reservedRows = visibleRows + (viewMore === undefined ? 0 : 1)

    function getBarWidth(player: Player) {
        const { barValue } = definition
        if (barValue === undefined || range === undefined) return undefined

        return range.then((statRange) => scaleBarWidth(barValue(player), statRange))
    }
</script>

{#if showHeading}
    <h3 class="mt-10 mb-3 w-full text-xl font-semibold">{definition.heading}</h3>
{/if}

<Table>
    <caption class="sr-only">{definition.caption}</caption>
    <thead>
        <tr>
            <th scope="col" class="w-14 px-4 text-right">#</th>
            <th scope="col" class="w-full">Player</th>
            {#each definition.columns as column, index (index)}
                <th scope="col" class={column.class}>{column.label}</th>
            {/each}
        </tr>
    </thead>
    {#await ranking}
        <tbody
            class="animate-pulse motion-reduce:animate-none"
            aria-busy="true"
            aria-label={definition.caption}
        >
            <LoadingRows rows={reservedRows} headers={definition.columns} />
        </tbody>
    {:then players}
        <tbody>
            {#if players.length === 0}
                <StateRow colspan={columnCount} rows={reservedRows} tone="empty">
                    {emptyMessage}
                </StateRow>
            {:else}
                {#each players as player, index (player.uid)}
                    <Row
                        rank={index + rankOffset + 1}
                        nick={player.nick}
                        squad={player.squad}
                        uid={player.uid}
                        percentile={player.percentile}
                        barWidth={getBarWidth(player)}
                        stats={definition.columns.map((column) => column.value(player))}
                    />
                {/each}
                {#if viewMore}
                    <tr>
                        <td colspan={columnCount} class="text-center">
                            <A href={viewMore}>view more...</A>
                        </td>
                    </tr>
                {/if}
            {/if}
        </tbody>
    {:catch _}
        <tbody>
            <StateRow colspan={columnCount} rows={reservedRows} tone="error">
                Failed to load
            </StateRow>
        </tbody>
    {/await}
</Table>
