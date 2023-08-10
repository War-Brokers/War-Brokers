/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["@warbrokers/eslint-config"],
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    rules: {
        "import/no-unresolved": [
            "error",
            { ignore: ["^firebase-functions/.+", "../build/routes"] },
        ],
    },
}
