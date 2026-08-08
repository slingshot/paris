---
name: verify
description: Verify Paris component changes end-to-end by driving them in Storybook
---

# Verifying Paris component changes

Paris is a component library; its runtime surface is Storybook.

## Launch

```bash
bun run storybook   # dev server on port 6006, up in ~1-2s
```

Wait for `curl -s http://localhost:6006/` to return 200.

## Drive

Load a story directly in the bare iframe (skips Storybook chrome, much smaller a11y snapshots):

```
http://localhost:6006/iframe.html?id=<kind>-<component>--<story>&viewMode=story
```

Story IDs are the kebab-cased `title` + story export, e.g. `Inputs/PhoneInput` `Controlled` → `inputs-phoneinput--controlled`.

Use the Playwright MCP tools (browser_navigate, browser_snapshot, browser_type, browser_click, browser_press_key, browser_take_screenshot). `browser_type` with `slowly: true` for per-keystroke handlers.

## Gotchas

- Stories whose behavior you can only see via callbacks need a story with a live readout (see PhoneInput's `Controlled` story, which prints value/validity into a `<code>` block) — add one if missing rather than asserting blind.
- Tab from the last focusable element wraps around to the first in the headless page; don't read that as a focus bug.
- Screenshots land in the repo root / `.playwright-mcp/` — delete them after sending; they must not be committed.
