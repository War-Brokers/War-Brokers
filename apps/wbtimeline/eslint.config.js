import wbConfig from "@warbrokers/eslint-config"
import { defineConfig } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import betterTailwindcss from "eslint-plugin-better-tailwindcss"

export default defineConfig(
    ...wbConfig.filter((config) => config.name !== "import/recommended"),
    ...nextVitals,
    ...nextTs,
    betterTailwindcss.configs["correctness-error"],
    {
        settings: {
            "better-tailwindcss": {
                cwd: import.meta.dirname,
                tailwindConfig: "tailwind.config.ts",
            },
        },
        rules: {
            // todo: remove
            "better-tailwindcss/no-unknown-classes": [
                "error",
                {
                    ignore: [
                        "^(?:content|dark|date|description|entry|icon|item|subcategory|video-container)$",
                    ],
                },
            ],
        },
    },
)
