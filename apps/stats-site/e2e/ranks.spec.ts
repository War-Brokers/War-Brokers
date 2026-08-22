import { expect, test } from "@playwright/test"

test("renders rank elements in order", async ({ page }) => {
    await page.goto("/ranks")

    await expect(page.getByRole("heading", { level: 3 })).toHaveText([
        "Novice",
        "Adequate",
        "Competent",
        "Advanced",
        "Pro",
        "Master",
        "Legendary",
        "Godlike",
        "Ascended",
    ])
})
