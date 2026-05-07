<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ArticleSummary } from '$lib/articles';

	interface Props {
		article: ArticleSummary;
		href: string;
	}

	let { article, href }: Props = $props();
</script>

<a {href} class="mini-card">
	<figure class="mini-card__image">
		<img
			src={resolve(article.image)}
			alt={article.imageAlt}
			loading="lazy"
			decoding="async"
		/>
	</figure>
	<div class="mini-card__body">
		<h3 class="mini-card__title">
			{article.title}
		</h3>
		<div class="card-meta">
			<span>{article.readingTime}</span>
			<span class="card-meta__dot" aria-hidden="true"></span>
			<span>{article.published}</span>
		</div>
	</div>
</a>
