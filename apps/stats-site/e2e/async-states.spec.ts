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

test("a distribution failure produces one status announcement", async ({ page }) => {
    await page.route("**/", async (route) => {
        const response = await route.fetch()
        const body = rejectStreamedPromise(await response.text(), 2)
        await route.fulfill({ response, body })
    })

    await page.goto("/")

    const globalStatistics = page.getByRole("region", { name: "Global Statistics" })
    await expect(globalStatistics.getByText("Update time unavailable")).toHaveCount(4)
    await expect(globalStatistics.getByText("Failed to load", { exact: true })).toHaveCount(4)
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
    await page.getByRole("button", { name: "Clear search" }).click()

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
