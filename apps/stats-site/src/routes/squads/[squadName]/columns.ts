import { createColumnHelper, renderComponent } from "@tanstack/svelte-table"

import type { DataTableFeatures } from "$lib/components/data-table"

import type { PageData } from "./$types"
import MemberNameCell from "./MemberNameCell.svelte"

type Member = Awaited<PageData["members"]>[number]

const columnHelper = createColumnHelper<DataTableFeatures, Member>()

export const memberColumns = columnHelper.columns([
    columnHelper.accessor("nick", {
        header: "Name",
        sortFn: "alphanumeric",
        meta: {
            label: "Name",
            widthClass: "w-[60%]",
            skeletonClass: "w-32",
        },
        cell: ({ row }) =>
            renderComponent(MemberNameCell, {
                nick: row.original.nick,
                uid: row.original.uid,
            }),
    }),
    columnHelper.accessor("xp", {
        header: "XP",
        meta: {
            label: "XP",
            widthClass: "w-[16%]",
            align: "end",
            cellClass: "text-end font-bold tabular-nums",
            skeletonClass: "w-20",
        },
        cell: ({ getValue }) => getValue().toLocaleString("en-US"),
    }),
    columnHelper.accessor("killsELO", {
        header: "Kills Elo",
        meta: {
            label: "Kills Elo",
            widthClass: "w-[12%]",
            align: "end",
            cellClass: "text-end font-bold tabular-nums",
            skeletonClass: "w-16",
        },
        cell: ({ getValue }) => getValue().toFixed(2),
    }),
    columnHelper.accessor("gamesELO", {
        header: "Games Elo",
        meta: {
            label: "Games Elo",
            widthClass: "w-[12%]",
            align: "end",
            cellClass: "text-end font-bold tabular-nums",
            skeletonClass: "w-16",
        },
        cell: ({ getValue }) => getValue().toFixed(2),
    }),
])
