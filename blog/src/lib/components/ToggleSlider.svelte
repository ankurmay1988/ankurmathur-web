<script lang="ts">
	import type { Snippet } from 'svelte';

	type ToggleSliderProps = {
		checked: boolean;
		active?: boolean;
		disabled?: boolean;
		labelOn?: string;
		labelOff?: string;
		title?: string;
		onClick?: (event: MouseEvent) => void;
		onChange?: (checked: boolean) => void;
		onToggle?: (checked: boolean, event: MouseEvent) => void;
		class?: string;
		onIcon?: Snippet<[]>;
		offIcon?: Snippet<[]>;
	};

	let {
		checked,
		active = true,
		disabled = false,
		labelOn = 'On',
		labelOff = 'Off',
		title,
		onClick,
		onChange,
		onToggle,
		class: className = '',
		onIcon,
		offIcon
	}: ToggleSliderProps = $props();

	let buttonClass = $derived.by(() =>
		['toggle-slider', className, active ? 'is-active' : '', checked ? 'is-checked' : '']
			.filter(Boolean)
			.join(' ')
	);
	let ariaLabel = $derived(checked ? labelOn : labelOff);

	function handleClick(event: MouseEvent) {
		if (disabled) {
			return;
		}

		onClick?.(event);

		const nextChecked = !checked;
		onChange?.(nextChecked);
		onToggle?.(nextChecked, event);
	}
</script>

<button
	type="button"
	class={buttonClass}
	onclick={handleClick}
	disabled={disabled}
	role="switch"
	aria-checked={checked}
	aria-label={ariaLabel}
	title={title ?? ariaLabel}
	data-active={active ? 'true' : 'false'}
	data-checked={checked ? 'true' : 'false'}
>
	<span class="toggle-slider__track" aria-hidden="true">
		<span class="toggle-slider__thumb">
			{#if checked}
				{#if onIcon}
					{@render onIcon()}
				{/if}
			{:else}
				{#if offIcon}
					{@render offIcon()}
				{/if}
			{/if}
		</span>
	</span>
</button>