import { expect, test } from "@playwright/test"

// cspell:ignore networkidle
test("mobile navigation exposes and hides its links without resetting on navigation", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto("/ranks", { waitUntil: "networkidle" })

    const toggle = page.getByRole("button", { name: "Primary navigation" })
    const navigation = page.locator("#primary-navigation")

    // The collapsed panel is associated with its toggle but excluded from interaction.
    await expect(toggle).toHaveAttribute("aria-controls", "primary-navigation")
    await expect(toggle).toHaveAttribute("aria-expanded", "false")
    await expect(navigation).toHaveAttribute("inert", "")

    // Keyboard traversal skips the links inside the inert panel.
    await page.keyboard.press("Tab")
    await expect(page.getByRole("link", { name: /War Brokers logo/ })).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(toggle).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(page.getByRole("link", { name: "POMP" })).toBeFocused()

    // Expanding from the keyboard restores the links to the tab order.
    await toggle.focus()
    await page.keyboard.press("Enter")

    await expect(toggle).toHaveAttribute("aria-expanded", "true")
    await expect(navigation).not.toHaveAttribute("inert", "")

    await page.keyboard.press("Tab")
    await expect(navigation.getByRole("link", { name: "Home" })).toBeFocused()

    // Navigating does not change the menu expansion state.
    await navigation.getByRole("link", { name: "Home" }).click()
    await expect(page).toHaveURL("/")
    await expect(toggle).toHaveAttribute("aria-expanded", "true")
    await expect(navigation).not.toHaveAttribute("inert", "")
})
