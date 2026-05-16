import { resumeData } from '$lib/index';
import type { ResumeData } from '$lib/types/resume';

export const prerender = true;

export function load(): ResumeData {
	return resumeData as ResumeData;
}
