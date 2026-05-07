<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeModeToggle from '$lib/components/ThemeModeToggle.svelte';
	import '$lib/styles/layout.css';
	import {
		defaultThemeState,
		isColorMode,
		isVisualTheme,
		resolveEffectiveMode,
		visualThemes,
		type ColorMode,
		type VisualTheme
	} from '$lib/theme.svelte';

	let { children } = $props();

	let themeState = $state({ ...defaultThemeState });
	let prefersDark = $state(false);
	const themeLabels: Record<VisualTheme, string> = {
		paper: 'Paper',
		mono: 'Mono',
		sketch: 'Sketch'
	};

	const ui = {
		shell:
			'theme-shell mx-auto box-border w-full max-w-7xl px-4 pt-4 pb-16 md:pt-6 2xl:max-w-screen-2xl',
		siteChrome:
			'site-chrome sticky top-4 z-10 mb-8 flex items-center justify-between gap-4 px-4 py-4 max-md:static max-md:flex-col max-md:items-start',
		themeControls: 'theme-controls flex flex-wrap items-center gap-4 max-md:w-full max-md:justify-between',
		themeGroup:
			'theme-group inline-flex items-center gap-2 p-1 max-md:w-full max-md:justify-center',
		themeChip: 'theme-chip rounded-full px-4 py-2 max-md:flex-1',
		siteContent: 'site-content grid gap-8 *:min-w-0'
	} as const;

	function syncTheme(visualTheme: VisualTheme, colorMode: ColorMode, persist = true) {
		if (typeof document === 'undefined') {
			return;
		}

		const effectiveMode = resolveEffectiveMode(colorMode, prefersDark);

		themeState.visualTheme = visualTheme;
		themeState.colorMode = colorMode;
		themeState.effectiveMode = effectiveMode;

		document.documentElement.dataset.theme = visualTheme;
		document.documentElement.dataset.mode = colorMode;
		document.documentElement.dataset.effectiveMode = effectiveMode;
		document.documentElement.classList.toggle('dark', effectiveMode === 'dark');

		if (persist) {
			localStorage.setItem('blog-theme', visualTheme);
			localStorage.setItem('blog-color-mode', colorMode);
		}
	}

	function applyTheme(visualTheme: VisualTheme, colorMode: ColorMode) {
		syncTheme(visualTheme, colorMode);
	}

	function toggleColorMode() {
		applyTheme(themeState.visualTheme, themeState.effectiveMode === 'dark' ? 'light' : 'dark');
	}

	function setSystemMode() {
		applyTheme(themeState.visualTheme, 'system');
	}

	$effect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		prefersDark = mediaQuery.matches;

		const storedTheme = localStorage.getItem('blog-theme');
		const storedMode = localStorage.getItem('blog-color-mode');
		const visualTheme =
			storedTheme && isVisualTheme(storedTheme) ? storedTheme : defaultThemeState.visualTheme;
		const colorMode =
			storedMode && isColorMode(storedMode) ? storedMode : defaultThemeState.colorMode;

		syncTheme(visualTheme, colorMode, false);

		const handleThemeChange = (event: MediaQueryListEvent) => {
			prefersDark = event.matches;
			syncTheme(themeState.visualTheme, themeState.colorMode, false);
		};

		if (typeof mediaQuery.addEventListener === 'function') {
			mediaQuery.addEventListener('change', handleThemeChange);

			return () => mediaQuery.removeEventListener('change', handleThemeChange);
		}

		mediaQuery.addListener(handleThemeChange);

		return () => mediaQuery.removeListener(handleThemeChange);
	});
</script>



<div class={ui.shell}>
	<header class={ui.siteChrome}>
		<a class="brand-mark" href={resolve('/')}>Ankur Mathur</a>

		<div class={ui.themeControls} aria-label="Theme controls">
			<div
				class={ui.themeGroup}
				role="group"
				aria-label="Visual theme"
			>
				{#each visualThemes as theme (theme)}
					<button
						type="button"
						class:active={themeState.visualTheme === theme}
						class={ui.themeChip}
						onclick={() => applyTheme(theme, themeState.colorMode)}
					>
						{themeLabels[theme]}
					</button>
				{/each}
			</div>

			<ThemeModeToggle
				effectiveMode={themeState.effectiveMode}
				isSystemMode={themeState.colorMode === 'system'}
				onToggleMode={toggleColorMode}
				onSetSystemMode={setSystemMode}
			/>
		</div>
	</header>

	<main class={ui.siteContent}>
		{@render children()}
	</main>
</div>
