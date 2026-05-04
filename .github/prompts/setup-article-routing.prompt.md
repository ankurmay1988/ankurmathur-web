---
description: "Set up the full blog article system: content folder structure, article .svx files with frontmatter, article layout component, article list page, and the dynamic [articleSlug] route that loads and renders articles."
agent: "agent"
---

Follow the instructions in [blog-articles.instructions.md](../.github/instructions/blog-articles.instructions.md) and [project-conventions.instructions.md](../.github/instructions/project-conventions.instructions.md) to build the blog article system in the `blog/` SvelteKit app.

Perform all of the following steps in order:

## Step 1 — Article content folder

Create the folder `blog/src/lib/articles/`. This is where `.svx` article files will live (as importable content components, separate from routes).

Create one sample article `blog/src/lib/articles/hello-world.svx` with:
- Frontmatter fields: `title`, `description`, `date` (today's date, `YYYY-MM-DD`), `tags` (array), `published: true`
- A `# {title}` heading that uses the frontmatter variable
- Two or three short paragraphs of placeholder content
- One fenced code block with a language tag (e.g., `typescript` or `csharp`)

## Step 2 — Article layout component

Create `blog/src/lib/layouts/ArticleLayout.svelte`. It should:
- Use Svelte 5 runes mode with `<script lang="ts">`
- Accept props via `$props()`: `title: string`, `description: string`, `date: string`, `tags: string[]`, `children: import('svelte').Snippet`
- Render a semantic `<article>` with a `<header>` containing the title and formatted date
- Render `{@render children()}` for the article body
- Use Tailwind CSS prose classes (`prose`, `prose-lg`, etc.) for article typography

Register the layout in `blog/svelte.config.js` by adding a `layout` option to the mdsvex config:
```js
layout: {
  article: './src/lib/layouts/ArticleLayout.svelte'
}
```

## Step 3 — Update the sample article

Add `layout: article` to the frontmatter of `hello-world.svx` so it uses the layout created above.

## Step 4 — Article index page (article listing)

Create `blog/src/routes/articles/+page.svelte` that:
- Receives article metadata from a load function (see below)
- Renders a list of article cards, each linking to `/articles/{slug}` with the title, date, description, and tags

Create `blog/src/routes/articles/+page.ts` with a `load` function that:
- Statically imports all `.svx` files from `$lib/articles/` using Vite's `import.meta.glob`
- Maps them to `{ slug, title, description, date, tags }` objects using their exported `metadata`
- Filters out `published: false` articles
- Sorts by `date` descending
- Returns `{ articles }` 

## Step 5 — Dynamic article route

Update `blog/src/routes/articles/[articleSlug]/+page.svelte` to:
- Accept `PageProps` from `./$types` with `$props()`
- Receive a `component` (the article Svelte component) from the load function
- Render it with `{@render data.component()}` or `<svelte:component this={data.component} />`

Create `blog/src/routes/articles/[articleSlug]/+page.ts` with a `load` function that:
- Uses `import.meta.glob` to get all articles from `$lib/articles/`
- Looks up the file matching `params.articleSlug`
- Throws a `404` error via SvelteKit's `error()` helper if not found
- Returns `{ component: module.default }`

## Step 6 — Verify

Run `pnpm run check` from `blog/` to confirm no TypeScript or Svelte errors. Fix any that appear. Then run `pnpm run dev` briefly and confirm `/articles` and `/articles/hello-world` render without errors.
