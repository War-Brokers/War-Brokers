import { createColumnHelper, rowSortingFeature, tableFeatures } from "@tanstack/svelte-table"
import { gameModeName } from "@warbrokers/types/src/gameMode"
import { MapName } from "@warbrokers/types/src/map"

import type { Server } from "./types"

export const serverTableFeatures = tableFeatures({ rowSortingFeature })

export function getServerSortValue(server: Server, columnId: string) {
    if (columnId === "name") return server.name
    if (columnId === "isTeams") return Number(server.isTeams)
    if (columnId === "gameMode") return gameModeName[server.gameMode]
    if (columnId === "map") return MapName[server.map]
    if (columnId === "playerCount") return server.playerCount

    throw new Error(`Unknown server column: ${columnId}`)
}

const columnHelper = createColumnHelper<typeof serverTableFeatures, Server>()

export const serverColumns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Server",
    }),
    columnHelper.accessor((server) => Number(server.isTeams), {
        id: "isTeams",
        header: "Team Mode",
    }),
    columnHelper.accessor((server) => gameModeName[server.gameMode], {
        id: "gameMode",
        header: "Game Mode",
    }),
    columnHelper.accessor((server) => MapName[server.map], {
        id: "map",
        header: "Map",
    }),
    columnHelper.accessor("playerCount", {
        header: "Players",
    }),
])
