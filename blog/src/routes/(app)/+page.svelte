<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let featured = $derived(data.featured);
	let articles = $derived(
		featured ? data.articles.filter((article) => article.slug !== featured.slug) : data.articles
	);
</script>

<svelte:head>
	<title>Ankur Mathur Journal</title>
	<meta
		name="description"
		content="A minimal editorial blog with switchable themes, dark mode, and markdown-first article layouts."
	/>
</svelte:head>

<!-- <section class="home-hero">
	<p class="eyebrow">Independent notes on building, writing, and interface craft</p>
	<h1>Calm reading surfaces for essays, field notes, and working drafts.</h1>
	<p class="hero-copy">
		This publication borrows the restraint of classic editorial layouts and keeps the chrome out of
		the way. The result is a markdown-first shell that can switch personality without rebuilding the
		reading experience.
	</p>
</section> -->

{#if featured}
	<section class="featured-story">
		<div>
			<p class="section-label">Featured story</p>
			<h2>
				<a href={resolve('/articles/[articleSlug]', { articleSlug: featured.slug })}>
					{featured.title}
				</a>
			</h2>
			<p>{featured.excerpt}</p>
		</div>

		<div class="story-meta">
			<span>{featured.category}</span>
			<span>{featured.published}</span>
			<span>{featured.readingTime}</span>
		</div>
	</section>
{/if}

<section class="story-grid" aria-label="Article list">
	{#each articles as article (article.slug)}
		<article class="story-card" data-tone={article.coverTone}>
			<p class="section-label">{article.category}</p>
			<h2>
				<a href={resolve('/articles/[articleSlug]', { articleSlug: article.slug })}>
					{article.title}
				</a>
			</h2>
			<p>{article.excerpt}</p>
			<div class="story-meta">
				<span>{article.published}</span>
				<span>{article.readingTime}</span>
			</div>
		</article>
	{/each}
</section>
