import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [sveltekit()],
    test: {
        include: ["src/**/*.{test,spec}.{js,ts}"],
    },
    server: {
        // only works in dev. For production rewrite rule, see vercel.json
        proxy: {
            // https://umami.is/docs/guides/bypass-ad-blockers
            // https://vitejs.dev/config/server-options.html#server-proxy
            // https://stats.wbpjs.com/stats/* -> https://analytics.umami.is/*
            "^/stats/.*": {
                target: "https://analytics.umami.is/",
                changeOrigin: true,
                rewrite: (path) => path.slice(6), // slice "/stats" off the string (which is 6 characters long)
            },
        },
    },
})
