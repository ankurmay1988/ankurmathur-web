<script lang="ts">
	import type { Education } from '$lib/types/resume';

	interface Props {
		items: Education[];
	}

	let { items }: Props = $props();
</script>

<section id="education" class="resume-section">
	<div class="resume-section-content">
		<h2 class="mb-5">Education</h2>

		{#each items as edu (edu.institution + edu.degree)}
			<div class="d-flex flex-column flex-md-row justify-content-between mb-5">
				<div class="flex-grow-1">
					<h3 class="mb-0">{edu.institution}</h3>
					<div class="subheading mb-3">{edu.degree}</div>
					<div>{edu.field}</div>
				</div>
				<div class="flex-shrink-0">
					<span class="text-primary">{edu.startDate} — {edu.endDate}</span>
				</div>
			</div>
		{/each}
	</div>
</section>
