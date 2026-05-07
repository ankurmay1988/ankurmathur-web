<script lang="ts">
	import ToggleSlider from '$lib/components/ToggleSlider.svelte';

	type EffectiveMode = 'light' | 'dark';
	type ThemeModeToggleProps = {
		effectiveMode: EffectiveMode;
		isSystemMode: boolean;
		onToggleMode: () => void;
		onSetSystemMode: () => void;
		onModeClick?: (event: MouseEvent) => void;
		onModeChange?: (nextMode: EffectiveMode) => void;
	};

	let {
		effectiveMode,
		isSystemMode,
		onToggleMode,
		onSetSystemMode,
		onModeClick,
		onModeChange
	}: ThemeModeToggleProps = $props();

	let isManualMode = $derived(!isSystemMode);
	let isDarkMode = $derived(effectiveMode === 'dark');
	let modeLabel = $derived(
		isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
	);

	function handleModeToggle(nextChecked: boolean) {
		onToggleMode();
		onModeChange?.(nextChecked ? 'dark' : 'light');
	}
</script>

<div class="mode-controls inline-flex items-center gap-1 p-1 max-md:w-full max-md:justify-center">
	<ToggleSlider
		checked={isDarkMode}
		active={isManualMode}
		class="mode-toggle"
		labelOn="Switch to light mode"
		labelOff="Switch to dark mode"
		title={modeLabel}
		onClick={onModeClick}
		onToggle={handleModeToggle}
	>
		{#snippet onIcon()}
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 11.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 3a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V20a.75.75 0 0 1 .75-.75ZM5.5 11.25a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1 0-1.5h1.5Zm16 0a.75.75 0 0 1 0 1.5H20a.75.75 0 0 1 0-1.5h1.5ZM7.05 6a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L7.05 7.06A.75.75 0 0 1 7.05 6Zm8.78 8.78a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM18 7.05a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06A.75.75 0 0 1 18 7.05Zm-8.78 8.78a.75.75 0 0 1 0 1.06L8.16 17.95A.75.75 0 1 1 7.1 16.9l1.06-1.06a.75.75 0 0 1 1.06 0Z"
				/>
			</svg>
		{/snippet}

		{#snippet offIcon()}
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M14.96 3.2a.75.75 0 0 1 .79.18 8.74 8.74 0 1 0 4.87 11.58.75.75 0 0 1 1.15.83A10.24 10.24 0 1 1 14.8 2.44a.75.75 0 0 1 .16.76Z"
				/>
			</svg>
		{/snippet}
	</ToggleSlider>

	<button
		type="button"
		class="system-toggle"
		class:active={isSystemMode}
		onclick={onSetSystemMode}
		aria-pressed={isSystemMode}
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