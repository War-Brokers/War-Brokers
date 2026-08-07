<script lang="ts">
    import { type Region, regionSchema } from "@warbrokers/types/src/region"
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
    import trpc from "$lib/trpc"

    import Row from "./Row.svelte"

    const regions: Region[] = regionSchema.options
        .map((item) => item.value)
        .filter((item) => !item.includes("TEST"))
        .filter((item) => !item.includes("CLAN"))

    type Servers = Awaited<ReturnType<typeof trpc.status.serverList.query>>
    const data: Partial<Record<Region, Promise<Servers>>> = {}

    onMount(() => {
        for (const region of regions) {
            data[region] = trpc.status.serverList.query({ region })
        }
    })
</script>

<Title title="Server Browser" />

{#each regions as region (region)}
    <h2 id={`${region}-servers`} class="mb-4 mt-8 text-2xl font-black">{region}</h2>

    <Table
        class="min-w-[56rem] table-fixed whitespace-nowrap"
        aria-labelledby={`${region}-servers`}
    >
        <colgroup>
            <col class="w-[20%]" />
            <col class="w-[10%]" />
            <col class="w-[30%]" />
            <col class="w-[30%]" />
            <col class="w-[10%]" />
        </colgroup>
        <TableHead>
            <TableHeadCell>Server</TableHeadCell>
            <TableHeadCell>Team Mode</TableHeadCell>
            <TableHeadCell>Game Mode</TableHeadCell>
            <TableHeadCell>Map</TableHeadCell>
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
                {#if servers?.length}
                    {#each servers as server (server.name)}
                        <Row
                            serverName={server.name}
                            gameMode={server.gameMode}
                            isTeams={server.isTeams}
                            map={server.map}
                            playerCount={server.playerCount}
                            maxPlayers={server.maxPlayers}
                        />
                    {/each}
                {:else}
                    <TableBodyRow>
                        <TableBodyCell>-</TableBodyCell>
                        <TableBodyCell>-</TableBodyCell>
                        <TableBodyCell>-</TableBodyCell>
                        <TableBodyCell>-</TableBodyCell>
                        <TableBodyCell>-</TableBodyCell>
                    </TableBodyRow>
                {/if}
            {:catch _}
                <TableBodyRow>
                    <TableBodyCell><span class="text-red-600">ERROR</span></TableBodyCell>
                    <TableBodyCell>-</TableBodyCell>
                    <TableBodyCell>-</TableBodyCell>
                    <TableBodyCell>-</TableBodyCell>
                    <TableBodyCell>-</TableBodyCell>
                </TableBodyRow>
            {/await}
        </TableBody>
    </Table>
{/each}
