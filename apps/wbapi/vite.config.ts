import { resolve } from "path"
import copy from "rollup-plugin-copy"
import generatePackageJson from "rollup-plugin-generate-package-json"
import { defineConfig } from "vitest/config"

import { dependencies, engines, name, version } from "./package.json"

/**
 * List of the regular expressions that match the packages that should be kept external
 */
const externalDepsList: RegExp[] = []
/**
 * The dependencies that should be included in the generated package.json file
 */
const externalDepsObj = {}

/** For each dependency that is not a monorepo package, mark it as an external dependency */
Object.keys(dependencies).forEach((dep) => {
    if (dependencies[dep] !== "workspace:*") {
        // This regex matches the pattern: 'package', 'package/subpackage', etc.
        const depRegex = new RegExp(`^${dep}(/.*)?$`)
        externalDepsList.push(depRegex)
        externalDepsObj[dep] = dependencies[dep]
    }
})

export default defineConfig({
    resolve: {
        // This setting is necessary for vite to resolve symlinks to packages in the monorepo
        preserveSymlinks: true,
        alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
    },
    test: {
        exclude: ["**/build/**", "**/lib/**"],
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "functions",
            fileName: "index",
            formats: ["umd"],
        },
        copyPublicDir: false,
        outDir: "lib",
        rollupOptions: {
            external: externalDepsList,
            plugins: [
                generatePackageJson({
                    baseContents: {
                        name: `${name}-dist`,
                        version,
                        engines,
                        type: "module",
                        main: "./index.umd.cjs",
                    },
                    additionalDependencies: externalDepsObj,
                }),
                /* If you use environment variables in the cloud functions, you will want to copy them into dist */
                copy({
                    targets: [{ src: ".env*", dest: "dist" }],
                    hook: "closeBundle", // we must specify the closeBundle hook so that the files don't get overwritten... that may be a bug with plugin, however, with this setting it works
                }),
            ],
        },
    },
})
