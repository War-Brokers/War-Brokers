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
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
]
