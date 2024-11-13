import {
    devices,
    defineConfig,
    type PlaywrightTestConfig,
} from "@playwright/test"

export interface Config {
    port: number
}

export function createConfig(config: Config): PlaywrightTestConfig {
    return defineConfig({
        // Timeout per test
        timeout: 30 * 1000,

        // Test directory
        testDir: "e2e",

        // Artifacts folder where screenshots, videos, and traces are stored.
        outputDir: "test-results/",

        fullyParallel: true,

        use: {
            // Use baseURL so to make navigations relative.
            // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
            baseURL: `http://localhost:${config.port}`,

            // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
            // More information: https://playwright.dev/docs/trace-viewer
            trace: "retry-with-trace",

            // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
            // contextOptions: {
            //   ignoreHTTPSErrors: true,
            // },
        },

        // Configure projects for major browsers.
        projects: [
            {
                name: "Desktop Chrome",
                use: {
                    ...devices["Desktop Chrome"],
                },
            },
            {
                name: "Desktop Firefox",
                use: {
                    ...devices["Desktop Firefox"],
                },
            },
            {
                name: "Mobile Chrome",
                use: {
                    ...devices["Pixel 5"],
                },
            },
        ],
    })
}
