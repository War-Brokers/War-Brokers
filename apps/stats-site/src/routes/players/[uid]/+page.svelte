<script lang="ts">
    import dayjs from "dayjs"
    import relativeTime from "dayjs/plugin/relativeTime"
    import utc from "dayjs/plugin/utc"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import Stat from "$lib/components/stat.svelte"
    import Title from "$lib/components/title.svelte"
    import * as Popover from "$lib/components/ui/popover"

    import type { PageData } from "./$types"
    import GameModeCharts from "./charts/GameModeCharts.svelte"
    import VehicleCharts from "./charts/VehicleCharts.svelte"
    import WeaponCharts from "./charts/WeaponCharts.svelte"

    const { data }: { data: PageData } = $props()
    const {
        player,
        badges,
        totalKills,
        totalDeaths,
        xpPercentile,
        killsEloPercentile,
        gamesEloPercentile,
    } = data

    function MongoDBObjectId2UnixTimestamp(s: string) {
        return parseInt(s.substring(0, 8), 16)
    }

    dayjs.extend(utc)
    dayjs.extend(relativeTime)
    const playingSince = dayjs.unix(MongoDBObjectId2UnixTimestamp(player.uid)).utc()
    const lastSeen = player.time === 0 ? undefined : dayjs.unix(player.time).utc()
    const absoluteTimeFormatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
    })
    const localTimeZone = absoluteTimeFormatter.resolvedOptions().timeZone
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
        class="text-xs font-black tracking-wider uppercase">vs</A
    >
</div>

<div class="mb-1 flex w-24">
    <span class="font-bold whitespace-nowrap dark:text-gray-400">Playing Since </span>
    &nbsp;
    <Popover.Root>
        <Popover.Trigger
            type="button"
            openOnHover
            openDelay={0}
            closeDelay={0}
            class="rounded-sm font-black whitespace-nowrap underline decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
            <time datetime={playingSince.toISOString()}>
                {playingSince.format("MMMM D, YYYY")}
            </time>
        </Popover.Trigger>
        <Popover.Content
            side="top"
            align="center"
            collisionPadding={16}
            trapFocus={false}
            aria-label="Playing since local date and time"
            class="w-auto p-3 font-light whitespace-nowrap"
            onOpenAutoFocus={(event: Event) => {
                event.preventDefault()
            }}
        >
            <time datetime={playingSince.toISOString()}>
                {absoluteTimeFormatter.format(playingSince.toDate())} (Time zone: {localTimeZone})
            </time>
        </Popover.Content>
    </Popover.Root>
</div>

<div class="flex w-24" class:mb-1={player.steam} class:mb-6={!player.steam}>
    <span class="font-bold whitespace-nowrap dark:text-gray-400">Last Seen </span>
    &nbsp;
    {#if lastSeen}
        <Popover.Root>
            <Popover.Trigger
                type="button"
                openOnHover
                openDelay={0}
                closeDelay={0}
                class="rounded-sm font-black whitespace-nowrap underline decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            >
                <time datetime={lastSeen.toISOString()}>
                    {lastSeen.fromNow()}
                </time>
            </Popover.Trigger>
            <Popover.Content
                side="top"
                align="center"
                collisionPadding={16}
                trapFocus={false}
                aria-label="Last seen local date and time"
                class="w-auto p-3 font-light whitespace-nowrap"
                onOpenAutoFocus={(event: Event) => {
                    event.preventDefault()
                }}
            >
                <time datetime={lastSeen.toISOString()}>
                    {absoluteTimeFormatter.format(lastSeen.toDate())} (Time zone: {localTimeZone})
                </time>
            </Popover.Content>
        </Popover.Root>
    {:else}
        <span class="font-black whitespace-nowrap">Unknown</span>
    {/if}
</div>

{#if player.steam}
    <div class="mb-6 w-24 font-black whitespace-nowrap text-amber-400">STEAM USER</div>
{/if}

<div>
    {#each badges as { id, date, imageURL, name } (id)}
        <Popover.Root>
            <Popover.Trigger
                {id}
                type="button"
                openOnHover
                openDelay={150}
                closeDelay={100}
                class="mb-10 inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            >
                <img src={imageURL} alt="" />
                <span class="sr-only">Show details for the {name} badge</span>
            </Popover.Trigger>
            <Popover.Content
                side="top"
                align="start"
                collisionPadding={16}
                trapFocus={false}
                aria-label="{name} badge details"
                class="w-auto p-3 font-light"
                onOpenAutoFocus={(event: Event) => {
                    event.preventDefault()
                }}
            >
                <div class="flex flex-col items-center justify-center">
                    <span class="mb-1 font-medium text-white">
                        {name}
                    </span>
                    {date}
                </div>
            </Popover.Content>
        </Popover.Root>
    {/each}
</div>

<div class="flex w-full flex-wrap gap-10">
    <Stat title="Level" data={player.level} />
    <Stat
        title="XP"
        data={player.xp.toLocaleString("en-US")}
        _id="xp-percentile"
        percentile={xpPercentile}
        popoverSideOffset={48}
    />
    <Stat
        title="Kills Elo"
        data={player.killsELO.toFixed(2)}
        _id="kills-elo-percentile"
        percentile={killsEloPercentile}
        popoverSideOffset={48}
    />
    <Stat
        title="Games Elo"
        data={player.gamesELO.toFixed(2)}
        _id="games-elo-percentile"
        percentile={gamesEloPercentile}
        popoverSideOffset={48}
    />
    <Stat title="Total Kills" data={totalKills.toLocaleString("en-US")} />
    <Stat title="Total Deaths" data={totalDeaths.toLocaleString("en-US")} />
    <Stat title="KDR" data={(totalKills / totalDeaths).toFixed(2)} />
</div>

<GameModeCharts {player} />
<WeaponCharts {player} />
<VehicleCharts {player} />
