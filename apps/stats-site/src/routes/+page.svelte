<script lang="ts">
    import Icon from "svelte-awesome"
    import arrowRight from "svelte-awesome/icons/arrowRight"

    import A from "$lib/components/A.svelte"
    import Distribution from "$lib/components/Distribution.svelte"
    import PlayerSearch from "$lib/components/PlayerSearch.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { distribution, playerCount, playersOnline, twitchStreams } = data
    const distributionUpdatedAt = distribution.then((value) => value.updatedAt)
    const distributionCacheUpdateIntervalHours = distribution.then(
        (value) => value.cacheUpdateIntervalHours,
    )

    const charts = [
        {
            statistic: "gamesElo",
            title: "Games Elo",
            unit: "Elo",
        },
        {
            statistic: "killsElo",
            title: "Kills Elo",
            unit: "Elo",
        },
        {
            statistic: "level",
            title: "Level",
            unit: "levels",
        },
        {
            statistic: "xp",
            title: "XP",
            unit: "XP",
        },
    ] as const
</script>

<Title title="Home" />

<div class="mb-4 flex w-full justify-center">
    <PlayerSearch />
</div>

<div class="flex flex-wrap gap-10">
    <div>
        <span class="font-bold dark:text-gray-400">Players online</span>
        <h2 class="text-2xl font-black">
            {#await playersOnline}
                ...
            {:then playersOnline}
                {playersOnline}
            {:catch _}
                <span class="dark:text-red-600">ERROR</span>
            {/await}
        </h2>
        <A href="/servers">
            Browse Servers &nbsp; <Icon data={arrowRight} />
        </A>
    </div>

    <div>
        <span class="font-bold dark:text-gray-400">Twitch streams</span>
        <h2 class="text-2xl font-black">
            {#await twitchStreams}
                ...
            {:then { total }}
                {total}
            {:catch _}
                <span class="dark:text-red-600">ERROR</span>
            {/await}
        </h2>
        <A href="https://www.twitch.tv/warbrokers">
            Watch Live &nbsp; <Icon data={arrowRight} />
        </A>
    </div>
</div>

<section class="mt-12" aria-labelledby="distribution-title">
    <h2 id="distribution-title" class="mb-6 text-2xl font-bold text-gray-100">Global Statistics</h2>

    <div class="mb-6">
        <span class="font-bold dark:text-gray-400">Players tracked</span>
        <h2 class="text-2xl font-black">
            {#await playerCount}
                ...
            {:then playerCount}
                {playerCount.toLocaleString("en-US")}
            {:catch _}
                <span class="dark:text-red-600">ERROR</span>
            {/await}
        </h2>
    </div>

    <div class="grid gap-6">
        {#each charts as chart}
            <Distribution
                id={`distribution-${chart.statistic}`}
                title={chart.title}
                data={distribution.then((value) => value[chart.statistic])}
                updatedAt={distributionUpdatedAt}
                cacheUpdateIntervalHours={distributionCacheUpdateIntervalHours}
                countLabel="Players"
                compactTooltip={chart.statistic === "xp"}
            />
        {/each}
    </div>
</section>
