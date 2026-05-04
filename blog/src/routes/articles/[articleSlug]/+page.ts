import { getArticleSummaryBySlug } from '$lib/articles';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const article = getArticleSummaryBySlug(params.articleSlug);

	if (!article) {
		throw error(404, 'Article not found');
	}

	return { article };
};
