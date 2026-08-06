import "dotenv/config"

import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env["DATABASE_URL"] // eslint-disable-line turbo/no-undeclared-env-vars

if (!databaseUrl) throw new Error("Missing required environment variable: DATABASE_URL")

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema/index.ts",
    out: "./drizzle",
    dbCredentials: {
        url: databaseUrl,
    },
})
