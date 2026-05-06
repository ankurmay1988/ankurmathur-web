<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&family=Patrick+Hand&display=swap"
		rel="stylesheet"
	/>
	<script>
		// Anti-FOUC: apply stored theme to <html> before first paint
		(() => {
			const root = document.documentElement;
			const visualThemes = ['paper', 'mono', 'sketch'];
			const colorModes = ['light', 'dark', 'system'];
			const storedTheme = localStorage.getItem('blog-theme');
			const storedMode = localStorage.getItem('blog-color-mode');
			const visualTheme = visualThemes.includes(storedTheme ?? '') ? storedTheme : 'paper';
			const colorMode = colorModes.includes(storedMode ?? '') ? storedMode : 'system';
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const effectiveMode = colorMode === 'system' ? (prefersDark ? 'dark' : 'light') : colorMode;

			root.dataset.theme = visualTheme;
			root.dataset.mode = colorMode;
			root.dataset.effectiveMode = effectiveMode;
			root.classList.toggle('dark', effectiveMode === 'dark');
		})();
	</script>
</svelte:head>

{@render children()}
