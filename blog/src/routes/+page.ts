import { getFeaturedArticle, listArticleSummaries } from '$lib/articles';

export function load() {
	return {
		featured: getFeaturedArticle(),
		articles: listArticleSummaries()
	};
}
