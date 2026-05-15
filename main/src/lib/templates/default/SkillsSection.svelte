<script lang="ts">
	import type { SkillCategory } from '$lib/types/resume';

	interface Props {
		categories: SkillCategory[];
	}

	let { categories }: Props = $props();
</script>

<section id="skills" class="resume-section">
	<div class="resume-section-content">
		<h2 class="mb-5">Skills</h2>

		{#each categories as cat (cat.name)}
			<div class="subheading mb-2">{cat.name}</div>
			<ul class="list-inline dev-icons mb-4">
				{#each cat.items as skill}
					<li class="list-inline-item skill-pill">{skill}</li>
				{/each}
			</ul>
		{/each}
	</div>
</section>
