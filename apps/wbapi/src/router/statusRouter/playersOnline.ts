import fetch from "node-fetch"
import { z } from "zod"

import { string2number } from "@/convert"
import { publicProcedure } from "@/trpc"
import { playersOnlineURL } from "@/url"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/playersOnline",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(z.number())
        .query(async () => {
            const res = await fetch(playersOnlineURL())
            const raw = await res.text() // X,XXX

            return string2number(raw)
        })
