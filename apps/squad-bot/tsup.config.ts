import { defineConfig } from "tsup"

export default defineConfig({
    outDir: "dist",
    entry: ["src/**/*.ts", "!src/**/*.d.ts"],

    clean: true,
    silent: true,

    format: ["cjs"],
    bundle: false, // load json files dynamically
    splitting: false,
    minify: false,
    keepNames: true,
})
