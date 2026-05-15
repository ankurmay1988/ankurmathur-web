export type SocialPlatform = 'linkedin' | 'github' | 'twitter' | 'email' | 'website' | string;

export interface SocialLink {
	platform: SocialPlatform;
	url: string;
	label: string;
}

export interface Experience {
	company: string;
	position: string;
	startDate: string;
	endDate: string | null;
	current: boolean;
	location: string;
	highlights: string[];
}

export interface Education {
	institution: string;
	degree: string;
	field: string;
	startDate: string;
	endDate: string;
}

export interface SkillCategory {
	name: string;
	items: string[];
}

export interface Certification {
	name: string;
	issuer: string;
}

export interface Project {
	name: string;
	description: string;
	url?: string;
	highlights?: string[];
}

export interface Basics {
	name: string;
	headline: string;
	email: string;
	phone: string;
	location: string;
	photo: string;
	summary: string;
	socialLinks: SocialLink[];
}

export interface ResumeData {
	template: string;
	basics: Basics;
	experience: Experience[];
	education: Education[];
	skills: SkillCategory[];
	certifications: Certification[];
	projects: Project[];
	languages: string[];
	interests: string[];
}
