import { defineConfig } from "oxfmt"

export default defineConfig({
    semi: false,
    tabWidth: 4,
    printWidth: 100,
    singleQuote: false,
    sortPackageJson: true,
    sortTailwindcss: true,
    svelte: true,
    ignorePatterns: [
        "_/*",
        ".agents/",
        "**/.turbo/",
        "**/build/",
        "**/drizzle/",
        "**/.svelte-kit/",
        "**/*.timestamp-*",
        "pnpm-lock.yaml",
        "**/test-results/",
        "next-env.d.ts",
        "skills-lock.json",
    ],
    overrides: [
        {
            files: ["*.md", "*.yml"],
            options: {
                tabWidth: 2,
            },
        },
    ],
})
