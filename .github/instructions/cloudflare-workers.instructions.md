---
description: "Use when adding Cloudflare bindings (KV, D1, R2) to SvelteKit load functions, configuring wrangler.jsonc bindings, typing the Env interface in app.d.ts, using the Cache API, or running background tasks with waitUntil. The adapter handles routing/SSR automatically — this covers what it does NOT handle."
---

# Cloudflare Workers — Bindings & Platform Patterns

The `@sveltejs/adapter-cloudflare` handles routing, SSR, and serving responses automatically. This file covers what it does **not** handle: accessing bindings, typing them, and CF-specific APIs.

## The `platform` Object in Load Functions

Cloudflare bindings are available via the `platform` argument in `+page.server.ts` and `+server.ts` load functions. It is **not** available in universal `+page.ts` load functions (those run on both server and client).

```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
  // platform is typed as App.Platform (declared in app.d.ts)
  const value = await platform?.env.MY_KV.get('key');
  return { value };
};
```

Always use optional chaining (`platform?.env`) — `platform` is `undefined` during `vite dev` (local dev without Wrangler).

## Adding a New Binding: 3-Step Process

Every binding requires changes in three places:

### 1. `wrangler.jsonc` — declare the binding

```jsonc
{
  // KV namespace
  "kv_namespaces": [
    { "binding": "MY_KV", "id": "<production-id>", "preview_id": "<preview-id>" }
  ],

  // D1 database
  "d1_databases": [
    { "binding": "DB", "database_name": "blog", "database_id": "<id>" }
  ],

  // R2 bucket
  "r2_buckets": [
    { "binding": "ASSETS_BUCKET", "bucket_name": "blog-assets" }
  ]
}
```

### 2. `src/app.d.ts` — add to the `Env` type

`wrangler types` auto-generates `worker-configuration.d.ts` which declares the `Env` interface. Run it after updating `wrangler.jsonc`:

```sh
pnpm run build  # runs wrangler types as part of build
# or manually:
npx wrangler types
```

The generated `Env` is referenced in `app.d.ts` via `env: Env` in `App.Platform` — no manual edits needed to `app.d.ts` itself for standard bindings.

### 3. Use in load function

```typescript
export const load: PageServerLoad = async ({ platform }) => {
  const db = platform?.env.DB;
  if (!db) throw new Error('D1 binding not available');
  // ...
};
```

## KV Patterns

```typescript
// Read
const value = await platform.env.MY_KV.get('article:hello-world');
const json = await platform.env.MY_KV.get('article:hello-world', { type: 'json' });

// Write (with optional TTL in seconds)
await platform.env.MY_KV.put('article:hello-world', JSON.stringify(data), {
  expirationTtl: 3600
});

// Delete
await platform.env.MY_KV.delete('article:hello-world');

// List keys with prefix
const { keys } = await platform.env.MY_KV.list({ prefix: 'article:' });
```

## D1 Patterns

D1 uses a prepared statement API:

```typescript
// Query
const article = await platform.env.DB
  .prepare('SELECT * FROM articles WHERE slug = ?')
  .bind(slug)
  .first<{ id: number; title: string; content: string }>();

// Multiple rows
const { results } = await platform.env.DB
  .prepare('SELECT slug, title, date FROM articles WHERE published = 1 ORDER BY date DESC')
  .all<{ slug: string; title: string; date: string }>();

// Mutation
await platform.env.DB
  .prepare('UPDATE articles SET views = views + 1 WHERE slug = ?')
  .bind(slug)
  .run();
```

Never use raw string concatenation in SQL — always use `?` placeholders and `.bind()`.

## Background Tasks with `waitUntil`

Use `platform.ctx.waitUntil` for fire-and-forget work (e.g., incrementing a view counter) that should not delay the response:

```typescript
export const load: PageServerLoad = async ({ platform, params }) => {
  // Don't await — runs in background after response is sent
  platform?.ctx.waitUntil(
    platform.env.DB
      .prepare('UPDATE articles SET views = views + 1 WHERE slug = ?')
      .bind(params.articleSlug)
      .run()
  );

  const article = await platform?.env.DB
    .prepare('SELECT * FROM articles WHERE slug = ?')
    .bind(params.articleSlug)
    .first();

  return { article };
};
```

## Caching with `platform.caches`

The Cloudflare Cache API is available via `platform.caches`. This is a full-page/response cache, not a KV cache.

```typescript
export const load: PageServerLoad = async ({ platform, request }) => {
  const cache = platform?.caches.default;
  const cacheKey = new Request(request.url);

  // Check cache first
  const cached = await cache?.match(cacheKey);
  if (cached) return cached.json();

  // Fetch data
  const data = await fetchExpensiveData(platform?.env);

  // Cache for 5 minutes
  platform?.ctx.waitUntil(
    cache?.put(cacheKey, new Response(JSON.stringify(data), {
      headers: { 'Cache-Control': 'max-age=300' }
    }))
  );

  return data;
};
```

For article content that rarely changes, prefer **SvelteKit prerendering** over runtime caching:

```typescript
// +page.server.ts or +page.ts
export const prerender = true; // builds to static HTML at deploy time
```

## Local Development

Bindings are only available when running via Wrangler, not `vite dev`:

```sh
# With bindings (uses wrangler.jsonc)
pnpm run preview   # runs: wrangler dev .svelte-kit/cloudflare/_worker.js

# Without bindings (faster iteration, platform is undefined)
pnpm run dev       # runs: vite dev
```

Always guard with `platform?.env` during `vite dev` to avoid null-reference errors.
