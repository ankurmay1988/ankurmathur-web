Act as a Senior Frontend Engineer and Expert UI Designer.
Your task is to code a complete Landing Page on the first attempt.
- Landing Page Theme: <INSERT THEME>
- Sections to add: <INSERT SECTIONS>

DESIGN.md contains the detailed design specifications and style guidelines for the landing page. Follow it closely to ensure the final product matches the intended visual and functional design.

[DESIGN.MD](design-rococo-romantic-narrative/DESIGN.md)

Generate the final code immediately following these definitions:

## Style

- **Name:** Rococo Romantic Narrative
- **Type:** Elegant, Dreamy, Whimsical
- **Keywords:** rococo, romantic, pastel, gold, floral, ornate, cherubs, soft, luxury
- **Era:** 18th Century
- **Light/Dark:** ✓ Full / ✗ No

## Color Palette

- **Primary:** Background #FDF6F0, Text #6B4C40, Accent #EBC97A
- **Secondary:** Pale Pink #FADADD, Sky Blue #C6E2FF, Mint Green #D0F0C0

## Visual Effects

Classical cherubs, blooming roses, flowing golden ribbons, soft watercolor wash, smooth gradients, ethereal glow.

## AI Visual Direction

rococo landing page, romantic style, pastel colors, gold accents, floral decorations, soft and dreamy, ornate luxury.

## CSS Technical

```css
background-color: #FDF6F0; color: #6B4C40; font-family: 'Great Vibes', cursive; background-image: radial-gradient(circle, #FDF6F0 0%, #FADADD 100%);
```

## Design System Variables

```css
--bg-romance: #FDF6F0, --text-cocoa: #6B4C40, --gold-ribbon: #EBC97A, --pastel-pink: #FADADD, --font-script: 'Great Vibes', cursive
```

## Implementation Checklist

- ☐ Pastel background (pink/blue/cream)
- ☐ Gold filigree details
- ☐ Soft script typography
- ☐ Floral and ribbon motifs
- ☐ Light and airy layout

## Execution Rules

1. Strictly follow the defined visual style.
2. Use high-quality inline SVG icons (Heroicons or Lucide style) — NEVER use emojis as icons.
3. Add `cursor-pointer` and smooth `hover` states (transition-all) on all interactive elements.
4. Required Page Structure:
   - Navbar (Logo + Links + CTA)
   - Hero Section (Impactful Headline + Subtitle + 2 buttons + 3D/Abstract visual element via CSS)
   - Features (3 cards with icons)
   - Testimonials (3 cards)
   - Pricing (3 tiers, highlight the middle one)
   - Final CTA
   - Full Footer with social links, privacy policy, terms of use, contact and SEO links.
5. All text content must be in English.
6. The visual must be CLEARLY distinct — do not create a "default Bootstrap" design. Force the use of the provided design system variables.
7. Use `<style>` tags in the head for custom classes (especially for complex backdrop-filter effects and animations) that Tailwind CDN doesn't cover.
8. Full Responsiveness: Layout must adapt perfectly to Mobile, Tablet and Desktop (vertical stack on mobile).
9. Include basic SEO, Viewport and Open Graph meta tags in `<head>`.
10. Footer must contain: Copyright 2026, Secondary navigation links and Social media icons.
11. Make the creative decisions needed to deliver the complete, functional result now.