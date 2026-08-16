import { expect, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"
const popoverSelector = '[data-slot="popover-content"]'

test("rank popover does not shift the mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 392, height: 900 })
    await page.goto(`/players/${pompUID}`)

    await page.locator("#games-elo-percentile").click()
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
    await trigger.click()
    await expect(page.locator(popoverSelector)).toBeVisible()

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
