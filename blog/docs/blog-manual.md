# Blog Manual

This document explains how the `blog/` app currently works, what was added to turn it into the editorial blog, and where to extend it safely in the future.

## What Changed From The Starter Project

The original app was the default SvelteKit starter with Tailwind, mdsvex, and the Cloudflare adapter scaffolded but not yet shaped into a real publication.

The blog implementation added these major pieces:

- a custom editorial shell with switchable visual themes
- light, dark, and system color-mode support with persistence
- a homepage that lists and highlights articles
- a content registry that discovers article files automatically
- dynamic article routes based on slug
- mdsvex article content using `.svx` files with metadata exports
- Shiki-based syntax highlighting for fenced code blocks
- custom typography and prose styles for article HTML output

## Current Project Structure

The most important files are:

- `src/routes/+layout.svelte`: minimal root layout — anti-FOUC IIFE, Google Fonts links, favicon only
- `src/routes/(app)/+layout.svelte`: full blog shell — nav, theme switcher, theme persistence, imports CSS
- `src/lib/styles/layout.css`: CSS entry point that imports all theme files, base, components, and responsive CSS
- `src/lib/styles/themes/`: one CSS file per visual theme (`paper.css`, `mono.css`, `sketch.css`)
- `src/lib/styles/components.css`: all shared component classes (`.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.tag`, `.field`, `.skeleton`, `.empty-state`, `.divider`, etc.)
- `src/lib/styles/base.css`: html/body resets, selection, links
- `src/lib/styles/responsive.css`: all `@media` breakpoints (theme-agnostic)
- `src/lib/theme.svelte.ts`: theme types and theme resolution helpers
- `src/lib/articles.ts`: article discovery, metadata normalization, sorting, and lookup helpers
- `src/routes/(app)/+page.ts`: homepage data loader
- `src/routes/(app)/+page.svelte`: homepage UI for the featured story and article cards
- `src/routes/(app)/articles/[articleSlug]/+page.ts`: article existence check and 404 handling
- `src/routes/(app)/articles/[articleSlug]/+page.svelte`: article page shell and article component render
- `src/routes/sample/+layout.svelte`: isolated bare layout for the Component Museum (no theme CSS)
- `src/routes/sample/+page.svelte`: `/sample` Component Museum developer reference page
- `src/lib/content/articles/*.svx`: article source files
- `svelte.config.js`: mdsvex and Shiki configuration

## How The Blog Works

At a high level, the blog works like this:

1. Article files are stored in `src/lib/content/articles/`.
2. `src/lib/articles.ts` loads those files with `import.meta.glob(..., { eager: true })`.
3. Each article file exports `metadata` and a default Svelte component generated from mdsvex.
4. The article registry converts those files into normalized article records.
5. The homepage load function asks for the featured article and the full article list.
6. The article route looks up a single article by `params.articleSlug`.
7. The article page renders the article metadata in the page shell and mounts the mdsvex component as the body.

That means articles are content-driven rather than manually registered in routes.

### Visual Flow Diagram

The content and rendering pipeline can be summarized like this:

```mermaid
flowchart TD
  A[src/lib/content/articles/*.svx] --> B[svelte.config.js mdsvex + Shiki preprocess]
  B --> C[src/lib/articles.ts registry]
  C --> D[src/routes/(app)/+page.ts]
  C --> E[src/routes/(app)/articles/[articleSlug]/+page.ts]
  D --> F[src/routes/(app)/+page.svelte homepage]
  E --> G[src/routes/(app)/articles/[articleSlug]/+page.svelte article shell]
  C --> G
  H[src/routes/+layout.svelte root: anti-FOUC + fonts] --> F
  H --> G
  J[src/routes/(app)/+layout.svelte blog shell + theme switcher] --> F
  J --> G
  I[src/lib/styles/layout.css CSS entry] --> J
  K[src/lib/styles/themes/*.css 5 themes] --> I
  L[src/lib/styles/components.css shared classes] --> I
```

Read it from left to right:

- content files are compiled by mdsvex and Shiki
- the article registry normalizes metadata and exposes lookup helpers
- route loaders fetch the right data shape for each page
- route components render the page inside the shared shell and design system

## How Articles Are Loaded

Article loading is centralized in `src/lib/articles.ts`.

### Discovery

This file uses:

```ts
const articleModules = import.meta.glob('./content/articles/*.{md,svx}', {
	eager: true
});
```

That tells Vite to import every `.md` or `.svx` file in the article content folder at build time.

### Metadata Extraction

Each discovered module can provide:

- `default`: the rendered Svelte component
- `metadata`: article metadata exported from the file

The code then derives a slug from the filename and merges metadata with a fallback summary object so missing fields do not break rendering.

### Normalization

`src/lib/articles.ts` also normalizes and formats the published date:

- `normalizePublishedAt(...)` converts valid input into ISO format for sorting
- `formatPublishedDate(...)` converts valid input into readable output such as `May 4, 2026`

### Sorting

Articles are sorted newest-first using `publishedAt`.

### Public Helpers

The rest of the app uses these helpers:

- `listArticleSummaries()`: returns all articles without the component field
- `getFeaturedArticle()`: returns the featured article or falls back to the first article
- `getArticleSummaryBySlug(slug)`: returns article metadata for route loading
- `getArticleBySlug(slug)`: returns the full article record including the mdsvex component

## How Articles Are Rendered

### Homepage

`src/routes/(app)/+page.ts` returns:

- `featured`
- `articles`

`src/routes/(app)/+page.svelte` then:

- renders the hero section
- renders the featured article block if one exists
- filters the featured article out of the remaining list
- renders the remaining articles as editorial cards

Links to article pages are created with SvelteKit's `resolve('/articles/[articleSlug]', { articleSlug })`.

### Article Route

`src/routes/(app)/articles/[articleSlug]/+page.ts` is intentionally narrow. It only verifies that the article summary exists. If the slug is unknown, it throws a `404`.

`src/routes/(app)/articles/[articleSlug]/+page.svelte` then:

- reads the slug from route params
- fetches the full article record with `getArticleBySlug(slug)`
- renders article metadata in the article shell
- renders the mdsvex component inside `.article-prose`

This split keeps route validation separate from rendering.

### Image URL Handling

Article metadata can use **external URLs** (e.g., Unsplash) for `image` and `heroImage`. Because SvelteKit's `resolve()` from `$app/paths` only works with internal pathnames, all components that display article images use a `resolveImage()` helper:

```ts
function resolveImage(url: string): string {
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	}
	return resolve(url);
}
```

This helper is defined in:
- `FeaturedCard.svelte`
- `MiniCard.svelte`
- `StoryCard.svelte`
- `[articleSlug]/+page.svelte`

If you create a new component that renders `article.image` or `article.heroImage`, always use this pattern — passing an external URL directly to `resolve()` will crash the page with a 500 error at runtime.

## How Article Files Should Be Written

Articles currently live in `src/lib/content/articles/` and are written as `.svx` files.

The current pattern looks like this:

```svx
<script module lang="ts">
  export const metadata = {
    title: 'My New Article',
    excerpt: 'Short summary shown on cards and meta tags.',
    published: '2026-05-04',
    readingTime: '5 min read',
    category: 'Notes',
    featured: false,
    image: '/images/articles/default-card-coder.svg',
    imageAlt: 'Short visual description',
    heroImage: '/images/articles/default-hero-coder.svg',
    heroImageAlt: 'Wide hero visual description',
    coverAlt: 'Short visual description',
    coverTone: 'amber'
  };
</script>

# My New Article

Article body written in markdown.
```

### Why `.svx` Instead Of `.md`

The current setup uses module-script metadata exports inside the content files. `.svx` is the safer format for that in this project because it is explicitly treated as mdsvex content with Svelte syntax enabled.

### Recommended Metadata Fields

Use these fields consistently:

- `title`
- `excerpt`
- `published`
- `readingTime`
- `category`
- `featured`
- `image` — card thumbnail URL (can be external or local)
- `imageAlt` — alt text for the card thumbnail
- `heroImage` — wide hero image URL for the article page (falls back to `image`)
- `heroImageAlt` — alt text for the hero image (falls back to `imageAlt`)
- `coverAlt` — legacy alias for `imageAlt`
- `coverTone`

If you omit a field, `src/lib/articles.ts` will fill in fallbacks for several of them, but it is better to set them explicitly.

## How To Add More Content

To add a new article:

1. Create a new file in `src/lib/content/articles/`, for example `my-second-post.svx`.
2. Export a `metadata` object from a `<script module lang="ts">` block.
3. Write the article body in markdown below that block.
4. Save the file.
5. Reload the homepage or article route.

The article will be discovered automatically. No route registration is required.

### Article Authoring Checklist

Use this checklist whenever you add a new post:

1. Create the file in `src/lib/content/articles/` using a kebab-case filename.
2. Use `.svx` if the article needs metadata exports or embedded Svelte components.
3. Add a `<script module lang="ts">` block with complete metadata.
4. Make sure `title`, `excerpt`, `published`, `readingTime`, and `category` are all set.
5. Use a valid date string for `published` so sorting and date formatting work correctly.
6. Set `featured: true` only if you want the article to become the homepage featured story.
7. Keep the excerpt short enough to work in homepage cards.
8. Set `image` and `heroImage` to either external URLs (e.g., Unsplash) or local paths under `/images/articles/`.
9. Verify the article slug matches the intended URL.
10. Preview the article page and homepage card after saving.
11. Check code fences, headings, lists, and tables in both light and dark modes if the post uses them.

### Authoring Tips

- Use fenced code blocks with an explicit language, for example ` ```ts ` or ` ```css `, so Shiki can highlight them correctly.
- Prefer plain markdown structure first. Add custom Svelte components only when markdown is not enough.
- Keep article titles reasonably short because both the homepage cards and article header use large editorial type.
- If an article includes custom components, ensure they still feel at home inside `.article-prose`.

### Slug Rules

The slug comes from the filename.

Example:

- file: `building-quiet-interfaces.svx`
- slug: `building-quiet-interfaces`
- URL: `/articles/building-quiet-interfaces`

### Featured Article Behavior

If an article has `featured: true`, the homepage can use it as the featured story. If no article is marked featured, the first article in the sorted list is used instead.

## How Styling Works

Styling is a modular CSS system that lives in `src/lib/styles/`. The entry point is `layout.css`, which is imported **only** by `src/routes/(app)/+layout.svelte` — not the root layout — so the blog's theme CSS never leaks to isolated routes like `/sample`.

### File Layout

```
src/lib/styles/
  layout.css          ← entry: @import tailwindcss + all theme files + base + components + responsive
  base.css            ← html, body, ::selection, a, img resets
  components.css      ← all shared component classes (.card, .btn, .tag, .field, .skeleton, etc.)
  responsive.css      ← @media breakpoints (theme-agnostic)
  themes/
    paper.css         ← default :root + html.dark[data-theme='paper']
    mono.css
    sketch.css
```

### Theme Tokens

Three visual themes are available: `paper` (default), `mono`, and `sketch`.

Each theme CSS file defines two blocks:

- `html[data-theme='<slug>'] { ... }` — §1 light-mode design tokens
- `html.dark[data-theme='<slug>'] { ... }` — §1 dark-mode token overrides
- Optional §2 blocks for effects tokens cannot express (backgrounds, pseudo-content, hard shadows, font-family overrides on specific elements)

Required tokens per theme: `--bg`, `--bg-accent`, `--surface`, `--surface-strong`, `--text`, `--muted`, `--border`, `--accent`, `--accent-soft`, `--quote`, `--code-bg`, `--hero-glow`, `--selection`.

Optional per-theme tokens: `--font-sans`, `--font-serif`, `--font-display`, `--radius`, `--shadow-soft`, `--error`.

### Shared Component Classes

`components.css` contains base styles for all reusable UI elements. Every value uses `var(--token)`, so adding a new theme automatically styles all components correctly.

Available classes:

| Class | Role |
|---|---|
| `.site-chrome` | Top navigation bar |
| `.brand-mark` | Site title link in nav |
| `.theme-chip` | Visual theme selector button |
| `.mode-toggle` | Light/dark mode switch with sliding thumb |
| `.system-toggle` | System color mode button |
| `.featured-card` | Large featured article card |
| `.mini-card` | Compact landscape article card |
| `.story-card` | Grid article card |
| `.card-tag` / `.card-tag--on-image` | Category pill badge |
| `.card-meta` / `.card-meta__dot` / `.card-meta--light` | Date + reading time row |
| `.section-header` / `.section-header__label` | Section header with decorative line |
| `.landing-hero` | Homepage featured + top posts grid |
| `.article-shell` | Article page container |
| `.article-header` / `.article-dek` / `.article-meta` | Article metadata display |
| `.article-prose` | Article body prose wrapper |
| `.back-link` | "Back to all writing" link |
| `.eyebrow` / `.section-label` | Small uppercase accent label |
| `.home-hero` / `.hero-copy` | Homepage hero section |

### Shell And Layout Styles

The `(app)/+layout.svelte` styles (`.theme-shell`, `.site-chrome`, `.brand-mark`, `.theme-chip`, `.mode-toggle`, etc.) are scoped inside `components.css` and the layout-specific sections.

### Prose Styling

Articles are rendered as mostly standard HTML from markdown, so `.article-prose` is the critical styling layer. It defines how default HTML elements should look:

- headings, paragraphs, lists, blockquotes, tables
- inline code and fenced code blocks
- horizontal rules

That means a plain markdown article still looks intentional without handcrafted article components.

### Code Block Styling

Code snippets are styled in two layers:

- Shiki generates syntax-highlighted HTML for fenced blocks
- `components.css` styles both inline code and `<pre><code>` blocks to match the editorial theme

## How Syntax Highlighting Works

Syntax highlighting is configured in `svelte.config.js`.

Important details:

- mdsvex processes `.svx` and `.md`
- Shiki uses `github-light` and `github-dark`
- supported languages currently include `typescript`, `javascript`, `css`, `html`, `svelte`, `bash`, `json`, `markdown`, `csharp`, `sql`, and `yaml`
- notation transformers are enabled for diff, focus, and highlight patterns

Because the highlighted HTML is generated during preprocessing, article code blocks render as themed HTML rather than raw plain text.

## How Theme Switching Works

Theme logic is split between `src/lib/theme.svelte.ts` and `src/routes/+layout.svelte`.

### Theme Model

`src/lib/theme.svelte.ts` defines:

- the available visual themes (`visualThemes` array — source of truth)
- the available color modes
- the `ThemeState` type
- `resolveEffectiveMode(...)`

The visual theme controls the editorial look. The color mode controls whether the app uses light, dark, or system behavior.

### Runtime Behavior

Theme logic is split across two layout files:

**Root layout (`src/routes/+layout.svelte`):**

- Contains an inline anti-FOUC IIFE that runs before JS hydration
- IIFE reads `localStorage`, sets `data-theme`, `data-mode`, and the `dark` class on `<html>` before first paint
- Contains a hardcoded `visualThemes` array that **must mirror** `theme.svelte.ts`
- Loads Google Fonts and favicon — applies to all routes including `/sample`
- Does **not** import any CSS

**Blog app layout (`src/routes/(app)/+layout.svelte`):**

- Imports `$lib/styles/layout.css` (full theme CSS — applies only to blog routes)
- Keeps theme state in Svelte runes (`$state`, `$effect`)
- Loads persisted values from `localStorage`
- Listens to `prefers-color-scheme`
- Computes effective mode for system behavior
- Renders nav, theme chip switcher, and color mode toggle
- Contains the `themeLabels` display-name map

### Persistence

Theme settings are stored in:

- `localStorage['blog-theme']`
- `localStorage['blog-color-mode']`

That means the selected visual theme and mode survive page reloads.

## How The Header Controls Work

The header has two theme control groups:

- visual theme buttons for `paper`, `mono`, and `sketch`
- mode controls for explicit light or dark switching and returning to system mode

The dark-mode toggle is a sliding thumb control. Its visual position follows the effective light or dark state.

The system-mode button switches back to system preference tracking.

## How To Customize The Blog In Future

### Add New Visual Themes

A detailed workflow is documented in `.github/skills/add-blog-theme/SKILL.md`. Short version:

1. Create `src/lib/styles/themes/<slug>.css` with §1 light/dark token blocks and any §2 component overrides.
2. Add `@import './themes/<slug>.css'` to `src/lib/styles/layout.css`.
3. Add `'<slug>'` to `visualThemes` in `src/lib/theme.svelte.ts`.
4. Add label entry to `themeLabels` in `src/routes/(app)/+layout.svelte`.
5. Add `'<slug>'` to the IIFE array in `src/routes/+layout.svelte` (anti-FOUC).

If you skip the CSS token blocks, the new theme button will exist but not have a unique visual identity.

### Add More Article Metadata

If you want author names, cover images, tags, series info, or hero media:

1. extend `ArticleSummary` in `src/lib/articles.ts`
2. read the new fields from `module.metadata`
3. decide whether fallbacks are needed
4. render the new fields in `+page.svelte` and article route components as needed

### Add Widgets Or Reusable Blocks

There are two main ways to add widgets in future.

#### Option 1: Reusable Svelte Components Inside Articles

Because the articles are `.svx`, you can import and render Svelte components directly inside article content.

Typical examples:

- callout boxes
- pull quotes
- charts
- code playground wrappers
- newsletter signup blocks

Recommended pattern:

1. create a component under `src/lib/components/`
2. import it inside a `.svx` article
3. render it where needed in the markdown flow

Use this when the widget belongs to article content.

Example component:

```svelte
<script lang="ts">
	let {
		title,
		children
	}: {
		title: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<aside class="callout-box">
	<strong>{title}</strong>
	{@render children?.()}
</aside>
```

Example usage inside an article:

```svx
<script module lang="ts">
  export const metadata = {
    title: 'My New Article',
    excerpt: 'Short summary shown on cards and meta tags.',
    published: '2026-05-04',
    readingTime: '5 min read',
    category: 'Notes',
    featured: false,
    coverAlt: 'Short visual description',
    coverTone: 'amber'
  };
</script>

<script lang="ts">
  import CalloutBox from '$lib/components/CalloutBox.svelte';
</script>

Regular markdown paragraph above the widget.

<CalloutBox title="Why this matters">
  This block is a reusable Svelte widget rendered inside the article flow.
</CalloutBox>

Regular markdown continues below.
```

If you add article widgets this way, keep two constraints in mind:

- the component should still look correct inside `.article-prose`
- the article should remain readable even if the widget is visually richer than surrounding markdown

#### Option 2: Shared Widgets In Page Shells

If a widget should appear around articles rather than inside them, place it in route components such as:

- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/routes/articles/[articleSlug]/+page.svelte`

Use this for things like:

- author bio blocks
- related posts
- reading progress
- newsletter footer
- social sharing controls

Use this when the widget is part of the shared page chrome.

### Add Related Posts

The clean place to start is `src/lib/articles.ts`.

You could add a helper like `getRelatedArticles(slug, category)` and then render the result near the end of `src/routes/articles/[articleSlug]/+page.svelte`.

### Add Tags Or Categories Pages

The current model already contains `category`. If you want taxonomy pages later, the likely next step is:

1. add richer taxonomy fields to article metadata
2. create grouping helpers in `src/lib/articles.ts`
3. add new routes such as `src/routes/categories/[category]/+page.ts`

### Add Search

If search is added later, the best starting point is the normalized article summaries from `listArticleSummaries()`. They already provide a stable content index for client-side or server-side search.

## Editing Guidelines For Future Work

When making future changes, keep these constraints in mind:

- the project uses Svelte 5 runes mode
- article content is markdown-first and should continue to work as plain HTML output
- styling is centralized in `src/lib/styles/` (entry: `layout.css`), so design changes should usually start in the relevant theme file or `components.css`
- content discovery is automatic, so avoid adding manual article registries unless there is a strong reason
- homepage and article routes depend on consistent article metadata

## Known Operational Notes

These are useful during maintenance:

- `pnpm check` can currently surface type issues from generated `.svelte-kit/output/server/index.js`
- `pnpm lint` can be noisy if generated `.svelte-kit` output is included
- `pnpm exec vite build` can fail at the Cloudflare adapter cleanup step if `.svelte-kit/cloudflare` is locked by a running dev server
- **Never pass an external URL to SvelteKit's `resolve()` function.** It only accepts internal pathnames and route IDs. Article images often use external URLs (e.g., Unsplash), so always use the `resolveImage()` helper (defined in card components and the article page) which detects external URLs automatically.
- When adding article metadata with `image` or `heroImage` fields, be aware that the Shiki highlighter's language list in `svelte.config.js` must include every language used in article code blocks — otherwise the build will fail with "Language X not found".

Those issues are about generated output and local dev state, not the source architecture described above.

## Suggested Next Extensions

If you continue evolving this blog, the most natural next additions are:

1. related posts on article pages
2. author metadata and author cards
3. tags or category archive pages
4. reusable mdsvex widgets for callouts, figures, and embeds
5. optional article hero media

## Summary

The current blog is a markdown-first editorial system built on SvelteKit, mdsvex, and a centralized article registry.

Its core idea is simple:

- content files drive the site
- route files stay thin
- `articles.ts` owns discovery and normalization
- `src/lib/styles/` owns the visual system (one file per theme; shared component classes in `components.css`)
- root `+layout.svelte` owns anti-FOUC and fonts; `(app)/+layout.svelte` owns the blog chrome and theme switcher

### Route Architecture

```
src/routes/
  +layout.svelte                        ← root: anti-FOUC IIFE + fonts + favicon (no CSS import)
  (app)/
    +layout.svelte                      ← blog layout: full CSS + nav + theme switcher
    +page.svelte / +page.ts             ← / homepage
    articles/
      [articleSlug]/
        +page.svelte / +page.ts         ← /articles/:slug
  sample/
    +layout.svelte                      ← bare layout: only components.css + neutral token fallbacks
    +page.svelte                        ← /sample Component Museum (dev reference)
```

The `(app)/` route group keeps blog-chrome-wrapped routes isolated from `sample/`, which intentionally has no nav, no theme switcher, and no theme CSS pollution.

As long as that separation stays intact, the blog should remain easy to extend without turning into a brittle set of one-off pages.
