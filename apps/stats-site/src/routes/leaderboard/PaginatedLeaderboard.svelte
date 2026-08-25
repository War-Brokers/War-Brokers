<script lang="ts" generics="Player extends LeaderboardPlayer">
    import PageControl from "$lib/components/Paged/PageControl.svelte"
    import Title from "$lib/components/title.svelte"

    import LeaderboardTable from "./LeaderboardTable.svelte"
    import type { LeaderboardPlayer, LeaderboardView } from "./types"

    export let view: LeaderboardView<Player>
</script>

<Title title={view.definition.title} />

<h2 class="mb-10 w-full text-center text-3xl font-black">
    {view.definition.title}
</h2>

<PageControl currentPage={view.page} total={view.playerCount} visible={view.limit} />

<LeaderboardTable
    definition={view.definition}
    ranking={view.ranking}
    visibleRows={view.limit}
    rankOffset={view.offset}
    range={view.range}
    emptyMessage="No ranked players are available on this page."
/>
