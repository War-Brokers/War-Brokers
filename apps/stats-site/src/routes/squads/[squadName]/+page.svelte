<script lang="ts">
    import SiDiscord from "@icons-pack/svelte-simple-icons/icons/SiDiscord"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { discordInviteCode, members, serverMembersCount, squadName } = data
</script>

<Title title={`Squad ${squadName}`} />

<h2 class="w-full text-center text-3xl font-black">Squad {squadName}</h2>

{#if discordInviteCode}
    <A
        class="mx-auto mb-10 flex items-center justify-center text-gray-100 hover:text-gray-100"
        href={`https://discord.gg/${discordInviteCode}`}
        external
    >
        <SiDiscord class="size-9 shrink-0 p-2" aria-hidden="true" />
        Discord (<span><b>{serverMembersCount}</b> members</span>)
    </A>
{/if}

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
