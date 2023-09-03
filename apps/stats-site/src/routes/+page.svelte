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

<div class="mb-16 mt-6">
    <PlayerSearch />
</div>

<div class="mb-16 flex flex-wrap gap-10">
    <div>
        <span class="font-bold dark:text-gray-400">Players online</span>
        <h2 class="text-2xl font-black">{playersOnline}</h2>
        <A href="/servers">Browse Servers &nbsp; <Icon data={arrowRight} /></A>
    </div>

    <div>
        <span class="font-bold dark:text-gray-400">Twitch Streams</span>
        <h2 class="text-2xl font-black">{twitchStreams?.total}</h2>
        <A href="https://www.twitch.tv/warbrokers">
            Watch Live &nbsp; <Icon data={arrowRight} />
        </A>
    </div>
</div>
