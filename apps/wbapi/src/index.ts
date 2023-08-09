import type { Request, Response } from "express"
import express, { json, urlencoded } from "express"
// eslint-disable-next-line import/no-unresolved
import { initializeApp } from "firebase-admin/app"
import { setGlobalOptions } from "firebase-functions/v2"
import { onRequest } from "firebase-functions/v2/https"
import swaggerUi from "swagger-ui-express"

import { RegisterRoutes } from "../build/routes"
import swaggerDoc from "../build/swagger.json"

initializeApp()

// Set the maximum instances to 10 for all functions
// limitations set by quota
setGlobalOptions({ maxInstances: 10 })

const app = express()

app.use(
    urlencoded({
        extended: true,
    }),
)
app.use(json())
app.use("/api-docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    return res.send(swaggerUi.generateHTML(swaggerDoc))
})

RegisterRoutes(app)

export const api = onRequest(app)
