import type { ResumeData } from '$lib/types/resume';

export interface TemplateProps {
	data: ResumeData;
}

export type TemplateComponent = new (...args: unknown[]) => {
	$$props_def: TemplateProps;
};
