<script lang="ts">
    import CategoryBreakdownCard from "$lib/components/charts/CategoryBreakdownCard.svelte"

    import { getWeaponBreakdowns, type WeaponStats } from "./weapons"

    const { player }: { player: WeaponStats } = $props()
    const breakdowns = getWeaponBreakdowns(player)
    let hoveredWeaponKey = $state<string | undefined>()
    let pinnedWeaponKey = $state<string | undefined>()

    function setHoveredWeaponKey(key: string | undefined) {
        hoveredWeaponKey = key
    }

    function setPinnedWeaponKey(key: string | undefined) {
        pinnedWeaponKey = key
    }
</script>

<section class="mt-12" aria-labelledby="weapon-statistics-title">
    <h2 id="weapon-statistics-title" class="mb-6 text-2xl font-bold text-gray-100">
        Weapon Statistics
    </h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {#each breakdowns as breakdown (breakdown.id)}
            <CategoryBreakdownCard
                model={breakdown}
                hoveredCategoryKey={hoveredWeaponKey}
                onHoveredCategoryKeyChange={setHoveredWeaponKey}
                pinnedCategoryKey={pinnedWeaponKey}
                onPinnedCategoryKeyChange={setPinnedWeaponKey}
            />
        {/each}
    </div>
</section>
