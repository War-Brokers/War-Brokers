import "dotenv/config"

import { createEnv } from "@t3-oss/env-core"
import z from "zod"

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
        WB_DB_ID: z.string().min(1),
        WB_DB_PW: z.string().min(1),
        WB_DB_BASE: z.string().min(1),
        DATABASE_URL: z.string().min(1),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
})
