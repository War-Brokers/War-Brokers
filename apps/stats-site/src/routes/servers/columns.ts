import { createColumnHelper, renderComponent } from "@tanstack/svelte-table"
import { gameModeName } from "@warbrokers/types/src/gameMode"
import { MapName } from "@warbrokers/types/src/map"

import type { DataTableFeatures } from "$lib/components/data-table"

import ServerCell from "./ServerCell.svelte"
import type { Server } from "./types"

const columnHelper = createColumnHelper<DataTableFeatures, Server>()

export const serverColumns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Server",
        sortFn: "alphanumeric",
        meta: {
            label: "Server",
            widthClass: "w-[23%]",
            cellClass: "font-bold",
            skeletonClass: "w-32",
        },
        cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((server) => Number(server.isTeams), {
        id: "isTeams",
        header: "Team Mode",
        meta: {
            label: "Team Mode",
            widthClass: "w-[13%]",
            skeletonClass: "w-10",
        },
        cell: ({ row }) => renderComponent(ServerCell, { server: row.original, cell: "isTeams" }),
    }),
    columnHelper.accessor((server) => gameModeName[server.gameMode], {
        id: "gameMode",
        header: "Game Mode",
        sortFn: "alphanumeric",
        meta: {
            label: "Game Mode",
            widthClass: "w-[24%]",
            skeletonClass: "w-28",
        },
        cell: ({ row }) => renderComponent(ServerCell, { server: row.original, cell: "gameMode" }),
    }),
    columnHelper.accessor((server) => MapName[server.map], {
        id: "map",
        header: "Map",
        sortFn: "alphanumeric",
        meta: {
            label: "Map",
            widthClass: "w-[30%]",
            skeletonClass: "w-28",
        },
        cell: ({ row }) => renderComponent(ServerCell, { server: row.original, cell: "map" }),
    }),
    columnHelper.accessor("playerCount", {
        header: "Players",
        meta: {
            label: "Players",
            widthClass: "w-[10%]",
            align: "end",
            cellClass: "text-end",
            skeletonClass: "w-16",
        },
        cell: ({ row }) =>
            renderComponent(ServerCell, { server: row.original, cell: "playerCount" }),
    }),
])
