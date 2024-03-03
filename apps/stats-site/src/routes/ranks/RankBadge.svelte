<script lang="ts">
    import { type Rank, rank2iconMap, rank2percentileMap } from "$lib/rank"

    export let rank: Rank
</script>

<div class="flex flex-col items-center rounded-xl p-8">
    <img src={rank2iconMap[rank]} alt="{rank} rank icon" />
    <h3 class="text-2xl font-black">{rank}</h3>
    <span class="text-lg font-medium dark:text-gray-400">
        better than <span class="font-black">
            {rank2percentileMap[rank]}%
        </span> of the players!
    </span>
</div>
