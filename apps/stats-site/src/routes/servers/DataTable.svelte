<script lang="ts">
    import { createTable, type SortingState } from "@tanstack/svelte-table"
    import type { Region } from "@warbrokers/types/src/region"

    import * as Table from "$lib/components/ui/table"

    import { getServerSortValue, serverColumns, serverTableFeatures } from "./columns"
    import LoadingRow from "./LoadingRow.svelte"
    import Row from "./Row.svelte"
    import SortHeader from "./SortHeader.svelte"
    import type { Servers } from "./types"

    const {
        data = [],
        region,
        state: loadState = "loaded",
    }: {
        data?: Servers
        region: Region
        state?: "error" | "loaded" | "loading"
    } = $props()

    const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" })
    let sorting = $state<SortingState>([{ id: "name", desc: false }])
    const sortedData = $derived.by(() => {
        if (sorting.length === 0) return data

        return data.toSorted((serverA, serverB) => {
            for (const sort of sorting) {
                const valueA = getServerSortValue(serverA, sort.id)
                const valueB = getServerSortValue(serverB, sort.id)
                const comparison =
                    typeof valueA === "number" && typeof valueB === "number"
                        ? valueA - valueB
                        : collator.compare(String(valueA), String(valueB))

                if (comparison !== 0) return sort.desc ? -comparison : comparison
            }

            return 0
        })
    })

    const table = createTable({
        features: serverTableFeatures,
        columns: serverColumns,
        get data() {
            return sortedData
        },
        getRowId: (server) => server.name,
        state: {
            get sorting() {
                return sorting
            },
        },
    })
    const isEmpty = $derived(loadState === "loaded" && data.length === 0)

    function getColumnSort(columnId: string) {
        const sort = sorting.find((item) => item.id === columnId)
        if (!sort) return false

        return sort.desc ? ("desc" as const) : ("asc" as const)
    }

    function toggleSorting(columnId: string, multi: boolean) {
        const current = sorting.find((item) => item.id === columnId)

        if (!multi) {
            if (!current) sorting = [{ id: columnId, desc: false }]
            else if (!current.desc) sorting = [{ id: columnId, desc: true }]
            else sorting = []

            return
        }

        if (!current) sorting = [...sorting, { id: columnId, desc: false }]
        else if (!current.desc) {
            sorting = sorting.map((item) => (item.id === columnId ? { ...item, desc: true } : item))
        } else sorting = sorting.filter((item) => item.id !== columnId)
    }

    function getAriaSort(sort: "asc" | "desc" | false) {
        if (sort === "asc") return "ascending" as const
        if (sort === "desc") return "descending" as const

        return undefined
    }
</script>

<!-- Keyboard users need to focus this scroll region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    class="h-80 overflow-auto border border-gray-600 bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 [&>[data-slot=table-container]]:overflow-visible"
    role="region"
    aria-label={`${region} servers`}
    tabindex="0"
>
    <Table.Root
        class={isEmpty
            ? "h-full min-w-[56rem] table-fixed whitespace-nowrap"
            : "min-w-[56rem] table-fixed whitespace-nowrap"}
    >
        <Table.Caption class="sr-only">{region} servers</Table.Caption>
        <colgroup>
            <col class="w-[23%]" />
            <col class="w-[13%]" />
            <col class="w-[24%]" />
            <col class="w-[30%]" />
            <col class="w-[10%]" />
        </colgroup>
        <Table.Header class="sticky top-0 z-10 bg-gray-700 text-gray-300">
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <Table.Row>
                    {#each headerGroup.headers as header (header.id)}
                        <Table.Head
                            colspan={header.colSpan}
                            scope="col"
                            aria-sort={getAriaSort(getColumnSort(header.column.id))}
                        >
                            {#if !header.isPlaceholder}
                                <SortHeader
                                    getSort={() => getColumnSort(header.column.id)}
                                    label={String(header.column.columnDef.header)}
                                    ontoggle={(multi: boolean) => {
                                        toggleSorting(header.column.id, multi)
                                    }}
                                />
                            {/if}
                        </Table.Head>
                    {/each}
                </Table.Row>
            {/each}
        </Table.Header>
        <Table.Body
            class={loadState === "loading"
                ? "animate-pulse motion-reduce:animate-none"
                : isEmpty
                  ? "h-full"
                  : undefined}
            aria-busy={loadState === "loading" ? "true" : undefined}
        >
            {#if loadState === "loading"}
                <LoadingRow />
            {:else if loadState === "error"}
                <Table.Row>
                    <Table.Cell
                        colspan={serverColumns.length}
                        class="h-20 text-center font-bold text-red-400"
                    >
                        <span role="status">Failed to load</span>
                    </Table.Cell>
                </Table.Row>
            {:else}
                {#each table.getRowModel().rows as row (row.id)}
                    <Row server={row.original} />
                {:else}
                    <Table.Row class="h-full bg-gray-900 transition-none hover:bg-gray-900">
                        <Table.Cell
                            colspan={serverColumns.length}
                            class="h-full text-center text-gray-400"
                        >
                            <span role="status">No active servers in {region}.</span>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            {/if}
        </Table.Body>
    </Table.Root>
</div>
