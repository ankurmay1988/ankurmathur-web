---
description: "Use when writing or editing Svelte components, SvelteKit routes, Cloudflare Workers integration, Tailwind CSS, or blog article content. Covers Svelte 5 runes mode, TypeScript conventions, Tailwind v4 setup, mdsvex article routing, and monorepo structure."
---

# Project Conventions

## Monorepo Structure

- Two SvelteKit apps: `blog/` (articles/content site) and `main/` (main website)
- Both deployed to **Cloudflare Workers** via `@sveltejs/adapter-cloudflare`
- Package manager is **pnpm**; run commands from within each app's directory

## Svelte 5 Runes Mode (mandatory)

Runes mode is **forced** for all non-library files via `svelte.config.js`. Always use runes syntax — never the legacy options API.

```svelte
<script lang="ts">
  // Props — use $props(), not export let
  let { children } = $props();
  let { params }: PageProps = $props();

  // Derived state — use $derived(), not $:
  let slug = $derived(params.articleSlug);

  // Reactive state — use $state(), not let with reactivity
  let count = $state(0);
</script>
```

**Never use**: `export let`, `$:` reactive statements, `onMount` when `$effect` suffices, or the legacy component options API.

## TypeScript

- All `.svelte` files use `<script lang="ts">`
- `tsconfig.json` has `"strict": true` — no implicit `any`, no unsafe assignments
- Import types with `import type { ... }` for type-only imports
- Use SvelteKit's generated `$types` for route-level types:
  ```ts
  import type { PageProps } from "./$types";
  ```

## Tailwind CSS v4

- Tailwind is configured via a Vite plugin (`@tailwindcss/vite`), not `tailwind.config.js`
- Import in `layout.css` using the v4 syntax:
  ```css
  @import "tailwindcss";
  @plugin '@tailwindcss/forms';
  @plugin '@tailwindcss/typography';
  ```
- Do **not** create a `tailwind.config.js` — configuration is done via CSS `@theme` blocks if needed
- For Svelte route/component markup, use Tailwind utilities as the default for **layout and structure** (container sizing, display/grid/flex, gaps, spacing, responsive behavior, width/height, typography scale)
- In blog routes, prefer standard Tailwind scale classes (`p-4`, `gap-6`, `rounded-3xl`, `text-sm`, `max-w-4xl`, etc.) over arbitrary utilities (`[ ... ]`) for spacing/sizing/typography unless there is a proven hard requirement
- Keep raw CSS in `src/lib/styles/` focused on theme look-and-feel (tokens, color treatments, shadows, decorative backgrounds, code styling), not structural layout rules for route markup
- In CSS-grid layouts, apply `min-w-0` to grid children (or parent utility `*:min-w-0`) to avoid intrinsic-width overflow and horizontal scrolling
- When class lists become long, extract them into local `const ui = { ... } as const` class maps in the Svelte file for readability while still using Tailwind utilities
- For article pages, avoid extra width caps on the article wrapper when the app shell already controls width; tune wide-screen behavior at shell level (`(app)/+layout.svelte`) using responsive `max-w-*` classes
- When validating wide-screen spacing in the integrated browser tools, note viewport constraints can under-report true desktop widths; verify final large-screen behavior in a real desktop browser when needed

## Cloudflare Workers Integration

- Platform types are declared in `src/app.d.ts` via `App.Platform`:
  ```ts
  interface Platform {
    env: Env; // KV, D1, R2, etc. bindings from wrangler.jsonc
    ctx: ExecutionContext;
    caches: CacheStorage;
  }
  ```
- Access bindings in `+page.server.ts` load functions via `platform.env.*`
- Worker name and bindings are configured in `wrangler.jsonc`
- Compatibility date must match project's `wrangler.jsonc`; do not downgrade it

## Blog — Article Routing & mdsvex

- Article content currently lives at `blog/src/lib/content/articles/`
- Article pages render through `blog/src/routes/(app)/articles/[articleSlug]/+page.svelte`, loaded from the article registry in `blog/src/lib/articles.ts`
- mdsvex processes `.svx` and `.md` files as Svelte components — in this blog, prefer `.svx` for article content because the implementation uses module-script metadata exports
- Route params use `params.articleSlug` (camelCase), not `params.article_slug`
- Article discovery is automatic via `import.meta.glob('./content/articles/*.{md,svx}', { eager: true })` inside `blog/src/lib/articles.ts`; do not add a manual registry unless the architecture changes
- The current article metadata model is `title`, `excerpt`, `published`, `readingTime`, `category`, `featured`, `coverAlt`, and `coverTone`
- The homepage relies on `getFeaturedArticle()` and filters the featured article out of the remaining list to avoid duplicate keyed entries
- Theme state is centralized in `blog/src/lib/theme.svelte.ts`. The anti-FOUC IIFE (runs before hydration) lives in the root `blog/src/routes/+layout.svelte`; the full theme switcher UI and `themeLabels` map live in `blog/src/routes/(app)/+layout.svelte`

## Blog — CSS Architecture

- All blog styles live in `blog/src/lib/styles/` — **not** in `src/routes/layout.css` (that file no longer exists)
- Entry point is `blog/src/lib/styles/layout.css`, imported only by `blog/src/routes/(app)/+layout.svelte`
- Five themes: `paper` (default), `journal`, `mono`, `romantic`, `sketch` — each in `src/lib/styles/themes/<slug>.css`
- Theme CSS uses the pattern: `html[data-theme='<slug>'] { ... }` for light, `html.dark[data-theme='<slug>'] { ... }` for dark
- `components.css` contains all shared component classes (`.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.tag`, `.field*`, `.skeleton`, `.empty-state*`, `.divider`) — all use CSS custom properties so new themes auto-style them
- The root `+layout.svelte` imports **no CSS** (anti-FOUC IIFE + fonts only); the `(app)/+layout.svelte` imports the full `layout.css`
- `/sample` route has its own bare layout that imports only `components.css` with neutral token fallbacks — completely isolated from theme CSS

## Blog — Route Group Architecture

```
blog/src/routes/
  +layout.svelte                  ← root: minimal (anti-FOUC IIFE, fonts, favicon — no CSS)
  (app)/
    +layout.svelte                ← blog shell: layout.css + nav + theme switcher
    +page.svelte / +page.ts       ← / homepage
    articles/[articleSlug]/       ← /articles/:slug
  sample/
    +layout.svelte                ← isolated: only components.css
    +page.svelte                  ← /sample Component Museum
```

When adding new blog routes, put them inside `(app)/` so they get the full nav and theme chrome automatically.

## Formatting (Prettier)

- **Indentation**: tabs (not spaces)
- **Quotes**: single quotes
- **Trailing commas**: none
- **Print width**: 100 characters
- Svelte files parsed with `prettier-plugin-svelte`; Tailwind classes sorted via `prettier-plugin-tailwindcss`
