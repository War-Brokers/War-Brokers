<script lang="ts">
    import Title from "$lib/components/title.svelte"
    import { rankNamesByPercentile, ranks } from "$lib/rank"
</script>

<Title title="Ranks" />

<div class="flex flex-row-reverse flex-wrap-reverse justify-center">
    {#each rankNamesByPercentile.toReversed() as rank (rank)}
        <div class="flex w-full flex-col items-center p-7 md:w-1/2 lg:w-1/3">
            <img width="256" height="256" src={ranks[rank].icon} alt="{rank} rank icon" />
            <h3 class="text-2xl font-bold">{rank}</h3>
            <span class="text-center text-gray-400">
                better than <span class="font-extrabold">
                    {ranks[rank].percentile}%
                </span> of the players
            </span>
        </div>
    {/each}
</div>
