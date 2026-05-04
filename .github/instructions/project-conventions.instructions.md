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
- Article pages render through `blog/src/routes/articles/[articleSlug]/+page.svelte`, but the content itself is loaded from the article registry in `blog/src/lib/articles.ts`
- mdsvex processes `.svx` and `.md` files as Svelte components — in this blog, prefer `.svx` for article content because the implementation uses module-script metadata exports
- Route params use `params.articleSlug` (camelCase), not `params.article_slug`
- Article discovery is automatic via `import.meta.glob('./content/articles/*.{md,svx}', { eager: true })` inside `blog/src/lib/articles.ts`; do not add a manual registry unless the architecture changes
- The current article metadata model is `title`, `excerpt`, `published`, `readingTime`, `category`, `featured`, `coverAlt`, and `coverTone`
- The homepage relies on `getFeaturedArticle()` and filters the featured article out of the remaining list to avoid duplicate keyed entries
- Theme state is centralized in `blog/src/lib/theme.svelte.ts` and applied from `blog/src/routes/+layout.svelte` using `data-theme`, `data-mode`, `data-effective-mode`, and the `dark` class on `<html>`

## Formatting (Prettier)

- **Indentation**: tabs (not spaces)
- **Quotes**: single quotes
- **Trailing commas**: none
- **Print width**: 100 characters
- Svelte files parsed with `prettier-plugin-svelte`; Tailwind classes sorted via `prettier-plugin-tailwindcss`
