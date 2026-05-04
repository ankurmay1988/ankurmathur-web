<script lang="ts">
	import { resolve } from '$app/paths';
	import { getArticleBySlug } from '$lib/articles';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();

	let slug = $derived(params.articleSlug);
	let articleRecord = $derived(getArticleBySlug(slug));
	let ArticleComponent = $derived(articleRecord?.component ?? null);
</script>

<svelte:head>
	<title>{data.article.title} | Ankur Mathur Journal</title>
	<meta name="description" content={data.article.excerpt} />
</svelte:head>

<article class="article-shell">
	<a class="back-link" href={resolve('/')}>Back to all writing</a>

	<header class="article-header">
		<p class="eyebrow">{data.article.category}</p>
		<h1>{data.article.title}</h1>
		<p class="article-dek">{data.article.excerpt}</p>
		<div class="article-meta">
			<span>{data.article.published}</span>
			<span>{data.article.readingTime}</span>
		</div>
	</header>

	{#if ArticleComponent}
		<div class="article-prose prose">
			<ArticleComponent />
		</div>
	{/if}
</article>
