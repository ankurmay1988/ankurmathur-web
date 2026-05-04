---
description: "Full setup of the blog project from scratch. Runs all blog setup steps in sequence: Shiki syntax highlighting, article routing system, and layout. Use this to bootstrap a fresh blog/ app or start from the current scaffold."
agent: "agent"
---

Follow the instructions in [project-conventions.instructions.md](../.github/instructions/project-conventions.instructions.md), [blog-articles.instructions.md](../.github/instructions/blog-articles.instructions.md), and [shiki-highlighting.instructions.md](../.github/instructions/shiki-highlighting.instructions.md).

Set up the complete `blog/` SvelteKit app by executing the following prompts in order. For each, read the referenced prompt file and carry out all its steps before moving to the next.

## Phase 1 — Shiki Syntax Highlighting

Carry out every step in [setup-shiki-highlighting.prompt.md](./setup-shiki-highlighting.prompt.md).

## Phase 2 — Article Routing System

Carry out every step in [setup-article-routing.prompt.md](./setup-article-routing.prompt.md).

## Phase 3 — Final Checks

After both phases are complete:

1. Run `pnpm run check` from `blog/` — fix any remaining TypeScript or Svelte errors
2. Run `pnpm run build` from `blog/` — confirm the Cloudflare Workers build succeeds with no errors
3. Summarise what was created and any manual follow-up steps the user should know about (e.g., adding new languages to the Shiki config, frontmatter fields for new articles)
