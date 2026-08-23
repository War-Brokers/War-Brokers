import { expect, type Page, test } from "@playwright/test"

const scaleStatistics = [
    { statistic: "level", title: "Level" },
    { statistic: "xp", title: "XP" },
    { statistic: "timeAlive", title: "Time Alive in hours" },
] as const

type LinearBucket = {
    start: number
    count: number
}

type LogBucket = {
    exponent: number
    count: number
}

type LinearDistributionResponse = {
    timeAlive: {
        bucketSize: number
        buckets: LinearBucket[]
    }
}

type LogDistributionResponse = {
    timeAlive: {
        bucketBase: number
        buckets: LogBucket[]
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

function isNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value)
}

function isLinearBucket(value: unknown): value is LinearBucket {
    return isRecord(value) && isNumber(value["start"]) && isNumber(value["count"])
}

function isLogBucket(value: unknown): value is LogBucket {
    return isRecord(value) && isNumber(value["exponent"]) && isNumber(value["count"])
}

function isLinearDistributionResponse(value: unknown): value is LinearDistributionResponse {
    if (!isRecord(value) || !isRecord(value["timeAlive"])) return false

    const timeAlive = value["timeAlive"]
    const buckets = timeAlive["buckets"]
    return (
        isNumber(timeAlive["bucketSize"]) && Array.isArray(buckets) && buckets.every(isLinearBucket)
    )
}

function isLogDistributionResponse(value: unknown): value is LogDistributionResponse {
    if (!isRecord(value) || !isRecord(value["timeAlive"])) return false

    const timeAlive = value["timeAlive"]
    const buckets = timeAlive["buckets"]
    return isNumber(timeAlive["bucketBase"]) && Array.isArray(buckets) && buckets.every(isLogBucket)
}

async function getApiData<T>(page: Page, path: string, parse: (value: unknown) => value is T) {
    const response = await page.request.get(`http://127.0.0.1:5000/${path}`)

    expect(response.ok()).toBe(true)

    const data: unknown = await response.json()
    if (!parse(data)) throw new Error(`Unexpected response from ${path}`)

    return data
}

test("distribution switches toggle horizontal scale", async ({ page }) => {
    await page.goto("/")

    for (const { statistic, title } of scaleStatistics) {
        const switchControl = page.locator(`#distribution-${statistic}-scale-switch`)
        const scaleControl = switchControl.locator("..")
        const chart = page.getByRole("img", {
            name: new RegExp(`^${title} histogram`),
        })

        await expect(chart).toBeVisible({ timeout: 20_000 })
        await expect(scaleControl.getByText("Linear", { exact: true })).toBeVisible()
        await expect(scaleControl.getByText("Log", { exact: true })).toBeVisible()
        await expect(switchControl).toHaveAttribute("role", "switch")
        await expect(switchControl).toHaveAttribute("aria-checked", "true")
        await expect(chart).toHaveAttribute("aria-label", /Horizontal scale: logarithmic/)

        await switchControl.focus()
        await switchControl.press("Space")

        await expect(switchControl).toHaveAttribute("aria-checked", "false")
        await expect(chart).toHaveAttribute("aria-label", /Horizontal scale: linear/)

        await switchControl.press("Space")
        await expect(switchControl).toHaveAttribute("aria-checked", "true")
        await expect(chart).toHaveAttribute("aria-label", /Horizontal scale: logarithmic/)
    }
})

test("logarithmic Time Alive data uses the same hour unit as linear data", async ({ page }) => {
    const [linear, logarithmic] = await Promise.all([
        getApiData(page, "players/distribution", isLinearDistributionResponse),
        getApiData(page, "players/logDistribution", isLogDistributionResponse),
    ])
    const linearLastBucket = linear.timeAlive.buckets.at(-1)
    const logarithmicLastBucket = logarithmic.timeAlive.buckets.at(-1)

    expect(linearLastBucket).toBeDefined()
    expect(logarithmicLastBucket).toBeDefined()
    if (!linearLastBucket || !logarithmicLastBucket) return

    const linearCount = linear.timeAlive.buckets.reduce((total, bucket) => total + bucket.count, 0)
    const logarithmicCount = logarithmic.timeAlive.buckets.reduce(
        (total, bucket) => total + bucket.count,
        0,
    )
    expect(logarithmicCount).toBe(linearCount)

    const linearUpperBound = linearLastBucket.start + linear.timeAlive.bucketSize
    const logarithmicUpperBound = 2 ** (logarithmicLastBucket.exponent + 1) - 1
    expect(logarithmicUpperBound).toBeLessThanOrEqual(2 * (linearUpperBound + 1))
})
