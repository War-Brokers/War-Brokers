<script lang="ts">
    import { Popover } from "flowbite-svelte"

    import A from "$lib/components/A.svelte"
    import Stat from "$lib/components/stat.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const {
        player,
        badges,
        playingSince,
        xpPercentile,
        killsEloPercentile,
        gamesEloPercentile,
    } = data
</script>

<Title title="{player.squad && `[${player.squad}] `}{player.nick}" />

<h1 class="mx-auto mb-10 text-4xl font-black">
    {#if player.squad}
        <A href="/squads/{player.squad}">[{player.squad}]</A>
    {/if}
    {player.nick}
</h1>

<div class="mb-5 flex w-24">
    <span class="whitespace-nowrap font-bold dark:text-gray-400">
        Playing Since
    </span>
    &nbsp;
    <span class="whitespace-nowrap font-black">
        {playingSince}
    </span>
</div>

<div>
    {#each badges as { id, date, imageURL, name }}
        <div {id} class="mb-10 inline-block">
            <img title={name} src={imageURL} alt={name} />
        </div>
        <Popover
            triggeredBy="#{id}"
            class="space-y-2 p-3 text-sm font-light dark:border-gray-600 dark:bg-gray-900"
            placement="top-start"
        >
            <div class="flex flex-col items-center justify-center">
                <span class="mb-1 font-medium text-gray-900 dark:text-white">
                    {name}
                </span>
                {date}
            </div>
        </Popover>
    {/each}
</div>

<div class="flex w-full flex-wrap gap-10">
    <Stat title="Level" data={player.level} />
    <Stat
        title="XP"
        data={player.xp.toLocaleString("en-US")}
        _id="xp-percentile"
        percentile={xpPercentile}
    />
    <Stat
        title="Kills Elo"
        data={player.killsELO.toFixed(2)}
        _id="kills-elo-percentile"
        percentile={killsEloPercentile}
    />
    <Stat
        title="Games Elo"
        data={player.gamesELO.toFixed(2)}
        _id="games-elo-percentile"
        percentile={gamesEloPercentile}
    />
</div>
