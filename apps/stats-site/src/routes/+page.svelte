<script lang="ts">
    import Icon from "svelte-awesome"
    import arrowRight from "svelte-awesome/icons/arrowRight"

    import img1 from "$lib/assets/2025-summer/1.avif"
    import img2 from "$lib/assets/2025-summer/2.avif"
    import img3 from "$lib/assets/2025-summer/3.avif"
    import img4 from "$lib/assets/2025-summer/4.avif"
    import A from "$lib/components/A.svelte"
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

<div class="mt-12">
    <h2 class="text-3xl font-black">Summer Speed Tournament this July!</h2>

    <span class="my-2 block">
        Join the <A href="https://discord.gg/HpKKUSYmAv">Discord server</A> and sign
        up now!
    </span>

    <img src={img1} class="mb-1" alt="banner" width="1452" height="817" />
    <img src={img2} class="mb-1" alt="format" width="1452" height="817" />
    <img src={img3} class="mb-1" alt="diagram" width="1452" height="817" />
    <img src={img4} class="mb-1" alt="dates" width="1452" height="817" />
</div>
