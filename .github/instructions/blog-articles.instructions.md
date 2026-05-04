---
description: "Use when creating or editing blog articles, mdsvex files, .svx files, .md article content, or article layout components. Covers file format choice, frontmatter schema, using Svelte components inside markdown, importing markdown as components, and Svelte 5 runes mode compatibility. For syntax highlighting with Shiki, see shiki-highlighting.instructions.md."
---

# Blog Article Conventions (mdsvex)

## File Format Choice

Both `.svx` and `.md` are processed by mdsvex (configured in `svelte.config.js`). Choose based on content:

| Extension | Use when                                                                         |
| --------- | -------------------------------------------------------------------------------- |
| `.svx`    | Article needs metadata exports, Svelte components, or any module/instance script |
| `.md`     | Pure prose only, with no need for module-script metadata exports                 |

For this repo's current implementation, place article content at: `blog/src/lib/content/articles/`.

The route files under `blog/src/routes/articles/[articleSlug]/` render content loaded from `blog/src/lib/articles.ts`; they are not authored as per-article `+page.svx` files.

## Metadata Model Used In This Repo

The implemented blog currently uses a module export named `metadata` from each article file instead of YAML frontmatter.

```svx
<script module lang="ts">
  export const metadata = {
    title: 'My Article Title',
    excerpt: 'A short description for cards and metadata.',
    published: '2026-05-04',
    readingTime: '5 min read',
    category: 'Notes',
    featured: false,
    coverAlt: 'Short visual description',
    coverTone: 'amber'
  };
</script>

# My Article Title

Written content starts here.
```

Current expected metadata fields are:

- `title`
- `excerpt`
- `published`
- `readingTime`
- `category`
- `featured`
- `coverAlt`
- `coverTone`

Notes:

- `published` should be a valid date string such as `YYYY-MM-DD`
- `featured: true` marks the article for homepage featuring
- `src/lib/articles.ts` provides fallbacks for several fields, but future content should still set them explicitly

## Svelte Components Inside Markdown (`.svx` / `.md`)

Add a `<script>` block at the top of the file (before any markdown) to import components. In runes mode, use `<script lang="ts">`.

```svx
<script lang="ts">
  import Chart from '$lib/components/Chart.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

# My Article

Here is an interactive chart:

<Chart data={[1, 2, 3]} />

<Callout type="info">
  This is a custom callout component.
</Callout>

Regular **markdown** continues below.
```

Rules:

- The `<script>` block must come before any markdown content
- Do **not** indent Svelte component tags — mdsvex is whitespace-sensitive
- Do **not** indent fenced code blocks (` ``` `) — indentation breaks them
- Svelte expressions `{variable}` work directly in markdown prose

## Module Script for Metadata

In Svelte 5 runes mode, `context="module"` is replaced by `<script module>`. In this repo, use `<script module>` for article metadata exports:

```svx
<script module lang="ts">
  export const metadata = {
    title: 'My Article Title',
    excerpt: 'A short description for cards and metadata.',
    published: '2026-05-04',
    readingTime: '5 min read',
    category: 'Notes',
    featured: false,
    coverAlt: 'Short visual description',
    coverTone: 'amber'
  };
</script>

# Article content here
```

Do not use `context="module"`; use `<script module lang="ts">`.

If you need article-level interactive components as well, add a second instance script:

```svx
<script module lang="ts">
  export const metadata = {
    title: 'Interactive Article',
    excerpt: 'Example article with a widget.',
    published: '2026-05-04',
    readingTime: '6 min read',
    category: 'Notes',
    featured: false,
    coverAlt: 'Short visual description',
    coverTone: 'amber'
  };
</script>

<script lang="ts">
  import CalloutBox from '$lib/components/CalloutBox.svelte';
</script>
```

## Importing Markdown as a Svelte Component

Render a `.svx` or `.md` file as a component inside a `.svelte` file:

```svelte
<script lang="ts">
  import ArticleContent from './content.svx';
</script>

<article>
  <ArticleContent />
</article>
```

Access the metadata without rendering:

```ts
import { metadata } from "./content.svx";
// metadata.title, metadata.date, etc.
```

In this repo, article rendering is centralized through `blog/src/lib/articles.ts`, so prefer using the registry helpers `getArticleBySlug()`, `getArticleSummaryBySlug()`, `listArticleSummaries()`, and `getFeaturedArticle()` instead of manually importing article files from route components.

## Article Shell In This Repo

This repo does not currently use mdsvex layout mapping for articles. Instead, article content is rendered inside the article shell defined in `blog/src/routes/articles/[articleSlug]/+page.svelte`.

That shell is responsible for:

- back navigation
- article title, excerpt, category, and meta display
- wrapping the article body in `.article-prose`

If you need to change shared article-page chrome, edit the route component rather than introducing a parallel mdsvex layout system unless you intend to refactor the whole content pipeline.

## Custom Markdown Element Components

Export named components from the layout's `<script module>` to replace default HTML elements:

```svelte
<script module lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Blockquote from '$lib/components/Blockquote.svelte';
  export { CodeBlock as pre, Blockquote as blockquote };
</script>
```

Export name must exactly match the HTML element tag (`pre`, `p`, `h1`, `blockquote`, `img`, `a`, etc.).

## Syntax Highlighting

This repo uses Shiki through `svelte.config.js`, not PrismJS. Always specify the language on fenced code blocks:

````svx
```typescript
const x: number = 42;
```
````

The current configuration uses `github-light` and `github-dark` themes plus notation transformers. If you add new code examples, prefer languages already registered in `svelte.config.js` or extend that list deliberately.

## Common Pitfalls

- **Don't indent fenced code blocks** — indentation breaks the parser
- **Don't use frontmatter if you want to follow the current repo pattern** — this blog currently expects module-script `metadata` exports in article files
- **Don't use `export let` for frontmatter props in layouts** — use `$props()` (runes mode)
- **Svelte expressions in markdown must use `{}`** — e.g., `{title}`, not template literals
- **Blank line required** between a Svelte component and the next markdown paragraph to avoid parse issues
- **Don't place new article files under route folders** unless the architecture changes — current discovery looks in `blog/src/lib/content/articles/`
- **Don't manually add a second registry for posts** — update `blog/src/lib/articles.ts` if the article model changes
