<script lang="ts">
	import './resume-print.css';
	import type { PageProps } from './$types';
	import ResumePrint from '$lib/templates/default/ResumePrint.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.basics.name} — CV / Resume (Print)</title>
	<meta name="description" content="Printable resume for {data.basics.name}" />
</svelte:head>

<div class="print-controls">
	<button class="btn btn-primary" onclick={() => window.print()}>Download PDF / Print</button>
	<a href="/" class="btn btn-ghost">Back to main page</a>
</div>

<ResumePrint data={data} />

<style>
	.print-controls {
		display: flex;
		gap: 1rem;
		padding: 1rem 2rem;
		background: #f8f9fa;
		border-bottom: 1px solid #dee2e6;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.btn-ghost {
		background: transparent;
		color: var(--gray-800);
		border: 1px solid #dee2e6;
	}

	.btn-ghost:hover {
		background: #e9ecef;
		text-decoration: none;
	}

	@media print {
		.print-controls { display: none; }
	}
</style>
