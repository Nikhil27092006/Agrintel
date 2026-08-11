---
name: KisanMitra
colors:
  surface: '#fff9ec'
  surface-dim: '#e0dac9'
  surface-bright: '#fff9ec'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e2'
  surface-container: '#f4eddd'
  surface-container-high: '#eee8d7'
  surface-container-highest: '#e9e2d2'
  on-surface: '#1e1c12'
  on-surface-variant: '#41493e'
  inverse-surface: '#333025'
  inverse-on-surface: '#f7f0df'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#835400'
  on-secondary: '#ffffff'
  secondary-container: '#fcab28'
  on-secondary-container: '#694300'
  tertiary: '#50342c'
  on-tertiary: '#ffffff'
  tertiary-container: '#694b42'
  on-tertiary-container: '#e6bcb0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#ffddb5'
  secondary-fixed-dim: '#ffb957'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#643f00'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#e7bdb1'
  on-tertiary-fixed: '#2c160e'
  on-tertiary-fixed-variant: '#5d4037'
  background: '#fff9ec'
  on-background: '#1e1c12'
  surface-variant: '#e9e2d2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  touch-target: 56px
---

## Brand & Style

The design system is rooted in the concept of "Digital Stewardship." It aims to bridge the gap between traditional agricultural wisdom and modern data science. The personality is that of a "knowledgeable neighbor"—someone who is deeply rooted in the land but understands the power of technology.

The style is **Modern Tactile**, combining the cleanliness of high-utility SaaS with soft, organic shapes that feel approachable to users who may be less tech-savvy. Large, generous tap targets and high-contrast typography ensure accessibility in outdoor, high-glare environments. The visual language avoids cold, industrial aesthetics in favor of a warm, supportive environment that reduces the cognitive load of complex agricultural decision-making.

## Colors

This color palette is inspired by the Indian agricultural landscape. 

- **Primary (Deep Forest Green):** Used for primary actions, branding, and representing healthy growth. It provides high contrast against the cream background.
- **Accent (Sun Gold):** Reserved for high-value insights, notifications, and "Aha!" moments.
- **Support (Warm Soil Brown):** Used for secondary UI elements, borders, and grounding the interface in an earthy tone.
- **Background (Cream):** A soft, low-strain alternative to pure white, improving readability under direct sunlight.
- **Alert/Risk (Alert Red):** Specifically used for pest warnings, crop failure risks, and critical market drops.

## Typography

The typography system prioritizes legibility across multiple scripts. 

- **Inter** is used for numerical data, English headings, and UI labels to provide a clean, modern structure.
- **Noto Sans** is the primary workhorse for body text, ensuring that Indic scripts (Hindi, Marathi, etc.) are rendered with clarity and appropriate line spacing to accommodate complex glyphs.
- **Sizing Strategy:** Base body size is slightly larger (18px for body-lg) than standard apps to account for varied literacy levels and outdoor usage.

## Layout & Spacing

This design system uses a **Fluid Grid** model optimized for narrow viewports. 

- **Mobile First:** The layout relies on a 4-column grid for mobile with 16px margins and 12px gutters.
- **Touch Targets:** A mandatory minimum height of 56px for all primary interactive elements (buttons, list items, inputs) ensures ease of use for users with larger hands or while wearing gloves.
- **Information Density:** Content is spaced generously to prevent accidental taps. Horizontal scrolling "card carousels" are preferred over long vertical lists for categorical data like weather or mandi prices.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Background):** Cream (#FFF8E7) creates a non-reflective base.
- **Level 1 (Cards):** Pure white (#FFFFFF) surfaces with a soft, diffused shadow (0px 4px 12px rgba(27, 94, 32, 0.08)). The shadow uses a slight green tint to maintain color harmony.
- **Level 2 (Interactive):** Floating Action Buttons (like the Voice Button) use a more pronounced shadow (0px 8px 24px rgba(0, 0, 0, 0.12)) to suggest "press-ability."
- **Overlays:** Full-screen modals use a semi-transparent Soil Brown (#5D4037) backdrop at 40% opacity to maintain focus.

## Shapes

The shape language is "Highly Organic." 

- **Cards & Containers:** Use a 16px corner radius (`rounded-lg`) to create a soft, friendly frame for data.
- **Buttons & Chips:** Use a 28px or fully pill-shaped radius (`rounded-xl`) to signify actionability and safety.
- **Input Fields:** Follow the 16px radius of cards to maintain a consistent internal language.

## Components

### Buttons
- **Primary Action:** 56px height, Deep Forest Green background, White text, 28px radius.
- **Voice Button:** A 72px diameter circle, Sun Gold background, with a continuous 2px stroke "pulse" animation to encourage interaction.

### Cards
- **Insight Cards:** White background, 16px radius, featuring a primary headline and a 4px left-accent border (Green for success, Gold for info, Red for risk).

### Selection & Input
- **Input Fields:** Cream background (slightly darker than page background) with a 2px Soil Brown bottom border.
- **Checkboxes/Radios:** Large 32px targets with Deep Forest Green active states.

### Data Indicators
- **Risk Pill:** Small pill-shaped badges (12px radius). Low (Green), Med (Gold), High (Red) with contrasting dark text.
- **Trend Chips:** Small rounded rectangles showing price changes with chevron icons (Up/Green, Down/Red).

### Navigation
- **Bottom Bar:** 64px height, White background, featuring 5 items. The active state uses a small Sun Gold dot below the icon.

### Gauges
- **Circular Risk Gauge:** Uses a 180-degree semi-circle track. The needle/indicator is Soil Brown, moving across a tri-color gradient (Green to Red) to visualize threat levels.