<script lang="ts">
    import DiscordIcon from "flowbite-svelte-icons/DiscordSolid.svelte"

    import Title from "$lib/components/title.svelte"
    import LPEmblem from "$lib/img/squads/LP.png"

    import type { PageData } from "./$types"

    export let data: PageData
    const { members, serverMembersCount } = data
</script>

<Title title="Llama's Pyjamas" />

<img src={LPEmblem} class="mx-auto w-28" alt="LP squad emblem" />
<h2 class="mb-4 w-full text-center text-3xl font-black">
    LP - Llama's Pyjamas
</h2>
<a
    href="https://discord.gg/2fsar34APa"
    class="mx-auto flex w-fit items-center justify-center underline-offset-4 hover:underline"
>
    <DiscordIcon class="inline-block w-9" />
    Discord (<span><b>{serverMembersCount}</b> members</span>)
</a>

<div class="mb-4 flex items-baseline gap-1">
    <span class="text-xl font-bold">{members.length}</span> members
</div>

<div class="flex flex-col gap-4">
    {#each members as player (player.uid)}
        <a href="/players/{player.uid}">
            <div class="flex flex-col rounded-lg bg-slate-700 p-4">
                <span class="mb-4 text-xl font-bold">{player.nick}</span>

                <div class="felx flex-row gap-4">Stats (WIP)</div>
            </div>
        </a>
    {/each}
</div>
