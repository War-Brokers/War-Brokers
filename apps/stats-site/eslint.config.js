import tsParser from "@typescript-eslint/parser"
import { defineConfig } from "eslint/config"
import betterTailwindcss from "eslint-plugin-better-tailwindcss"
import oxlint from "eslint-plugin-oxlint"
import svelte from "eslint-plugin-svelte"
import globals from "globals"
import svelteParser from "svelte-eslint-parser"

export default defineConfig(
    {
        ignores: [".svelte-kit/", "vite.config.ts.timestamp*"],
    },
    betterTailwindcss.configs["correctness-error"],
    {
        rules: {
            "better-tailwindcss/enforce-canonical-classes": "error",
        },
    },
    {
        settings: {
            "better-tailwindcss": {
                cwd: import.meta.dirname,
                entryPoint: "src/app.css",
            },
        },
    },
    // https://github.com/sveltejs/eslint-plugin-svelte
    ...svelte.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                extraFileExtensions: [".svelte"],
                parser: tsParser,
            },
        },
    },
    ...oxlint.configs["flat/recommended"],
)
