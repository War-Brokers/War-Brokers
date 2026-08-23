<script lang="ts">
    import Icon from "svelte-awesome"
    import arrowRight from "svelte-awesome/icons/arrowRight"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import Distribution from "$lib/components/Distribution/Distribution.svelte"
    import PlayerSearch from "$lib/components/PlayerSearch.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import Metric from "./Metric.svelte"

    export let data: PageData
    const {
        distribution,
        playerCount: _playerCount,
        playersOnline,
        twitchStreams: _twitchStreams,
    } = data
    const distributionUpdatedAt = distribution.then((value) => value.updatedAt)
    const distributionCacheUpdateIntervalHours = distribution.then(
        (value) => value.cacheUpdateIntervalHours,
    )
    const playerCount = _playerCount.then((value) => value.toLocaleString("en-US"))
    const twitchStreams = _twitchStreams.then((value) => value.total)

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
    <PlayerSearch resolvedResultHref={(uid: string) => resolve("/players/[uid]", { uid })} />
</div>

<div class="flex flex-wrap gap-10">
    <Metric label="Players online" value={playersOnline}>
        <A href={resolve("/servers")}>
            Browse Servers &nbsp; <Icon data={arrowRight} aria-hidden="true" />
        </A>
    </Metric>

    <Metric label="Twitch streams" value={twitchStreams}>
        <A href="https://www.twitch.tv/directory/category/war-brokers" external>
            Watch Live &nbsp; <Icon data={arrowRight} aria-hidden="true" />
        </A>
    </Metric>
</div>

<section class="mt-12" aria-labelledby="distribution-title">
    <h2 id="distribution-title" class="mb-6 text-2xl font-bold text-gray-100">Global Statistics</h2>
    <p class="sr-only" role="status" aria-atomic="true">
        {#await distribution catch _}
            Global statistics failed to load.
        {/await}
    </p>

    <div class="mb-6">
        <Metric label="Players tracked" value={playerCount} />
    </div>

    <div class="grid gap-6">
        {#each charts as chart (chart.statistic)}
            <Distribution
                id={`distribution-${chart.statistic}`}
                title={chart.title}
                data={distribution.then((value) => value[chart.statistic])}
                updatedAt={distributionUpdatedAt}
                cacheUpdateIntervalHours={distributionCacheUpdateIntervalHours}
                compactTooltip={chart.statistic === "xp"}
            />
        {/each}
    </div>
</section>
