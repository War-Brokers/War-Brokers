import { z } from "zod"

import { string2number } from "@/convert"
import { publicProcedure } from "@/trpc"
import { playerCountURL } from "@/url"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/playerCount",
                description: "Gets the total number of registered accounts",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(z.number())
        .query(async () => {
            const res = await fetch(playerCountURL())
            const raw = await res.text() // XXX,XXX,XXX

            return string2number(raw)
        })
