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

- `src/routes/+layout.svelte`: shared application shell, header, theme controls, and theme persistence
- `src/routes/layout.css`: the design system and most of the editorial styling
- `src/lib/theme.svelte.ts`: theme types and theme resolution helpers
- `src/lib/articles.ts`: article discovery, metadata normalization, sorting, and lookup helpers
- `src/routes/+page.ts`: homepage data loader
- `src/routes/+page.svelte`: homepage UI for the featured story and article cards
- `src/routes/articles/[articleSlug]/+page.ts`: article existence check and 404 handling
- `src/routes/articles/[articleSlug]/+page.svelte`: article page shell and article component render
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
  C --> D[src/routes/+page.ts]
  C --> E[src/routes/articles/[articleSlug]/+page.ts]
  D --> F[src/routes/+page.svelte homepage]
  E --> G[src/routes/articles/[articleSlug]/+page.svelte article shell]
  C --> G
  H[src/routes/+layout.svelte theme shell] --> F
  H --> G
  I[src/routes/layout.css design system] --> F
  I --> G
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

`src/routes/+page.ts` returns:

- `featured`
- `articles`

`src/routes/+page.svelte` then:

- renders the hero section
- renders the featured article block if one exists
- filters the featured article out of the remaining list
- renders the remaining articles as editorial cards

Links to article pages are created with SvelteKit's `resolve('/articles/[articleSlug]', { articleSlug })`.

### Article Route

`src/routes/articles/[articleSlug]/+page.ts` is intentionally narrow. It only verifies that the article summary exists. If the slug is unknown, it throws a `404`.

`src/routes/articles/[articleSlug]/+page.svelte` then:

- reads the slug from route params
- fetches the full article record with `getArticleBySlug(slug)`
- renders article metadata in the article shell
- renders the mdsvex component inside `.article-prose`

This split keeps route validation separate from rendering.

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
- `coverAlt`
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
8. Verify the article slug matches the intended URL.
9. Preview the article page and homepage card after saving.
10. Check code fences, headings, lists, and tables in both light and dark modes if the post uses them.

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

Most styling lives in `src/routes/layout.css`.

This file is not only page layout CSS. It is effectively the blog design system.

### Theme Tokens

The CSS defines design tokens for three visual themes:

- `paper`
- `journal`
- `mono`

Each theme sets variables such as:

- `--bg`
- `--surface`
- `--text`
- `--muted`
- `--accent`
- `--code-bg`

Dark variants are defined under selectors like:

```css
html.dark[data-theme='paper'] { ... }
html.dark[data-theme='journal'] { ... }
html.dark[data-theme='mono'] { ... }
```

### Shell And Layout Styles

The same CSS file also styles:

- the sticky header
- theme controls
- homepage hero section
- featured article section
- article cards
- article page shell
- typography for prose content

### Prose Styling

Articles are rendered as mostly standard HTML from markdown, so `.article-prose` is the critical styling layer. It defines how default HTML elements should look:

- headings
- paragraphs
- lists
- blockquotes
- tables
- inline code
- fenced code blocks
- horizontal rules

That means a plain markdown article still looks intentional without handcrafted article components.

### Code Block Styling

Code snippets are styled in two layers:

- Shiki generates syntax-highlighted HTML for fenced blocks
- `layout.css` styles both inline code and `<pre><code>` blocks to match the editorial theme

Recent changes increased code emphasis by making inline code more contrasty and giving block code a stronger framed container.

## How Syntax Highlighting Works

Syntax highlighting is configured in `svelte.config.js`.

Important details:

- mdsvex processes `.svx` and `.md`
- Shiki uses `github-light` and `github-dark`
- supported languages currently include `typescript`, `javascript`, `css`, `html`, `svelte`, `bash`, `json`, and `markdown`
- notation transformers are enabled for diff, focus, and highlight patterns

Because the highlighted HTML is generated during preprocessing, article code blocks render as themed HTML rather than raw plain text.

## How Theme Switching Works

Theme logic is split between `src/lib/theme.svelte.ts` and `src/routes/+layout.svelte`.

### Theme Model

`src/lib/theme.svelte.ts` defines:

- the available visual themes
- the available color modes
- the `ThemeState` type
- `resolveEffectiveMode(...)`

The visual theme controls the editorial look. The color mode controls whether the app uses light, dark, or system behavior.

### Runtime Behavior

`src/routes/+layout.svelte`:

- keeps theme state in Svelte runes state
- loads persisted values from `localStorage`
- listens to `prefers-color-scheme`
- computes the effective mode for system behavior
- writes theme state to the root HTML element using `data-theme`, `data-mode`, and `data-effective-mode`
- toggles the `dark` class on `<html>`

### Persistence

Theme settings are stored in:

- `localStorage['blog-theme']`
- `localStorage['blog-color-mode']`

That means the selected visual theme and mode survive page reloads.

## How The Header Controls Work

The header has two theme control groups:

- visual theme buttons for `paper`, `journal`, and `mono`
- mode controls for explicit light or dark switching and returning to system mode

The dark-mode toggle is a sliding thumb control. Its visual position follows the effective light or dark state.

The system-mode button switches back to system preference tracking.

## How To Customize The Blog In Future

### Add New Visual Themes

To add a new visual theme:

1. Add the theme key to `visualThemes` in `src/lib/theme.svelte.ts`.
2. Extend `VisualTheme` usage where needed.
3. Add a label in `src/routes/+layout.svelte`.
4. Add CSS variable blocks in `src/routes/layout.css` for light and dark versions.

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
- styling is centralized in `src/routes/layout.css`, so design changes should usually start there
- content discovery is automatic, so avoid adding manual article registries unless there is a strong reason
- homepage and article routes depend on consistent article metadata

## Known Operational Notes

These are useful during maintenance:

- `pnpm check` can currently surface type issues from generated `.svelte-kit/output/server/index.js`
- `pnpm lint` can be noisy if generated `.svelte-kit` output is included
- `pnpm exec vite build` can fail at the Cloudflare adapter cleanup step if `.svelte-kit/cloudflare` is locked by a running dev server

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
- `layout.css` owns the visual system
- `+layout.svelte` owns theming and shared chrome

As long as that separation stays intact, the blog should remain easy to extend without turning into a brittle set of one-off pages.
