<script lang="ts">
    import SiDiscord from "@icons-pack/svelte-simple-icons/icons/SiDiscord"

    import A from "$lib/components/A.svelte"
    import DataTable from "$lib/components/data-table/data-table.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import { memberColumns } from "./columns"

    type Member = Awaited<PageData["members"]>[number]

    export let data: PageData
    const { discordInviteCode, members, serverMembersCount, squadName } = data

    const memberTableProps = {
        ariaLabel: `${squadName} members`,
        caption: `${squadName} members`,
        columns: memberColumns,
        emptyMessage: "No members are available.",
        getRowId: (member: Member) => member.uid,
        initialSorting: [{ id: "nick", desc: false }],
        loadingRowCount: 5,
        tableClass: "min-w-[42rem]",
    }
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
        Discord (
        {#if serverMembersCount}
            {#await serverMembersCount}
                <span class="skeleton-reveal inline-flex items-baseline gap-1" aria-busy="true">
                    <span
                        class="inline-block h-5 w-12 animate-pulse rounded bg-gray-600 motion-reduce:animate-none"
                        aria-hidden="true"
                    ></span>
                    members
                </span>
            {:then count}
                <span><b>{count}</b> members</span>
            {:catch _}
                <span class="font-bold text-red-400" role="status">Failed to load</span>
            {/await}
        {:else}
            <span>members</span>
        {/if})
    </A>
{/if}

{#await members}
    <div class="mb-10 flex items-baseline gap-1" aria-hidden="true">
        <span class="h-7 w-8 rounded bg-gray-600"></span> members
    </div>
{:then members}
    <div class="mb-10 flex items-baseline gap-1">
        <span class="text-xl font-bold">{members.length}</span> members
    </div>
{/await}

{#await members}
    <DataTable {...memberTableProps} state="loading" />
{:then members}
    <DataTable {...memberTableProps} data={members} />
{:catch _}
    <DataTable {...memberTableProps} state="error" />
{/await}
