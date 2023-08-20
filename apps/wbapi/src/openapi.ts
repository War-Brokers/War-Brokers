import { generateOpenApiDocument } from "trpc-openapi"

import { appRouter } from "@/router"
import { tag as pingTag } from "@/router/pingRouter"
import { tag as playerTag } from "@/router/playersRouter"

export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: "Example CRUD API",
    description: "OpenAPI compliant REST API built using tRPC with Express",
    version: "1.0.0",
    baseUrl:
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.NODE_ENV === "development"
            ? "http://localhost:5000"
            : "https://wbp-wbapi.web.app",
    docsUrl: "https://github.com/jlalmes/trpc-openapi",
    tags: [pingTag, playerTag],
})
