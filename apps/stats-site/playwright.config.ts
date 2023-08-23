import { createConfig } from "@warbrokers/playwright-config"

export default createConfig({
    port: 4173,
    command: "pnpm build && pnpm preview",
})
