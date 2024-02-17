import type { OpenAPIV3 } from "openapi-types"
import { generateOpenApiDocument } from "trpc-openapi"

import { appRouter } from "@/router"
// tags
import { tag as pingTag } from "@/router/pingProcedure"
import { tag as playerTag } from "@/router/playersRouter"
import { tag as statusTag } from "@/router/statusRouter"

export const openApiDocument: OpenAPIV3.Document = generateOpenApiDocument(
    appRouter,
    {
        title: "Example CRUD API",
        description: "OpenAPI compliant REST API built using tRPC with Express",
        version: "1.0.0",
        baseUrl:
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            process.env.NODE_ENV === "development"
                ? "http://localhost:5000" // firebase emulator
                : "https://wbapi.wbpjs.com", // production
        docsUrl:
            "https://github.com/War-Brokers/War-Brokers/tree/master/apps/wbapi",
        tags: [pingTag, playerTag, statusTag],
    },
)
