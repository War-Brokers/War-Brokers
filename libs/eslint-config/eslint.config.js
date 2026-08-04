import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import turboConfig from "eslint-config-turbo/flat"
import eslintPluginImport from "eslint-plugin-import"
import eslintPluginSimpleSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import ts from "typescript-eslint"

const typeScriptFiles = ["**/*.{ts,tsx,mts,cts}"]

/** @type {import("eslint").Linter.RulesRecord} */
const requestedTypeCheckedRules = {
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unsafe-type-assertion": "error",
    "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
    ],
    "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
            allowDefaultCaseForExhaustiveSwitch: false,
            considerDefaultExhaustiveForUnions: false,
        },
    ],
}

export const strictTypeCheckedRules = Object.assign(
    {},
    ...ts.configs.strictTypeChecked.map((config) => config.rules ?? {}),
    requestedTypeCheckedRules,
)

export default defineConfig(
    {
        ignores: ["dist/", "build/", ".turbo/", "node_modules/"],
    },
    ...turboConfig,
    js.configs.recommended,
    ...ts.configs.strictTypeChecked.map((config) => ({
        ...config,
        files: typeScriptFiles,
    })),
    eslintPluginImport.flatConfigs.recommended,
    {
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`
                },
            },
        },
    },
    {
        plugins: {
            "simple-import-sort": eslintPluginSimpleSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
    {
        files: ["**/*.{js,ts,tsx,jsx,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
        },
    },
    {
        files: typeScriptFiles,
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            ...requestedTypeCheckedRules,
        },
    },
)
