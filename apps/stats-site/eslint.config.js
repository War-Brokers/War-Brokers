import tsParser from "@typescript-eslint/parser"
import wbConfig from "@warbrokers/eslint-config"
import { defineConfig } from "eslint/config"
import svelte from "eslint-plugin-svelte"
import globals from "globals"
import svelteParser from "svelte-eslint-parser"

export default defineConfig(
    {
        ignores: [".svelte-kit/", "vite.config.ts.timestamp*"],
    },
    ...wbConfig,
    // https://github.com/sveltejs/eslint-plugin-svelte
    ...svelte.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: [
            "**/*.svelte",
            "**/*.svelte.js",
            "**/*.svelte.ts",
            "*.svelte",
            "*.svelte.js",
            "*.svelte.ts",
        ],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: tsParser,
            },
        },
    },
    {
        rules: {
            "import/no-unresolved": ["error", { ignore: ["\\$app/.*"] }],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            // todo: re-enable
            "svelte/no-navigation-without-resolve": "off",
            "svelte/require-each-key": "off",
            "svelte/infinite-reactive-loop": "off",
        },
    },
)
