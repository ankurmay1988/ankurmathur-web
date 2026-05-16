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

	// Scroll-spy: highlight nav links on scroll
	$effect(() => {
		if (typeof window === 'undefined') return;

		const navLinks = document.querySelectorAll<HTMLAnchorElement>('.sidebar-nav-list .nav-link');
		const sections: { id: string; el: HTMLElement }[] = [];
		navLinks.forEach((link) => {
			const href = link.getAttribute('href');
			if (href && href.startsWith('#')) {
				const el = document.getElementById(href.substring(1));
				if (el) sections.push({ id: href.substring(1), el });
			}
		});

		function onScroll() {
			const scrollPos = window.scrollY;
			const viewportHeight = window.innerHeight;
			// Bootstrap-style: section is "active" when its top passes ~40% into viewport
			const activationPoint = scrollPos + viewportHeight * 0.4;

			let current = sections[0]?.id || '';

			// If near the bottom, activate the last section
			const lastSection = sections[sections.length - 1];
			if (lastSection && scrollPos + viewportHeight >= document.body.scrollHeight - 2) {
				current = lastSection.id;
			} else {
				for (const section of sections) {
					const offsetTop = section.el.offsetTop;
					if (offsetTop <= activationPoint) {
						current = section.id;
					} else {
						break;
					}
				}
			}

			navLinks.forEach((link) => {
				const href = link.getAttribute('href');
				if (href === `#${current}`) {
					link.classList.add('active');
				} else {
					link.classList.remove('active');
				}
			});
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		// Also run on resize since viewport height changes
		window.addEventListener('resize', onScroll, { passive: true });
		// Run after a tick to account for scroll restoration
		requestAnimationFrame(() => onScroll());
		setTimeout(onScroll, 100);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	// Smooth scroll on nav click + collapse mobile menu
	function handleNavClick(e: MouseEvent) {
		const link = e.currentTarget as HTMLAnchorElement;
		const href = link.getAttribute('href');
		if (href && href.startsWith('#')) {
			e.preventDefault();
			const target = document.getElementById(href.substring(1));
			if (target) {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		}
		// Collapse mobile nav
		const nav = document.getElementById('sideNav');
		if (nav) nav.classList.remove('nav-open');
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700&family=Muli:400,400i,800,800i&display=swap" rel="stylesheet" />
</svelte:head>

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
				<li class="nav-item"><a class="nav-link" href="#about" onclick={handleNavClick}>About</a></li>
				<li class="nav-item"><a class="nav-link" href="#experience" onclick={handleNavClick}>Experience</a></li>
				<li class="nav-item"><a class="nav-link" href="#education" onclick={handleNavClick}>Education</a></li>
				<li class="nav-item"><a class="nav-link" href="#skills" onclick={handleNavClick}>Skills</a></li>
				{#if data.interests.length > 0}
					<li class="nav-item"><a class="nav-link" href="#interests" onclick={handleNavClick}>Interests</a></li>
				{/if}
				<li class="nav-item"><a class="nav-link" href="#contact" onclick={handleNavClick}>Contact</a></li>
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
