/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["@warbrokers/eslint-config"],

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },

    overrides: [
        {
            files: ["*.test.ts"],
            env: { jest: true },
        },
    ],

    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
}
