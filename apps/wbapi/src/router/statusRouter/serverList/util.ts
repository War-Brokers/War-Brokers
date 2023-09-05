import { z } from "zod"

export const serverSchema = z.object({
    playerCount: z.number(),
    maxPlayers: z.number(),
})
export type Server = z.infer<typeof serverSchema>

export const apiResponseSchema = z.array(serverSchema)
export type APIResponse = z.infer<typeof apiResponseSchema>

/**
 * @param data - looks like: "serverCount,data1,data2,data3,data4,data5,data6,data1,data2,data3,data4,data5,data6...".
 */
export async function parseData(data: string): Promise<APIResponse> {
    // [0] -> server count
    //
    // [1] -> server IP:PORT
    // [2] -> server name
    // [3] -> server version
    // [4] -> isTeams + isServerOpen + gameMode
    // [5] -> player count
    // [6] -> map
    //
    // 1~6 repeats for other servers...
    const entries = data.split(",")
    const serverCount = Number(entries[0]) // serverCount * 6 + 1 === entries.length

    const result: APIResponse = []
    for (let i = 0; i < serverCount; i++) {
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

    return result
        .sort((a, b) => b.playerCount - a.playerCount)
        .filter((item) => item.playerCount !== 0)
}

function maxPlayers(map: number) {
    if ([9, 11, 16, 17, 23, 26].includes(map)) return 60
    if ([25, 27, 28].includes(map)) return 4

    return 16
}
