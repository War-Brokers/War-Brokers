import { gameModeIDSchema } from "@warbrokers/types/src/gameMode"
import { mapIDSchema, type WBMap } from "@warbrokers/types/src/map"
import type { Region } from "@warbrokers/types/src/region"
import { regionSchema } from "@warbrokers/types/src/region"
import { z } from "zod"

import { serverListURL } from "@/const"
import { reason2TRPCError } from "@/errors"
import { fetchUpstream } from "@/fetch"
import { publicProcedure } from "@/trpc"
import { FailReason, type Result } from "@/types"

export const serverSchema = z.object({
    name: z.string(),
    address: z.string(),
    region: regionSchema,
    version: z.number().int(),
    isTeams: z.boolean(),
    isServerOpen: z.boolean(),
    gameMode: gameModeIDSchema,
    playerCount: z.number(),
    map: mapIDSchema,
    maxPlayers: z.number(),
})
export type Server = z.infer<typeof serverSchema>

export const responseSchema = z.array(serverSchema)
export type Response = z.infer<typeof responseSchema>

const validRegions = regionSchema.options.map((option) => option.value).join(", ")

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/serverList",
                description: `Gets a list of War Brokers game servers.

Valid inputs: ${validRegions}`,
                tags: [tag],
            },
        })
        .input(z.object({ region: regionSchema }))
        .output(responseSchema)
        .query(async ({ input }) => {
            const { region } = input

            const res = await serverList(region)

            if (!res.success) {
                console.error(`/status/serverList failed: ${res.reason}`)
                throw reason2TRPCError(res.reason)
            }

            return res.data
        })

function maxPlayers(region: Region, map: WBMap) {
    if (region.endsWith("_4V4")) return 8
    if (region.includes("BATTLE_ROYALE") || region.includes("DEAD")) return 60
    if (region.includes("COMPETITIVE") || [25, 27, 28].includes(map)) return 4

    return 16
}

export function parseData(data: string) {
    const entries = data.split(",")
    const serverCount = Number(entries[0]) // serverCount * 6 + 1 === entries.length

    const result: Response = []
    for (let i = 0; i < serverCount; i++) {
        const address = z.string().parse(entries[6 * i + 1])
        const region = regionSchema.parse(entries[6 * i + 2])
        const version = Number(entries[6 * i + 3])
        const status = Number(entries[6 * i + 4])
        const isServerOpen = (status & 0b01000000) === 0
        const isTeams = (status & 0b10000000) !== 0
        const gameMode = gameModeIDSchema.parse(`m${String(status & 0b00111111).padStart(2, "0")}`)
        const playerCount = Number(entries[6 * i + 5])
        const map = mapIDSchema.parse(Number(entries[6 * i + 6]))

        result.push({
            name: "Temporary value, users shouldn't be seeing this.",
            address,
            region,
            version,
            isTeams,
            isServerOpen,
            gameMode,
            playerCount,
            map,
            maxPlayers: maxPlayers(region, map),
        })
    }

    return result
        .sort((a: Server, b: Server) => {
            // sort by address and port
            const [aHost = "", aPort = ""] = a.address.split(":")
            const [bHost = "", bPort = ""] = b.address.split(":")

            if (aHost !== bHost) return aHost < bHost ? -1 : 1
            return Number(aPort) - Number(bPort)
        })
        .map((server, index) => ({
            ...server,
            name: `${server.region}_${String(index + 1).padStart(2, "0")}`,
        }))
        .sort((a, b) => b.playerCount - a.playerCount)
        .filter((item) => item.playerCount !== 0) // matching game client behavior
}

export async function serverList(region: Region): Promise<Result<Response>> {
    const res = await fetchUpstream(serverListURL(region))

    // looks like: "serverCount,data1,data2,data3,data4,data5,data6,data1,data2,data3,data4,data5,data6...".
    const data = await res.text()

    if (
        !data ||
        data.includes("404 Not Found") ||
        data.includes("Error") ||
        data.includes("signout")
    )
        return {
            success: false,
            reason: FailReason.WBAPIConnectionFail,
        }

    return {
        success: true,
        data: parseData(data),
    }
}
