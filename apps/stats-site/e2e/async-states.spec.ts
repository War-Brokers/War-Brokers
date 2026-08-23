import { expect, type Route, test } from "@playwright/test"

const serverListRoute = "**/trpc/status.serverList*"
const overflowingServers = Array.from({ length: 8 }, (_, index) => ({
    name: `USA_${String(index + 1).padStart(2, "0")}`,
    gameMode: "m00",
    isTeams: true,
    map: 3,
    playerCount: index + 1,
    maxPlayers: 16,
}))
const sortableServers = [
    {
        name: "Charlie",
        gameMode: "m11",
        isTeams: true,
        map: 2,
        playerCount: 2,
        maxPlayers: 16,
    },
    {
        name: "Alpha",
        gameMode: "m00",
        isTeams: true,
        map: 49,
        playerCount: 3,
        maxPlayers: 16,
    },
    {
        name: "Bravo",
        gameMode: "m07",
        isTeams: false,
        map: 0,
        playerCount: 1,
        maxPlayers: 16,
    },
]

function fulfillBatchedServerLists(route: Route, data: unknown[]) {
    const procedures = decodeURIComponent(new URL(route.request().url()).pathname)
        .split("/trpc/")[1]
        ?.split(",")
    if (!procedures) throw new Error("Expected a batched server-list request")

    return route.fulfill({
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: JSON.stringify(procedures.map(() => ({ result: { data } }))),
    })
}

function rejectStreamedPromise(body: string, id: number): string {
    const rejectedBody = body.replace(
        new RegExp(
            `<script>__sveltekit_dev\\.resolve\\(${id}, \\(\\) => \\[[\\s\\S]*?\\]\\)<\\/script>`,
        ),
        `<script>__sveltekit_dev.resolve(${id}, () => [, {message: "Internal Error"}])</script>`,
    )

    if (rejectedBody === body) throw new Error(`Expected streamed promise ${id}`)
    return rejectedBody
}

test("server tables use shaped placeholders before an empty result", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize({ width: 320, height: 900 })

    const pendingRoutes: Route[] = []
    await page.route(serverListRoute, (route) => {
        pendingRoutes.push(route)
    })

    await page.goto("/servers")
    await expect.poll(() => pendingRoutes.length).toBeGreaterThan(0)

    const busyBodies = page.locator('tbody[aria-busy="true"]')
    const skeletonShape = busyBodies.first().locator(".skeleton-reveal").first()
    await expect(busyBodies.first()).toBeVisible()
    await expect(busyBodies.first()).toHaveClass(/animate-pulse/)
    await expect(busyBodies.first()).toHaveCSS("animation-name", "none")
    await expect(skeletonShape).toHaveCSS("animation-name", "skeleton-reveal")
    await expect(skeletonShape).toHaveCSS("animation-delay", "0.15s")
    await expect(skeletonShape).toHaveCSS("animation-duration", "0.15s")
    await expect(busyBodies.first().locator('tr[aria-hidden="true"]')).toHaveCount(1)
    await expect(page.getByText(/Loading/i)).toHaveCount(0)
    await expect
        .poll(() =>
            page.evaluate(() => ({
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: document.documentElement.clientWidth,
            })),
        )
        .toEqual({ documentWidth: 320, viewportWidth: 320 })

    await Promise.all(pendingRoutes.map((route) => fulfillBatchedServerLists(route, [])))

    await expect(page.getByText(/No active servers in/).first()).toBeVisible()
    await expect(busyBodies).toHaveCount(0)

    const emptyTable = page.getByRole("region", { name: "USA servers" })
    const emptyRow = emptyTable.locator("tbody tr")
    const tableHeight = await emptyTable.evaluate((element) => element.clientHeight)
    await expect
        .poll(() => emptyRow.evaluate((element) => element.clientHeight))
        .toBeGreaterThan(tableHeight - 60)

    const backgroundBeforeHover = await emptyRow.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
    )
    await emptyRow.hover()
    await expect
        .poll(() => emptyRow.evaluate((element) => getComputedStyle(element).backgroundColor))
        .toBe(backgroundBeforeHover)

    await expect
        .poll(() =>
            page.evaluate(() => ({
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: document.documentElement.clientWidth,
            })),
        )
        .toEqual({ documentWidth: 320, viewportWidth: 320 })
})

test("server table failures expose concise safe copy", async ({ page }) => {
    await page.route(serverListRoute, (route) => route.abort("failed"))
    await page.goto("/servers")

    await expect(page.getByText("Failed to load").first()).toBeVisible()
    await expect(page.getByText("ERROR", { exact: true })).toHaveCount(0)
})

test("server tables keep a fixed height when results overflow", async ({ page }) => {
    const pendingRoutes: Route[] = []
    await page.route(serverListRoute, (route) => {
        pendingRoutes.push(route)
    })

    await page.goto("/servers")
    await expect.poll(() => pendingRoutes.length).toBeGreaterThan(0)

    const scroller = page.getByRole("region", { name: "USA servers" })
    await expect(scroller).toBeVisible()
    const pendingHeight = await scroller.evaluate((element) => element.clientHeight)

    await Promise.all(
        pendingRoutes.map((route) => fulfillBatchedServerLists(route, overflowingServers)),
    )

    await expect(scroller.locator("tbody tr")).toHaveCount(8)
    await expect
        .poll(() => scroller.evaluate((element) => element.clientHeight))
        .toBe(pendingHeight)
    await expect
        .poll(() => scroller.evaluate((element) => element.scrollHeight))
        .toBeGreaterThan(pendingHeight)

    await scroller.press("End")
    await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
})

test("server tables sort by every displayed column", async ({ page }) => {
    await page.route(serverListRoute, (route) => fulfillBatchedServerLists(route, sortableServers))
    await page.goto("/servers")

    const table = page.getByRole("region", { name: "USA servers" })
    const serverNames = () => table.locator("tbody tr td:first-child").allTextContents()
    await expect.poll(serverNames).toEqual(["Alpha", "Bravo", "Charlie"])

    const cases = [
        {
            label: "Server",
            ascending: ["Alpha", "Bravo", "Charlie"],
            descending: ["Charlie", "Bravo", "Alpha"],
        },
        {
            label: "Team Mode",
            ascending: ["Bravo", "Charlie", "Alpha"],
            descending: ["Charlie", "Alpha", "Bravo"],
        },
        {
            label: "Game Mode",
            ascending: ["Charlie", "Bravo", "Alpha"],
            descending: ["Alpha", "Bravo", "Charlie"],
        },
        {
            label: "Map",
            ascending: ["Bravo", "Alpha", "Charlie"],
            descending: ["Charlie", "Alpha", "Bravo"],
        },
        {
            label: "Players",
            ascending: ["Bravo", "Charlie", "Alpha"],
            descending: ["Alpha", "Charlie", "Bravo"],
        },
    ]

    for (const { label, ascending, descending } of cases) {
        const button = table.getByRole("button", { name: `Sort by ${label}` })
        const header = button.locator("xpath=ancestor::th")

        if (label !== "Server") {
            await button.focus()
            await page.keyboard.press("Enter")
        }
        await expect(header).toHaveAttribute("aria-sort", "ascending")
        await expect.poll(serverNames).toEqual(ascending)

        await button.click()
        await expect(header).toHaveAttribute("aria-sort", "descending")
        await expect.poll(serverNames).toEqual(descending)
    }
})

test("map previews render above the sticky table header", async ({ page }) => {
    await page.route(serverListRoute, (route) => fulfillBatchedServerLists(route, sortableServers))
    let resolveMapImageRequest!: (route: Route) => void
    const mapImageRequest = new Promise<Route>((resolve) => {
        resolveMapImageRequest = resolve
    })
    await page.route("https://war-brokers.fandom.com/wiki/Special:Redirect/file/*", (route) => {
        resolveMapImageRequest(route)
    })
    await page.goto("/servers")

    const table = page.getByRole("region", { name: "USA servers" })
    const mapLink = table.getByRole("link", { name: "Gold Mine V2" })
    await mapLink.hover()

    const skeleton = page.locator('[data-slot="skeleton"]')
    const mapImageRoute = await mapImageRequest
    await expect(skeleton).toBeVisible()
    await mapImageRoute.fulfill({
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="144"></svg>',
    })

    const preview = page.getByRole("img", { name: "Gold Mine V2 preview" })
    await expect(preview).toBeVisible()
    await expect(skeleton).toHaveCount(0)

    const popover = preview.locator("xpath=ancestor::*[@data-slot='popover-content']")
    const header = table.locator("thead")
    const [popoverBox, headerBox] = await Promise.all([popover.boundingBox(), header.boundingBox()])
    if (!popoverBox || !headerBox) throw new Error("Expected visible popover and table header")

    const overlap = {
        x: Math.max(popoverBox.x, headerBox.x) + 2,
        y: Math.max(popoverBox.y, headerBox.y) + 2,
    }
    expect(overlap.x).toBeLessThan(
        Math.min(popoverBox.x + popoverBox.width, headerBox.x + headerBox.width),
    )
    expect(overlap.y).toBeLessThan(
        Math.min(popoverBox.y + popoverBox.height, headerBox.y + headerBox.height),
    )
    await expect
        .poll(() =>
            popover.evaluate(
                (element, point) => element.contains(document.elementFromPoint(point.x, point.y)),
                overlap,
            ),
        )
        .toBe(true)
})

test("a distribution failure produces one status announcement", async ({ page }) => {
    await page.route("**/", async (route) => {
        const response = await route.fetch()
        const body = rejectStreamedPromise(await response.text(), 2)
        await route.fulfill({ response, body })
    })

    await page.goto("/")

    const globalStatistics = page.getByRole("region", { name: "Global Statistics" })
    await expect(globalStatistics.getByText("Update time unavailable")).toHaveCount(5)
    await expect(globalStatistics.getByText("Failed to load", { exact: true })).toHaveCount(5)
    await expect(globalStatistics.getByRole("status")).toHaveCount(1)
    await expect(globalStatistics.getByRole("status")).toHaveText(
        "Global statistics failed to load.",
    )
})

test("leaderboard count failures preserve previous-page navigation", async ({ page }) => {
    await page.route("**/leaderboard/xp?page=2", async (route) => {
        const response = await route.fetch()
        const body = rejectStreamedPromise(await response.text(), 2)
        await route.fulfill({ response, body })
    })

    await page.goto("/leaderboard/xp?page=2")

    await expect(page.getByText("Page count unavailable.")).toBeVisible()
    const previous = page.getByRole("button", { name: "Previous" })
    await expect(previous).toBeVisible()
    await expect(previous).toBeEnabled()

    await previous.click()
    await expect(page).toHaveURL("/leaderboard/xp?page=1")
})

test("squad filters explain empty results and can be cleared", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.goto("/squads")

    await expect
        .poll(() =>
            page.evaluate(() => ({
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: document.documentElement.clientWidth,
            })),
        )
        .toEqual({ documentWidth: 320, viewportWidth: 320 })

    const filter = page.locator("#squad-search")
    await filter.fill("no-squad-match")

    await expect(page.getByText("No squads match “no-squad-match”.")).toBeVisible()
    await filter.fill("")

    await expect(filter).toHaveValue("")
    await expect(page.locator('main a[href^="/squads/"]').first()).toBeVisible()
})

test("route errors expose safe copy and navigation", async ({ page }) => {
    const response = await page.goto("/path/that/does/not/exist")

    expect(response?.status()).toBe(404)
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible()
    await expect(
        page.getByText("The page may have moved or the address may be incorrect."),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/")
})
