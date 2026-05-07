<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let featured = $derived(data.featured);
	let articles = $derived(
		featured ? data.articles.filter((article) => article.slug !== featured.slug) : data.articles
	);

	const ui = {
		featuredStory:
			'featured-story grid gap-6 rounded-3xl p-6 md:grid-cols-3',
		storyMeta: 'story-meta flex flex-wrap gap-x-4 gap-y-4 text-sm',
		storyGrid: 'story-grid grid grid-cols-2 gap-6 max-md:grid-cols-1',
		storyCard: 'story-card grid min-h-72 content-start gap-4 rounded-3xl p-6'
	} as const;
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
	<section class={ui.featuredStory}>
		<div class="min-w-0 md:col-span-2">
			<p class="section-label">Featured story</p>
			<h2>
				<a href={resolve('/articles/[articleSlug]', { articleSlug: featured.slug })}>
					{featured.title}
				</a>
			</h2>
			<p>{featured.excerpt}</p>
		</div>

		<div class={ui.storyMeta}>
			<span>{featured.category}</span>
			<span>{featured.published}</span>
			<span>{featured.readingTime}</span>
		</div>
	</section>
{/if}

<section class={ui.storyGrid} aria-label="Article list">
	{#each articles as article (article.slug)}
		<article class={ui.storyCard} data-tone={article.coverTone}>
			<p class="section-label">{article.category}</p>
			<h2>
				<a href={resolve('/articles/[articleSlug]', { articleSlug: article.slug })}>
					{article.title}
				</a>
			</h2>
			<p>{article.excerpt}</p>
			<div class={ui.storyMeta}>
				<span>{article.published}</span>
				<span>{article.readingTime}</span>
			</div>
		</article>
	{/each}
</section>
