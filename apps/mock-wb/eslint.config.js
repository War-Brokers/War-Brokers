import wbConfig from "@warbrokers/eslint-config"

export default [
    ...wbConfig,
    {
        files: ["**/*.test.ts"],
        languageOptions: {
            globals: { jest: true },
        },
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
]
