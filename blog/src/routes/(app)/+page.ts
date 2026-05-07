import { getFeaturedArticle, getTopArticles, listArticleSummaries } from '$lib/articles';

export function load() {
	const featured = getFeaturedArticle();
	return {
		featured,
		topArticles: getTopArticles(4, featured?.slug),
		articles: listArticleSummaries()
	};
}
