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
- The current article metadata model uses the fields: `title`, `excerpt`, `published`, `readingTime`, `category`, `featured`, `image`, `imageAlt`, `heroImage`, `heroImageAlt`, `coverTone`. `coverAlt` is a deprecated alias — use `imageAlt`/`heroImageAlt` in new articles.
  - `image` / `imageAlt` — card thumbnail (16:9). Falls back to default SVG.
  - `heroImage` / `heroImageAlt` — article-page hero (21:9). Falls back to `image`, then default SVG.
- The homepage relies on `getFeaturedArticle()` and filters the featured article out of the remaining list to avoid duplicate keyed entries. `getTopArticles(count, excludeSlug?)` returns the top N articles, optionally excluding one slug.
- Theme state is centralized in `blog/src/lib/theme.svelte.ts`. The anti-FOUC IIFE (runs before hydration) lives in the root `blog/src/routes/+layout.svelte`; the full theme switcher UI and `themeLabels` map live in `blog/src/routes/(app)/+layout.svelte`

## Blog — CSS Architecture

- All blog styles live in `blog/src/lib/styles/` — **not** in `src/routes/layout.css` (that file no longer exists)
- Entry point is `blog/src/lib/styles/layout.css`, imported only by `blog/src/routes/(app)/+layout.svelte`
- Five themes: `paper` (default), `journal`, `mono`, `romantic`, `sketch` — each in `src/lib/styles/themes/<slug>.css`
- Theme CSS uses the pattern: `html[data-theme='<slug>'] { ... }` for light, `html.dark[data-theme='<slug>'] { ... }` for dark
- `components.css` contains all shared component classes (`.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.tag`, `.field*`, `.skeleton`, `.empty-state*`, `.divider`) — all use CSS custom properties so new themes auto-style them
- The root `+layout.svelte` imports **no CSS** (anti-FOUC IIFE + fonts only); the `(app)/+layout.svelte` imports the full `layout.css`
- `/sample` route has its own bare layout that imports only `components.css` with neutral token fallbacks — completely isolated from theme CSS
- **Before editing the sketch theme** (`sketch.css` or sketch-related markup): read `.github/prompts/design-hand-drawn-sketch-note/DESIGN.md` — it is the authoritative spec for sketch colors, shadows, border radii, typography, and component behavior
- **Image containers** (e.g. `<figure>` wrapping card/hero images) must use `border-radius: var(--radius)` in `components.css` — never hardcode Tailwind `rounded-*` on them, or themes with custom `--radius` values will be silently overridden. Theme-specific overrides belong in the relevant `themes/<slug>.css` file.
- **Current `--radius` values**: paper `0.75rem`, mono `0.75rem`, sketch `0.45rem` (angular, per DESIGN.md spec)
- **Root font-size**: locked at `16px` on `:root` in `paper.css` (the default/fallback theme). All rem-based sizing in the codebase is relative to this 16px base — do not change it without updating all rem values.

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

## Blog — Landing Page Architecture

The homepage (`(app)/+page.svelte`) uses a three-tier layout: **featured** → **top posts** → **story grid**.

### Card Components (`blog/src/lib/components/`)

| Component | Class | Layout | Use |
|-----------|-------|--------|-----|
| `FeaturedCard.svelte` | `.featured-card` | Landscape 16/10, gradient overlay footer, film grain texture | One hero article |
| `MiniCard.svelte` | `.mini-card` | Horizontal — square 5.2rem thumbnail + text | "Top Posts" strip |
| `StoryCard.svelte` | `.story-card` | Portrait — 16/9 image + bottom-aligned text | Story grid |

All three share the same typed props interface:

```svelte
interface Props {
  article: ArticleSummary;
  href: string;
}
let { article, href }: Props = $props();
```

- `href` is **always computed in the page route** using `resolve('/articles/[articleSlug]', { articleSlug: article.slug })` from `$app/paths`, then passed as a prop — never derived inside the card component itself.

### CSS Layout Classes

- `.landing-hero` — CSS Grid `1.5fr 1fr` on desktop; stacks to `1fr` at ≤960px. Has `2rem` horizontal margins on desktop, removed at ≤960px.
- `.top-posts-list` — flex column list of mini-cards; collapses to single column at ≤960px.
- `.story-grid` — CSS Grid, responsive columns: 6 (≥1400px) → 4 (≤1200px) → 2 (≤960px) → 1 (≤560px). Has `2rem` horizontal margins on desktop, removed at ≤960px.

### Full-Card Clickability Pattern

Wrap the entire card markup in an `<a>` tag — never nest a link inside a non-anchor card wrapper. Apply `text-decoration: none; color: inherit; cursor: pointer; display: block;` on the outer `<a>`. Never use pointer-events tricks or JS click handlers to fake clickability on a `<div>`.

### Visual Effects (do not remove)

- **Film grain**: `.featured-card::before` uses an inline SVG `data:` URI with `feTurbulence`, 28% opacity, `mix-blend-mode: overlay`. Prevents color banding on gradient overlays.
- **Frosted glass footer**: `backdrop-filter: blur(18px) saturate(0.75)` with `border-top: 1px solid hsl(0 0% 100% / 0.09)`.

## Formatting (Prettier)

- **Indentation**: tabs (not spaces)
- **Quotes**: single quotes
- **Trailing commas**: none
- **Print width**: 100 characters
- Svelte files parsed with `prettier-plugin-svelte`; Tailwind classes sorted via `prettier-plugin-tailwindcss`
