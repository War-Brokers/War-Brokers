import { expect, test } from "@playwright/test"

const prefix = "War Brokers Stats | "

test("should have proper title", async ({ page }) => {
    await page.goto("/")
    expect(await page.title()).toEqual(prefix + "Home")

    await page.goto("/404")
    expect(await page.title()).toEqual(prefix + "404 Not Found")
})
