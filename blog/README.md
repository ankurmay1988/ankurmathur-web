# Ankur Mathur Blog

This app is the editorial blog inside the `ankurmathur-web` workspace. It is built with SvelteKit, Svelte 5 runes, Tailwind CSS v4, mdsvex, Shiki, and the Cloudflare adapter.

The blog is designed around a markdown-first publishing workflow:

- articles live as `.svx` content files
- article discovery is automatic
- the homepage and article routes stay thin
- typography, themes, and prose rendering are centralized

## What This App Includes

- a homepage with a featured story and article grid
- dynamic article routes based on file slug
- switchable visual themes: `paper`, `journal`, `mono`
- color modes: `light`, `dark`, `system`
- Shiki syntax highlighting for fenced code blocks
- editorial prose styling for markdown-generated HTML

## Scripts

Run commands from the `blog/` directory.

```sh
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm lint
pnpm format
```

## Development Notes

- `pnpm dev` starts the local Vite development server.
- `pnpm build` runs Svelte sync, generates Wrangler types, and builds the app.
- `pnpm preview` runs the Cloudflare worker preview build.
- `pnpm check` runs `svelte-check` and type generation.
- `pnpm lint` runs Prettier and ESLint.

Known local caveats:

- generated `.svelte-kit` output can make `pnpm check` or `pnpm lint` noisy
- `pnpm exec vite build` can fail at Cloudflare cleanup if the dev server is still locking `.svelte-kit/cloudflare`

## Content Authoring

Articles live in `src/lib/content/articles/` and are normally written as `.svx` files.

Each article should export metadata from a module script:

```svx
<script module lang="ts">
  export const metadata = {
    title: 'My New Article',
    excerpt: 'Short summary shown on cards and in page metadata.',
    published: '2026-05-04',
    readingTime: '5 min read',
    category: 'Notes',
    featured: false,
    coverAlt: 'Short visual description',
    coverTone: 'amber'
  };
</script>
```

The file name becomes the article slug.

Example:

- `my-second-post.svx` becomes `/articles/my-second-post`

## Documentation

Detailed implementation notes live in `docs/blog-manual.md`.

That manual covers:

- architecture and routing
- article loading and rendering
- styling and theme behavior
- how to add new content
- how to extend the blog with new widgets or features
