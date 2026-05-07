<script lang="ts">
	import { resolve } from '$app/paths';
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
		modeControls:
			'mode-controls inline-flex items-center gap-1 p-1 max-md:w-full max-md:justify-center',
		modeToggle:
			'mode-toggle relative grid h-11 w-14 place-items-center overflow-hidden rounded-full border border-transparent p-1',
		modeToggleTrack: 'mode-toggle__track relative block h-full w-full rounded-full',
		modeToggleThumb:
			'mode-toggle__thumb absolute top-1/2 left-0.5 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full',
		systemToggle:
			'system-toggle grid h-11 w-11 place-items-center rounded-full border border-transparent',
		siteContent: 'site-content grid gap-8 *:min-w-0'
	} as const;

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

			<div class={ui.modeControls}>
				<button
					type="button"
					class={ui.modeToggle}
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
					<span class={ui.modeToggleTrack} aria-hidden="true">
						<span class={ui.modeToggleThumb}>
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
					class={ui.systemToggle}
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

	<main class={ui.siteContent}>
		{@render children()}
	</main>
</div>
