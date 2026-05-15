<script lang="ts">
	import type { ResumeData } from '$lib/types/resume';
	import AboutSection from './AboutSection.svelte';
	import ExperienceSection from './ExperienceSection.svelte';
	import EducationSection from './EducationSection.svelte';
	import SkillsSection from './SkillsSection.svelte';
	import InterestsSection from './InterestsSection.svelte';
	import ContactForm from './ContactForm.svelte';

	interface Props {
		data: ResumeData;
	}

	let { data }: Props = $props();
</script>

<div class="resume-wrapper">
	<!-- Sidebar Navigation (StartBootstrap style) -->
	<nav class="sidebar-nav" id="sideNav">
		<button class="nav-toggler" aria-label="Toggle navigation" onclick={() => document.getElementById('sideNav')?.classList.toggle('nav-open')}>
			<span class="navbar-toggler-icon"></span>
		</button>
		<a class="sidebar-brand" href="#page-top">
			<img
				src={data.basics.photo}
				alt={data.basics.name}
				class="profile-img"
				loading="lazy"
			/>
		</a>
		<div class="sidebar-nav-links">
			<ul class="sidebar-nav-list">
				<li class="nav-item"><a class="nav-link" href="#about">About</a></li>
				<li class="nav-item"><a class="nav-link" href="#experience">Experience</a></li>
				<li class="nav-item"><a class="nav-link" href="#education">Education</a></li>
				<li class="nav-item"><a class="nav-link" href="#skills">Skills</a></li>
				{#if data.interests.length > 0}
					<li class="nav-item"><a class="nav-link" href="#interests">Interests</a></li>
				{/if}
				<li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
			</ul>
			<div class="sidebar-cta">
				<a href="/resume" class="download-resume-link">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
					Resume PDF
				</a>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<div class="resume-main">
		<div class="container-fluid p-0">
			<AboutSection basics={data.basics} />
			<hr class="m-0" />
			<ExperienceSection items={data.experience} />
			<hr class="m-0" />
			<EducationSection items={data.education} />
			<hr class="m-0" />
			<SkillsSection categories={data.skills} />
			<hr class="m-0" />
			{#if data.interests.length > 0}
				<InterestsSection interests={data.interests} />
				<hr class="m-0" />
			{/if}
			<section id="contact" class="resume-section">
				<div class="resume-section-content">
					<h2 class="mb-5">Contact Me</h2>
					<ContactForm />
				</div>
			</section>
		</div>
	</div>
</div>
