<script lang="ts">
    import { A } from "flowbite-svelte"
    import Icon from "svelte-awesome"
    import arrowRight from "svelte-awesome/icons/arrowRight"

    import PlayerSearch from "$lib/components/PlayerSearch.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { playersOnline, twitchStreams } = data
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
        <A href="/servers" class="dark:text-orange-500">
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
        <A href="https://www.twitch.tv/warbrokers" class="dark:text-orange-500">
            Watch Live &nbsp; <Icon data={arrowRight} />
        </A>
    </div>
</div>
