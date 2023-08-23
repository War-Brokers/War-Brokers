import { expect, test } from "@playwright/test"

test("Should return 404 for invalid routes", async ({ page }) => {
    const response = await page.goto("/path/that/does/not/exist")
    expect(response?.status()).toEqual(404)
})
