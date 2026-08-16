<script lang="ts">
    import { type Region, regionSchema } from "@warbrokers/types/src/region"
    import { onMount } from "svelte"

    import Title from "$lib/components/title.svelte"
    import trpc from "$lib/trpc"

    import DataTable from "./DataTable.svelte"

    const regions: Region[] = regionSchema.options
        .map((item) => item.value)
        .filter((item) => !item.includes("TEST"))
        .filter((item) => !item.includes("CLAN"))

    type Servers = Awaited<ReturnType<typeof trpc.status.serverList.query>>
    const data: Partial<Record<Region, Promise<Servers>>> = {}

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
    <h2 id={`${region}-servers`} class="mt-8 mb-4 text-2xl font-black">{region}</h2>

    {#if data[region]}
        {#await data[region]}
            <DataTable {region} state="loading" />
        {:then servers}
            <DataTable data={servers} {region} />
        {:catch _}
            <DataTable {region} state="error" />
        {/await}
    {:else}
        <DataTable {region} state="loading" />
    {/if}
{/each}
