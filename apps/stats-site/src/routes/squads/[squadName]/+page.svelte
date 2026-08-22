<script lang="ts">
    import DataTable from "$lib/components/data-table/data-table.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import { memberColumns } from "./columns"
    import APG from "./customSquadHeaders/APG.svelte"
    import CAESAR from "./customSquadHeaders/CAESAR.svelte"
    import SquadHeader from "./SquadHeader.svelte"

    const { data }: { data: PageData } = $props()
    const { squadName, squadConfig } = data

    const memberTableProps = $derived({
        ariaLabel: `${squadName} members`,
        caption: `${squadName} members`,
        columns: memberColumns,
        emptyMessage: "No members are available.",
        getRowId: (member: Awaited<PageData["members"]>[number]) => member.uid,
        initialSorting: [{ id: "nick", desc: false }],
        tableClass: "min-w-[42rem]",
    })
</script>

<Title title={squadConfig?.fullName ? `${squadName} - ${squadConfig.fullName}` : squadName} />

{#if squadName === "APG"}
    <APG {...data} />
{:else if squadName === "CAESAR"}
    <CAESAR {...data} />
{:else}
    <SquadHeader {...data} />
{/if}

{#await data.members}
    <div class="mb-4 flex items-baseline gap-1" aria-hidden="true">
        <span class="h-7 w-8 rounded bg-gray-600"></span> members
    </div>
{:then members}
    <div class="mb-4 flex items-baseline gap-1">
        <span class="text-xl font-bold">{members.length}</span> members
    </div>
{:catch _}
    <div class="mb-4 flex items-baseline gap-1">
        <span class="font-bold text-red-400" role="status">Failed to load</span>
    </div>
{/await}

{#await data.members}
    <DataTable {...memberTableProps} state="loading" loadingRowCount={1} />
{:then members}
    <DataTable {...memberTableProps} data={members} />
{:catch _}
    <DataTable {...memberTableProps} state="error" />
{/await}
