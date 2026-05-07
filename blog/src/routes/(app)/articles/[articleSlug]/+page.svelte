<script lang="ts">
	import { resolve } from '$app/paths';
	import { getArticleBySlug } from '$lib/articles';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();

	let slug = $derived(params.articleSlug);
	let articleRecord = $derived(getArticleBySlug(slug));
	let ArticleComponent = $derived(articleRecord?.component ?? null);

	const ui = {
		articleShell:
			'article-shell mx-auto flex w-full min-w-0 flex-col gap-6 rounded-3xl px-4 py-6 md:px-8 md:py-10',
		articleHeader:
			'article-header flex max-w-full min-w-0 flex-col gap-4 border-b border-(--border) pb-4',
		articleMeta: 'article-meta flex flex-wrap gap-x-4 gap-y-4 text-sm',
		articleHero: 'article-hero overflow-hidden',
		articleProse: 'article-prose prose w-full max-w-none text-lg leading-8 max-md:text-base'
	} as const;
</script>

<svelte:head>
	<title>{data.article.title} | Ankur Mathur Journal</title>
	<meta name="description" content={data.article.excerpt} />
</svelte:head>

<article class={ui.articleShell}>
	<a class="back-link w-fit" href={resolve('/')}>Back to all writing</a>

	<header class={ui.articleHeader}>
		<p class="eyebrow">{data.article.category}</p>
		<h1>{data.article.title}</h1>
		<p class="article-dek">{data.article.excerpt}</p>
		<div class={ui.articleMeta}>
			<span>{data.article.published}</span>
			<span>{data.article.readingTime}</span>
		</div>
		<figure class={ui.articleHero}>
			<img
				src={resolve(data.article.heroImage)}
				alt={data.article.heroImageAlt}
				loading="eager"
				decoding="async"
			/>
		</figure>
	</header>

	{#if ArticleComponent}
		<div class={ui.articleProse}>
			<ArticleComponent />
		</div>
	{/if}
</article>
