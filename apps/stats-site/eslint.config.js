import tsParser from "@typescript-eslint/parser"
import wbConfig, { strictTypeCheckedRules } from "@warbrokers/eslint-config"
import { defineConfig } from "eslint/config"
import svelte from "eslint-plugin-svelte"
import globals from "globals"
import svelteParser from "svelte-eslint-parser"
import tseslint from "typescript-eslint"

export default defineConfig(
    {
        ignores: [".svelte-kit/", "vite.config.ts.timestamp*"],
    },
    ...wbConfig,
    {
        files: ["e2e/*.ts", "playwright.config.ts"],
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["playwright.config.ts"],
                },
                tsconfigRootDir: import.meta.dirname,
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
                extraFileExtensions: [".svelte"],
                parser: tsParser,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            ...strictTypeCheckedRules,
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        rules: {
            "import/no-unresolved": ["error", { ignore: ["^\\$(?:app|env)/"] }],
        },
    },
)
