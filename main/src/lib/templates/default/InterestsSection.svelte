<script lang="ts">
	interface Props {
		interests: string[];
	}

	let { interests }: Props = $props();
</script>

{#if interests.length > 0}
	<section id="interests" class="resume-section">
		<div class="resume-section-content">
			<h2 class="mb-5">Interests</h2>
			<ul>
				{#each interests as interest}
					<li>{interest}</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}
