import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "build",
    format: "esm",

    noExternal: [/@warbrokers(.*)/],
})
