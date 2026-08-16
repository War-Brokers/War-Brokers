<script lang="ts">
    import SiDiscord from "@icons-pack/svelte-simple-icons/icons/SiDiscord"

    import { resolve } from "$app/paths"
    import Title from "$lib/components/title.svelte"
    import LPEmblem from "$lib/img/squads/LP.png"

    import type { PageData } from "./$types"

    export let data: PageData
    const { members, serverMembersCount } = data
</script>

<Title title="Llama's Pyjamas" />

<img src={LPEmblem} width="112" height="112" class="mx-auto" alt="LP squad emblem" />
<h2 class="mb-4 w-full text-center text-3xl font-black">LP - Llama's Pyjamas</h2>
<a
    href="https://discord.gg/2fsar34APa"
    class="mx-auto flex w-fit items-center justify-center underline-offset-4 hover:underline"
>
    <SiDiscord class="size-9 shrink-0 p-2" aria-hidden="true" />
    Discord (<span><b>{serverMembersCount}</b> members</span>)
</a>

<div class="mb-4 flex items-baseline gap-1">
    <span class="text-xl font-bold">{members.length}</span> members
</div>

<div class="flex flex-col gap-4">
    {#each members as player (player.uid)}
        <a href={resolve("/players/[uid]", { uid: player.uid })}>
            <div class="flex flex-col rounded-lg bg-gray-700 p-4">
                <span class="mb-4 text-xl font-bold">{player.nick}</span>

                <div class="flex flex-row gap-4">Stats (WIP)</div>
            </div>
        </a>
    {/each}
</div>
