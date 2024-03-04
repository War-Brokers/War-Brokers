import "dotenv/config"

import { createExpressMiddleware } from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import swaggerUi from "swagger-ui-express"
import { createOpenApiExpressMiddleware } from "trpc-openapi"

import { openApiDocument } from "@/openapi"
import { initRedis } from "@/redis"
import { appRouter } from "@/router"
import { createContext } from "@/trpc"

export const env = {
    /* eslint-disable turbo/no-undeclared-env-vars */
    WB_DB_ID: process.env.WB_DB_ID as string,
    WB_DB_PW: process.env.WB_DB_PW as string,
    WB_DB_BASE: process.env.WB_DB_BASE as string,

    LEADERBOARD_REDIS_URL: process.env.LEADERBOARD_REDIS_URL as string,
    LEADERBOARD_REDIS_TOKEN: process.env.LEADERBOARD_REDIS_TOKEN as string,

    SQUAD_REDIS_URL: process.env.SQUAD_REDIS_URL as string,
    SQUAD_REDIS_TOKEN: process.env.SQUAD_REDIS_TOKEN as string,
    /* eslint-enable turbo/no-undeclared-env-vars */
}

initRedis()

const app = express()

app.use(cors())

// API documentations
app.use("/api-docs", swaggerUi.serve)
app.get(
    "/api-docs",
    swaggerUi.setup(openApiDocument, {
        swaggerOptions: {
            tryItOutEnabled: true,
        },
    }),
)

// Handle incoming tRPC requests
app.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }))

// Handle incoming OpenAPI requests
app.use(
    "/",
    createOpenApiExpressMiddleware({ router: appRouter, createContext }),
)

console.log("====> http://127.0.0.1:5000/api-docs")
app.listen(5000)
