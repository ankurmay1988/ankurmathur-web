---
description: "Use when working on the main resume/portfolio website (main/ folder). Covers template system architecture, adding new templates, data layer, page routing, and project structure. For general SvelteKit/Cloudflare conventions, see project-conventions.instructions.md."
---

# Main Project — Resume Website (main/)

## Project Overview

This is a **data-driven resume/portfolio website** for Ankur Mathur (`ankurmathur.in`). It renders professional profile information from a single JSON data file through swappable visual templates.

### Core Concept

- **Single source of truth**: All resume content lives in `src/lib/data/resume.json`
- **Template-driven rendering**: Visual presentation is handled by templates in `src/lib/templates/` — switch the look by changing the `template` field in JSON
- **Two render targets**: Web (`/`) and print/PDF (`/resume`) — each uses its own template component (`ResumePage.svelte` and `ResumePrint.svelte`)
- **Contact form**: A working contact form with spam protection, backed by Cloudflare Email Routing

## Resume Data (The Source of Truth)

The file `src/lib/data/resume.json` is the authoritative data source. It contains Ankur Mathur's full career profile:

### Data Structure

```typescript
interface ResumeData {
  template: string;              // Which visual template to use (e.g. "default")
  basics: {
    name: string;                // "Ankur Mathur"
    headline: string;            // Full-Stack Developer | Polyglot Developer | Microservices Architect | ...
    email: string;               // ankurakaet@gmail.com
    phone: string;               // +91 9887863958
    location: string;            // "Greater Jaipur Area, Rajasthan, India"
    photo: string;               // "/images/profile.svg" (placeholder — replace with /images/profile.jpg)
    summary: string;             // Professional summary paragraph
    socialLinks: {
      platform: string;          // "linkedin", "github", "email"
      url: string;
      label: string;
    }[];
  };
  experience: {                  // 6 roles total
    company: string;             // "Nagarro", "A3logics", "Bhandari Foils..."
    position: string;
    startDate: string;           // "YYYY-MM" format
    endDate: string | null;      // null means current position
    current: boolean;
    location: string;
    highlights: string[];        // Bullet-point accomplishments
  }[];
  education: {                   // 1 entry
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
  skills: {                      // 5 categories
    name: string;
    items: string[];
  }[];
  certifications: { name: string; issuer: string }[];
  projects: never[];             // Reserved, currently empty
  languages: never[];            // Reserved, currently empty
  interests: never[];            // Reserved, currently empty
}
```

### Data Population Rules

- **All data is hand-authored in JSON** — no CMS, no database, no API
- **Experience dates use `"YYYY-MM"`** format (e.g. `"2018-11"`). Templates format this for display (e.g. "Nov 2018")
- **`endDate: null` + `current: true`** marks the present position
- **Empty arrays** (`projects`, `languages`, `interests`) are reserved for future use
- **Photo** is a placeholder SVG — the final site should use `/images/profile.jpg` when available
- **The `template` field** selects which template renders the data. Changing this swaps the entire visual design

### TypeScript Types

Mirroring the JSON in `src/lib/types/resume.ts`:
- `ResumeData` — root shape
- `Basics` — personal info + social links
- `Experience` — one work history entry
- `Education` — one education entry
- `SkillCategory` — grouped skills
- `Certification`, `Project` — reserved

## Project Requirements (Non-Negotiable)

These constraints must always be maintained:

### Deployment & Build

- **Adapter**: Must use `@sveltejs/adapter-cloudflare` — the site runs on Cloudflare Workers
- **Build pipeline**: `pnpm run build` runs `svelte-kit sync && wrangler types && vite build` — do not change this order
- **No runtime dependencies**: All packages are `devDependencies` — no runtime npm packages
- **Deployment**: GitOps via GitHub Actions — user commits trigger auto-deploy. Do not run `wrangler deploy` manually unless explicitly asked.
- **Package manager**: pnpm only — never use npm or yarn

### Routing & Rendering

- **`/` and `/resume` must be prerendered** (`export const prerender = true`) — resume data is static JSON, no server-side data needed
- **`/api/contact` must NOT be prerendered** (`export const prerender = false`) — POST endpoints need a live Worker
- **No server load functions** (`+page.server.ts`) — all data comes from static JSON import in universal `load()` functions

### Contact Form

- **Must use Cloudflare `sendEmail` binding** via `platform.env.SEND_EMAIL`
- **Must include honeypot** (`_gotcha` hidden field) for bot prevention
- **Must validate** required fields and email format before sending
- **Destination**: Always sends to `ankurakaet@gmail.com`
- **Graceful fallback**: Log to console when binding is unavailable (local dev)

### Contact Form Component

- **Uses Svelte 5 `$state()`** for form fields (`name`, `email`, `subject`, `message`, `status`)
- **Uses `bind:value`** for two-way input binding
- **Uses `onsubmit={handleSubmit}`** (Svelte 5 event syntax)
- **Submit via `fetch()` POST** to `/api/contact` with JSON body
- **Client-side validation** must check: non-empty fields, valid email regex
- **Status management**: Track `'idle' | 'sending' | 'success' | 'error'` states

### Prerendering Rules

- Routes importing static JSON data must use `export const prerender = true`
- API routes handling POST requests must use `export const prerender = false`
- The `+page.ts` for statically prerendered routes exports prerender AND a load function

### Global Scope

- **`app.html` must stay minimal** — only `<!doctype html>`, charset, viewport, `%sveltekit.head%`, `%sveltekit.body%`. No template-specific resources.
- **`+layout.svelte` must stay clean** — only favicon and viewport meta. No fonts, no external CSS, no template imports.
- **Templates own their resources** — fonts, theme assets, external deps go in the template's `<svelte:head>`, never in globals.

## Template System Architecture

Components are organized for swappable visual templates:

```
src/lib/templates/
  index.ts                          # Template registry — maps name to component
                                    # Page routes import from here, not directly
  <template-name>/
    ResumePage.svelte               # Main layout (imported by page routes)
    ResumePrint.svelte              # Print/PDF variant
    AboutSection.svelte
    ExperienceSection.svelte
    EducationSection.svelte
    SkillsSection.svelte
    InterestsSection.svelte
    ContactForm.svelte
```

### Adding a New Template

Create a new folder `src/lib/templates/<name>/` and:

1. Implement all the same components with the same props interface
2. **Each template owns its own resources** — fonts, theme CSS, external deps all go in the template's `<svelte:head>`. Never touch `app.html` or `+layout.svelte`.
3. Register the template by name in `src/lib/templates/index.ts`
4. The page route (`+page.svelte`) selects the template from the registry using `data.template`

### Rules

- **No global pollution.** `app.html` must stay clean. `+layout.svelte` has only favicon + viewport meta.
- **No template-specific assumptions in the route shell.** Page routes import from the template registry; they don't know which template is active.
- **Each template is self-contained** — switching templates should only require changing the `template` field in `resume.json` and swapping the folder.

## Data Layer

| File | Purpose |
|------|---------|
| `src/lib/data/resume.json` | All resume content (JSON) |
| `src/lib/types/resume.ts` | TypeScript interfaces matching JSON shape |
| `src/lib/index.ts` | Barrel exports for both |

The `template` field in `resume.json` controls which template to render:
```json
{ "template": "default", "basics": { ... }, "experience": [...], ... }
```

Date format for experience items: `"YYYY-MM"` (e.g. `"2018-11"`).

## Routing

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Static (prerendered) | Main resume page × active template |
| `/resume` | Static (prerendered) | Print-optimized version of resume data |
| `/api/contact` | Dynamic (POST, not prerendered) | Contact form endpoint |

Static routes export `prerender = true`. API endpoints export `prerender = false`.

## Common Pitfalls

- **Dev server lock**: Kill the dev server before building — it locks `.svelte-kit/cloudflare`
- **Port conflict**: Dev server auto-selects next port (5174, etc.) if 5173 is busy
- **Platform bindings** (`platform.env`): Unavailable during `vite dev` — always use optional chaining
