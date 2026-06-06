# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`html-css-builder` is a published npm package (`main: src/index.js`) — an ultra-lightweight, zero-dependency helper for building DOM elements and injecting CSS from JavaScript. The guiding constraint is **minimal size and high performance**: keep the implementation tiny, avoid dependencies, and avoid features that bloat the output. The entire library lives in `src/index.js` (~40 lines).

## Commands

- `npm test` — runs Jest with coverage (`jest --collect-coverage`). Coverage is the de-facto bar; the suite is expected to stay at 100%.
- Run a single test: `npx jest -t "build CSS block"` (matches by test name).
- Tests use the `jsdom` environment (configured in `package.json` under `jest`), which is what makes `document`, `HTML(...)`, and `document.styleSheets` work without a browser.

## Public API (three exports)

- `HTML(tag, props = {}, parent = null, content = null, attrs = {})` — creates an element. `props` are assigned as DOM **properties** (`element[prop] = value`, so `className`/`onclick` work, not `class`); `attrs` are set via `setAttribute` (for `data-*`, custom attributes); `content` sets `innerHTML`; `parent` (if truthy) appends the element. Returns the element. Because `parent` is the 3rd arg, you nest by passing another `HTML(...)` call as the parent.
- `CSS(styles)` — compiles a plain `{ selector: { property: value } }` object into a CSS string and injects a new `<style>` tag into `<head>`. Output is **global** (not scoped/CSS-modules); the library deliberately maps the object directly to vanilla CSS and is **not** JSS.
- `CSS_Link(path)` — injects a `<link rel="stylesheet">` into `<head>`.

## CSS compiler architecture (`rules` + `declarations`)

The CSS generator is split into two mutually-recursive helpers — understand this before touching CSS output:

- `declarations(block)` renders a flat `{ property: value }` map. It converts camelCase property names to kebab-case (`fontSize` → `font-size`), so both DOM-style and standard CSS property names are accepted.
- `rules(styles)` iterates selectors. A selector is treated as **nested** only when it starts with `@` AND its body contains at least one object value (e.g. `@media`, `@supports`, `@container`, `@starting-style` wrapping inner rules) — in that case the body is recursed through `rules` again. Everything else (plain selectors, and declaration-only at-rules like `@font-face` whose values are strings) renders as a flat `declarations` block.

Critical invariant: **the flat (non-nested) output must remain byte-for-byte identical** — the recursive refactor preserved exact whitespace/formatting (3-space indent, leading/trailing newlines). Verify any change to these helpers against existing tests, which assert on the parsed `document.styleSheets` CSSOM (`cssRules`, `selectorText`, `style.<prop>`, and `CSSMediaRule.cssRules` for nesting).

## Notes

- The README's example uses `require('html-builder')`, but the actual package/import name is `html-css-builder`.
- `.npmignore` excludes `tests/`, `node_modules`, and `coverage/` from the published package — keep test/dev artifacts out of `src/`.
- Versioning: bumps are committed manually in `package.json` (e.g. the nested-at-rule feature bumped 0.1.8 → 0.2.0).
