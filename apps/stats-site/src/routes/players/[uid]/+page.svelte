<script lang="ts">
    import dayjs from "dayjs"
    import relativeTime from "dayjs/plugin/relativeTime"
    import utc from "dayjs/plugin/utc"
    import { Popover } from "flowbite-svelte"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import Stat from "$lib/components/stat.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { player, badges, xpPercentile, killsEloPercentile, gamesEloPercentile } = data

    function MongoDBObjectId2UnixTimestamp(s: string) {
        return parseInt(s.substring(0, 8), 16)
    }

    dayjs.extend(utc)
    dayjs.extend(relativeTime)
    const playingSince = dayjs.unix(MongoDBObjectId2UnixTimestamp(player.uid)).utc()
    const lastSeen = player.time === 0 ? undefined : dayjs.unix(player.time).utc()
</script>

<Title title="{player.squad && `[${player.squad}] `}{player.nick}" />

<div class="mb-10 flex w-full flex-col items-center justify-center">
    <h1 class="mx-auto mb-4 text-4xl font-black">
        {#if player.squad}
            <A href={resolve("/squads/[squadName]", { squadName: player.squad })}
                >[{player.squad}]</A
            >
        {/if}
        {player.nick}
    </h1>
    <A
        href={resolve("/[[a]]-vs-[[b]]", { a: player.uid })}
        class="text-xs font-black uppercase tracking-wider">vs</A
    >
</div>

<div class="mb-1 flex w-24">
    <span class="whitespace-nowrap font-bold dark:text-gray-400">Playing Since </span>
    &nbsp;
    <time class="whitespace-nowrap font-black" datetime={playingSince.toISOString()}>
        {playingSince.format("MMMM D, YYYY")}
    </time>
</div>

<div class="mb-6 flex w-24">
    <span class="whitespace-nowrap font-bold dark:text-gray-400">Last Seen </span>
    &nbsp;
    <time
        class="whitespace-nowrap font-black"
        datetime={lastSeen?.toISOString()}
        title={lastSeen?.format("MMMM D, YYYY")}
    >
        {lastSeen ? `${dayjs(lastSeen).toNow(true)} ago` : "Unknown"}
    </time>
</div>

<div>
    {#each badges as { id, date, imageURL, name } (id)}
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
