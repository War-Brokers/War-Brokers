import { expect, test } from "@playwright/test"

test("squad links encode percent signs and load the squad", async ({ page }) => {
    await page.goto("/squads")

    const squadLink = page.getByRole("link", { name: "100% squad" })
    await expect(squadLink).toHaveAttribute("href", "/squads/100%25")

    await squadLink.click()

    await expect(page).toHaveURL("/squads/100%25")
    await expect(page).toHaveTitle("100% - War Brokers Stats")
    await expect(page.getByRole("heading", { name: "Squad [100%]" })).toBeVisible()
})

test("an encoded percent-sign squad URL loads directly", async ({ page }) => {
    const response = await page.goto("/squads/100%25")

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle("100% - War Brokers Stats")
    await expect(page.getByRole("heading", { name: "Squad [100%]" })).toBeVisible()
})
