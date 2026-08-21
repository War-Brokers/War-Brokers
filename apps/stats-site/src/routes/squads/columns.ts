import { createColumnHelper, renderComponent } from "@tanstack/svelte-table"

import type { DataTableFeatures } from "$lib/components/data-table"

import type { PageData } from "./$types"
import SquadNameCell from "./SquadNameCell.svelte"

type Squad = PageData["squads"][number]

const columnHelper = createColumnHelper<DataTableFeatures, Squad>()

export const squadColumns = columnHelper.columns([
    columnHelper.accessor("squad", {
        header: "Name",
        sortFn: "alphanumeric",
        meta: {
            label: "Name",
            widthClass: "w-[90%]",
        },
        cell: ({ row }) => renderComponent(SquadNameCell, { name: row.original.squad }),
    }),
    columnHelper.accessor("memberCount", {
        header: "Members",
        meta: {
            label: "Members",
            widthClass: "w-[10%]",
            align: "end",
            cellClass: "text-end font-bold tabular-nums",
            skeletonClass: "w-12",
        },
        cell: ({ getValue }) => getValue().toLocaleString("en-US"),
    }),
])
