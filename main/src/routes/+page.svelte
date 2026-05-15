<script lang="ts">
	import type { PageProps } from './$types';
	import ResumePage from '$lib/templates/default/ResumePage.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.basics.name} — Resume</title>
	<meta name="description" content={data.basics.headline} />
	<meta property="og:title" content="{data.basics.name} — Resume" />
	<meta property="og:description" content={data.basics.headline} />
	<meta property="og:type" content="profile" />
</svelte:head>

<ResumePage data={data} />