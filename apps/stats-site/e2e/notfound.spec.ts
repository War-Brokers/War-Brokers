import { expect, test } from "@playwright/test"

test("returns 404 for an invalid route", async ({ page }) => {
    const response = await page.goto("/path/that/does/not/exist")
    expect(response?.status()).toEqual(404)
})
