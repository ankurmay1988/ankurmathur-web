---
name: add-blog-theme
description: 'Add a new visual theme to the blog website. Use when asked to create a theme, design style, visual variant, or new look for the blog. Covers the full workflow: creating a CSS token file (light + dark), wiring the theme into the switcher (theme.svelte.ts, +layout.svelte), and adding component adjustments for effects tokens cannot express (gradients, pseudo-content, font-family overrides, etc.). Triggers on: "add a theme", "new theme", "create a visual style", "add a design", "new look for the blog".'
argument-hint: 'Theme name and design description or reference (e.g. "minimal grid, newspaper-style")'
---

# Add a New Visual Theme

## Overview

The blog uses a **CSS custom-property override architecture**. Every visual theme lives in a single file under `blog/src/lib/styles/themes/`. Switching the `data-theme` attribute on `<html>` is the only runtime change needed — no JS, no component modifications.

```
blog/src/lib/styles/
  layout.css          ← entry: @import all theme files here
  base.css            ← html, body, ::selection, a, img resets
  components.css      ← all component classes
  responsive.css      ← @media breakpoints
  themes/
    paper.css         ← default :root + html.dark[data-theme='paper']
    journal.css       ← html[data-theme='journal'] + html.dark variant
    mono.css
    romantic.css
    sketch.css
    <new-theme>.css   ← YOU ARE CREATING THIS
```

---

## Step 1 — Design the Token Set

Before writing any code, decide on the palette. Every component reads these CSS variables — get these right and the visual transformation is complete with no other overrides needed.

**Required tokens (all themes must define all of these):**

| Variable | Role |
|---|---|
| `--bg` | Page background |
| `--bg-accent` | Radial gradient accent in page background |
| `--surface` | Card / nav glass background (usually semi-transparent) |
| `--surface-strong` | Opaque version of surface (used for frosted overlays) |
| `--text` | Primary text |
| `--muted` | Secondary / meta text |
| `--border` | All borders |
| `--accent` | Primary brand color (links, active states, bullets) — must be WCAG AA on `--bg` |
| `--accent-soft` | Low-opacity wash of accent (backgrounds, hover states) |
| `--quote` | Blockquote text / inline code text |
| `--code-bg` | Inline code background |
| `--hero-glow` | Radial glow color used in `html, body` background gradient (set to `transparent` to disable) |
| `--selection` | `::selection` highlight color |

**Optional tokens:**

| Variable | Role |
|---|---|
| `--font-sans` | Override default sans-serif stack |
| `--font-serif` | Override default serif stack |
| `--font-display` | Decorative display font (only needed if used in §2 adjustments) |
| `--radius` | Border radius scale (default: `1.5rem`) — all UI elements scale proportionally |
| `--shadow-soft` | Card / shell drop shadow — used by cards AND `.btn`/`.field-input` via theme override |
| `--error` | Form field error text color (optional; fallback is `#d32f2f`) |

**Dark mode rules:**
- `--bg` should be very dark (avoid pure black — `#111` feels harsh)
- `--text` should be off-white (avoid pure white — `#fff` feels too bright)
- `--accent` should be lightened / more luminous compared to its light-mode value
- `--border` and `--bg-accent` should be very low-opacity light values
- `--muted` should be around 50-60% opacity of `--text`

---

## Step 2 — Create the Theme CSS File

Create `blog/src/lib/styles/themes/<slug>.css`. Use this template exactly:

```css
/*
 * ================================================================
 *  <THEME NAME> THEME — <Tagline>
 * ================================================================
 *  Activated by:  html[data-theme='<slug>']
 * ================================================================
 */

/* §1 DESIGN TOKENS — LIGHT MODE */
html[data-theme='<slug>'] {
  color-scheme: light;

  --bg: ;
  --bg-accent: ;
  --surface: ;
  --surface-strong: ;
  --text: ;
  --muted: ;
  --border: ;
  --accent: ;
  --accent-soft: ;
  --quote: ;
  --code-bg: ;
  --hero-glow: ;
  --selection: ;

  /* optional font/shape overrides */
  /* --font-sans: ; */
  /* --font-serif: ; */
  /* --radius: ; */
  /* --shadow-soft: ; */
}

/* §2 COMPONENT ADJUSTMENTS — LIGHT MODE (only if needed) */
/* Add narrowly-scoped rules here. Targets existing classes only. */
/* See "Component Adjustments" section below for what to override. */

/* §1 DESIGN TOKENS — DARK MODE */
html.dark[data-theme='<slug>'] {
  color-scheme: dark;

  --bg: ;
  --bg-accent: ;
  --surface: ;
  --surface-strong: ;
  --text: ;
  --muted: ;
  --border: ;
  --accent: ;
  --accent-soft: ;
  --quote: ;
  --code-bg: ;
  --hero-glow: ;
  --selection: ;
}

/* §2 COMPONENT ADJUSTMENTS — DARK MODE (only if different from light) */
```

> **Important:** Do NOT use `color-scheme: light` as a way to suppress dark mode. The `html.dark[data-theme='<slug>']` block is what enables dark mode — if this block exists and specifies tokens, dark mode works.

---

## Step 3 — Component Adjustments (§2)

Token overrides handle 80% of visual changes. Use §2 **only** for effects that require targeting specific element classes directly. Common cases:

### Background overrides
When the theme needs a textured or repeating background on both `html` and `body` (both have background declarations), target both:

```css
html[data-theme='<slug>'],
html[data-theme='<slug>'] body {
  background: /* your background */ ;
}
```

### Font-family on specific elements (not all)
If your theme uses `--font-display` only for the brand mark and hero, not body text:

```css
html[data-theme='<slug>'] .brand-mark { font-family: var(--font-display); }
html[data-theme='<slug>'] .home-hero h1 { font-family: var(--font-display); }
```

### Pseudo-content decorations
```css
html[data-theme='<slug>'] .section-label::before { content: '★\00a0'; opacity: 0.65; }
html[data-theme='<slug>'] .section-label::after  { content: '\00a0★'; opacity: 0.65; }
```

### Hard-shadow cards (sketch-like)
```css
html[data-theme='<slug>'] .story-card {
  box-shadow: 3px 4px 0 rgb(0 0 0 / 0.1);
  background: var(--surface); /* disable the default gradient */
}
```

### SVG ornament as `::after` pseudo-element
Use `isolation: isolate` on the card so the pseudo-element can safely use `z-index: -1`:

```css
html[data-theme='<slug>'] .home-hero {
  position: relative;
  isolation: isolate;
  background: /* custom gradient */, var(--surface);
}
html[data-theme='<slug>'] .home-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,...");
  pointer-events: none;
  z-index: -1;
}
```

### Theme chip active state
If your accent color needs a different text fill for legibility:

```css
html[data-theme='<slug>'] .theme-chip.active {
  background: var(--accent);
  color: #fff; /* or var(--bg) for very dark accents */
}
```

---

## Step 4 — Register the Theme (3 file changes)

### 4a. `blog/src/lib/styles/layout.css`
Add one `@import` line in the themes block:

```css
@import './themes/<slug>.css';
```

### 4b. `blog/src/lib/theme.svelte.ts`
Add `'<slug>'` to the `visualThemes` array:

```ts
export const visualThemes = ['paper', 'journal', 'mono', 'romantic', 'sketch', '<slug>'] as const;
```

### 4c. `blog/src/routes/(app)/+layout.svelte`
Add to the `themeLabels` map:

```ts
const themeLabels: Record<VisualTheme, string> = {
  paper: 'Paper',
  // ... existing themes ...
  '<slug>': 'Display Name',
};
```

### 4d. `blog/src/routes/+layout.svelte` (root layout — anti-FOUC IIFE)
Add to the inline IIFE array so the theme applies before JS hydrates:

```js
const visualThemes = ['paper', 'journal', 'mono', 'romantic', 'sketch', '<slug>'];
```

> **Why two arrays?** The IIFE runs before JS hydration to avoid a flash of un-styled content. It must mirror `theme.svelte.ts` but lives in the root layout (which wraps all routes, including `/sample`). The `themeLabels` map lives in `(app)/+layout.svelte` (the blog layout with the nav switcher). They are duplicated by necessity.

---

## Step 5 — Add Google Fonts (if needed)

If the theme uses a custom font not already in the `<link>` tag in the root layout:

1. Find the `<link rel="preconnect">` block and the Google Fonts `<link>` in `blog/src/routes/+layout.svelte` (the root layout — it loads fonts for all routes)
2. Append the new font family to the `family=` query string, e.g.:
   ```
   &family=YourFont:wght@400;600
   ```
3. Reference it in your `--font-sans` / `--font-serif` / `--font-display` values

---

## Step 6 — Validate

Run the dev server and check each of the following:

- [ ] Theme chip appears in the nav switcher
- [ ] Clicking the chip sets `data-theme='<slug>'` on `<html>`
- [ ] All 5 token surfaces render correctly (nav, hero, story cards, article shell, prose)
- [ ] Dark mode toggle works — `html.dark[data-theme='<slug>']` tokens apply
- [ ] System mode respects `prefers-color-scheme`
- [ ] Page refresh preserves the selected theme (localStorage round-trip)
- [ ] Mobile nav collapses correctly (responsive.css is theme-agnostic — no changes needed)
- [ ] Shiki code blocks show correct light/dark colors (controlled by `html.dark .shiki` in components.css — no per-theme change)

```bash
cd blog && pnpm dev
```

---

## Reference: Full Token List with Types

```css
/* Background layers */
--bg            /* hex or rgb() — page solid background */
--bg-accent     /* hex or rgb() — gradient accent */

/* Surfaces (cards, nav) */
--surface       /* rgb(R G B / 0.78) — typically semi-transparent */
--surface-strong /* rgb(R G B / 0.94) — more opaque */

/* Text */
--text          /* hex — primary, must be AA contrast on --bg */
--muted         /* hex or rgb(R G B / 0.5x) — secondary */

/* Borders & accents */
--border        /* rgb(R G B / 0.1x) — very low opacity */
--accent        /* hex — primary brand color */
--accent-soft   /* rgb(R G B / 0.1x) — low-opacity wash */
--quote         /* hex — blockquote / inline code text */

/* Code */
--code-bg       /* rgb(R G B / 0.0x) — inline code background */

/* Special effects */
--hero-glow     /* rgb(R G B / 0.2x) — radial gradient on page bg */
--selection     /* rgb(R G B / 0.2x) — ::selection highlight */

/* Shape (optional overrides) */
--radius        /* e.g. 1.5rem, 0.45rem — applied to cards, buttons, inputs, skeletons */
--shadow-soft   /* box-shadow shorthand — used by cards AND btn/field overrides */
--error         /* optional: form error text color; fallback is #d32f2f */
```

---

## Pre-Styled UI Elements (auto-styled from tokens)

`components.css` contains base styles for all current and future UI elements using CSS custom properties. **When you add a new theme, these elements are automatically styled correctly — no extra work needed**, because they all consume the same token variables.

Only add theme-specific §2 overrides when the element needs something tokens cannot express (see examples in Step 3 above).

### Available class names

| Class | Element | What tokens drive it |
|---|---|---|
| `.card` | Generic surface panel | `--surface`, `--border`, `--shadow-soft`, `--radius` |
| `.btn` | Button base (combine with modifier) | `--font-sans`, `--radius` |
| `.btn-primary` | Filled accent button | `--accent` (fill), `--bg` (text) — see contrast note below |
| `.btn-ghost` | Outline button | `--border`, `--text`, `--accent-soft` |
| `.tag` | Small pill label | `--accent-soft`, `--accent`, `--font-sans` |
| `.field` | Form field wrapper | layout only |
| `.field-label` | Input label (above input) | `--font-sans`, `--text` |
| `.field-input` | Text input / select / textarea | `--surface-strong`, `--border`, `--accent`, `--font-sans` |
| `.field-error` | Validation error message | `--error` (fallback `#d32f2f`) |
| `.skeleton` | Shimmer loading placeholder | `--bg-accent`, `--surface-strong` |
| `.empty-state` | Empty state wrapper | `--muted` |
| `.empty-state__icon` | Icon area | `--accent` |
| `.empty-state__title` | Heading | `--font-serif`, `--text` |
| `.empty-state__body` | Description | — |
| `.divider` | Horizontal rule | `--border` |

### Radius cascade

`--radius` drives all shape across elements proportionally:

| Element | Formula | Effect at `--radius: 1.5rem` | Effect at `--radius: 0.45rem` |
|---|---|---|---|
| Cards, nav, article shell | `var(--radius)` or `+ offset` | very rounded | subtly rounded |
| Buttons (`.btn`) | `var(--radius)` | pill-ish | nearly square |
| Inputs (`.field-input`) | `calc(var(--radius) * 0.4)` | 0.6rem | 0.18rem |
| Skeletons (`.skeleton`) | `calc(var(--radius) * 0.35)` | 0.52rem | 0.16rem |

This means a theme that sets `--radius: 0.25rem` automatically gets sharp rectangular buttons AND inputs AND cards, with no per-element overrides.

### Button contrast gotcha

`.btn-primary` uses `color: var(--bg)` as text on `--accent` fill. This works for most themes. **Mid-luminance accent colors (golds, ambers) may fail WCAG AA.** Rule of thumb:

- If `--accent` looks like a medium-brightness gold or amber, add a dark text override:
  ```css
  html[data-theme='<slug>'] .btn-primary {
    color: #2a1a0e; /* or any near-black with sufficient contrast */
  }
  ```
- Then reset in the dark mode block so the token takes over again:
  ```css
  html.dark[data-theme='<slug>'] .btn-primary {
    color: var(--bg); /* dark --bg on bright dark-mode --accent = high contrast */
  }
  ```

### Sketch-style themes: hard shadows on interactive elements

If your theme uses hard-offset shadows (no blur), override buttons and inputs to match:

```css
/* Buttons */
html[data-theme='<slug>'] .btn-primary { box-shadow: 3px 3px 0 rgb(0 0 50 / 0.18); }
html[data-theme='<slug>'] .btn-primary:hover { box-shadow: 5px 5px 0 rgb(0 0 50 / 0.22); }
html[data-theme='<slug>'] .btn-ghost { box-shadow: 3px 3px 0 rgb(0 0 50 / 0.1); }

/* Inputs — replace blurred focus ring with solid offset */
html[data-theme='<slug>'] .field-input { box-shadow: 2px 3px 0 rgb(0 0 50 / 0.08); }
html[data-theme='<slug>'] .field-input:focus { box-shadow: 3px 3px 0 rgb(0 0 50 / 0.14); }

/* Tags — square corners instead of pill */
html[data-theme='<slug>'] .tag { border-radius: 0.25rem; }
```

Invert shadow colors for dark mode (use light color, very low opacity).

---
