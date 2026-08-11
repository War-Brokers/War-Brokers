import { expect, test } from "@playwright/test"

const suffix = " - War Brokers Stats"

test("should have proper title", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle("Home" + suffix)

    await page.goto("/players/5d2ead35d142affb05757778")
    await expect(page).toHaveTitle("[LP] POMP" + suffix)

    // todo: add squad page title

    await page.goto("/-vs-")
    await expect(page).toHaveTitle("? vs ?" + suffix)

    await page.goto("/5d2ead35d142affb05757778-vs-")
    await expect(page).toHaveTitle("[LP] POMP vs ?" + suffix)

    await page.goto("/404")
    await expect(page).toHaveTitle("404 Page not found" + suffix)

    await page.goto("/path/that/does/not/exist")
    await expect(page).toHaveTitle("404 Page not found" + suffix)
})
