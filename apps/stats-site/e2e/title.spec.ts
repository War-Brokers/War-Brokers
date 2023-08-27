import { expect, test } from "@playwright/test"

const suffix = " - War Brokers Stats"

test("should have proper title", async ({ page }) => {
    await page.goto("/")
    expect(await page.title()).toEqual("Home" + suffix)

    await page.goto("/players/5d2ead35d142affb05757778")
    expect(await page.title()).toEqual("[LP] POMP" + suffix)

    // todo: add squad page title

    await page.goto("/404")
    expect(await page.title()).toEqual("404 Not Found" + suffix)
})
