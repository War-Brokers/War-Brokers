import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

// https://env.t3.gg/docs/core
export default createEnv({
    server: {
        WB_DB_ID: z.string(),
        WB_DB_PW: z.string(),
        WB_DB_BASE: z.string(),
    },
    runtimeEnv: process.env,
})
