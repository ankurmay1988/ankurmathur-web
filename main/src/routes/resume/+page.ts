import { resumeData } from '$lib/index';
import type { ResumeData } from '$lib/types/resume';

export function load(): ResumeData {
	return resumeData as ResumeData;
}
