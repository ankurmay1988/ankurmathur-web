export const visualThemes = ['paper', 'mono', 'sketch'] as const;
export const colorModes = ['light', 'dark', 'system'] as const;

export type VisualTheme = (typeof visualThemes)[number];
export type ColorMode = (typeof colorModes)[number];

export type ThemeState = {
	visualTheme: VisualTheme;
	colorMode: ColorMode;
	effectiveMode: 'light' | 'dark';
};

export const defaultThemeState: ThemeState = {
	visualTheme: 'paper',
	colorMode: 'system',
	effectiveMode: 'light'
};

export function isVisualTheme(value: string): value is VisualTheme {
	return visualThemes.includes(value as VisualTheme);
}

export function isColorMode(value: string): value is ColorMode {
	return colorModes.includes(value as ColorMode);
}

export function resolveEffectiveMode(colorMode: ColorMode, prefersDark: boolean): 'light' | 'dark' {
	if (colorMode === 'system') {
		return prefersDark ? 'dark' : 'light';
	}

	return colorMode;
}
