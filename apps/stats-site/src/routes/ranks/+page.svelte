<script lang="ts">
    import Title from "$lib/components/title.svelte"
    import { rankNamesByPercentile, ranks } from "$lib/rank"
</script>

<Title title="Ranks" />

<div class="flex flex-wrap justify-center">
    {#each rankNamesByPercentile as rank (rank)}
        <div class="flex flex-col items-center rounded-xl p-7">
            <img width="256" height="256" src={ranks[rank].icon} alt="{rank} rank icon" />
            <h3 class="text-2xl font-black">{rank}</h3>
            <span class="text-lg font-medium dark:text-gray-400">
                better than <span class="font-black">
                    {ranks[rank].percentile}%
                </span> of the players!
            </span>
        </div>
    {/each}
</div>
