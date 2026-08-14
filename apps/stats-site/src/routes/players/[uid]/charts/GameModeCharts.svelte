<script lang="ts">
    import type { Player } from "@warbrokers/types/src/player"

    import CategoryBreakdownCard from "$lib/components/charts/CategoryBreakdownCard.svelte"

    import { getGameModeBreakdowns } from "./gameModes"

    const { player }: { player: Pick<Player, "wins" | "losses"> } = $props()
    const breakdowns = getGameModeBreakdowns(player)
</script>

<section class="mt-12" aria-labelledby="game-mode-statistics-title">
    <h2 id="game-mode-statistics-title" class="mb-6 text-2xl font-bold text-gray-100">
        Game Mode Statistics
    </h2>
    <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {#each breakdowns as breakdown (breakdown.id)}
            <CategoryBreakdownCard model={breakdown} />
        {/each}
    </div>
</section>
