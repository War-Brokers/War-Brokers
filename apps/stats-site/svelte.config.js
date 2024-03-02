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

            // https://vercel.com/docs/edge-network/regions#region-list
            regions: [
                "sfo1", // us-west-1 (San Francisco, USA)
            ],
        }),
    },
}

export default config
