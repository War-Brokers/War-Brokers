<script lang="ts">
    import {
        type Response,
        serverList,
    } from "@warbrokers/fetch/src/status/serverList"
    import {
        type Location as Region,
        LocationSchema as RegionSchema,
    } from "@warbrokers/types/src/location"
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte"
    import { onMount } from "svelte"

    import Title from "$lib/components/title.svelte"

    import Row from "./Row.svelte"

    const regions: Region[] = RegionSchema._def.options
        .map((item) => item.value)
        .filter((item) => !item.includes("TEST"))
        .filter((item) => !item.includes("CLAN"))

    const data: Partial<Record<Region, Response>> = {}

    onMount(async () => {
        for (const region of regions) {
            const res = await serverList(region)
            if (!res.success) continue // todo: handle error case

            data[region] = res.data
        }
    })
</script>

<Title title="Server Browser" />

{#each regions as region (region)}
    <h2 class="mb-4 mt-8 text-2xl font-black">{region}</h2>

    <Table>
        <TableHead>
            <TableHeadCell>Server</TableHeadCell>
            <TableHeadCell>Game Mode</TableHeadCell>
            <TableHeadCell>Map</TableHeadCell>
            <TableHeadCell>Time Left</TableHeadCell>
            <TableHeadCell>Players</TableHeadCell>
        </TableHead>
        <TableBody>
            {#await data[region]}
                <TableBodyRow>
                    <TableBodyCell>Loading...</TableBodyCell>
                    <TableBodyCell>Loading...</TableBodyCell>
                    <TableBodyCell>Loading...</TableBodyCell>
                    <TableBodyCell>Loading...</TableBodyCell>
                    <TableBodyCell>Loading...</TableBodyCell>
                </TableBodyRow>
            {:then servers}
                {#if servers}
                    {#each servers as { playerCount, maxPlayers }, i (i)}
                        <Row
                            name={`${region}_${i}`}
                            {playerCount}
                            {maxPlayers}
                        />
                    {/each}
                {/if}
            {/await}
        </TableBody>
    </Table>
{/each}
