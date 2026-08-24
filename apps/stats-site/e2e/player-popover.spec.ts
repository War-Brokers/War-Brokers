import { expect, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"
const popoverSelector = '[data-slot="popover-content"]'

test.use({ timezoneId: "UTC" })

test("shows time alive and per-minute rates", async ({ page }) => {
    await page.goto(`/players/${pompUID}`)

    const timeAlive = page.getByText("Time Alive", { exact: true }).locator("../..")
    await expect(timeAlive).toContainText("256.19 hours")
    await expect(
        page.getByText("Total Damage Dealt", { exact: true }).locator("../.."),
    ).toContainText("4,221,755.9")
    await expect(
        page.getByText("Total Damage Received", { exact: true }).locator("../.."),
    ).toContainText("5,998,023.2")
    const canHover = await page.evaluate(() => matchMedia("(hover: hover)").matches)

    for (const title of [
        "XP",
        "Total Kills",
        "Total Deaths",
        "Total Damage Dealt",
        "Total Damage Received",
    ]) {
        const stat = page.getByText(title, { exact: true }).locator("../..")
        const trigger = stat.getByRole("button", { name: new RegExp(`${title} rate`) })
        if (canHover) await trigger.hover()
        else await trigger.focus()
        await expect(page.getByRole("tooltip", { name: `${title} rate` })).toHaveText(
            /^\d+\.\d{2}\/min$/,
        )
    }
})

test("shows level progress percentage and XP details on demand", async ({ page }) => {
    await page.goto(`/players/${pompUID}`)
    await page.waitForLoadState("networkidle")

    const level = page.getByText("Level", { exact: true }).locator("../..")
    await expect(level).not.toContainText("22,760 XP required for level 380")
    await expect(level.getByRole("progressbar")).toHaveCount(0)

    await level.getByRole("button", { name: /level progress details/ }).hover()
    const progressPopover = page.locator(`${popoverSelector}[aria-label="Level progress details"]`)
    await expect(
        progressPopover.getByRole("progressbar", { name: "Level progress" }),
    ).toHaveAttribute("value", "2240")
    await expect(progressPopover).toContainText("8.96%")
    await expect(progressPopover).toContainText("2,240 / 25,000 XP")
    await expect(progressPopover).toContainText("22,760 XP required for level 380")
})

test("shows local date and time details for profile timestamps", async ({ page }) => {
    await page.goto(`/players/${pompUID}`)
    await page.waitForLoadState("networkidle")

    const playingSince = page.getByText("Playing Since", { exact: true }).locator("..")
    const playingSinceTrigger = playingSince.getByRole("button")
    await expect(playingSinceTrigger).toHaveText("July 17, 2019")
    await expect(playingSinceTrigger.locator("time")).toHaveAttribute(
        "datetime",
        "2019-07-17T05:08:05.000Z",
    )
    await playingSinceTrigger.hover()
    await expect(
        page.locator(`${popoverSelector}[aria-label="Playing since local date and time"]`),
    ).toHaveText("July 17, 2019 at 5:08 AM (Time zone: UTC)")
    await page.keyboard.press("Escape")

    const lastSeen = page.getByText("Last Seen", { exact: true }).locator("..")
    const lastSeenTrigger = lastSeen.getByRole("button")
    await expect(lastSeenTrigger).toHaveText(/ago$/)
    await expect(lastSeenTrigger.locator("time")).toHaveAttribute(
        "datetime",
        "2025-03-20T01:39:23.000Z",
    )
    await lastSeenTrigger.hover()
    await expect(
        page.locator(`${popoverSelector}[aria-label="Last seen local date and time"]`),
    ).toHaveText("March 20, 2025 at 1:39 AM (Time zone: UTC)")
})

test("rank popover does not shift the mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 392, height: 900 })
    await page.goto(`/players/${pompUID}`)

    await page.locator("#games-elo-percentile").hover()
    const popover = page.locator(popoverSelector)
    await expect(popover).toBeVisible()
    await expect(popover).toHaveAttribute("data-side", /^(top|bottom)$/)
    await expect(page.getByRole("img", { name: /Bell curve showing this player/ })).toBeVisible()

    const value = page.locator("#games-elo-percentile").locator("xpath=../following-sibling::span")
    const [popoverBox, valueBox] = await Promise.all([popover.boundingBox(), value.boundingBox()])
    if (!popoverBox || !valueBox) throw new Error("Expected popover and stat value bounds")

    const verticalOverlap =
        Math.min(popoverBox.y + popoverBox.height, valueBox.y + valueBox.height) -
        Math.max(popoverBox.y, valueBox.y)
    expect(verticalOverlap).toBeLessThanOrEqual(0)

    const layouts = await page.evaluate(async () => {
        const samples: string[] = []

        for (let frame = 0; frame < 60; frame += 1) {
            await new Promise(requestAnimationFrame)

            const trigger = document.querySelector("#games-elo-percentile")
            const popover = document.querySelector('[data-slot="popover-content"]')
            const popoverRect = popover?.getBoundingClientRect()

            samples.push(
                JSON.stringify({
                    documentWidth: document.documentElement.scrollWidth,
                    viewportWidth: document.documentElement.clientWidth,
                    triggerX: trigger?.getBoundingClientRect().x,
                    popoverRight: popoverRect?.right,
                    popoverWidth: popoverRect?.width,
                    popoverX: popoverRect?.x,
                }),
            )
        }

        return [...new Set(samples)]
    })

    expect(layouts).toHaveLength(1)

    const layout: unknown = JSON.parse(layouts[0] ?? "{}")

    if (
        typeof layout !== "object" ||
        layout === null ||
        !("popoverX" in layout) ||
        typeof layout.popoverX !== "number" ||
        !("popoverRight" in layout) ||
        typeof layout.popoverRight !== "number"
    ) {
        throw new Error("Expected numeric popover bounds")
    }

    expect(layout).toMatchObject({
        documentWidth: 392,
        popoverWidth: 288,
        viewportWidth: 392,
    })
    expect(layout.popoverX).toBeGreaterThanOrEqual(2)
    expect(layout.popoverRight).toBeLessThanOrEqual(391)
})

test("rank popover draws above the wins chart", async ({ page }) => {
    await page.setViewportSize({ width: 506, height: 466 })
    await page.goto(`/players/${pompUID}`)

    const trigger = page.locator("#games-elo-percentile")
    await trigger.evaluate((element) => {
        element.scrollIntoView({ block: "start" })
    })
    await trigger.hover()
    const popover = page.locator(popoverSelector)
    await expect(popover).toBeVisible()

    const popoverBox = await popover.boundingBox()
    if (!popoverBox) throw new Error("Expected popover bounds")

    await page.locator('[data-chart="wins-donut"]').evaluate(
        (element, { left, top }) => {
            element.style.position = "fixed"
            element.style.left = `${left}px`
            element.style.top = `${top}px`
        },
        { left: popoverBox.x + 16, top: popoverBox.y + 16 },
    )

    const paintOrder = await page.evaluate(() => {
        const popover = document.querySelector('[data-slot="popover-content"]')
        const chart = document.querySelector('[data-chart="wins-donut"]')

        if (!(popover instanceof HTMLElement) || !(chart instanceof HTMLElement)) return undefined

        const popoverRect = popover.getBoundingClientRect()
        const chartRect = chart.getBoundingClientRect()
        const left = Math.ceil(Math.max(popoverRect.left, chartRect.left))
        const right = Math.floor(Math.min(popoverRect.right, chartRect.right))
        const top = Math.ceil(Math.max(popoverRect.top, chartRect.top))
        const bottom = Math.floor(Math.min(popoverRect.bottom, chartRect.bottom))

        for (let y = top; y < bottom; y += 2) {
            for (let x = left; x < right; x += 2) {
                const elements = document.elementsFromPoint(x, y)
                const popoverIndex = elements.findIndex((element) => popover.contains(element))
                const chartIndex = elements.findIndex(
                    (element) =>
                        element instanceof SVGPathElement &&
                        element.hasAttribute("data-category-key"),
                )

                if (popoverIndex !== -1 && chartIndex !== -1) return { chartIndex, popoverIndex }
            }
        }

        return undefined
    })

    expect(paintOrder).toBeDefined()
    expect(paintOrder?.popoverIndex).toBeLessThan(paintOrder?.chartIndex ?? 0)
})
