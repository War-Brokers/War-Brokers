import type { Region } from "@warbrokers/types/src/region"
import { regionSchema } from "@warbrokers/types/src/region"
import { z } from "zod"

import { serverListURL } from "@/const"
import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"
import { FailReason, type Result } from "@/types"

export const serverSchema = z.object({
    playerCount: z.number(),
    maxPlayers: z.number(),
})
export type Server = z.infer<typeof serverSchema>

export const responseSchema = z.array(serverSchema)
export type Response = z.infer<typeof responseSchema>

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/serverList",
                description: `Gets a list of War Brokers game servers.

Valid inputs: USA, USA_WEST, ASIA, AUSTRALIA, EUROPE, INDIA, JAPAN, RUSSIA, USA_CLAN, USA_CLAN_WEST, AS_BATTLE_ROYALE, AU_BATTLE_ROYALE, EU_BATTLE_ROYALE, NA_BATTLE_ROYALE, NA_COMPETITIVE_TESTING`,
                tags: [tag],
            },
        })
        .input(z.object({ region: regionSchema }))
        .output(responseSchema)
        .query(async ({ input }) => {
            const { region } = input

            const res = await serverList(region)

            if (!res.success) throw reason2TRPCError(res.reason)

            return res.data
        })

function maxPlayers(map: number) {
    if ([9, 11, 16, 17, 23, 26].includes(map)) return 60
    if ([25, 27, 28].includes(map)) return 4

    return 16
}

export function parseData(data: string) {
    // [0] -> server count
    // [1] -> server IP:PORT                    ┐
    // [2] -> server name                       │
    // [3] -> server version                    │
    // [4] -> isTeams + isServerOpen + gameMode ├─ 1~6 repeats for other servers...
    // [5] -> player count                      │
    // [6] -> map                               ┘
    const entries = data.split(",")
    const serverCount = Number(entries[0]) // serverCount * 6 + 1 === entries.length

    const result: Response = []
    for (let i = 0; i < serverCount; i++) {
        // todo: complete
        // const magicNum = Number(entries[6 * i + 4])
        // const isServerOpen = (magicNum & 0b01000000) == 0
        // const isTeams = (magicNum & 0b10000000) == 0
        // const gameMode: GameMode = magicNum & 0b00111111
        const map = Number(entries[6 * i + 6])

        result.push({
            playerCount: Number(entries[6 * i + 5]),
            maxPlayers: maxPlayers(map),
        })
    }

    // todo: sort by IP and port too to match server ID with WB client
    return result
        .sort((a, b) => b.playerCount - a.playerCount)
        .filter((item) => item.playerCount !== 0)
}

export async function serverList(region: Region): Promise<Result<Response>> {
    const res = await fetch(serverListURL(region))

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
