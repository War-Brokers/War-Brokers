<script lang="ts">
    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import { SortHeader } from "$lib/components/data-table"
    import Title from "$lib/components/title.svelte"
    import * as Table from "$lib/components/ui/table"

    import type { PageData } from "./$types"

    type Squad = Awaited<PageData["squads"]>[number]
    type SortColumn = "name" | "members"
    type SortDirection = "asc" | "desc"

    export let data: PageData
    const { squads } = data

    let searchTerm = ""
    let sortColumn: SortColumn = "name"
    let sortDirection: SortDirection = "asc"

    const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" })

    function toggleSort(column: SortColumn) {
        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc"
            return
        }

        sortColumn = column
        sortDirection = "asc"
    }

    function getAriaSort(column: SortColumn) {
        if (sortColumn !== column) return undefined

        return sortDirection === "asc" ? "ascending" : "descending"
    }

    function sortSquads(squads: Squad[]) {
        const query = searchTerm.toLocaleLowerCase()
        const filteredSquads = squads.filter((squad) =>
            squad.squad.toLocaleLowerCase().includes(query),
        )

        return filteredSquads.toSorted((squadA, squadB) => {
            const comparison =
                sortColumn === "name"
                    ? collator.compare(squadA.squad, squadB.squad)
                    : squadA.memberCount - squadB.memberCount

            if (comparison !== 0) return sortDirection === "asc" ? comparison : -comparison

            return collator.compare(squadA.squad, squadB.squad)
        })
    }
</script>

<Title title="Squads" />

<h2 class="mb-10 w-full text-center text-3xl font-black">Squads</h2>

<form
    class="mb-4 flex flex-wrap items-end gap-3"
    onsubmit={(event) => {
        event.preventDefault()
    }}
>
    <div class="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-sm">
        <label for="squad-search" class="text-sm font-bold text-gray-300">Filter squads</label>
        <input
            id="squad-search"
            name="search"
            type="search"
            maxlength="20"
            autocomplete="off"
            spellcheck="false"
            bind:value={searchTerm}
            class="h-10 min-w-0 rounded-lg border border-gray-600 bg-gray-600 px-3 text-base leading-6 text-gray-100 placeholder:text-gray-300 focus-visible:border-orange-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-400"
            placeholder="Squad Name"
        />
    </div>
</form>

<div class="rounded-lg border border-gray-700 bg-gray-900">
    <Table.Root class="min-w-96">
        <Table.Caption class="sr-only">Squad list</Table.Caption>
        <colgroup>
            <col class="w-[90%]" />
            <col class="w-[10%]" />
        </colgroup>
        <Table.Header class="bg-gray-700">
            <Table.Row>
                <Table.Head scope="col" aria-sort={getAriaSort("name")}>
                    <SortHeader
                        label="Name"
                        getSort={() => (sortColumn === "name" ? sortDirection : false)}
                        ontoggle={() => {
                            toggleSort("name")
                        }}
                    />
                </Table.Head>
                <Table.Head scope="col" class="text-end" aria-sort={getAriaSort("members")}>
                    <SortHeader
                        label="Members"
                        align="end"
                        getSort={() => (sortColumn === "members" ? sortDirection : false)}
                        ontoggle={() => {
                            toggleSort("members")
                        }}
                    />
                </Table.Head>
            </Table.Row>
        </Table.Header>

        {#await squads}
            <Table.Body class="animate-pulse motion-reduce:animate-none" aria-busy="true">
                {#each { length: 5 } as _, index (index)}
                    <Table.Row class="skeleton-reveal bg-gray-900" aria-hidden="true">
                        <Table.Cell><div class="h-5 w-20 rounded bg-gray-600"></div></Table.Cell>
                        <Table.Cell class="text-end">
                            <div class="ms-auto h-5 w-12 rounded bg-gray-600"></div>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        {:then squads}
            {#key `${searchTerm}-${sortColumn}-${sortDirection}`}
                {@const sortedSquads = sortSquads(squads)}
                <Table.Body>
                    {#if squads.length === 0}
                        <Table.Row>
                            <Table.Cell colspan={2} class="h-24 text-center text-gray-400">
                                <span role="status">No squads are available.</span>
                            </Table.Cell>
                        </Table.Row>
                    {:else if sortedSquads.length === 0}
                        <Table.Row>
                            <Table.Cell colspan={2} class="h-24 text-center text-gray-400">
                                <span role="status">No squads match “{searchTerm}”.</span>
                            </Table.Cell>
                        </Table.Row>
                    {:else}
                        {#each sortedSquads as squad (squad.squad)}
                            <Table.Row>
                                <Table.Cell>
                                    <A
                                        href={resolve("/squads/[squadName]", {
                                            squadName: squad.squad,
                                        })}
                                        class="font-bold">{squad.squad}</A
                                    >
                                </Table.Cell>
                                <Table.Cell class="text-end font-bold tabular-nums">
                                    {squad.memberCount.toLocaleString("en-US")}
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            {/key}
        {:catch _}
            <Table.Body>
                <Table.Row>
                    <Table.Cell colspan={2} class="h-24 text-center font-bold text-red-400">
                        <span role="status">Failed to load</span>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        {/await}
    </Table.Root>
</div>

<style lang="postcss">
    /* https://stackoverflow.com/a/9422689 */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }
</style>
