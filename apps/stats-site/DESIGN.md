---
version: alpha
name: War Brokers Stats
colors:
  canvas: "#1f2937" # gray-800
  surface: "#111827" # gray-900
  surface-raised: "#374151" # gray-700
  border: "#374151" # gray-700
  text: "#f3f4f6" # gray-100
  text-muted: "#9ca3af" # gray-400
  text-on-accent: "#030712" # gray-950
  primary: "#f97316" # orange-500
  focus: "#fb923c" # orange-400
  error: "#ef4444" # red-500
  success: "#22c55e" # green-500
  warning: "#f59e0b" # amber-500
  info: "#0ea5e9" # sky-500
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
  - The hex values in the front matter only document the palette. Do not use them verbatim.
- The site supports dark appearance only. The root html has `class="dark"` set.

### Semantic UI Colors

| Role            | Tailwind color | Use                                                                                |
| --------------- | -------------- | ---------------------------------------------------------------------------------- |
| Background      | `gray-800`     | page background                                                                    |
| Surface         | `gray-900`     | cards, popovers, and alternating table rows                                        |
| Deep surface    | `gray-950`     | footer and deliberately recessed areas                                             |
| Raised surface  | `gray-700`     | header, table headers, hover rows, and raised cards                                |
| Border          | `gray-700`     | decorative borders and separators; use `gray-600` when a stronger edge is required |
| Primary text    | `gray-100`     | headings, values, labels, and body text                                            |
| Secondary text  | `gray-300`     | supporting text on `gray-600` or `gray-700`                                        |
| Muted text      | `gray-400`     | supporting text and metadata on `gray-800` or darker surfaces                      |
| Neutral control | `gray-600`     | button background; use `gray-700` on hover and `gray-800` while active             |
| Primary accent  | `orange-500`   | links and accent marks                                                             |
| Hover accent    | `orange-400`   | link hover states and links shown on `gray-700`                                    |
| Focus           | `orange-400`   | every custom focus-visible outline                                                 |
| Error           | `red-500`      | errors, unavailable data, and capacity warnings                                    |
| Success         | `green-500`    | successful status text                                                             |
| Warning         | `amber-500`    | warning status text                                                                |
| Information     | `sky-500`      | informational status text                                                          |

- Check colors against their immediate rendered background in every interaction state.
  - Normal text must have at least 4.5:1 contrast.
  - Large text, focus indicators, control boundaries, and essential graphical marks must have at least 3:1 contrast.
  - Decorative separators may have lower contrast only when they are not required to identify a control, state, or content boundary.
- Never rely on color alone to communicate a status or interaction state.
- Do not add literal color values to first-party interface styles. A chart library boundary may
  use a literal only when its API requires one; add the matching Tailwind color in a comment.

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

- Use the shared `A` component for standard inline links.
- Use `orange-500` by default and `orange-400` on hover.
- Use `hover:underline`.
  - Keep an underline visible when an inline link is not distinguishable from its surrounding text by at least 3:1 color contrast.
- External links should use `rel="external noopener noreferrer"` and `target="_blank"`.
