# Project Overview

A **data-driven resume/portfolio website** for Ankur Mathur (`ankurmathur.in`). The site renders Ankur's full career profile (6 work experiences, education, 5 skill categories, contact info) from a single JSON file through swappable visual templates. All content is hand-authored in `resume.json` — no CMS, no database.

## Monorepo Layout

Monorepo with two SvelteKit projects:
- `main/` — Resume/portfolio website (this project)
- `blog/` — Blog website at blog.ankurmathur.in

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5 runes mode) with `@sveltejs/adapter-cloudflare`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin) + Custom CSS (`layout.css`)
- **Language**: TypeScript (strict mode)
- **Build**: pnpm, Rolldown (via Vite 8)
- **Deployment**: Cloudflare Workers (GitOps pipeline via GitHub Actions)
- **Email**: Cloudflare `sendEmail` binding

## Commands

```bash
# Dev server (from main/ directory)
pnpm run dev --host

# Build
pnpm run build

# Deploy (handled by GitOps on commit)
pnpm run deploy

# Type checking
pnpm run check

# Lint
pnpm run lint

# Format
pnpm run format
```

Run all commands from the `main/` directory. The dev server must be killed (`Ctrl+C`) before building/deploying.

## Architecture

### Routing

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static (prerendered) | Main resume page |
| `/resume` | Static (prerendered) | Print-optimized PDF/download |
| `/api/contact` | Dynamic (POST only) | Contact form endpoint |

### Component Structure (`src/lib/templates/`)

Templates are organized for multi-theme support:

```
templates/
  index.ts                # Template registry/selector
  <name>/
    ResumePage.svelte     # Main layout (implements local <svelte:head> for resources)
    ResumePrint.svelte    # Print variant
    AboutSection.svelte
    ExperienceSection.svelte
    EducationSection.svelte
    SkillsSection.svelte
    InterestsSection.svelte
    ContactForm.svelte
```

To add a new template: create `templates/<name>/` with the same components, each template owns its own resources (fonts, CSS) in `<svelte:head>`. Register in `templates/index.ts`. Do NOT pollute `app.html` or `+layout.svelte`.

## Svelte 5 Conventions

- **Runes mode is mandatory** — the compiler enforces `$state`, `$derived`, `$effect`, `$props`
- **No `export let`**, no `$:` reactive statements, no `on:click` (use `onclick`)
- **No `createEventDispatcher`** — use callback props instead
- **No `<slot>`** — use snippets with `{@render children()}`
- **Props**: Always type with `interface Props` + destructure via `let { ... }: Props = $props()`
- **Effects**: Always clean up event listeners (`return () => ...`) and guard with SSR check (`if (typeof window === 'undefined') return`)
- **Stores**: Do NOT use Svelte stores — use runes in `.svelte.ts` files for shared state instead

## Data Layer

Resume data lives in `src/lib/data/resume.json`. TypeScript interfaces are in `src/lib/types/resume.ts`. Import both via `$lib/index.ts`.

Key types:
- `ResumeData` — top-level shape
- `Basics` — name, headline, contact info, social links
- `Experience` — company, position, dates, highlights
- `Education` — institution, degree, field, dates
- `SkillCategory` — category name + items array

The JSON has placeholder photo path `/images/profile.svg`.

## Styling

- `src/routes/layout.css` — all main project styles
- `src/routes/resume/resume-print.css` — print-optimized styles
- `@import 'tailwindcss'` at top of layout.css
- Use CSS custom properties from `:root` for theme values
- Prefer BEM-style component classes over utility classes for the resume layout
- Template-specific styling belongs in the template, not in layout.css
- Font loading is handled via `<svelte:head>` in the template component, NOT in app.html

## Common Pitfalls

1. **Font loading in app.html** — Do NOT put font links in `app.html`. Each template loads its own fonts via `<svelte:head>` in its main component.
2. **Dev server lock** — The dev server locks `.svelte-kit/cloudflare` directory. Kill it before building or deploying.
3. **PORT 5173 in use** — Dev server auto-selects next port (5174, 5175, etc.) if 5173 is busy.
4. **prerender** — Static routes (`/` and `/resume`) have `export const prerender = true`. API routes (`/api/contact`) have `prerender = false`.
5. **No runtime dependencies** — All packages are devDependencies.
