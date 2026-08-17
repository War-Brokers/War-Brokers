<script lang="ts">
    import CategoryBreakdownCard from "$lib/components/charts/CategoryBreakdownCard.svelte"

    import { getVehicleBreakdowns, type VehicleStats } from "./vehicles"

    const { player }: { player: VehicleStats } = $props()
    const breakdowns = getVehicleBreakdowns(player)
    let hoveredVehicleKey = $state<string | undefined>()
    let pinnedVehicleKey = $state<string | undefined>()

    function setHoveredVehicleKey(key: string | undefined) {
        hoveredVehicleKey = key
    }

    function setPinnedVehicleKey(key: string | undefined) {
        pinnedVehicleKey = key
    }
</script>

<section class="mt-12" aria-labelledby="vehicle-statistics-title">
    <h2 id="vehicle-statistics-title" class="mb-6 text-2xl font-bold text-gray-100">
        Vehicle Statistics
    </h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {#each breakdowns as breakdown (breakdown.id)}
            <CategoryBreakdownCard
                model={breakdown}
                hoveredCategoryKey={hoveredVehicleKey}
                onHoveredCategoryKeyChange={setHoveredVehicleKey}
                pinnedCategoryKey={pinnedVehicleKey}
                onPinnedCategoryKeyChange={setPinnedVehicleKey}
            />
        {/each}
    </div>
</section>
