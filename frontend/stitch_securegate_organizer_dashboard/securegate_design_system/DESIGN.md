---
name: SecureGate Design System
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5b403c'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#8f706a'
  outline-variant: '#e3beb8'
  surface-tint: '#b62413'
  primary: '#b22110'
  on-primary: '#ffffff'
  primary-container: '#d63b27'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a7'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#006579'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f99'
  on-tertiary-container: '#f9fdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a7'
  on-primary-fixed: '#400200'
  on-primary-fixed-variant: '#910900'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#b2ebff'
  tertiary-fixed-dim: '#68d4f3'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5e'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  h1-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  page-padding: 24px
  sidebar-width: 240px
  max-container: 1200px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system for SecureGate focuses on absolute clarity, efficiency, and industrial precision. As an e-ticket management platform for organizers, the UI must prioritize data legibility and rapid task completion over decorative elements.

The aesthetic follows a **High-Contrast Minimalism** approach. It eliminates all depth markers—such as shadows, gradients, and blurs—in favor of a structural, flat architecture defined by hairline borders and intentional whitespace. The emotional response is one of reliability and "invisible" utility: the interface stays out of the way until needed, using a singular high-energy accent color to guide the eye toward critical actions and metrics.

## Colors
This design system utilizes a strictly functional palette. 
- **Coral Red (#F04E37)** is the primary vessel for interactivity and brand presence. It is used sparingly for primary call-to-actions, active navigation states, and highlighting key performance indicators.
- **Grayscale** defines the hierarchy. Pure white (#FFFFFF) is reserved for the primary workspace, while light grays (#F5F5F7) differentiate surfaces and structural containers.
- **Semantic colors** follow a standard light-background, high-contrast-text model to ensure accessibility when communicating status (Success, Warning, Danger).

## Typography
**Inter** is the foundational typeface, selected for its exceptional legibility in data-heavy environments. 

- **Weights:** Use Medium (500) for all headings to provide clear structural hierarchy without appearing overly heavy. Use Regular (400) for body text and descriptive content.
- **Casing:** Adhere strictly to **Sentence case** for all UI elements, including buttons, headers, and labels. This maintains an approachable and modern professional tone.
- **Alignment:** Numbers in data tables should use tabular figures where possible to ensure vertical alignment of digits.

## Layout & Spacing
The layout uses a **Fixed-Fluid hybrid model** to maintain administrative control.

- **Desktop:** A fixed 240px left sidebar handles primary navigation. The main content area occupies the remaining width up to a 1200px maximum container size.
- **Borders:** Containers are separated by 0.5px solid borders (#EBEBEB). Do not use shadows to create separation.
- **Responsive:** 
    - **Mobile:** Transition the sidebar to a hidden drawer accessible via hamburger menu, and introduce a bottom tab bar for the top 3-5 frequent actions.
    - **Padding:** Maintain a consistent 24px gutter around the primary viewport and within major card containers.

## Elevation & Depth
Depth is created exclusively through **Tonal Layering** and **Hairline Outlines**. 
- Level 0 (Base): #FFFFFF (Main background).
- Level 1 (Surfaces): #F5F5F7 (Cards and secondary panels).
- Level 2 (Inputs/Subtle): #F9F9F9.

There are no shadows in this design system. Overlays (Modals/Popovers) should be defined by a solid 1px border and a dim, neutral backdrop overlay to focus the user’s attention, rather than a drop shadow.

## Shapes
The shape language combines varying radii to distinguish between structural containers and interactive elements.
- **Cards:** Use a 14px radius for a modern, soft container feel.
- **Buttons:** Use a 22px "Pill" radius. This high degree of rounding distinguishes buttons from all other rectangular UI elements, making them instantly identifiable as clickable.
- **Inputs & Badges:** Use a tighter 10px radius to maintain a compact, organized appearance in dense data views.

## Components
- **Buttons:** Primary buttons use #F04E37 with white text. Secondary buttons use a #F5F5F7 background with #111111 text. Height should be normalized at 40px for desktop.
- **Cards:** Always white background, 14px radius, and a 0.5px solid #EBEBEB border. No hover shadows. 
- **Active Navigation:** Sidebar items in an active state must feature a 4px Coral Red (#F04E37) left border, #FFF0EE background tint, and Coral Red text.
- **Input Fields:** Use #F5F5F7 as the background color with a 0.5px border. On focus, the border should change to #F04E37.
- **Badges/Status:** Use 10px radius with 11px font. Use the semantic background/text pairings defined in the Color section (e.g., Success: #DCFCE7 bg / #15803D text).
- **Data Tables:** Use a flat style. Row separators are 0.5px #EBEBEB. Header row should have a #F9F9F9 background with Text Tertiary (#9A9A9A) labels.