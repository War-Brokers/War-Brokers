import { expect, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"

test("shows a searchbox for two missing players", async ({ page }) => {
    await page.goto("/-vs-")

    const comparison = page.getByRole("region", { name: "Players to compare" })
    const playerASearch = comparison.getByRole("searchbox", {
        name: "Search Player A",
    })
    const playerBSearch = comparison.getByRole("searchbox", {
        name: "Search Player B",
    })

    await expect(playerASearch).toBeVisible()
    await expect(playerBSearch).toBeVisible()
})

test("shows searchbox for missing player B", async ({ page }) => {
    await page.goto(`/${pompUID}-vs-`)

    const comparison = page.getByRole("region", {
        name: "Players to compare",
    })
    await expect(comparison.getByRole("link", { name: "[LP] POMP" })).toBeVisible()
    await expect(comparison.getByRole("searchbox", { name: "Search Player A" })).toHaveCount(0)
    await expect(comparison.getByRole("searchbox", { name: "Search Player B" })).toBeVisible()
})

test("shows searchbox for missing player A", async ({ page }) => {
    await page.goto(`/-vs-${pompUID}`)

    const comparison = page.getByRole("region", {
        name: "Players to compare",
    })
    await expect(comparison.getByRole("link", { name: "[LP] POMP" })).toBeVisible()
    await expect(comparison.getByRole("searchbox", { name: "Search Player A" })).toBeVisible()
    await expect(comparison.getByRole("searchbox", { name: "Search Player B" })).toHaveCount(0)
})

test("shows searchbox for invalid player UID", async ({ page }) => {
    await page.goto(`/invalid-vs-${pompUID}`)

    const comparison = page.getByRole("region", {
        name: "Players to compare",
    })
    await expect(
        comparison.getByRole("searchbox", {
            name: "Search Player A",
        }),
    ).toBeVisible()
    await expect(comparison.getByRole("link", { name: "[LP] POMP" })).toBeVisible()
})

for (const side of ["A", "B"] as const) {
    test(`editing player ${side} clears that side`, async ({ page }) => {
        await page.goto(`/${pompUID}-vs-${pompUID}`)

        const comparison = page.getByRole("region", {
            name: "Players to compare",
        })

        await comparison.getByRole("button", { name: `Edit player ${side}` }).click()

        await expect(page).toHaveURL(side === "A" ? `/-vs-${pompUID}` : `/${pompUID}-vs-`)
    })
}
