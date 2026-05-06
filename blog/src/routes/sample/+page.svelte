<script lang="ts">
	// ── Theme preview data ─────────────────────────────────────────────────
	// Light-mode token values per theme, copied directly from themes/*.css §1.
	// Applied as inline CSS custom properties on each preview cell so all five
	// themes render simultaneously without touching the global html[data-theme].
	type ThemePreset = { name: string; label: string; cssVars: string };

	const themes: ThemePreset[] = [
		{
			name: 'paper',
			label: 'Paper',
			cssVars: [
				'--bg:#f6f1e8',
				'--bg-accent:#efe5d6',
				'--surface:rgb(255 251 245 / 0.95)',
				'--surface-strong:rgb(255 251 245 / 0.99)',
				'--text:#1f1b16',
				'--muted:#6f6558',
				'--border:rgb(101 84 65 / 0.18)',
				'--accent:#9a5f2b',
				'--accent-soft:rgb(154 95 43 / 0.12)',
				'--radius:1.5rem',
				'--shadow-soft:0 4px 18px rgb(15 23 42 / 0.09)',
				"--font-sans:'Avenir Next','Segoe UI','Helvetica Neue',sans-serif",
				"--font-serif:'Iowan Old Style','Palatino Linotype','Book Antiqua',Georgia,serif",
				'--error:#d32f2f'
			].join(';')
		},
		{
			name: 'mono',
			label: 'Mono',
			cssVars: [
				'--bg:#f2f2f0',
				'--bg-accent:#deded8',
				'--surface:rgb(255 255 255 / 0.95)',
				'--surface-strong:rgb(255 255 255 / 0.99)',
				'--text:#111111',
				'--muted:#585858',
				'--border:rgb(17 17 17 / 0.1)',
				'--accent:#111111',
				'--accent-soft:rgb(17 17 17 / 0.08)',
				'--radius:1.5rem',
				'--shadow-soft:0 4px 18px rgb(15 23 42 / 0.06)',
				"--font-sans:'Avenir Next','Segoe UI','Helvetica Neue',sans-serif",
				"--font-serif:'Iowan Old Style','Palatino Linotype','Book Antiqua',Georgia,serif",
				'--error:#d32f2f'
			].join(';')
		},
		{
			name: 'sketch',
			label: 'Sketch',
			cssVars: [
				'--bg:#f4f1ea',
				'--bg-accent:#edeade',
				'--surface:rgb(244 241 234 / 0.97)',
				'--surface-strong:rgb(244 241 234 / 0.99)',
				'--text:#0e2a5c',
				'--muted:rgb(14 42 92 / 0.52)',
				'--border:rgb(14 42 92 / 0.16)',
				'--accent:#b82020',
				'--accent-soft:rgb(209 40 40 / 0.1)',
				'--radius:0.45rem',
				'--shadow-soft:3px 4px 0 rgb(14 42 92 / 0.1)',
				"--font-sans:'Patrick Hand',cursive",
				"--font-serif:'Patrick Hand',cursive",
				'--error:#d32f2f'
			].join(';')
		}
	];

	// ── Copy to clipboard ──────────────────────────────────────────────────
	let copiedId = $state<string | null>(null);

	async function copy(text: string, id: string) {
		try {
			await navigator.clipboard.writeText(text);
			copiedId = id;
			setTimeout(() => {
				copiedId = null;
			}, 1800);
		} catch {
			// Clipboard API unavailable
		}
	}

	// ── HTML snippets ──────────────────────────────────────────────────────
	const snippets: Record<string, string> = {
		buttons: `<button class="btn btn-primary" type="button">Primary action</button>
<button class="btn btn-ghost" type="button">Secondary action</button>`,

		tag: `<span class="tag">Category</span>`,

		card: `<div class="card">
  <p>Card surface — background, border, shadow, and radius
  all adapt automatically to the active theme.</p>
</div>`,

		field: `<div class="field">
  <label class="field-label" for="email">Email address</label>
  <input
    class="field-input"
    id="email"
    type="email"
    placeholder="you@example.com"
  />
</div>`,

		'field-error': `<div class="field">
  <label class="field-label" for="name">Full name</label>
  <input class="field-input" id="name" type="text" value="..." />
  <p class="field-error">This field is required.</p>
</div>`,

		skeleton: `<div class="skeleton" style="height:1.1rem;width:62%"></div>
<div class="skeleton" style="height:1rem;width:80%;margin-top:0.5rem"></div>
<div class="skeleton" style="height:1rem;width:48%;margin-top:0.5rem"></div>`,

		'empty-state': `<div class="empty-state">
  <svg
    class="empty-state__icon"
    width="40" height="40" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="1.5"
    aria-hidden="true"
  >
    <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0H4m4 0 2 2h4l2-2"/>
  </svg>
  <p class="empty-state__title">Nothing here yet</p>
  <p class="empty-state__body">
    Once you add content, it will appear here.
  </p>
</div>`,

		divider: `<hr class="divider" />`
	};
</script>

<svelte:head>
	<title>Component Museum · UI Reference</title>
	<meta
		name="description"
		content="All UI components rendered across all five themes. Copy HTML snippets — tokens do the styling."
	/>
</svelte:head>

<div class="museum">
	<!-- ── Page header ───────────────────────────────────────────── -->
	<header class="museum-hero">
		<p class="eyebrow">Developer reference</p>
		<h1 class="museum-title">Component Museum</h1>
		<p class="museum-desc">
			Every UI component shown simultaneously in all five themes. Copy any HTML snippet and drop it
			into the app — theme tokens handle the styling automatically.
		</p>
		<div class="museum-notice">
			<span class="museum-notice-icon" aria-hidden="true">ℹ</span>
			Previews use <strong>light-mode</strong> token values. Dark-mode palettes and theme-specific
			§2 overrides (e.g. Sketch hard shadows, Romantic contrast fix) apply only in the full page
			context.
		</div>
	</header>

	<!-- ── Buttons ───────────────────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Buttons</h2>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name"><code>.btn.btn-primary</code> + <code>.btn.btn-ghost</code></h3>
				<p class="museum-comp-desc">
					Filled accent and outlined ghost buttons. Shape scales with <code>--radius</code>; hover
					glow derives from <code>--accent</code>.
				</p>
			</div>
			<div class="museum-strip" role="list" aria-label="Button preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<div class="preview-row">
								<button class="btn btn-primary" type="button">Primary</button>
								<button class="btn btn-ghost" type="button">Ghost</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets.buttons, 'buttons')}
					>
						{copiedId === 'buttons' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets.buttons}</code></pre>
			</div>
		</div>
	</section>

	<!-- ── Tag / Badge ───────────────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Tag / Badge</h2>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name"><code>.tag</code></h3>
				<p class="museum-comp-desc">
					Inline pill label. Background uses <code>--accent-soft</code>, text uses
					<code>--accent</code>. Border radius overrides to <code>0.25rem</code> on Sketch.
				</p>
			</div>
			<div class="museum-strip" role="list" aria-label="Tag preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<span class="tag">Engineering</span>
							<span class="tag" style="margin-left:0.4rem">Design</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets.tag, 'tag')}
					>
						{copiedId === 'tag' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets.tag}</code></pre>
			</div>
		</div>
	</section>

	<!-- ── Card ──────────────────────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Card</h2>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name"><code>.card</code></h3>
				<p class="museum-comp-desc">
					Generic surface panel. Background: <code>--surface</code>. Border: <code>--border</code>.
					Shadow: <code>--shadow-soft</code>. Radius: <code>--radius</code>.
				</p>
			</div>
			<div class="museum-strip" role="list" aria-label="Card preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<div class="card">
								<p style="margin:0;font-family:var(--font-serif);font-size:0.9rem;color:var(--text);line-height:1.5">
									Card surface with border, shadow, and radius.
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets.card, 'card')}
					>
						{copiedId === 'card' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets.card}</code></pre>
			</div>
		</div>
	</section>

	<!-- ── Form field ────────────────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Form Fields</h2>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name">
					<code>.field</code> + <code>.field-label</code> + <code>.field-input</code>
				</h3>
				<p class="museum-comp-desc">
					Label-above-input pattern. Focus ring is <code>--accent-soft</code> glow. Input radius is
					<code>calc(--radius × 0.4)</code> — subtly rounder than cards.
				</p>
			</div>
			<div class="museum-strip" role="list" aria-label="Form field preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<div class="field">
								<label class="field-label" for={`email-${theme.name}`}>Email address</label>
								<input
									class="field-input"
									id={`email-${theme.name}`}
									type="email"
									placeholder="you@example.com"
								/>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets.field, 'field')}
					>
						{copiedId === 'field' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets.field}</code></pre>
			</div>
		</div>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name"><code>.field-error</code></h3>
				<p class="museum-comp-desc">
					Validation message below the input. Reads from <code>--error</code> (themes may define it;
					fallback: <code>#d32f2f</code>).
				</p>
			</div>
			<div class="museum-strip" role="list" aria-label="Field error preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<div class="field">
								<label class="field-label" for={`name-${theme.name}`}>Full name</label>
								<input class="field-input" id={`name-${theme.name}`} type="text" value="..." />
								<p class="field-error">This field is required.</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets['field-error'], 'field-error')}
					>
						{copiedId === 'field-error' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets['field-error']}</code></pre>
			</div>
		</div>
	</section>

	<!-- ── Skeleton ──────────────────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Skeleton Loader</h2>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name"><code>.skeleton</code></h3>
				<p class="museum-comp-desc">
					Shimmer placeholder for loading states. Gradient sweeps between <code>--bg-accent</code> and
					<code>--surface-strong</code>. No circular spinners per design spec.
				</p>
			</div>
			<div class="museum-strip" role="list" aria-label="Skeleton preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<div style="display:grid;gap:0.5rem">
								<div class="skeleton" style="height:1.1rem;width:62%"></div>
								<div class="skeleton" style="height:1rem;width:80%"></div>
								<div class="skeleton" style="height:1rem;width:48%"></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets.skeleton, 'skeleton')}
					>
						{copiedId === 'skeleton' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets.skeleton}</code></pre>
			</div>
		</div>
	</section>

	<!-- ── Empty state ───────────────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Empty State</h2>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name"><code>.empty-state</code></h3>
				<p class="museum-comp-desc">
					Centered placeholder when content is absent. Icon uses <code>--accent</code> at 45% opacity.
					Sketch theme sets icon opacity to 60%.
				</p>
			</div>
			<div class="museum-strip museum-strip--tall" role="list" aria-label="Empty state preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<div class="empty-state">
								<svg
									class="empty-state__icon"
									width="36"
									height="36"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									aria-hidden="true"
								>
									<path
										d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0H4m4 0 2 2h4l2-2"
									/>
								</svg>
								<p class="empty-state__title">Nothing here yet</p>
								<p class="empty-state__body">Once you add content, it will appear here.</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets['empty-state'], 'empty-state')}
					>
						{copiedId === 'empty-state' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets['empty-state']}</code></pre>
			</div>
		</div>
	</section>

	<!-- ── Divider ───────────────────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Divider</h2>

		<div class="museum-component">
			<div class="museum-comp-header">
				<h3 class="museum-comp-name"><code>.divider</code></h3>
				<p class="museum-comp-desc">
					Horizontal rule using <code>--border</code> color. Always <code>border: 0</code> with
					<code>border-top</code> to avoid browser default styling.
				</p>
			</div>
			<div class="museum-strip" role="list" aria-label="Divider preview across themes">
				{#each themes as theme (theme.name)}
					<div class="museum-cell" style={theme.cssVars} role="listitem">
						<span class="museum-cell-label">{theme.label}</span>
						<div class="museum-cell-preview">
							<p
								style="margin:0 0 0.75rem;font-family:var(--font-serif);font-size:0.85rem;color:var(--text)"
							>
								Above the rule
							</p>
							<hr class="divider" />
							<p
								style="margin:0.75rem 0 0;font-family:var(--font-serif);font-size:0.85rem;color:var(--muted)"
							>
								Below the rule
							</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="museum-snippet">
				<div class="museum-snippet-bar">
					<span class="museum-snippet-lang">HTML</span>
					<button
						class="museum-copy-btn"
						type="button"
						onclick={() => copy(snippets.divider, 'divider')}
					>
						{copiedId === 'divider' ? '✓ Copied' : 'Copy'}
					</button>
				</div>
				<pre class="museum-code"><code>{snippets.divider}</code></pre>
			</div>
		</div>
	</section>

	<!-- ── Token reference table ─────────────────────────────────── -->
	<section class="museum-section">
		<h2 class="museum-section-title">Token Reference</h2>
		<div class="museum-token-table-wrap">
			<table class="museum-token-table">
				<thead>
					<tr>
						<th>Token</th>
						<th>Used by</th>
						<th>Paper</th>
						<th>Mono</th>
						<th>Sketch</th>
					</tr>
				</thead>
				<tbody>
					{#each [
							{ token: '--radius', usage: 'cards, buttons, inputs, skeletons', values: ['1.5rem', '1.5rem', '0.45rem'] },
							{ token: '--accent', usage: '.btn-primary fill, .tag color, focus ring', values: ['#9a5f2b', '#111111', '#b82020'] },
							{ token: '--accent-soft', usage: '.tag bg, .btn-ghost hover, focus shadow', values: ['rgb(154 95 43/12%)', 'rgb(17 17 17/8%)', 'rgb(209 40 40/10%)'] },
							{ token: '--font-sans', usage: '.btn, .field-label, .field-input, .tag', values: ['Avenir Next', 'Avenir Next', 'Patrick Hand'] },
							{ token: '--shadow-soft', usage: '.card, nav', values: ['blur', 'blur', 'flat offset'] },
					] as row (row.token)}
						<tr>
							<td><code>{row.token}</code></td>
							<td class="museum-token-usage">{row.usage}</td>
							{#each row.values as val}
								<td>{val}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	/* ── Museum chrome ─────────────────────────────────────────── */

	.museum {
		padding-block: 0.5rem 5rem;
	}

	.museum-hero {
		margin-bottom: 3.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--border);
	}

	.museum-title {
		margin: 0.25rem 0 0.75rem;
		font-family: var(--font-serif);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 600;
		color: var(--text);
		letter-spacing: -0.02em;
		line-height: 1.12;
	}

	.museum-desc {
		margin: 0 0 1rem;
		max-width: 58ch;
		font-size: 1rem;
		color: var(--muted);
		line-height: 1.65;
	}

	.museum-notice {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.55rem 0.9rem;
		border-radius: calc(var(--radius) * 0.4);
		background: var(--accent-soft);
		font-size: 0.85rem;
		color: var(--text);
		line-height: 1.5;
		max-width: 62ch;
	}

	.museum-notice-icon {
		font-style: normal;
		color: var(--accent);
		flex-shrink: 0;
	}

	/* ── Sections ─────────────────────────────────────────────── */

	.museum-section {
		margin-bottom: 3rem;
	}

	.museum-section-title {
		margin: 0 0 1.25rem;
		padding-bottom: 0.55rem;
		border-bottom: 1px solid var(--border);
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}

	/* ── Component block ──────────────────────────────────────── */

	.museum-component {
		margin-bottom: 2rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.museum-comp-header {
		padding: 1rem 1.2rem 0.8rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
	}

	.museum-comp-name {
		margin: 0 0 0.25rem;
		font-family: var(--font-sans);
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--text);
	}

	.museum-comp-name :global(code) {
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.85em;
		background: var(--code-bg, rgb(0 0 0 / 0.05));
		padding: 0.1em 0.35em;
		border-radius: 0.25rem;
		color: var(--accent);
	}

	.museum-comp-desc {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted);
		line-height: 1.55;
	}

	.museum-comp-desc :global(code) {
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.85em;
		background: var(--code-bg, rgb(0 0 0 / 0.05));
		padding: 0.1em 0.3em;
		border-radius: 0.2rem;
		color: var(--accent);
	}

	/* ── Theme strip ──────────────────────────────────────────── */

	.museum-strip {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		overflow-x: auto;
	}

	.museum-strip--tall .museum-cell-preview {
		min-height: 10rem;
	}

	/* ── Individual theme cell ────────────────────────────────── */

	/* CSS custom props injected via inline style attribute — all
	   component classes inside inherit and render in that theme. */
	.museum-cell {
		background: var(--bg);
		padding: 0.75rem;
		border-right: 1px solid rgb(0 0 0 / 0.06);
	}

	.museum-cell:last-child {
		border-right: none;
	}

	.museum-cell-label {
		display: block;
		margin-bottom: 0.6rem;
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.museum-cell-preview {
		min-height: 3.5rem;
		display: flex;
		align-items: center;
	}

	.preview-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}

	/* ── Snippet block ────────────────────────────────────────── */

	.museum-snippet {
		border-top: 1px solid var(--border);
	}

	.museum-snippet-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.4rem 0.75rem;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}

	.museum-snippet-lang {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.museum-copy-btn {
		padding: 0.22rem 0.65rem;
		border-radius: 0.375rem;
		border: 1px solid var(--border);
		background: transparent;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--muted);
		cursor: pointer;
		transition:
			background-color 140ms ease,
			color 140ms ease;
	}

	.museum-copy-btn:hover {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.museum-code {
		margin: 0;
		padding: 0.9rem 1rem;
		overflow-x: auto;
		background: color-mix(in srgb, var(--surface) 60%, var(--bg));
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.8rem;
		line-height: 1.65;
		color: var(--text);
		white-space: pre;
		tab-size: 2;
	}

	/* ── Token table ──────────────────────────────────────────── */

	.museum-token-table-wrap {
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.museum-token-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
	}

	.museum-token-table th {
		padding: 0.6rem 0.85rem;
		text-align: left;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		white-space: nowrap;
	}

	.museum-token-table td {
		padding: 0.55rem 0.85rem;
		border-bottom: 1px solid var(--border);
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.78rem;
		color: var(--text);
		vertical-align: top;
	}

	.museum-token-table tr:last-child td {
		border-bottom: none;
	}

	.museum-token-table td:first-child :global(code) {
		color: var(--accent);
	}

	.museum-token-usage {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		color: var(--muted);
	}

	/* ── Responsive ────────────────────────────────────────────── */

	@media (max-width: 900px) {
		.museum-strip {
			grid-template-columns: repeat(3, minmax(160px, 1fr));
		}
	}

	@media (max-width: 600px) {
		.museum-strip {
			grid-template-columns: repeat(2, minmax(150px, 1fr));
		}

		.museum-title {
			font-size: 1.75rem;
		}
	}
</style>
