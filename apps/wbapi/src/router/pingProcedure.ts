import { z } from "zod"

import { publicProcedure } from "@/trpc"

export const tag = "ping"

const pingReply = "pong!"

export default publicProcedure
    .meta({
        openapi: {
            method: "GET",
            path: "/ping",
            description: "Checks whether the server is alive or not",
            tags: [tag],
        },
    })
    .input(z.undefined())
    .output(z.literal(pingReply))
    .query(() => pingReply)
