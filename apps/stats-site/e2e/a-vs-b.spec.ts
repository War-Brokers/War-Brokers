import { expect, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"

test("shows a combobox for two missing players", async ({ page }) => {
    await page.goto("/-vs-")

    const comparison = page.getByRole("region", { name: "Players to compare" })
    const playerASearch = comparison.getByRole("combobox", {
        name: "Search Player A",
    })
    const playerBSearch = comparison.getByRole("combobox", {
        name: "Search Player B",
    })

    await expect(playerASearch).toBeVisible()
    await expect(playerBSearch).toBeVisible()
})

test("shows combobox for missing player B", async ({ page }) => {
    await page.goto(`/${pompUID}-vs-`)

    const comparison = page.getByRole("region", {
        name: "Players to compare",
    })
    await expect(comparison.getByRole("link", { name: "[LP] POMP" })).toBeVisible()
    await expect(comparison.getByRole("combobox", { name: "Search Player A" })).toHaveCount(0)
    await expect(comparison.getByRole("combobox", { name: "Search Player B" })).toBeVisible()
})

test("shows combobox for missing player A", async ({ page }) => {
    await page.goto(`/-vs-${pompUID}`)

    const comparison = page.getByRole("region", {
        name: "Players to compare",
    })
    await expect(comparison.getByRole("link", { name: "[LP] POMP" })).toBeVisible()
    await expect(comparison.getByRole("combobox", { name: "Search Player A" })).toBeVisible()
    await expect(comparison.getByRole("combobox", { name: "Search Player B" })).toHaveCount(0)
})

test("shows combobox for invalid player UID", async ({ page }) => {
    const response = await page.goto(`/invalid-vs-${pompUID}`)
    expect(response?.status()).toBe(200)
    expect(await response?.text()).not.toContain("Internal Error")

    const comparison = page.getByRole("region", {
        name: "Players to compare",
    })
    const playerSearch = comparison.getByRole("combobox", { name: "Search Player A" })
    const errorMessage = comparison.locator("#player-a-search-message")
    await expect(playerSearch).toBeVisible()
    await expect(playerSearch).toHaveAttribute("aria-describedby", "player-a-search-message")
    await expect(playerSearch).toHaveAttribute("aria-invalid", "true")
    await expect(errorMessage).toHaveText('Player UID "invalid" is invalid.')
    await expect(errorMessage).toBeVisible()
    await expect(comparison.getByRole("link", { name: "[LP] POMP" })).toBeVisible()

    const playerSearchBounds = await playerSearch.boundingBox()
    const errorMessageBounds = await errorMessage.boundingBox()
    if (!playerSearchBounds || !errorMessageBounds)
        throw new Error("Comparison state is not visible")
    expect(playerSearchBounds.y).toBeLessThan(errorMessageBounds.y)
})

test("explains when a player was not found", async ({ page }) => {
    await page.goto(`/000000000000000000000000-vs-${pompUID}`)

    const comparison = page.getByRole("region", { name: "Players to compare" })
    await expect(
        comparison.getByText('No player was found with UID "000000000000000000000000".'),
    ).toBeVisible()
    await expect(comparison.getByRole("combobox", { name: "Search Player A" })).toBeVisible()
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

test("associates comparison values with each player and statistic", async ({ page }) => {
    await page.goto(`/${pompUID}-vs-${pompUID}`)

    const table = page.getByRole("table", { name: "Player statistics comparison" })
    await expect(table).toBeVisible()
    await expect(table.getByRole("columnheader", { name: "[LP] POMP" })).toHaveCount(2)

    const levelRow = table.getByRole("row").filter({
        has: page.getByRole("rowheader", { name: "Level" }),
    })
    const levelValues = levelRow.getByRole("cell")

    await expect(levelValues).toHaveCount(2)
    await expect(levelValues.nth(0)).toHaveAttribute("headers", "player-a-column stat-level")
    await expect(levelValues.nth(1)).toHaveAttribute("headers", "player-b-column stat-level")
    await expect(levelValues.getByText("Tied", { exact: true })).toHaveCount(2)
    await expect(levelValues.getByText("Tied", { exact: true }).first()).toBeVisible()
})

test("loading skeleton reserves the resolved comparison height", async ({ page }) => {
    await page.goto(`/${pompUID}-vs-${pompUID}`, { waitUntil: "commit" })

    const pendingHeight = await page
        .getByRole("region", { name: "Player comparison" })
        .evaluate((element) => element.getBoundingClientRect().height)

    const table = page.getByRole("table", { name: "Player statistics comparison" })
    await expect(table).toBeVisible()

    const resolvedHeight = await table.evaluate((element) => {
        const playerHeader = document.querySelector<HTMLElement>(
            'section[aria-label="Players to compare"]',
        )
        if (!playerHeader) throw new Error("Expected the resolved player comparison header")

        return element.getBoundingClientRect().bottom - playerHeader.getBoundingClientRect().top
    })

    expect(Math.abs(resolvedHeight - pendingHeight)).toBeLessThanOrEqual(1)
})
