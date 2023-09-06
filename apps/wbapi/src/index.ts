import { createExpressMiddleware } from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import { initializeApp } from "firebase-admin/app"
import { setGlobalOptions } from "firebase-functions/v2"
import { onRequest } from "firebase-functions/v2/https"
import swaggerUi from "swagger-ui-express"
import { createOpenApiExpressMiddleware } from "trpc-openapi"

import { WB_DOMAIN, WB_ID, WB_PW } from "@/env"
import { openApiDocument } from "@/openapi"
import { appRouter } from "@/router"
import { createContext } from "@/trpc"

initializeApp()

// Set the maximum instances to 10 for all functions
// limitations set by quota
setGlobalOptions({ maxInstances: 10 })

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

export const api = onRequest(
    {
        region: "us-central1",
        memory: "256MiB",
        secrets: [WB_ID, WB_PW, WB_DOMAIN],
    },
    app,
)
