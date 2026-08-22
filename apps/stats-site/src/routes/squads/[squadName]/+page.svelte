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
        getRowId: (member: PageData["members"][number]) => member.uid,
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

<div class="mb-4 flex items-baseline gap-1">
    <span class="text-xl font-bold">{data.members.length}</span> members
</div>

<DataTable {...memberTableProps} data={data.members} />
