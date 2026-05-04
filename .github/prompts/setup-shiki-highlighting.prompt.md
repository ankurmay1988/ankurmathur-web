---
description: "Set up Shiki syntax highlighting for the blog. Installs shiki + @shikijs/transformers, configures mdsvex build-time highlighter with dual light/dark themes, creates the server-side runtime highlight utility for Cloudflare Workers, and adds the required dark mode CSS."
agent: "agent"
---

Follow the instructions in [shiki-highlighting.instructions.md](../.github/instructions/shiki-highlighting.instructions.md) and [project-conventions.instructions.md](../.github/instructions/project-conventions.instructions.md) to set up Shiki syntax highlighting for the `blog/` SvelteKit app.

Perform all of the following steps:

## Step 1 — Install packages

In `blog/`, install:
- `shiki`
- `@shikijs/transformers`

Use `pnpm add -D` from the `blog/` directory.

## Step 2 — Update `blog/svelte.config.js`

Replace the existing mdsvex preprocessor config with one that:
- Imports `escapeSvelte` from `mdsvex` and `createHighlighter` from `shiki`
- Imports `transformerNotationDiff`, `transformerNotationHighlight`, `transformerNotationFocus`, `transformerNotationErrorLevel` from `@shikijs/transformers`
- Creates a singleton `highlighter` using top-level `await createHighlighter(...)` with:
  - themes: `github-light` (light) and `github-dark` (dark)
  - langs: `typescript`, `javascript`, `csharp`, `fsharp`, `sql`, `html`, `css`, `svelte`, `bash`, `json`, `yaml`, `xml`, `powershell`, `markdown`
- Sets the mdsvex `highlight.highlighter` function that:
  - Calls `highlighter.codeToHtml(code, { lang, themes: { light: 'github-light', dark: 'github-dark' }, transformers: [...] })`
  - Wraps the result in `escapeSvelte(...)` 
  - Returns `{@html \`${html}\`}`
- Keeps all other existing config (`compilerOptions`, `kit`, `extensions`) unchanged

## Step 3 — Create `blog/src/lib/server/highlight.ts`

Create a server-only highlight utility using `createHighlighterCore` + `createJavaScriptRegexEngine` (no WASM — required for Cloudflare Workers runtime). It should:
- Import language and theme modules individually from `@shikijs/langs/*` and `@shikijs/themes/*`
- Export an async `highlightCode(code: string, lang: string): Promise<string>` function
- Use the same `github-light` / `github-dark` dual theme
- Use a singleton highlighter promise (module-level, not re-created per call)
- Include the same transformers as the build-time config

## Step 4 — Add dark mode CSS to `blog/src/routes/layout.css`

Append CSS rules that make Shiki's dual-theme tokens respond to:
1. `@media (prefers-color-scheme: dark)` — system preference
2. `html.dark .shiki` — class-based dark mode (for a future theme toggle)

Also append CSS for transformer annotation classes:
- `.line.diff.add` — green tint background
- `.line.diff.remove` — red tint background
- `.line.highlighted` — yellow tint background
- `.line.focused` / `.has-focused .line.focused` — focus dimming effect
- `.line.highlighted.error` — red tint
- `.line.highlighted.warning` — orange tint

## Step 5 — Verify

Run `pnpm run check` from `blog/` to confirm no TypeScript or Svelte errors. Fix any that appear.
