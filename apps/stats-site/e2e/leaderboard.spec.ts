import { expect, test } from "@playwright/test"

const leaderboardRoutes = [
    "/leaderboard",
    "/leaderboard/daily",
    "/leaderboard/daily/kills",
    "/leaderboard/gamesELO",
    "/leaderboard/killsELO",
    "/leaderboard/timeAlive",
    "/leaderboard/xp",
]

test("leaderboard hover backgrounds override alternating row backgrounds", async ({
    page,
}, testInfo) => {
    const supportsHover = await page.evaluate(() => matchMedia("(hover: hover)").matches)
    test.skip(!supportsHover || testInfo.project.name === "Mobile Chrome", "Hover is unavailable")

    for (const route of leaderboardRoutes) {
        await page.goto(route)

        const rows = page.locator("table").first().locator('tbody tr[class~="hover:bg-gray-700"]')
        await expect(rows.nth(1)).toBeVisible()

        await rows.nth(0).locator("td:nth-child(2)").hover()
        const hoveredBackground = await rows
            .nth(0)
            .evaluate((element) => getComputedStyle(element).backgroundColor)

        await rows.nth(1).locator("td:nth-child(3)").hover()
        await expect
            .poll(() =>
                rows.nth(1).evaluate((element) => getComputedStyle(element).backgroundColor),
            )
            .toBe(hoveredBackground)
    }
})

test("daily kills bars use the cached global range", async ({ page }) => {
    const bars = page.locator('tbody tr[class~="hover:bg-gray-700"] td[aria-hidden="true"] span')

    await page.goto("/leaderboard/daily")
    await expect(bars.first()).toBeVisible()
    await expect.poll(() => bars.first().evaluate((bar) => parseFloat(bar.style.width))).toBe(100)

    await page.goto("/leaderboard/daily/kills?page=2")
    await expect(bars.first()).toBeVisible()

    const nextPageBarWidth = await bars.first().evaluate((bar) => parseFloat(bar.style.width))
    expect(nextPageBarWidth).toBeGreaterThan(0)
    expect(nextPageBarWidth).toBeLessThan(100)
})
