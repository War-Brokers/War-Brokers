<script lang="ts">
    import { type Region, regionSchema } from "@warbrokers/types/src/region"
    import { onMount } from "svelte"

    import DataTable from "$lib/components/data-table/data-table.svelte"
    import Title from "$lib/components/title.svelte"
    import trpc from "$lib/trpc"

    import { serverColumns } from "./columns"
    import type { Server, Servers } from "./types"

    const regions: Region[] = regionSchema.options
        .map((item) => item.value)
        .filter((item) => !item.includes("TEST"))
        .filter((item) => !item.includes("CLAN"))

    const data: Partial<Record<Region, Promise<Servers>>> = {}

    const getServerRowId = (server: Server) => server.name

    function loadRegion(region: Region) {
        data[region] = trpc.status.serverList.query({ region })
    }

    onMount(() => {
        for (const region of regions) {
            loadRegion(region)
        }
    })
</script>

<Title title="Server Browser" />

{#each regions as region (region)}
    {@const tableProps = {
        ariaLabel: `${region} servers`,
        caption: `${region} servers`,
        columns: serverColumns,
        emptyMessage: `No active servers in ${region}.`,
        getRowId: getServerRowId,
        initialSorting: [{ id: "name", desc: false }],
        containerClass: "h-80",
        tableClass: "min-w-[56rem]",
        loadingRowCount: 1,
    }}
    <h2 id={`${region}-servers`} class="mt-8 mb-4 text-2xl font-black">{region}</h2>

    {#if data[region]}
        {#await data[region]}
            <DataTable {...tableProps} state="loading" />
        {:then servers}
            <DataTable {...tableProps} data={servers} />
        {:catch _}
            <DataTable {...tableProps} state="error" />
        {/await}
    {:else}
        <DataTable {...tableProps} state="loading" />
    {/if}
{/each}
