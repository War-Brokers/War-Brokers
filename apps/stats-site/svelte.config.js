import adapter from "@sveltejs/adapter-vercel"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // https://kit.svelte.dev/docs/integrations#preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // https://kit.svelte.dev/docs/adapters
        adapter: adapter({
            runtime: "edge",
            regions: ["us-west-1", "us-west-2", "us-east-1", "us-east-2"],
        }),
    },
}

export default config
