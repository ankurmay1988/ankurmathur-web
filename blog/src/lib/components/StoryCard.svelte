<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ArticleSummary } from '$lib/articles';

	interface Props {
		article: ArticleSummary;
		href: string;
	}

	let { article, href }: Props = $props();

	function resolveImage(url: string): string {
		if (url.startsWith('http://') || url.startsWith('https://')) {
			return url;
		}
		return resolve(url);
	}
</script>

<a {href} class="story-card">
	<figure class="story-card__image">
		<img
			src={resolveImage(article.image)}
			alt={article.imageAlt}
			loading="lazy"
			decoding="async"
		/>
		<span class="card-tag card-tag--on-image">{article.category}</span>
	</figure>
	<div class="story-card__body">
		<h2 class="story-card__title">
			{article.title}
		</h2>
		<div class="card-meta">
			<span>{article.readingTime}</span>
			<span class="card-meta__dot" aria-hidden="true"></span>
			<span>{article.published}</span>
		</div>
	</div>
</a>
