---
version: alpha
name: War Brokers Stats
colors:
  # Flowbite overrides the Tailwind CSS color palette. The colors below are the overridden colors.
  canvas: "#1f2937" # gray-800
  surface: "#111827" # gray-900
  surface-raised: "#374151" # gray-700
  border: "#374151" # gray-700
  text: "#f3f4f6" # gray-100
  text-muted: "#9ca3af" # gray-400
  text-on-accent: "#030712" # gray-950
  primary: "#FF5A1F" # orange-500
  focus: "#FF8A4C" # orange-400
  error: "#F98080" # red-400
  success: "#31C48D" # green-400
  warning: "#fbbf24" # amber-400
  info: "#38bdf8" # sky-400
typography:
  # Tailwind V3's default font-sans stack. See <https://v3.tailwindcss.com/docs/font-family>.
  body:
    fontFamily: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
  numbers:
    fontFamily: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
    fontFeature: tabular-nums
spacing:
  base: 4px
rounded:
  compact: 6px
  control: 8px
  card: 12px
  pill: 9999px
---

# War Brokers Stats Design System

## Overview

War Brokers Stats site is a clean and modern web interface with data and statistics
(for War Brokers, an online multi-player first-person shooter game) as its primary content.

The goal of the design is to present as many information as possible without compromising on readability.

## Agent Skills and Precedence

Use the [`better-interface` skill by Jakub Krehel](https://jakub.kr/skills) for
typography, accessibility, layout, writing, color, and UI review.

This document owns War Brokers Stats product decisions and takes precedence over any agent skill.
Skills may identify a problem or guide the implementation, but must not override it without
updating this document in the same change.

## Colors

- Use Tailwind CSS named colors and opacity modifiers.
  - Hex values in the front matter of this file only documents the palette. Do not copy them into components.

- The site supports dark appearance only. The root html has `class="dark"` set.
- Use Tailwind CSS colors rather than custom color values.
- Use `orange` for accents.
- Use `red` for errors.
- Never rely on color alone to communicate an error.

## Data States

### Loading States

- Page structure should load as quickly as possible and not wait for anything. Let data stream in as they are ready.
- Minimize layout shift.
  - Loading placeholders must reserve approximately the same space and structure as the resolved content.
  - Give media and charts an explicit aspect ratio or stable minimum height.
- Never let the user read text such as `loading...` to know that content is loading. Loading state can always be communicated visually.
- Only dynamic data must have a placeholder. Static content must not be included in the placeholder.
- Set `aria-busy="true"` on the closest meaningful content container while it is pending. Remove `aria-busy` when the request settles.
- Skeletons
  - Use Tailwind CSS `animate-pulse` for skeletons.
  - Keep skeletons hidden for 150ms, then fade them in over 150ms, so quickly resolved requests do not flash a loading state.
  - Mark skeleton shapes `aria-hidden="true"`.

### Error States

- Do not use redundant copy such as `Unable to load the Kills Elo leaderboard.` when the container already specifies what the data should be (in this case, `Kills Elo leaderboard`).
  - Stick with bold `Failed to load`.
- Never directly expose an exception, backend error message, stack trace, or other internal error details in the UI.
- Do not silently discard errors that should be logged or reported.
- Do not rely on color alone to convey error state.

## Links

- Color
  - `orange-500` by default
  - `orange-600` on hover
- Show underline on hover.
- External links
  - should be marked as such
    - HTML: and `rel="external noopener noreferrer"`
    - visual:
  - Should open in new tab (`target="_blank"`)
