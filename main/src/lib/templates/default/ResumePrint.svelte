<script lang="ts">
	import type { ResumeData } from '$lib/types/resume';

	interface Props {
		data: ResumeData;
	}

	let { data }: Props = $props();

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '';
		const [year, month] = dateStr.split('-');
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		if (month) {
			return `${months[parseInt(month) - 1]} ${year}`;
		}
		return year;
	}

	function displayUrl(url: string): string {
		let cleaned = url.replace(/^https?:\/\//, '').replace(/^mailto:/, '').replace(/\/$/, '');
		// Remove www. prefix
		cleaned = cleaned.replace(/^www\./, '');
		return cleaned;
	}
</script>

<div class="resume-print">
	<section id="main">
		<header id="title">
			<h1>{data.basics.name}</h1>
			<span class="subtitle">{data.basics.headline}</span>
		</header>

		<section class="main-block">
			<h2><i class="fa fa-suitcase"></i> Experience</h2>
			{#each data.experience as exp (exp.company + exp.position + exp.startDate)}
				<section class="blocks">
					<div class="date">
						<span>{formatDate(exp.startDate)}</span>
						<span>{exp.current ? 'Present' : formatDate(exp.endDate)}</span>
					</div>
					<div class="decorator"></div>
					<div class="details">
						<header>
							<h3>{exp.position}</h3>
							<span class="place">{exp.company}</span>
							{#if exp.location}
								<span class="location">{exp.location}</span>
							{/if}
						</header>
						<div>
							<ul>
								{#each exp.highlights as h}
									<li>{h}</li>
								{/each}
							</ul>
						</div>
					</div>
				</section>
			{/each}
		</section>

		<section class="main-block concise">
			<h2><i class="fa fa-graduation-cap"></i> Education</h2>
			{#each data.education as edu (edu.institution + edu.degree)}
				<section class="blocks">
					<div class="date">
						<span>{edu.startDate}</span>
						<span>{edu.endDate}</span>
					</div>
					<div class="decorator"></div>
					<div class="details">
						<header>
							<h3>{edu.degree}</h3>
							<span class="place">{edu.institution}</span>
						</header>
						<div>{edu.field}</div>
					</div>
				</section>
			{/each}
		</section>

		{#if data.certifications.length > 0}
			<section class="main-block concise">
				<h2><i class="fa fa-certificate"></i> Certifications</h2>
				<section class="blocks">
					<div class="decorator"></div>
					<div class="details">
						<ul>
							{#each data.certifications as cert}
								<li>{cert.name} — {cert.issuer}</li>
							{/each}
						</ul>
					</div>
				</section>
			</section>
		{/if}
	</section>

	<aside id="sidebar">
		<div class="side-block" id="contact">
			<h1>Contact</h1>
			<ul>
				<li><i class="fa fa-envelope"></i> {data.basics.email}</li>
				<li><i class="fa fa-phone"></i> {data.basics.phone}</li>
				<li><i class="fa fa-globe"></i> {data.basics.location}</li>
				{#each data.basics.socialLinks as link}
					<li><i class="fa fa-{link.platform === 'github' ? 'github' : link.platform === 'linkedin' ? 'linkedin' : 'envelope'}"></i> {displayUrl(link.url)}</li>
				{/each}
			</ul>
		</div>
		<div class="side-block" id="skills">
			<h1>Skills</h1>
			{#each data.skills as cat}
				<ul>
					{#each cat.items as skill}
						<li>{skill}</li>
					{/each}
				</ul>
			{/each}
		</div>
		<div class="side-block" id="disclaimer">
			This r&eacute;sum&eacute; was wholly typeset with HTML/CSS &mdash; see <code>git.io/vVSYL</code>
		</div>
	</aside>
</div>
