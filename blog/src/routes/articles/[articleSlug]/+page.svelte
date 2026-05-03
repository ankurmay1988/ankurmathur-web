<script lang="ts">
	import type { PageProps } from "./$types";

    let { params }: PageProps = $props();

    let slug = $derived(params.articleSlug);
</script>

<h1>Article: {slug}</h1>