import { expect, type Locator, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"

async function getArcPoint(arc: Locator, options: { rightmost?: boolean; targetX?: number } = {}) {
    return arc.evaluate((element, options) => {
        if (!(element instanceof SVGPathElement)) return undefined

        const bounds = element.getBBox()
        const matrix = element.getScreenCTM()
        if (!matrix) return undefined
        let selectedPoint: { x: number; y: number } | undefined

        for (let y = bounds.y; y <= bounds.y + bounds.height; y += 2) {
            for (let x = bounds.x; x <= bounds.x + bounds.width; x += 2) {
                const point = new DOMPoint(x, y)

                if (element.isPointInFill(point)) {
                    const screenPoint = point.matrixTransform(matrix)
                    if (options.targetX !== undefined) {
                        if (
                            !selectedPoint ||
                            Math.abs(screenPoint.x - options.targetX) <
                                Math.abs(selectedPoint.x - options.targetX)
                        ) {
                            selectedPoint = { x: screenPoint.x, y: screenPoint.y }
                        }
                    } else if (options.rightmost) {
                        if (!selectedPoint || screenPoint.x > selectedPoint.x) {
                            selectedPoint = { x: screenPoint.x, y: screenPoint.y }
                        }
                    } else {
                        return { x: screenPoint.x, y: screenPoint.y }
                    }
                }
            }
        }

        return selectedPoint
    }, options)
}

async function getArcRadii(arc: Locator) {
    return arc.evaluate((element) => {
        if (!(element instanceof SVGPathElement)) return undefined

        const pathLength = element.getTotalLength()
        let innerRadius = Number.POSITIVE_INFINITY
        let outerRadius = 0

        for (let index = 0; index <= 1000; index += 1) {
            const point = element.getPointAtLength((pathLength * index) / 1000)
            const radius = Math.hypot(point.x, point.y)
            innerRadius = Math.min(innerRadius, radius)
            outerRadius = Math.max(outerRadius, radius)
        }

        return { innerRadius, outerRadius }
    })
}

test("links pie and bar hover states", async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover linking applies to pointer hover environments")

    await page.goto(`/players/${pompUID}`)

    const wins = page.getByRole("article", { name: "Wins per Game Mode" })
    const teamDeathMatchArc = wins.locator('svg path[data-category-key="m00"]')
    const battleRoyaleArc = wins.locator('svg path[data-category-key="m11"]')
    const teamDeathMatchRow = wins.locator('li[data-category-key="m00"]')
    const battleRoyaleRow = wins.locator('li[data-category-key="m11"]')

    const teamDeathMatchPoint = await getArcPoint(teamDeathMatchArc)
    if (!teamDeathMatchPoint) throw new Error("Team Death Match arc is not visible")

    await page.mouse.move(teamDeathMatchPoint.x, teamDeathMatchPoint.y)
    await expect(page.getByRole("tooltip")).toContainText("Team Death Match")
    await expect(page.getByRole("tooltip")).toContainText("1,830 (82.3%)")
    await expect(teamDeathMatchRow).toHaveCSS("opacity", "1")
    await expect(battleRoyaleRow).toHaveCSS("opacity", "0.3")

    await battleRoyaleRow.hover()
    await expect(teamDeathMatchArc).toHaveCSS("opacity", "0.3")
    await expect(battleRoyaleArc).toHaveCSS("opacity", "1")
})

test("uses tap instead of hover for touch input", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Touch interaction applies to touch environments")

    await page.goto(`/players/${pompUID}`)

    const wins = page.getByRole("article", { name: "Wins per Game Mode" })
    const teamDeathMatchArc = wins.locator('svg path[data-category-key="m00"]')
    const teamDeathMatchRow = wins.locator('li[data-category-key="m00"]')
    const battleRoyaleRow = wins.locator('li[data-category-key="m11"]')
    const teamDeathMatchButton = teamDeathMatchRow.getByRole("button")
    const arcPoint = await getArcPoint(teamDeathMatchArc)

    if (!arcPoint) throw new Error("Team Death Match arc is not visible")

    await teamDeathMatchRow.dispatchEvent("pointerenter", { pointerType: "touch" })
    await teamDeathMatchArc.dispatchEvent("pointerenter", {
        clientX: arcPoint.x,
        clientY: arcPoint.y,
        pointerType: "touch",
    })

    await expect(teamDeathMatchRow).toHaveCSS("opacity", "1")
    await expect(battleRoyaleRow).toHaveCSS("opacity", "1")
    await expect(page.getByRole("tooltip")).toHaveCount(0)
    expect(
        await teamDeathMatchArc.evaluate((element) => {
            const event = new TouchEvent("touchmove", { bubbles: true, cancelable: true })
            element.dispatchEvent(event)

            return event.defaultPrevented
        }),
    ).toBe(false)

    await page.touchscreen.tap(arcPoint.x, arcPoint.y)
    await expect(teamDeathMatchButton).toHaveAttribute("aria-pressed", "true")
    await expect(battleRoyaleRow).toHaveCSS("opacity", "0.3")

    await teamDeathMatchButton.tap()
    await expect(teamDeathMatchButton).toHaveAttribute("aria-pressed", "false")
    await expect(battleRoyaleRow).toHaveCSS("opacity", "1")
})

test("pins and unpins highlighted bars", async ({ page }) => {
    await page.goto(`/players/${pompUID}`)
    await page.waitForLoadState("networkidle")

    const wins = page.getByRole("article", { name: "Wins per Game Mode" })
    const heading = wins.getByRole("heading", { name: "Wins per Game Mode" })
    const teamDeathMatchRow = wins.locator('li[data-category-key="m00"]')
    const battleRoyaleRow = wins.locator('li[data-category-key="m11"]')
    const teamDeathMatchButton = teamDeathMatchRow.getByRole("button")

    await expect(teamDeathMatchButton).toHaveCSS("cursor", "pointer")
    await teamDeathMatchButton.click()
    await heading.hover()

    await expect(teamDeathMatchButton).toHaveAttribute("aria-pressed", "true")
    await expect(teamDeathMatchRow).toHaveCSS("opacity", "1")
    await expect(battleRoyaleRow).toHaveCSS("opacity", "0.3")

    await teamDeathMatchButton.click()
    await heading.hover()

    await expect(teamDeathMatchButton).toHaveAttribute("aria-pressed", "false")
    await expect(teamDeathMatchRow).toHaveCSS("opacity", "1")
    await expect(battleRoyaleRow).toHaveCSS("opacity", "1")
})

test("expands a pie segment further when pinned", async ({ page, isMobile }) => {
    test.skip(isMobile, "Pie hover sizing applies to pointer hover environments")

    await page.goto(`/players/${pompUID}`)
    await page.waitForLoadState("networkidle")

    const wins = page.getByRole("article", { name: "Wins per Game Mode" })
    const heading = wins.getByRole("heading", { name: "Wins per Game Mode" })
    const teamDeathMatchArc = wins.locator('svg path[data-category-key="m00"]')
    const teamDeathMatchButton = wins.locator('li[data-category-key="m00"]').getByRole("button")
    const restingRadii = await getArcRadii(teamDeathMatchArc)
    const arcPoint = await getArcPoint(teamDeathMatchArc)

    if (restingRadii === undefined || arcPoint === undefined)
        throw new Error("Team Death Match arc is not visible")

    await expect(teamDeathMatchArc).toHaveCSS("cursor", "pointer")
    await page.mouse.move(arcPoint.x, arcPoint.y)
    await expect
        .poll(async () => (await getArcRadii(teamDeathMatchArc))?.outerRadius ?? 0)
        .toBeGreaterThan(restingRadii.outerRadius)
    await expect
        .poll(async () =>
            Math.abs(
                ((await getArcRadii(teamDeathMatchArc))?.innerRadius ?? 0) -
                    restingRadii.innerRadius,
            ),
        )
        .toBeLessThan(0.25)

    const hoveredRadii = await getArcRadii(teamDeathMatchArc)
    if (hoveredRadii === undefined) throw new Error("Team Death Match arc is not visible")

    await page.mouse.click(arcPoint.x, arcPoint.y)
    await heading.hover()
    await expect(teamDeathMatchButton).toHaveAttribute("aria-pressed", "true")
    await expect
        .poll(async () => (await getArcRadii(teamDeathMatchArc))?.outerRadius ?? 0)
        .toBeGreaterThan(hoveredRadii.outerRadius)
    await expect
        .poll(async () => (await getArcRadii(teamDeathMatchArc))?.innerRadius ?? 0)
        .toBeGreaterThan(hoveredRadii.innerRadius)

    const pinnedPoint = await getArcPoint(teamDeathMatchArc)
    if (pinnedPoint === undefined) throw new Error("Pinned Team Death Match arc is not visible")

    await page.mouse.click(pinnedPoint.x, pinnedPoint.y)
    await heading.hover()
    await expect(teamDeathMatchButton).toHaveAttribute("aria-pressed", "false")
    await expect
        .poll(async () =>
            Math.abs(
                ((await getArcRadii(teamDeathMatchArc))?.outerRadius ?? 0) -
                    restingRadii.outerRadius,
            ),
        )
        .toBeLessThan(0.25)
    await expect
        .poll(async () =>
            Math.abs(
                ((await getArcRadii(teamDeathMatchArc))?.innerRadius ?? 0) -
                    restingRadii.innerRadius,
            ),
        )
        .toBeLessThan(0.25)
})

test("follows the pointer and clamps the pie tooltip inside its chart", async ({
    page,
    isMobile,
}) => {
    test.skip(isMobile, "Pie tooltips apply to pointer hover environments")

    await page.setViewportSize({ width: 800, height: 800 })
    await page.goto(`/players/${pompUID}`)

    const wins = page.getByRole("article", { name: "Wins per Game Mode" })
    const chart = wins.locator('[data-chart="wins-donut"]')
    const teamDeathMatchArc = wins.locator('svg path[data-category-key="m00"]')
    const missileLaunchArc = wins.locator('svg path[data-category-key="m10"]')
    const missileLaunchBar = wins
        .locator('li[data-category-key="m10"]')
        .locator('[aria-hidden="true"]')
    const chartBox = await chart.boundingBox()
    if (!chartBox) throw new Error("Wins chart is not visible")

    const teamDeathMatchPoint = await getArcPoint(teamDeathMatchArc, {
        targetX: chartBox.x + chartBox.width * 0.35,
    })
    if (!teamDeathMatchPoint) throw new Error("Team Death Match arc is not visible")

    await page.mouse.move(teamDeathMatchPoint.x, teamDeathMatchPoint.y)

    const tooltip = page.getByRole("tooltip")
    await expect(tooltip).toContainText("Team Death Match")

    const followingTooltipBox = await tooltip.boundingBox()
    if (!followingTooltipBox) throw new Error("Team Death Match tooltip is not visible")

    expect(followingTooltipBox.x).toBeCloseTo(teamDeathMatchPoint.x + 10, 0)
    expect(followingTooltipBox.y).toBeCloseTo(teamDeathMatchPoint.y + 10, 0)

    const followingMissileLaunchPoint = await getArcPoint(missileLaunchArc, {
        targetX: chartBox.x + chartBox.width * 0.4,
    })
    if (!followingMissileLaunchPoint) throw new Error("Missile Launch arc is not visible")

    await page.mouse.move(followingMissileLaunchPoint.x, followingMissileLaunchPoint.y)
    await expect(tooltip).toContainText("Missile Launch / Bomb Disposal")

    const followingMissileTooltipBox = await tooltip.boundingBox()
    if (!followingMissileTooltipBox) throw new Error("Missile Launch tooltip is not visible")

    const missileLaunchPoint = await getArcPoint(missileLaunchArc, { rightmost: true })
    if (!missileLaunchPoint) throw new Error("Missile Launch arc is not visible")

    await page.mouse.move(missileLaunchPoint.x, missileLaunchPoint.y)

    await expect(tooltip).toContainText("Missile Launch / Bomb Disposal")

    const colors = await Promise.all([
        missileLaunchArc.evaluate((element) => getComputedStyle(element).fill),
        missileLaunchBar.evaluate((element) => getComputedStyle(element).backgroundColor),
        tooltip
            .locator("span")
            .first()
            .evaluate((element) => getComputedStyle(element).backgroundColor),
    ])
    expect(new Set(colors).size).toBe(1)

    const tooltipBox = await tooltip.boundingBox()
    if (!tooltipBox) throw new Error("Missile Launch tooltip is not visible")

    const chartRight = chartBox.x + chartBox.width
    const tooltipRight = tooltipBox.x + tooltipBox.width
    expect(missileLaunchPoint.x + 10 + tooltipBox.width).toBeGreaterThan(chartRight)
    expect(tooltipBox.x).toBeGreaterThanOrEqual(chartBox.x)
    expect(tooltipRight).toBeLessThanOrEqual(chartRight)
    expect(tooltipRight).toBeCloseTo(chartRight, 0)
    expect(tooltipBox.width).toBeCloseTo(followingMissileTooltipBox.width, 0)
})

test("wins card changes from half width to full width", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 })
    await page.goto(`/players/${pompUID}`)

    const gameModes = page.getByRole("region", { name: "Game Mode Statistics" })
    const wins = gameModes.getByRole("article", { name: "Wins per Game Mode" })
    const wideSectionBox = await gameModes.boundingBox()
    const wideCardBox = await wins.boundingBox()

    expect(wideSectionBox).not.toBeNull()
    expect(wideCardBox).not.toBeNull()
    expect(wideCardBox?.width).toBeLessThan((wideSectionBox?.width ?? 0) * 0.55)

    await page.setViewportSize({ width: 392, height: 800 })

    const narrowSectionBox = await gameModes.boundingBox()
    const narrowCardBox = await wins.boundingBox()

    expect(narrowSectionBox).not.toBeNull()
    expect(narrowCardBox).not.toBeNull()
    expect(narrowCardBox?.width).toBe(narrowSectionBox?.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(392)
})
