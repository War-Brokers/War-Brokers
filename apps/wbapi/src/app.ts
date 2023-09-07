import { createExpressMiddleware } from "@trpc/server/adapters/express"
import cors from "cors"
import express, { type Express } from "express"
import swaggerUi from "swagger-ui-express"
import { createOpenApiExpressMiddleware } from "trpc-openapi"

import { openApiDocument } from "@/openapi"
import { appRouter } from "@/router"
import { createContext } from "@/trpc"

const app: Express = express()

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

export { app }
