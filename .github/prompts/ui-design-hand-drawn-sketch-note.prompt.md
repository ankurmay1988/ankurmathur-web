Act as a Senior Frontend Engineer and Expert UI Designer.
Your task is to code a complete Landing Page on the first attempt.
- Landing Page Theme: <INSERT THEME>
- Sections to add: <INSERT SECTIONS>

[DESIGN.MD](design-hand-drawn-sketch-note/DESIGN.md)

Generate the final code immediately following these definitions:

## Style

- **Name:** Hand-Drawn Sketch-Note
- **Type:** Authentic, Informal, Creative
- **Keywords:** sketch, note, hand-drawn, doodle, paper, notebook, pencil, casual, fun
- **Era:** Modern Casual
- **Light/Dark:** ✓ Full / ✗ No

## Color Palette

- **Primary:** Background #F4F1EA, Text #0E2A5C, Accent #D12828
- **Secondary:** Graphite Grey #333333, Highlighter Yellow #FFFFA5,  Ballpoint Blue #0000FF

## Visual Effects

Spiral binding, coffee ring stains, arrows, stick figures, speech bubbles, matte paper grain, horizontal rule lines, ink bleed.

## AI Visual Direction

hand drawn landing page, notebook paper background, sketch style, doodles, handwriting font, casual and fun design.

## CSS Technical

```css
background-color: #F4F1EA; color: #0E2A5C; font-family: 'Patrick Hand', cursive; background-image: linear-gradient(#ccc 1px, transparent 1px); background-size: 100% 1.5em;
```

## Design System Variables

```css
--paper-note: #F4F1EA, --ink-blue: #0E2A5C, --pencil-grey: #333333, --alert-red: #D12828, --font-hand: 'Patrick Hand', cursive
```

## Implementation Checklist

- ☐ Notebook paper background (lines/grid)
- ☐ Handwriting-style fonts
- ☐ Doodle/Sketch illustrations
- ☐ Imperfect/Organic shapes
- ☐ 'Sticker' or 'Tape' effects

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