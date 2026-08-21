import {
    createSortedRowModel,
    metaHelper,
    rowSortingFeature,
    sortFn_alphanumeric,
    tableFeatures,
} from "@tanstack/svelte-table"

export type DataTableColumnMeta = {
    label: string
    widthClass?: string
    align?: "start" | "end"
    headerClass?: string
    cellClass?: string
    skeletonClass?: string
}

export const dataTableFeatures = tableFeatures({
    columnMeta: metaHelper<DataTableColumnMeta>(),
    rowSortingFeature,
    sortFns: { alphanumeric: sortFn_alphanumeric },
    sortedRowModel: createSortedRowModel(),
})

export type DataTableFeatures = typeof dataTableFeatures
