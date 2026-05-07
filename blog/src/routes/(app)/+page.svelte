<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	import FeaturedCard from '$lib/components/FeaturedCard.svelte';
	import MiniCard from '$lib/components/MiniCard.svelte';
	import StoryCard from '$lib/components/StoryCard.svelte';

	let { data }: PageProps = $props();

	let featured = $derived(data.featured);
	let topArticles = $derived(data.topArticles);
	let topSlugs = $derived(new Set(topArticles.map((a) => a.slug)));
	let articles = $derived(
		data.articles.filter((a) => a.slug !== featured?.slug && !topSlugs.has(a.slug))
	);
</script>

<svelte:head>
<title>Ankur Mathur Journal</title>
<meta
name="description"
content="A minimal editorial blog with switchable themes, dark mode, and markdown-first article layouts."
/>
</svelte:head>

<!-- ── Hero strip: Featured + Top Posts ───────────────────────── -->
<div class="landing-hero">
	{#if featured}
		<section class="featured-section" aria-label="Featured article">
			<header class="section-header">
				<span class="section-header__label">Featured</span>
			</header>
			<FeaturedCard
				article={featured}
				href={resolve('/articles/[articleSlug]', { articleSlug: featured.slug })}
			/>
		</section>
	{/if}

	{#if topArticles.length > 0}
		<section class="top-posts-section" aria-label="Top posts">
			<header class="section-header">
				<span class="section-header__label">Top Posts</span>
			</header>
			<div class="top-posts-list">
				{#each topArticles as article (article.slug)}
					<MiniCard
						{article}
						href={resolve('/articles/[articleSlug]', { articleSlug: article.slug })}
					/>
				{/each}
			</div>
		</section>
	{/if}
</div>

<!-- ── Remaining articles grid ────────────────────────────────── -->
{#if articles.length > 0}
	<section class="story-grid" aria-label="More articles">
		{#each articles as article (article.slug)}
			<StoryCard
				{article}
				href={resolve('/articles/[articleSlug]', { articleSlug: article.slug })}
			/>
		{/each}
	</section>
{/if}