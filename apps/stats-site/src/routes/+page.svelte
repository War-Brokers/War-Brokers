<script lang="ts">
    import PlayerSearch from "$lib/components/PlayerSearch.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { playersOnline, playerCount, twitchStreams } = data
</script>

<Title title="Home" />

<PlayerSearch />

<div class="flex flex-wrap gap-10">
    <div>
        <span class="font-bold dark:text-gray-400">Total Players</span>
        <h2 class="text-2xl font-black">
            {playerCount?.toLocaleString("en-US")}
        </h2>
    </div>

    <div>
        <span class="font-bold dark:text-gray-400">Players online</span>
        <h2 class="text-2xl font-black">{playersOnline}</h2>
    </div>

    <div>
        <span class="font-bold dark:text-gray-400">Twitch Streams</span>
        <h2 class="text-2xl font-black">{twitchStreams?.total}</h2>
    </div>
</div>
