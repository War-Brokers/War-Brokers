<script lang="ts">
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import Stat from "./stat.svelte"

    export let data: PageData
    const {
        player,
        timestamp,
        xpPercentile,
        killsEloPercentile,
        gamesEloPercentile,
    } = data
</script>

<Title title="{player.squad && `[${player.squad}] `}{player.nick}" />

<h1 class="mx-auto mb-10 text-4xl font-black">
    {#if player.squad}
        <a href="/squads/{player.squad}" class="hover:dark:underline">
            [{player.squad}]
        </a>
    {/if}
    {player.nick}
</h1>

<div class="mb-10 flex w-24">
    <span class="whitespace-nowrap font-bold dark:text-gray-400">
        Playing Since
    </span>
    &nbsp;
    <span class="whitespace-nowrap font-black">
        {timestamp}
    </span>
</div>

<div class="flex w-full flex-wrap gap-10">
    <Stat title="Level" data={player.level} />
    <Stat
        title="XP"
        data={player.xp}
        _id="xp-percentile"
        percentile={xpPercentile}
    />
    <Stat
        title="Kills Elo"
        data={player.killsELO}
        _id="kills-elo-percentile"
        percentile={killsEloPercentile}
    />
    <Stat
        title="Games Elo"
        data={player.gamesELO}
        _id="games-elo-percentile"
        percentile={gamesEloPercentile}
    />
</div>
