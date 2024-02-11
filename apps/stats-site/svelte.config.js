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
                "icn1", // ap-northeast-2 (Seoul, South Korea)
                "sfo1", // us-west-1 (San Francisco, USA)
                "pdx1", // us-west-2 (Portland, USA)
                "iad1", // us-east-1 (Washington, D.C., USA)
                "cle1", // us-east-2 (Cleveland, USA)
            ],
        }),
    },
}

export default config
