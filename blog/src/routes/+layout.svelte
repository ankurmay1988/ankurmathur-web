<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
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
		journal: 'Journal',
		mono: 'Mono'
	};

	function syncTheme(visualTheme: VisualTheme, colorMode: ColorMode, persist = true) {
		if (typeof document === 'undefined') {
			return;
		}

		const effectiveMode = resolveEffectiveMode(colorMode, prefersDark);

		themeState = {
			visualTheme,
			colorMode,
			effectiveMode
		};

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
			storedTheme && isVisualTheme(storedTheme) ? storedTheme : themeState.visualTheme;
		const colorMode = storedMode && isColorMode(storedMode) ? storedMode : themeState.colorMode;

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

<svelte:head>
	<link rel="icon" href={favicon} />
	<script>
		(() => {
			const root = document.documentElement;
			const visualThemes = ['paper', 'journal', 'mono'];
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

<div class="theme-shell">
	<header class="site-chrome">
		<a class="brand-mark" href={resolve('/')}>Ankur Mathur</a>

		<div class="theme-controls" aria-label="Theme controls">
			<div class="theme-group" role="group" aria-label="Visual theme">
				{#each visualThemes as theme (theme)}
					<button
						type="button"
						class:active={themeState.visualTheme === theme}
						class="theme-chip"
						onclick={() => applyTheme(theme, themeState.colorMode)}
					>
						{themeLabels[theme]}
					</button>
				{/each}
			</div>

			<div class="mode-controls">
				<button
					type="button"
					class="mode-toggle"
					class:active={themeState.colorMode !== 'system'}
					class:is-dark={themeState.effectiveMode === 'dark'}
					onclick={toggleColorMode}
					aria-pressed={themeState.colorMode !== 'system'}
					aria-label={themeState.effectiveMode === 'dark'
						? 'Switch to light mode'
						: 'Switch to dark mode'}
					title={themeState.effectiveMode === 'dark'
						? 'Switch to light mode'
						: 'Switch to dark mode'}
				>
					<span class="mode-toggle__track" aria-hidden="true">
						<span class="mode-toggle__thumb">
							{#if themeState.effectiveMode === 'dark'}
								<svg viewBox="0 0 24 24" aria-hidden="true">
									<path
										d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 11.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 3a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V20a.75.75 0 0 1 .75-.75ZM5.5 11.25a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1 0-1.5h1.5Zm16 0a.75.75 0 0 1 0 1.5H20a.75.75 0 0 1 0-1.5h1.5ZM7.05 6a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L7.05 7.06A.75.75 0 0 1 7.05 6Zm8.78 8.78a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM18 7.05a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06A.75.75 0 0 1 18 7.05Zm-8.78 8.78a.75.75 0 0 1 0 1.06L8.16 17.95A.75.75 0 1 1 7.1 16.9l1.06-1.06a.75.75 0 0 1 1.06 0Z"
									/>
								</svg>
							{:else}
								<svg viewBox="0 0 24 24" aria-hidden="true">
									<path
										d="M14.96 3.2a.75.75 0 0 1 .79.18 8.74 8.74 0 1 0 4.87 11.58.75.75 0 0 1 1.15.83A10.24 10.24 0 1 1 14.8 2.44a.75.75 0 0 1 .16.76Z"
									/>
								</svg>
							{/if}
						</span>
					</span>
				</button>

				<button
					type="button"
					class="system-toggle"
					class:active={themeState.colorMode === 'system'}
					onclick={setSystemMode}
					aria-pressed={themeState.colorMode === 'system'}
					aria-label="Use system theme"
					title="Use system theme"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M4.75 6A2.25 2.25 0 0 1 7 3.75h10A2.25 2.25 0 0 1 19.25 6v8A2.25 2.25 0 0 1 17 16.25h-3.47l1.53 2.3h1.19a.75.75 0 0 1 0 1.5H7.75a.75.75 0 0 1 0-1.5h1.19l1.53-2.3H7A2.25 2.25 0 0 1 4.75 14V6ZM7 5.25a.75.75 0 0 0-.75.75v8c0 .41.34.75.75.75h10a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H7Zm4.28 13.3h1.44l-1.33-2h-.11l-1.33 2h1.33Z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</header>

	<main class="site-content">
		{@render children()}
	</main>
</div>
