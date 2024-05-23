<script lang="ts">
    import DiscordIcon from "flowbite-svelte-icons/DiscordSolid.svelte"

    import Title from "$lib/components/title.svelte"
    import SquadEmblem from "$lib/img/squads/HF.png"

    import type { PageData } from "./$types"

    const title = "HF"

    export let data: PageData
    const { members, serverMembersCount } = data
</script>

<Title {title} />

<img src={SquadEmblem} class="mx-auto w-28" alt="LP squad emblem" />
<h2 class="mb-4 w-full text-center text-3xl font-black">
    Squad {title}
</h2>
<a
    href="https://discord.gg/nZhsAWttge"
    class="mx-auto flex w-fit items-center justify-center gap-1 underline-offset-4 hover:underline"
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
