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

<a {href} class="featured-card">
	<img
		src={resolveImage(article.image)}
		alt={article.imageAlt}
		loading="eager"
		decoding="async"
		class="featured-card__bg"
	/>
	<div class="featured-card__overlay">
		<div class="featured-card__top">
			<span class="card-tag card-tag--on-image">{article.category}</span>
		</div>
		<div class="featured-card__footer">
			<h2 class="featured-card__title">
				{article.title}
			</h2>
			<div class="card-meta card-meta--light">
				<span>{article.readingTime}</span>
				<span class="card-meta__dot" aria-hidden="true"></span>
				<span>{article.published}</span>
			</div>
		</div>
	</div>
</a>
