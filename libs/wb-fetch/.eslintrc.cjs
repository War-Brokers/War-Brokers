/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["@warbrokers/eslint-config"],

    overrides: [
        {
            files: ["*.test.ts"],
            env: { jest: true },
        },
    ],

    parserOptions: {
        project: ["tsconfig.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
}
