import type { Component } from 'svelte';

export type ArticleSummary = {
	slug: string;
	title: string;
	excerpt: string;
	published: string;
	readingTime: string;
	category: string;
	featured: boolean;
	coverAlt?: string;
	coverTone?: string;
};

type ArticleModule = {
	default: Component;
	metadata?: Partial<ArticleSummary>;
};

type ArticleRecord = ArticleSummary & {
	publishedAt: string;
	component: Component;
};

const articleModules = import.meta.glob('./content/articles/*.{md,svx}', {
	eager: true
}) as Record<string, ArticleModule>;

const fallbackSummary = {
	excerpt: 'A short field note from the workshop.',
	published: '2026-05-04',
	readingTime: '4 min read',
	category: 'Notes',
	featured: false,
	coverAlt: 'Abstract editorial texture',
	coverTone: 'amber'
} satisfies Omit<ArticleSummary, 'slug' | 'title'>;

const articles: ArticleRecord[] = Object.entries(articleModules)
	.map(([path, module]) => {
		const slug = path
			.split('/')
			.at(-1)
			?.replace(/\.(md|svx)$/, '');

		if (!slug) {
			return null;
		}

		const metadata = module.metadata ?? {};
		const publishedAt = normalizePublishedAt(metadata.published ?? fallbackSummary.published);

		return {
			slug,
			title: metadata.title ?? slugToTitle(slug),
			excerpt: metadata.excerpt ?? fallbackSummary.excerpt,
			published: formatPublishedDate(publishedAt),
			publishedAt,
			readingTime: metadata.readingTime ?? fallbackSummary.readingTime,
			category: metadata.category ?? fallbackSummary.category,
			featured: metadata.featured ?? fallbackSummary.featured,
			coverAlt: metadata.coverAlt ?? fallbackSummary.coverAlt,
			coverTone: metadata.coverTone ?? fallbackSummary.coverTone,
			component: module.default
		};
	})
	.filter((article): article is ArticleRecord => article !== null)
	.sort((left, right) => (left.publishedAt < right.publishedAt ? 1 : -1));

function slugToTitle(slug: string) {
	return slug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function listArticleSummaries() {
	return articles.map(
		({ component: _component, publishedAt: _publishedAt, ...article }) => article
	);
}

export function getFeaturedArticle() {
	return (
		listArticleSummaries().find((article) => article.featured) ?? listArticleSummaries()[0] ?? null
	);
}

export function getArticleSummaryBySlug(slug: string) {
	return listArticleSummaries().find((article) => article.slug === slug) ?? null;
}

export function getArticleBySlug(slug: string) {
	return articles.find((article) => article.slug === slug) ?? null;
}

function normalizePublishedAt(value: string) {
	const parsed = new Date(value);

	if (Number.isNaN(parsed.valueOf())) {
		return value;
	}

	return parsed.toISOString();
}

function formatPublishedDate(value: string) {
	const parsed = new Date(value);

	if (Number.isNaN(parsed.valueOf())) {
		return value;
	}

	return new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(parsed);
}
