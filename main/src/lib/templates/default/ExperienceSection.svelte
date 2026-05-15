<script lang="ts">
	import type { Experience } from '$lib/types/resume';

	interface Props {
		items: Experience[];
	}

	let { items }: Props = $props();

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '';
		const [year, month] = dateStr.split('-');
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		if (month) {
			const monthIndex = parseInt(month) - 1;
			return months[monthIndex] + ' ' + year;
		}
		return year;
	}
</script>

<section id="experience" class="resume-section">
	<div class="resume-section-content">
		<h2 class="mb-5">Experience</h2>

		{#each items as exp (exp.company + exp.position + exp.startDate)}
			<div class="d-flex flex-column flex-md-row justify-content-between mb-5">
				<div class="flex-grow-1">
					<h3 class="mb-0">{exp.position}</h3>
					<div class="subheading mb-3">{exp.company}</div>
					<ul class="fa-ul">
						{#each exp.highlights as highlight}
							<li>
								<span class="fa-li"><span class="bullet-dot"></span></span>
								{highlight}
							</li>
						{/each}
					</ul>
				</div>
				<div class="flex-shrink-0">
					<span class="text-primary">{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
				</div>
			</div>
		{/each}
	</div>
</section>
