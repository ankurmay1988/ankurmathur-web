---
name: research-and-write-article
description: >-
  Research a topic from a reference URL and write an original blog article for
  this project. Use when the user provides a link to an existing article, blog
  post, or technical resource and wants a new original article on the same
  topic. Triggers on: "extract article from", "write article based on",
  "create article about X like Y", "research and write", "article inspired by".
  Covers: fetching the reference to understand thought process and structure,
  choosing an original domain or angle, writing a .svx file with correct
  metadata and Shiki-highlighted code blocks, and validating the output.
argument-hint: 'URL or topic to research, e.g. https://example.com/post or "event sourcing in .NET"'
---

# Research and Write Article

Produces a new, original blog article (`.svx`) in `blog/src/lib/content/articles/` by
researching a reference source and rewriting the ideas with an independent domain,
examples, and narrative voice. Never reproduces the source verbatim.

## When to Use

- User shares a URL and asks to "extract", "copy", or "write something like this"
- User describes a technical topic and wants a full article written
- User wants a new article that covers the same concepts as a reference post

## Procedure

### Step 1 — Load Project Instructions

Read both instruction files before writing a single word:

- [blog-articles.instructions.md](../../.github/instructions/blog-articles.instructions.md)
- [shiki-highlighting.instructions.md](../../.github/instructions/shiki-highlighting.instructions.md)

Key rules to internalize:

- Article files are `.svx`, located in `blog/src/lib/content/articles/`
- Metadata is a `<script module lang="ts">` export named `metadata`, **not** YAML frontmatter
- Required fields: `title`, `excerpt`, `published`, `readingTime`, `category`, `featured`, `coverAlt`, `coverTone`
- `published` format: `YYYY-MM-DD`
- Code blocks must specify a language tag; supported: `typescript`, `csharp`, `bash`, `sql`, `json`, `svelte`, `css`, etc.
- Do NOT indent fenced code blocks inside the markdown body
- The `<script module>` block must come before any markdown content

### Step 2 — Study the Reference

Fetch the reference URL (or research the topic if no URL is given):

```
fetch_webpage(urls=[url], query="<article topic>")
```

Extract the following — do **not** copy prose or code:

- **Thought process**: What problem does the article open with? What conceptual journey does it take the reader on?
- **Concepts covered**: Core vocabulary, mental models, and their order of introduction
- **Code patterns**: What patterns are demonstrated? (e.g., load → validate → append → save)
- **Structure**: Sections, their sequence, and what each one establishes
- **When-to-use framing**: How does the article position the technique vs alternatives?

### Step 3 — Choose an Original Domain

Pick a domain that is **different** from the reference but maps equally well to the concepts. The goal is to demonstrate the same ideas through a fresh lens.

Examples of domain swaps for common topics:

| Reference domain | Original domain options |
|---|---|
| Shopping cart | Support tickets, hotel reservations, job applications |
| Blog posts | Podcast episodes, recipe collections, photo galleries |
| Order processing | Loan applications, event registrations, shipment tracking |
| User profiles | Device fleet management, subscription plans |

The new domain should:
- Have a natural lifecycle (statuses, transitions) that exercises the same patterns
- Be concrete enough that business rules make intuitive sense
- Differ enough that no section resembles the reference

### Step 4 — Plan the Article Structure

Map the reference's thought arc to the new domain. A good article typically follows:

1. **Opening hook** — The real-world problem the reader already has
2. **Core concept introduction** — What is this pattern and why does it exist?
3. **Vocabulary** — Define terms before using them in code (events, streams, aggregates, etc.)
4. **Setup** — Installation or configuration, briefly
5. **Domain model** — Events, types, or schema with design rationale
6. **Write side** — Command handlers or mutation logic with the pattern called out explicitly
7. **Read side** — Projections, queries, or views
8. **Bonus insight** — One concept the reference did not cover, or covered lightly
9. **When to use / avoid** — Honest trade-off framing
10. **Summary** — Reinforce the three or four key takeaways

Not every article needs all ten sections — adapt to the topic.

### Step 5 — Write the Article

Create the file at `blog/src/lib/content/articles/<slug>.svx`.

Slug rules:
- All lowercase, words separated by hyphens
- Describes the topic, not the reference: `event-sourcing-with-marten-and-postgresql`, not `marten-article`

Template:

```svx
<script module lang="ts">
  export const metadata = {
    title: 'Article Title Here',
    excerpt: 'One or two sentences. What will the reader learn?',
    published: 'YYYY-MM-DD',
    readingTime: 'N min read',
    category: 'Backend | Frontend | Design | Notes',
    featured: false,
    coverAlt: 'Short visual description for the cover image',
    coverTone: 'amber | indigo | slate | rose | emerald'
  };
</script>

Opening paragraph...

## Section Heading

Prose...

```csharp
// code example
```

More prose...
```

Writing principles:
- Open with the reader's problem, not with definitions
- Introduce vocabulary with one-sentence definitions before using terms in code
- Annotate every code block with a short prose explanation of what it demonstrates
- Include design rationale for non-obvious decisions (e.g., "We store `AgentName` directly because display names can change")
- Each section should establish something the next section depends on
- The "when to avoid" section should be honest — weak trade-off analysis erodes trust
- For multi-part series posts, add a `## Series Navigation` section near the top that links to **all** parts in order; mark the current part as plain text (`Part N (this article): ...`)

### Step 6 — Validate

After creating the file, confirm:

- [ ] `<script module lang="ts">` is the very first block
- [ ] All required metadata fields are present
- [ ] `published` is a valid `YYYY-MM-DD` date
- [ ] Every fenced code block has a language tag
- [ ] No code block is indented (mdsvex breaks on indented fences)
- [ ] File is in `blog/src/lib/content/articles/`
- [ ] Slug matches the filename (no spaces, all lowercase)
- [ ] If this is part of a multi-part series, a `## Series Navigation` section is present and links to all parts using `/articles/<slug>`

Optionally run `svelte-check` and confirm any errors shown are pre-existing (not in the new file):

```bash
cd blog && pnpm exec svelte-check --tsconfig ./tsconfig.json 2>&1
```

## Copyright Rules

- Never reproduce prose verbatim from the reference source
- Never reproduce code verbatim from the reference source  
- It is fine to use the same technical concepts, patterns, and vocabulary — these are not copyrightable
- The new article must use a different domain, different variable names, different examples
- If a user explicitly asks to "copy" or "extract" content, decline and offer to research-and-rewrite instead

## Output

A single `.svx` file that:
- Is auto-discovered by the glob in `blog/src/lib/articles.ts` (no manual registration needed)
- Passes `svelte-check` without new errors
- Reads as a standalone article — no prior knowledge of the reference source required
