import { expect, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"

test("shows weapon statistics and derived metrics", async ({ page }) => {
    await page.goto(`/players/${pompUID}`)

    const weapons = page.getByRole("region", { name: "Weapon Statistics" })

    await expect(weapons.getByRole("article")).toHaveCount(10)
    await expect(
        weapons.getByRole("article", { name: "Kills per Weapon" }).getByRole("img"),
    ).toHaveAccessibleName("Donut chart showing 60,104 total kills distributed across 47 weapons.")
    await expect(
        weapons.getByRole("article", { name: "Shots Fired per Weapon" }).getByRole("img"),
    ).toHaveAccessibleName(
        "Donut chart showing 947,723 total shots fired distributed across 50 weapons.",
    )
    await expect(
        weapons
            .getByRole("article", { name: "Longest Kill per Weapon" })
            .locator('li[data-category-key="p09"]'),
    ).toContainText("1,178.6 m")
    await expect(
        weapons
            .getByRole("article", { name: "Headshot Frequency per Weapon" })
            .locator('li[data-category-key="p67"]'),
    ).toContainText("31.7%")
    await expect(
        weapons
            .getByRole("article", { name: "Unzoomed Accuracy per Weapon" })
            .locator('li[data-category-key="p09"]'),
    ).toContainText("281.0%")
    await expect(
        weapons
            .getByRole("article", { name: "Headshot Frequency per Weapon" })
            .locator('li[data-category-key="p11"]'),
    ).toHaveCount(0)
    await expect(
        weapons
            .getByRole("article", { name: "Shots Fired per Weapon" })
            .locator('li[data-category-key="p61"]'),
    ).toContainText("294,381")
    await expect(
        weapons
            .getByRole("article", { name: "Shots Fired per Kill per Weapon" })
            .locator('li[data-category-key="p91"]'),
    ).toContainText("95.7")
    await expect(
        weapons.getByRole("article", { name: "Kills per Weapon" }).locator("li"),
    ).toHaveCount(47)
    await expect(
        weapons.getByRole("article", { name: "Longest Kill per Weapon" }).locator("li"),
    ).toHaveCount(47)
    await expect(
        weapons
            .getByRole("article", { name: "Kills per Weapon" })
            .locator('li[data-category-key="p126"]'),
    ).toContainText("G3A3")
    await expect(
        weapons.getByRole("article", { name: "Kills per Weapon" }).getByRole("button"),
    ).toHaveCount(47)
})

test("links hover state across visible weapon rows", async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover emphasis applies to pointer hover environments")

    await page.goto(`/players/${pompUID}`)
    await page.waitForLoadState("networkidle")

    const kills = page.getByRole("article", { name: "Kills per Weapon" })
    const longestKill = page.getByRole("article", { name: "Longest Kill per Weapon" })
    const fiftyCalDistance = longestKill.locator('li[data-category-key="p90"]')
    const fiftyCalKills = kills.locator('li[data-category-key="p90"]')
    const sniperKills = kills.locator('li[data-category-key="p67"]')
    const fiftyCalArc = kills.locator('svg path[data-category-key="p90"]')
    const sniperArc = kills.locator('svg path[data-category-key="p67"]')
    const fiftyCalDistanceButton = fiftyCalDistance.getByRole("button")
    const fiftyCalKillsButton = fiftyCalKills.getByRole("button")
    const firstKill = kills.locator("li").first()
    const secondKill = kills.locator("li").nth(1)

    await expect(fiftyCalKills).toBeVisible()
    await fiftyCalDistance.hover()
    await expect(fiftyCalKills).toHaveCSS("opacity", "1")
    await expect(sniperKills).toHaveCSS("opacity", "0.3")
    await expect(fiftyCalArc).toHaveCSS("opacity", "1")
    await expect(sniperArc).toHaveCSS("opacity", "0.3")
    await expect(fiftyCalKills).toHaveCSS("transition-duration", "0s")
    await expect(fiftyCalArc).toHaveCSS("transition-duration", "0s")

    await fiftyCalDistanceButton.click()
    await longestKill.getByRole("heading", { name: "Longest Kill per Weapon" }).hover()
    await expect(fiftyCalDistanceButton).toHaveAttribute("aria-pressed", "true")
    await expect(fiftyCalKillsButton).toHaveAttribute("aria-pressed", "true")
    await expect(fiftyCalKills).toHaveCSS("opacity", "1")
    await expect(sniperKills).toHaveCSS("opacity", "0.3")

    await fiftyCalKillsButton.click()
    await kills.getByRole("heading", { name: "Kills per Weapon" }).hover()
    await expect(fiftyCalDistanceButton).toHaveAttribute("aria-pressed", "false")
    await expect(fiftyCalKillsButton).toHaveAttribute("aria-pressed", "false")
    await expect(sniperKills).toHaveCSS("opacity", "1")

    await secondKill.scrollIntoViewIfNeeded()
    const secondKillBox = await secondKill.boundingBox()
    const secondKillBarBox = await secondKill.locator(":scope > button").boundingBox()

    if (secondKillBox === null || secondKillBarBox === null)
        throw new Error("Expected weapon rows to have bounding boxes")

    await page.mouse.move(
        secondKillBox.x + secondKillBox.width / 2,
        (secondKillBox.y + secondKillBarBox.y) / 2,
    )
    await expect(firstKill).toHaveCSS("opacity", "0.3")
    await expect(secondKill).toHaveCSS("opacity", "1")
})

test("footer ends at the document boundary", async ({ page }) => {
    await page.goto(`/players/${pompUID}`)

    const footerBox = await page.locator("footer").boundingBox()
    const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight)

    expect(footerBox).not.toBeNull()
    expect(Math.round((footerBox?.y ?? 0) + (footerBox?.height ?? 0))).toBe(documentHeight)
})
