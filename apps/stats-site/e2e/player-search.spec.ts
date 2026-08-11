import { expect, type Route, test } from "@playwright/test"

const pompUID = "5d2ead35d142affb05757778"
const secondUID = "aaaaaaaaaaaaaaaaaaaaaaaa"
const searchRoute = "**/trpc/players.searchByName*"

type SearchResult = {
    nick: string
    squad: string | null
    uid: string
}

const results: SearchResult[] = [
    { nick: "POMP", squad: "LP", uid: pompUID },
    { nick: "Pompy", squad: null, uid: secondUID },
]

function fulfillSearch(route: Route, data: SearchResult[]) {
    return route.fulfill({
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: JSON.stringify([{ result: { data } }]),
    })
}

/**
 * Pauses mocked async work until the test explicitly resolves it,
 * avoiding timing-based sleeps when asserting an in-flight state.
 */
function createControlledPromise() {
    let resolvePromise: () => void = () => {}
    const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve
    })

    return { promise, resolve: resolvePromise }
}

function getSearchQuery(route: Route): string {
    const input = new URL(route.request().url()).searchParams.get("input")
    if (!input) throw new Error("Expected a tRPC input query parameter")

    const payload: unknown = JSON.parse(input)
    if (
        typeof payload !== "object" ||
        payload === null ||
        !("0" in payload) ||
        typeof payload["0"] !== "object" ||
        payload["0"] === null ||
        !("query" in payload["0"]) ||
        typeof payload["0"].query !== "string"
    ) {
        throw new Error("Expected a batched player search query")
    }

    return payload["0"].query
}

test("player search supports combobox keyboard navigation", async ({ page }) => {
    await page.route(searchRoute, (route) => fulfillSearch(route, results))
    await page.goto("/-vs-")

    const search = page.getByRole("combobox", { name: "Search Player A" })
    await search.fill("po")

    const listbox = page.getByRole("listbox")
    const options = listbox.getByRole("option")
    await expect(listbox).toBeVisible()
    await expect(options).toHaveCount(2)
    await expect(search).toHaveAttribute("aria-expanded", "true")
    await expect(search).toHaveAttribute("aria-controls", "player-a-search-results")
    await expect(search).not.toHaveAttribute("aria-activedescendant")

    await search.press("Enter")
    await expect(page).toHaveURL("/-vs-")

    await search.press("End")
    await expect(search).not.toHaveAttribute("aria-activedescendant")
    await expect
        .poll(() =>
            search.evaluate((input) =>
                input instanceof HTMLInputElement ? input.selectionStart : null,
            ),
        )
        .toBe(2)
    await search.press("Enter")
    await expect(page).toHaveURL("/-vs-")

    await search.press("Home")
    await expect(search).not.toHaveAttribute("aria-activedescendant")
    await expect
        .poll(() =>
            search.evaluate((input) =>
                input instanceof HTMLInputElement ? input.selectionStart : null,
            ),
        )
        .toBe(0)

    await search.press("ArrowDown")
    await expect(search).toHaveAttribute(
        "aria-activedescendant",
        `player-a-search-option-${pompUID}`,
    )
    await expect(options.first()).toHaveAttribute("aria-selected", "true")

    await search.press("ArrowDown")
    await expect(search).toHaveAttribute(
        "aria-activedescendant",
        `player-a-search-option-${secondUID}`,
    )

    await search.press("ArrowUp")
    await expect(search).toHaveAttribute(
        "aria-activedescendant",
        `player-a-search-option-${pompUID}`,
    )
    await expect(search).toBeFocused()

    await search.press("Escape")
    await expect(listbox).toBeHidden()
    await expect(search).toHaveAttribute("aria-expanded", "false")
    await expect(search).toBeFocused()
    await expect(search).toHaveValue("po")

    await search.click()
    await expect(listbox).toBeVisible()
    await search.press("ArrowDown")
    await search.press("Enter")
    await expect(page).toHaveURL(`/${pompUID}-vs-`)
})

test("player search preserves native links and skips options when tabbing", async ({ page }) => {
    await page.route(searchRoute, (route) => fulfillSearch(route, results))
    await page.goto("/-vs-")

    const playerASearch = page.getByRole("search", { name: "Search Player A" })
    const input = playerASearch.getByRole("combobox")
    await input.fill("po")

    const firstOption = playerASearch.getByRole("option").first()
    await expect(firstOption).toHaveAttribute("href", `/${pompUID}-vs-`)
    await expect(firstOption).toHaveAttribute("tabindex", "-1")

    await input.press("Tab")
    await expect(page.getByRole("combobox", { name: "Search Player B" })).toBeFocused()
    await expect(playerASearch.getByRole("listbox")).toBeHidden()
    await expect(input).toHaveAttribute("aria-expanded", "false")

    await input.click()
    await firstOption.click()
    await expect(page).toHaveURL(`/${pompUID}-vs-`)
})

test("player search exposes short, loading, empty, result, and error states", async ({ page }) => {
    let requestCount = 0
    const slowSearchResponse = createControlledPromise()
    await page.route(searchRoute, async (route) => {
        requestCount += 1
        const query = getSearchQuery(route)

        if (query === "slow") {
            await slowSearchResponse.promise
            await fulfillSearch(route, results)
            return
        }

        if (query === "none") {
            await fulfillSearch(route, [])
            return
        }

        await route.abort("failed")
    })
    await page.goto("/-vs-")

    const playerSearch = page.getByRole("search", { name: "Search Player A" })
    const input = playerSearch.getByRole("combobox")
    const status = page.getByRole("status").first()

    await input.fill("p")
    await expect(page.getByText("Enter at least 2 characters.")).toBeVisible()
    await expect(input).not.toHaveAttribute("aria-invalid", "true")
    await page.waitForTimeout(400)
    expect(requestCount).toBe(0)

    await input.fill("slow")
    const loadingResults = playerSearch.locator('[aria-busy="true"]')
    await expect(loadingResults).toBeVisible()
    await expect(loadingResults).toHaveClass(/animate-pulse/)
    await expect(loadingResults.getByText("Searching players...")).toHaveCount(0)
    await expect(status).toHaveText("Searching players...")
    await input.press("Escape")
    await expect(loadingResults).toBeHidden()

    slowSearchResponse.resolve()

    await expect(status).toHaveText("2 players found.")
    await expect(playerSearch.getByRole("listbox")).toBeHidden()
    await expect(input).toHaveAttribute("aria-expanded", "false")

    await input.click()
    await expect(playerSearch.getByRole("listbox")).toBeVisible()

    await input.fill("none")
    await expect(page.locator("#player-a-search-message")).toHaveText(
        'No players found for "none".',
    )
    await expect(page.locator("#player-a-search-message")).toHaveClass(/text-gray-400/)
    await expect(input).not.toHaveAttribute("aria-invalid", "true")
    await expect(status).toHaveText('No players found for "none".')

    await input.fill("fail")
    await expect(page.locator("#player-a-search-message")).toBeVisible()
    await expect(page.locator("#player-a-search-message")).toHaveClass(/text-red-400/)
    await expect(status).toHaveText("Unable to search players. Try again.")
    await expect(input).toHaveAttribute("aria-describedby", "player-a-search-message")
    await expect(input).toHaveAttribute("aria-invalid", "true")
})

test("player search ignores responses for superseded queries", async ({ page }) => {
    const pendingRequests = new Map<string, Route>()
    await page.route(searchRoute, (route) => {
        pendingRequests.set(getSearchQuery(route), route)
    })
    await page.goto("/-vs-")

    const playerSearch = page.getByRole("search", { name: "Search Player A" })
    const input = playerSearch.getByRole("combobox")

    await input.fill("old")
    await expect.poll(() => pendingRequests.has("old")).toBe(true)
    await input.fill("new")
    await expect.poll(() => pendingRequests.has("new")).toBe(true)

    const newRequest = pendingRequests.get("new")
    if (!newRequest) throw new Error("Expected the new search request")
    await fulfillSearch(newRequest, [{ nick: "New result", squad: null, uid: secondUID }])
    await expect(playerSearch.getByRole("option", { name: /New result/ })).toBeVisible()

    const oldRequest = pendingRequests.get("old")
    if (!oldRequest) throw new Error("Expected the old search request")
    await fulfillSearch(oldRequest, [{ nick: "Old result", squad: null, uid: pompUID }])
    await expect(playerSearch.getByRole("option", { name: /New result/ })).toBeVisible()
    await expect(playerSearch.getByRole("option", { name: /Old result/ })).toHaveCount(0)
})

test("player search waits for IME composition to finish", async ({ page }) => {
    let requestCount = 0
    await page.route(searchRoute, async (route) => {
        requestCount += 1
        await fulfillSearch(route, results)
    })
    await page.goto("/-vs-")

    const playerSearch = page.getByRole("search", { name: "Search Player A" })
    const input = playerSearch.getByRole("combobox")
    await input.focus()
    await input.dispatchEvent("compositionstart")
    await input.evaluate((element) => {
        if (!(element instanceof HTMLInputElement)) throw new Error("Expected search input")

        element.value = "玩家"
        element.dispatchEvent(
            new InputEvent("input", {
                bubbles: true,
                data: "玩家",
                inputType: "insertCompositionText",
                isComposing: true,
            }),
        )
    })

    await page.waitForTimeout(400)
    expect(requestCount).toBe(0)

    await input.dispatchEvent("compositionend")
    await expect.poll(() => requestCount).toBe(1)
    await expect(playerSearch.getByRole("listbox")).toBeVisible()
})

test("player search cancels pending debounce work when destroyed", async ({ page }) => {
    let requestCount = 0
    await page.route(searchRoute, async (route) => {
        requestCount += 1
        await fulfillSearch(route, results)
    })
    await page.goto("/-vs-")

    await page.getByRole("combobox", { name: "Search Player A" }).fill("po")
    await page.getByRole("link", { name: /War Brokers logo/ }).click()
    await expect(page).toHaveURL("/")
    await page.waitForTimeout(400)

    expect(requestCount).toBe(0)
})
