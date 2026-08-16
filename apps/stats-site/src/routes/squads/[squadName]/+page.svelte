<script lang="ts">
    import { resolve } from "$app/paths"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { members, squadName } = data
</script>

<Title title={`Squad ${squadName}`} />

<h2 class="w-full text-center text-3xl font-black">Squad {squadName}</h2>

<div class="mb-10 flex items-baseline gap-1">
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
