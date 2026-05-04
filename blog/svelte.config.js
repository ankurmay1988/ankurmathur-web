import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import {
	transformerNotationDiff,
	transformerNotationFocus,
	transformerNotationHighlight
} from '@shikijs/transformers';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['typescript', 'javascript', 'css', 'html', 'svelte', 'bash', 'json', 'markdown', 'csharp', 'sql', 'yaml']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: { adapter: adapter() },
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			highlight: {
				highlighter: (code, lang = 'text') => {
					const html = escapeSvelte(
						highlighter.codeToHtml(code, {
							lang,
							themes: { light: 'github-light', dark: 'github-dark' },
							transformers: [
								transformerNotationDiff(),
								transformerNotationHighlight(),
								transformerNotationFocus()
							]
						})
					);

					return `{@html \`${html}\`}`;
				}
			}
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
