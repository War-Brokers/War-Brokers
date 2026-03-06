import wbConfig from "@warbrokers/eslint-config"
import { defineConfig } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig(
    ...wbConfig.filter((config) => config.name !== "import/recommended"),
    ...nextVitals,
    ...nextTs,
)
