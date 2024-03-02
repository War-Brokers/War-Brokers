import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { WB_DB_BASE, WB_DB_ID, WB_DB_PW } from "$env/static/private"

// https://env.t3.gg/docs/core
export default createEnv({
    server: {
        WB_DB_ID: z.string(),
        WB_DB_PW: z.string(),
        WB_DB_BASE: z.string(),
    },
    runtimeEnv: { WB_DB_ID, WB_DB_PW, WB_DB_BASE },
})
