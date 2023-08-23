/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["@warbrokers/eslint-config", "plugin:svelte/recommended"],

    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        extraFileExtensions: [".svelte"],
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },

    overrides: [
        {
            files: ["*.svelte"],
            parser: "svelte-eslint-parser",
            parserOptions: {
                parser: "@typescript-eslint/parser",
            },
        },
    ],
}
