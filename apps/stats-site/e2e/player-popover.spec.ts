import { expect, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"

test("rank popover does not shift the mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 392, height: 647 })
    await page.goto(`/players/${pompUID}`)

    await page.locator("#games-elo-percentile").click()
    await expect(page.getByRole("tooltip")).toBeVisible()
    await expect(page.getByRole("img", { name: /Bell curve showing this player/ })).toBeVisible()

    const layouts = await page.evaluate(async () => {
        const samples: string[] = []

        for (let frame = 0; frame < 60; frame += 1) {
            await new Promise(requestAnimationFrame)

            const trigger = document.querySelector("#games-elo-percentile")
            const tooltip = document.querySelector('[role="tooltip"]')
            const tooltipRect = tooltip?.getBoundingClientRect()

            samples.push(
                JSON.stringify({
                    documentWidth: document.documentElement.scrollWidth,
                    viewportWidth: document.documentElement.clientWidth,
                    triggerX: trigger?.getBoundingClientRect().x,
                    tooltipRight: tooltipRect?.right,
                    tooltipWidth: tooltipRect?.width,
                    tooltipX: tooltipRect?.x,
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
        !("tooltipX" in layout) ||
        typeof layout.tooltipX !== "number" ||
        !("tooltipRight" in layout) ||
        typeof layout.tooltipRight !== "number"
    ) {
        throw new Error("Expected numeric tooltip bounds")
    }

    expect(layout).toMatchObject({
        documentWidth: 392,
        tooltipWidth: 288,
        viewportWidth: 392,
    })
    expect(layout.tooltipX).toBeGreaterThanOrEqual(16)
    expect(layout.tooltipRight).toBeLessThanOrEqual(376)
})

test("rank popover draws above the wins chart", async ({ page }) => {
    await page.setViewportSize({ width: 506, height: 466 })
    await page.goto(`/players/${pompUID}`)

    const trigger = page.locator("#games-elo-percentile")
    await trigger.evaluate((element) => {
        element.scrollIntoView({ block: "start" })
    })
    await trigger.click()
    await expect(page.getByRole("tooltip")).toBeVisible()

    const paintOrder = await page.evaluate(() => {
        const tooltip = document.querySelector('[role="tooltip"]')
        const chart = document.querySelector('[data-chart="wins-donut"]')

        if (!(tooltip instanceof HTMLElement) || !(chart instanceof HTMLElement)) return undefined

        const tooltipRect = tooltip.getBoundingClientRect()
        const chartRect = chart.getBoundingClientRect()
        const left = Math.ceil(Math.max(tooltipRect.left, chartRect.left))
        const right = Math.floor(Math.min(tooltipRect.right, chartRect.right))
        const top = Math.ceil(Math.max(tooltipRect.top, chartRect.top))
        const bottom = Math.floor(Math.min(tooltipRect.bottom, chartRect.bottom))

        for (let y = top; y < bottom; y += 2) {
            for (let x = left; x < right; x += 2) {
                const elements = document.elementsFromPoint(x, y)
                const tooltipIndex = elements.findIndex((element) => tooltip.contains(element))
                const chartIndex = elements.findIndex(
                    (element) =>
                        element instanceof SVGPathElement &&
                        element.hasAttribute("data-category-key"),
                )

                if (tooltipIndex !== -1 && chartIndex !== -1) return { chartIndex, tooltipIndex }
            }
        }

        return undefined
    })

    expect(paintOrder).toBeDefined()
    expect(paintOrder?.tooltipIndex).toBeLessThan(paintOrder?.chartIndex ?? 0)
})
