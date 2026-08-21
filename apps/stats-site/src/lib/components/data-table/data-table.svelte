<script lang="ts" generics="TData extends RowData">
    import type { ColumnDef, RowData, SortingState } from "@tanstack/svelte-table"
    import { createTable, FlexRender } from "@tanstack/svelte-table"

    import * as Table from "$lib/components/ui/table"
    import { cn } from "$lib/utils"

    import SortHeader from "./SortHeader.svelte"
    import { type DataTableFeatures, dataTableFeatures } from "./types"

    type LoadState = "error" | "loaded" | "loading"
    type Props<T extends RowData> = {
        ariaLabel: string
        caption: string
        columns: ColumnDef<DataTableFeatures, T>[]
        data?: T[]
        emptyMessage: string
        getRowId: (row: T) => string
        initialSorting?: SortingState
        loadingRowCount?: number
        containerClass?: string
        tableClass?: string
        rowClass?: string
        headerClass?: string
        state?: LoadState
    }

    const {
        ariaLabel,
        caption,
        columns,
        data = [],
        emptyMessage,
        getRowId,
        initialSorting = [],
        loadingRowCount = 1,
        containerClass,
        tableClass,
        rowClass = "even:bg-gray-900",
        headerClass = "bg-gray-700 text-gray-300",
        state: loadState = "loaded",
    }: Props<TData> = $props()

    const table = createTable({
        features: dataTableFeatures,
        columns,
        get data() {
            return data
        },
        getRowId,
        initialState: {
            sorting: initialSorting,
        },
    })

    const isEmpty = $derived(loadState === "loaded" && data.length === 0)

    function getAriaSort(sort: false | "asc" | "desc") {
        if (sort === "asc") return "ascending" as const
        if (sort === "desc") return "descending" as const

        return undefined
    }
</script>

<!-- Keyboard users need to focus this scroll region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    class={cn(
        "overflow-auto border border-gray-600 bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 [&>[data-slot=table-container]]:overflow-visible",
        containerClass,
    )}
    role="region"
    aria-label={ariaLabel}
    tabindex="0"
>
    <Table.Root class={cn("table-fixed whitespace-nowrap", tableClass, isEmpty && "h-full")}>
        <Table.Caption class="sr-only">{caption}</Table.Caption>
        <colgroup>
            {#each table.getAllLeafColumns() as column (column.id)}
                <col class={column.columnDef.meta?.widthClass} />
            {/each}
        </colgroup>
        <Table.Header class={headerClass}>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <Table.Row>
                    {#each headerGroup.headers as header (header.id)}
                        {@const meta = header.column.columnDef.meta}
                        <Table.Head
                            colspan={header.colSpan}
                            scope="col"
                            aria-sort={getAriaSort(header.column.getIsSorted())}
                            class={cn(meta?.headerClass, meta?.align === "end" && "text-end")}
                        >
                            {#if !header.isPlaceholder}
                                {#if typeof header.column.columnDef.header === "string" && header.column.getCanSort()}
                                    <SortHeader
                                        label={meta?.label ?? header.column.columnDef.header}
                                        align={meta?.align ?? "start"}
                                        getSort={() => header.column.getIsSorted()}
                                        ontoggle={(multi: boolean) => {
                                            header.column.toggleSorting(undefined, multi)
                                        }}
                                    />
                                {:else}
                                    <FlexRender {header} />
                                {/if}
                            {/if}
                        </Table.Head>
                    {/each}
                </Table.Row>
            {/each}
        </Table.Header>
        <Table.Body
            class={cn(
                loadState === "loading" && "animate-pulse motion-reduce:animate-none",
                isEmpty && "h-full",
            )}
            aria-busy={loadState === "loading" ? "true" : undefined}
        >
            {#if loadState === "loading"}
                {#each { length: loadingRowCount } as _, index (index)}
                    <Table.Row
                        class={cn("skeleton-reveal bg-gray-900", rowClass)}
                        aria-hidden="true"
                    >
                        {#each table.getAllLeafColumns() as column (column.id)}
                            {@const meta = column.columnDef.meta}
                            <Table.Cell class={meta?.cellClass}>
                                <div
                                    class={cn(
                                        "h-5 rounded bg-gray-600",
                                        meta?.skeletonClass ?? "w-20",
                                        meta?.align === "end" && "ms-auto",
                                    )}
                                ></div>
                            </Table.Cell>
                        {/each}
                    </Table.Row>
                {/each}
            {:else if loadState === "error"}
                <Table.Row>
                    <Table.Cell
                        colspan={table.getAllLeafColumns().length}
                        class="h-20 text-center font-bold text-red-400"
                    >
                        <span role="status">Failed to load</span>
                    </Table.Cell>
                </Table.Row>
            {:else}
                {#each table.getRowModel().rows as row (row.id)}
                    <Table.Row class={rowClass}>
                        {#each row.getAllCells() as cell (cell.id)}
                            <Table.Cell class={cell.column.columnDef.meta?.cellClass}>
                                <FlexRender {cell} />
                            </Table.Cell>
                        {/each}
                    </Table.Row>
                {:else}
                    <Table.Row class="h-full bg-gray-900 transition-none hover:bg-gray-900">
                        <Table.Cell
                            colspan={table.getAllLeafColumns().length}
                            class="h-full text-center text-gray-400"
                        >
                            <span role="status">{emptyMessage}</span>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            {/if}
        </Table.Body>
    </Table.Root>
</div>
