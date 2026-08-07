import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

const vitePreprocessor = vitePreprocess()

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // https://kit.svelte.dev/docs/integrations#preprocessors
    preprocess: {
        ...vitePreprocessor,
        // todo: remove
        style: async (options) => {
            if (options.filename?.includes("node_modules/layerchart")) return

            return await vitePreprocessor.style?.(options)
        },
    },

    kit: {
        // https://kit.svelte.dev/docs/adapters
        adapter: adapter(),
    },
}

export default config
