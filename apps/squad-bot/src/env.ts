import { createEnv } from "@t3-oss/env-core"
import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

export const env = createEnv({
    server: {
        DISCORD_BOT_TOKEN: z.string().min(1),
    },

    runtimeEnv: process.env,
})
