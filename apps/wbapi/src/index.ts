import "dotenv/config"

import { createExpressMiddleware } from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import rateLimit from "express-rate-limit"
import swaggerUi from "swagger-ui-express"
import { createOpenApiExpressMiddleware } from "trpc-openapi"

import { openApiDocument } from "@/openapi"
import { appRouter } from "@/router"
import { createContext } from "@/trpc"

import { initDB } from "./db"

export const env = {
    /* eslint-disable turbo/no-undeclared-env-vars */
    WB_DB_ID: process.env.WB_DB_ID as string,
    WB_DB_PW: process.env.WB_DB_PW as string,
    WB_DB_BASE: process.env.WB_DB_BASE as string,

    DATABASE_URL: process.env.DATABASE_URL as string,
    /* eslint-enable turbo/no-undeclared-env-vars */
}

export const db = await initDB()

// fastify
const app = express()

app.use(cors())

app.use(
    /^\/(?!api-docs|ping).*$/,
    rateLimit({
        windowMs: 1000 * 60, // 1 minute
        max: 20, // requests per windowMs per IP
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => (req.ip || req.socket.remoteAddress) === "192.168.1.1",
    }),
)

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
