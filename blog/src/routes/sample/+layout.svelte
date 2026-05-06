<script lang="ts">
	import { resolve } from '$app/paths';
	// Import only component class definitions — no theme token files, no base.css
	// background rules. This keeps /sample free from the active blog theme.
	import '$lib/styles/components.css';

	let { children } = $props();
</script>

<div class="sample-shell">
	<header class="sample-nav">
		<a href={resolve('/')} class="sample-back">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M19 12H5m7-7-7 7 7 7"/>
			</svg>
			Back to blog
		</a>
		<span class="sample-nav-title">Component Museum</span>
		<span class="sample-nav-hint">Light-mode token previews · <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank" rel="noopener noreferrer">CSS custom properties</a></span>
	</header>

	<main class="sample-content">
		{@render children()}
	</main>
</div>

<style>
	/* Neutral baseline: no theme tokens on :root, so define fallbacks for any
	   component class that references a CSS custom property. These are the
	   Paper-light values — they only apply inside /sample, never on blog pages. */
	:global(html),
	:global(body) {
		background: #f5f5f5;
		min-height: 100vh;
		/* token fallbacks consumed by component classes via var() */
		--font-sans: 'Avenir Next', 'Segoe UI', 'Helvetica Neue', sans-serif;
		--font-serif: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
		--bg: #f6f1e8;
		--bg-accent: #efe5d6;
		--surface: rgb(255 251 245 / 0.95);
		--surface-strong: rgb(255 251 245 / 0.99);
		--text: #1f1b16;
		--muted: #6f6558;
		--border: rgb(101 84 65 / 0.18);
		--accent: #9a5f2b;
		--accent-soft: rgb(154 95 43 / 0.12);
		--radius: 1.5rem;
		--shadow-soft: 0 4px 18px rgb(15 23 42 / 0.09);
		--code-bg: rgb(58 42 30 / 0.06);
		--quote: #5b3c26;
		--error: #d32f2f;
	}

	.sample-shell {
		width: min(calc(100% - 2rem), 90rem);
		margin: 0 auto;
		padding: 1.25rem 0 5rem;
	}

	.sample-nav {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 0.7rem 1rem;
		margin-bottom: 2.5rem;
		background: rgb(255 255 255 / 0.82);
		border: 1px solid rgb(0 0 0 / 0.08);
		border-radius: 0.75rem;
		backdrop-filter: blur(12px);
		box-shadow: 0 2px 12px rgb(0 0 0 / 0.06);
	}

	.sample-back {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: 'Avenir Next', 'Segoe UI', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		color: #555;
		text-decoration: none;
		white-space: nowrap;
		transition: color 140ms ease;
	}

	.sample-back:hover {
		color: #111;
	}

	.sample-nav-title {
		font-family: 'Avenir Next', 'Segoe UI', sans-serif;
		font-size: 0.9rem;
		font-weight: 700;
		color: #111;
	}

	.sample-nav-hint {
		margin-left: auto;
		font-family: 'Avenir Next', 'Segoe UI', sans-serif;
		font-size: 0.78rem;
		color: #888;
	}

	.sample-nav-hint a {
		color: #555;
	}

	.sample-content {
		padding: 0 0.25rem;
	}
</style>
