import wbConfig from "@warbrokers/eslint-config"
import { defineConfig } from "eslint/config"

export default defineConfig(...wbConfig, {
    files: ["*.ts"],
    languageOptions: {
        parserOptions: {
            projectService: {
                allowDefaultProject: ["*.ts"],
            },
            tsconfigRootDir: import.meta.dirname,
        },
    },
})
