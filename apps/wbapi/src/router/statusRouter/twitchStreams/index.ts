import { info } from "firebase-functions/logger"
import fetch from "node-fetch"
import { z } from "zod"

import { publicProcedure } from "@/trpc"
import { twitchStreamsURL } from "@/url"

import { apiResponseSchema, parseData } from "./util"

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
        .output(apiResponseSchema)
        .query(async () => {
            info("Getting War Brokers twitch streams")

            const res = await fetch(twitchStreamsURL())
            const raw = await res.text()

            return parseData(raw)
        })
