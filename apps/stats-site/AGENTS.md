# AGENTS.md

## Design

For visual, interaction, accessibility, etc., read and follow [DESIGN.md](./DESIGN.md).
Make sure `npx @google/design.md lint apps/stats-site/DESIGN.md` returns no warning or error
after modifying `DESIGN.md`.

## llms.txt

Update `static/llms.txt` when adding new route or data.

## Playwright

Rely on `mise run verify`. Do not install playwright manually unless explicitly requested.
