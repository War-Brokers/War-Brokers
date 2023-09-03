import { LocationSchema } from "@warbrokers/types/src/location"
import fetch from "node-fetch"
import { z } from "zod"

import { AbortError } from "@/errors"
import { publicProcedure } from "@/trpc"
import { serverListURL } from "@/url"

import { apiResponseSchema, parseData } from "./util"

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
        .input(
            z.object({
                region: LocationSchema,
            }),
        )
        .output(apiResponseSchema)
        .query(async ({ input }) => {
            const res = await fetch(serverListURL(input.region))
            const raw = await res.text()

            if (
                !raw ||
                raw.includes("404 Not Found") ||
                raw.includes("Error") ||
                raw.includes("signout")
            )
                throw AbortError

            return await parseData(raw)
        })
