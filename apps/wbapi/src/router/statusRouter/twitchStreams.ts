import { z } from "zod"

import { twitchStreamsURL } from "@/const"
import { reason2TRPCError } from "@/errors"
import { discardResponseBody, fetchUpstream } from "@/fetch"
import { publicProcedure } from "@/trpc"
import { FailReason, type Result } from "@/types"

export const streamSchema = z.object({
    thumbnail: z.string(),
    streamer: z.string(), // https://twitch.tv/<streamer>
    viewers: z.number(),
})

export const responseSchema = z.object({
    total: z.number(),
    streams: z.array(streamSchema),
})

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/twitchStreams",
                description:
                    "Gets a list of all available War Brokers twitch streams",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(responseSchema)
        .query(async () => {
            const res = await twitchStreamCount()

            if (!res.success) {
                console.error(`/status/twitchStreams failed: ${res.reason}`)
                throw reason2TRPCError(res.reason)
            }

            return res.data
        })

export type Response = z.infer<typeof responseSchema>

export function parseData(data: string): Result<Response> {
    if (data === "0,")
        return {
            success: true,
            data: {
                total: 0,
                streams: [],
            },
        }

    const entries = data.split(",")

    const result: Response = {
        total: Number(entries[0]),
        streams: [],
    }

    for (let i = 1; i < entries.length; i += 3) {
        const thumbnail = entries[i]
        const streamer = entries[i + 1]
        const viewers = entries[i + 2]

        if (
            thumbnail === undefined ||
            streamer === undefined ||
            viewers === undefined
        )
            return { success: false, reason: FailReason.SchemaValidationFail }

        const parseResult = streamSchema.safeParse({
            thumbnail,
            streamer,
            viewers: Number(viewers.replace(/,/g, "")),
        })

        if (!parseResult.success)
            return { success: false, reason: FailReason.SchemaValidationFail }

        result.streams.push(parseResult.data)
    }

    return { success: true, data: result }
}

export async function twitchStreamCount(): Promise<Result<Response>> {
    const res = await fetchUpstream(twitchStreamsURL())

    if (!res.ok) {
        await discardResponseBody(res)
        return { success: false, reason: FailReason.WBAPIConnectionFail }
    }

    // looks like: "total,thumbnail_1,streamer_1,viewers_1,thumbnail_2,streamer_2,viewers_2,...".
    const data = await res.text()

    return parseData(data)
}
