---
description: "Use when adding syntax highlighting to blog articles or Svelte components using Shiki. Covers mdsvex highlighter setup, fenced code blocks in .svx/.md, CodeBlock Svelte component patterns, Cloudflare Workers constraints, dual light/dark themes, and @shikijs/transformers notations."
---

# Shiki Syntax Highlighting

## Install

```sh
pnpm add -D shiki @shikijs/transformers
```

## 1. Configure mdsvex in `svelte.config.js` (Build-time highlighting)

This is the primary path for code blocks in `.svx` / `.md` articles. It runs in Node.js at build time — use the full `shiki` bundle here (no Cloudflare Workers WASM restriction applies at build time).

```js
// blog/svelte.config.js
import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { createHighlighter } from 'shiki';

// Singleton — created once, reused for all files during build
const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: [
    'typescript', 'javascript', 'csharp', 'fsharp',
    'sql', 'html', 'css', 'svelte', 'bash', 'json', 'yaml', 'markdown'
  ]
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
  },
  kit: { adapter: adapter() },
  preprocess: [
    mdsvex({
      extensions: ['.svx', '.md'],
      highlight: {
        highlighter: (code, lang = 'text') => {
          const html = escapeSvelte(
            highlighter.codeToHtml(code, {
              lang,
              themes: { light: 'github-light', dark: 'github-dark' }
            })
          );
          return `{@html \`${html}\`}`;
        }
      }
    })
  ],
  extensions: ['.svelte', '.svx', '.md']
};

export default config;
```

**Key points:**
- `escapeSvelte` from `mdsvex` escapes `{`, `}`, `` ` `` so the HTML is safe to embed in a Svelte template literal
- Return value must be `{@html \`...\`}` — a Svelte raw HTML expression
- `createHighlighter` is called once at the module level (top-level `await` works in ESM)

## 2. Writing Code Blocks in Articles (`.svx` / `.md`)

Always specify the language on fenced code blocks. Language names are case-insensitive.

````md
```typescript
public class ArticleService
{
    public async Task<Article> GetBySlugAsync(string slug)
        => await _db.Articles.FirstOrDefaultAsync(a => a.Slug == slug);
}
```

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IArticleService, ArticleService>();
```

```svelte
<script lang="ts">
  let { title } = $props<{ title: string }>();
</script>

<h1>{title}</h1>
```
````

Common language identifiers: `typescript` / `ts`, `csharp` / `cs`, `fsharp` / `fs`, `javascript` / `js`, `sql`, `html`, `css`, `svelte`, `bash` / `sh`, `json`, `yaml`, `xml`, `powershell` / `ps1`, `dockerfile`, `markdown` / `md`.

> If a language isn't loaded in `createHighlighter`, add it to the `langs` array in `svelte.config.js`. Check available languages at https://shiki.style/languages.

## 3. Add Dark Mode CSS

The dual-theme setup emits CSS variables on each token. Add this to `layout.css` to make themes respond to the user's system preference or a `.dark` class:

```css
/* System preference */
@media (prefers-color-scheme: dark) {
  .shiki, .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
  }
}

/* Class-based (if toggling dark mode with a class on <html>) */
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

## 4. `<CodeBlock>` Svelte Component (Runtime / Dynamic Highlighting)

For dynamically highlighted code in interactive Svelte components (not in markdown), highlight **server-side** and pass the HTML to the component. This avoids bundling Shiki into the client.

### The utility (`src/lib/server/highlight.ts`)

Use `createHighlighterCore` + `createJavaScriptRegexEngine` — this avoids WASM and works on Cloudflare Workers at runtime.

```typescript
// blog/src/lib/server/highlight.ts
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// Singleton — reuse across requests
const highlighterPromise = createHighlighterCore({
  themes: [
    import('@shikijs/themes/github-light'),
    import('@shikijs/themes/github-dark')
  ],
  langs: [
    import('@shikijs/langs/typescript'),
    import('@shikijs/langs/javascript'),
    import('@shikijs/langs/csharp'),
    // add more as needed
  ],
  engine: createJavaScriptRegexEngine()
});

export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await highlighterPromise;
  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' }
  });
}
```

### Server load function (`+page.server.ts`)

```typescript
// blog/src/routes/articles/[articleSlug]/+page.server.ts
import { highlightCode } from '$lib/server/highlight';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const example = await highlightCode(
    `public record Article(string Slug, string Title);`,
    'csharp'
  );
  return { example };
};
```

### Component (`+page.svelte`)

```svelte
<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

{@html data.example}
```

**Never call `highlightCode` in a `+page.ts` (universal load) or inside `$effect`** — it would run on the client where `shiki` is not bundled, and imports would fail.

## 5. Transformer Notations in Code Blocks (`@shikijs/transformers`)

Add `@shikijs/transformers` to the mdsvex highlighter for annotation support in articles:

```js
// svelte.config.js — add to the highlighter call
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel
} from '@shikijs/transformers';

highlight: {
  highlighter: (code, lang = 'text') => {
    const html = escapeSvelte(
      highlighter.codeToHtml(code, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerNotationFocus(),
          transformerNotationErrorLevel()
        ]
      })
    );
    return `{@html \`${html}\`}`;
  }
}
```

Then use inline comment annotations in article code blocks:

````md
```csharp
// [!code highlight]
public async Task<IActionResult> Index() // highlighted line

var old = "legacy";    // [!code --]
var updated = "new";   // [!code ++]

throw new Exception(); // [!code error]
logger.Warn("slow");   // [!code warning]
```
````

Add CSS for the transformer classes — transformers only add classes, not styles:

```css
/* layout.css */
.line.diff.add    { background-color: #16a34a22; }
.line.diff.remove { background-color: #dc262622; }
.line.highlighted { background-color: #fbbf2422; }
.line.focused     { opacity: 0.4; }
.has-focused .line.focused { opacity: 1; }
.line.highlighted.error   { background-color: #dc262633; }
.line.highlighted.warning { background-color: #d9770633; }
```

## 6. Language Loading at Build vs. Runtime

| Scenario | Approach |
|----------|----------|
| Code in `.svx` / `.md` articles | `createHighlighter` in `svelte.config.js` — full bundle, Node.js only |
| Dynamic code in server load functions on CF Workers | `createHighlighterCore` + `createJavaScriptRegexEngine` — no WASM |
| Code in client components | **Avoid** — don't ship Shiki to the browser; pre-render on server |

## 7. Adding New Languages

1. Add the language import to the `langs` array in `svelte.config.js` (build-time)
2. Add a corresponding `import('@shikijs/langs/<name>')` in `src/lib/server/highlight.ts` (runtime)
3. Check https://shiki.style/languages for the exact package name and identifier
