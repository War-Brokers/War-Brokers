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

    import LoadingRow from "./LoadingRow.svelte"
    import Row from "./Row.svelte"

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
    <h2 id={`${region}-servers`} class="mb-4 mt-8 text-2xl font-black">{region}</h2>

    <!-- Keyboard users need to focus this scroll region. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        class="h-80 overflow-auto border border-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:bg-gray-900"
        role="region"
        aria-label={`${region} servers`}
        tabindex="0"
    >
        <Table
            divClass="relative"
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
            <TableHead class="sticky top-0 z-10 dark:text-gray-300">
                <TableHeadCell>Server</TableHeadCell>
                <TableHeadCell>Team Mode</TableHeadCell>
                <TableHeadCell>Game Mode</TableHeadCell>
                <TableHeadCell>Map</TableHeadCell>
                <TableHeadCell>Players</TableHeadCell>
            </TableHead>
            {#if data[region]}
                {#await data[region]}
                    <TableBody
                        tableBodyClass="animate-pulse motion-reduce:animate-none"
                        aria-busy="true"
                        aria-label={`${region} servers`}
                    >
                        <LoadingRow />
                    </TableBody>
                {:then servers}
                    <TableBody>
                        {#if servers.length > 0}
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
                            <TableBodyRow class="dark:bg-gray-900">
                                <TableBodyCell colspan={5} class="h-20 text-center text-gray-400">
                                    <span role="status">No active servers in {region}.</span>
                                </TableBodyCell>
                            </TableBodyRow>
                        {/if}
                    </TableBody>
                {:catch _}
                    <TableBody>
                        <TableBodyRow>
                            <TableBodyCell
                                colspan={5}
                                class="h-20 text-center font-bold text-red-400"
                            >
                                <span role="status">Failed to load</span>
                            </TableBodyCell>
                        </TableBodyRow>
                    </TableBody>
                {/await}
            {:else}
                <TableBody
                    tableBodyClass="animate-pulse motion-reduce:animate-none"
                    aria-busy="true"
                    aria-label={`${region} servers`}
                >
                    <LoadingRow />
                </TableBody>
            {/if}
        </Table>
    </div>
{/each}
