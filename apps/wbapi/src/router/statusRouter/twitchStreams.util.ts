import { z } from "zod"

import { AbortError } from "@/errors"

export const streamSchema = z.object({
    thumbnail: z.string(),
    streamer: z.string(), // https://twitch.tv/<streamer>
    viewers: z.number(),
})

export const apiResponseSchema = z.object({
    total: z.number(),
    streams: z.array(streamSchema),
})

export type APIResponseSchema = z.infer<typeof apiResponseSchema>

/**
 * @param data - looks like: "total,thumbnail_1,streamer_1,viewers_1,thumbnail_2,streamer_2,viewers_2,...".
 */
export function parseData(data: string): APIResponseSchema {
    if (data === "0,")
        return {
            total: 0,
            streams: [],
        }

    const entries = data.split(",")

    const result: APIResponseSchema = {
        total: Number(entries[0]),
        streams: [],
    }

    for (let i = 1; i < entries.length; i += 3) {
        const parseResult = streamSchema.safeParse({
            thumbnail: entries[i],
            streamer: entries[i + 1],
            viewers: Number(
                entries[i + 2]
                    // remove comma
                    .replace(/,/g, ""),
            ),
        })

        if (!parseResult.success) throw AbortError

        result.streams.push(parseResult.data)
    }

    return result
}
