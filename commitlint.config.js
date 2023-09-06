/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["chore", "ci", "docs", "feat", "fix", "refactor"],
        ],
        "scope-enum": [
            2,
            "always",
            [
                "stats-site",
                "wbapi",
                "wbtimeline",
                "eslint-config",
                "playwright-config",
                "wb-types",
            ],
        ],
    },
}
