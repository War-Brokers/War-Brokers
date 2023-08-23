import { devices, type PlaywrightTestConfig } from "@playwright/test"

export interface Config {
    command?: string
    port: number
}

export function createConfig(config: Config): PlaywrightTestConfig {
    const baseURL = `http://localhost:${config.port}`

    return {
        // Timeout per test
        timeout: 30 * 1000,

        // Test directory
        testDir: "e2e",

        // Artifacts folder where screenshots, videos, and traces are stored.
        outputDir: "test-results/",

        // Run your local dev server before starting the tests:
        // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
        webServer: {
            command: config.command || "pnpm serve",
            url: baseURL,
            timeout: 30 * 1000,
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            reuseExistingServer: !process.env.CI,
            stdout: "ignore",
            stderr: "ignore",
        },

        use: {
            // Use baseURL so to make navigations relative.
            // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
            baseURL,

            // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
            // More information: https://playwright.dev/docs/trace-viewer
            trace: "retry-with-trace",

            // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
            // contextOptions: {
            //   ignoreHTTPSErrors: true,
            // },
        },

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
    }
}
