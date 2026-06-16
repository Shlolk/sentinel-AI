---
name: Obsidian Command
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#e8bcb7'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#af8783'
  outline-variant: '#5e3f3b'
  surface-tint: '#ffb4ab'
  primary: '#ffb4ab'
  on-primary: '#690005'
  primary-container: '#ff5449'
  on-primary-container: '#5c0004'
  inverse-primary: '#c00011'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#c9c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#929090'
  on-tertiary-container: '#2a2a29'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000a'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 32px
  container-padding: 20px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

The design system is engineered for high-stakes intelligence and strategic oversight. It adopts an **ultra-dark, cinematic aesthetic** that blends the precision of aerospace interfaces with the premium minimalism of high-end consumer electronics. The interface functions as a "Cyber Command Center"—a place where massive data streams are distilled into actionable clarity.

The visual language is characterized by **Glassmorphism** and **Tactile Depth**. Surfaces are not merely flat; they are translucent layers of "obsidian glass" that catch faint ambient light. We utilize high-contrast accents of "Signal Red" against a void-black background to create an immediate sense of urgency and importance. The atmosphere is professional, cold, and authoritative, evoking the feeling of a mission-critical platform where every pixel has a purpose.

## Colors

The palette is anchored by **Deep Void Black (#050505)** to ensure maximum contrast for data visualization. 

- **Signal Red (#ff2b2b):** Used exclusively for critical alerts, primary actions, and "active" states. It should appear to glow, utilizing subtle box-shadows to simulate light emission.
- **Glass Surfaces:** Containers use a semi-transparent dark gray with a backdrop-blur (minimum 12px) to create depth without clutter.
- **Data Visualization:** Beyond the primary red, use a muted spectrum:
    - **Amber (#f59e0b):** For cautionary states.
    - **Emerald (#10b981):** For healthy/stable states.
    - **Slate Blue (#3b82f6):** For informational/neutral data.

## Typography

The typography system strikes a balance between human-centric readability and technical precision.

1.  **Headlines (Hanken Grotesk):** Provides a sharp, contemporary feel for high-level metrics and section headers.
2.  **Body (Inter):** A utilitarian workhorse for descriptions, logs, and general content, ensuring clarity at small sizes.
3.  **Data & Labels (JetBrains Mono):** Used for timestamps, coordinates, and technical metadata to reinforce the "intelligence platform" aesthetic.

**Hierarchy Rule:** Large display numbers should always be high-contrast white (#FFFFFF). Secondary labels should use a reduced opacity (60-70%) to maintain clear information architecture.

## Layout & Spacing

This design system utilizes a **12-column Fluid Grid** for internal dashboard modules, while the global navigation remains fixed at the left.

- **Grid Texture:** Subtle 32px x 32px grid lines (opacity 3%) can be applied to the background to assist with visual alignment and provide a technical "blueprint" feel.
- **Density:** High density is preferred. Information should be tightly packed but separated by clear "air" (24px gutters) to prevent cognitive overload.
- **Responsive Behavior:** 
    - **Desktop:** 12 columns, 32px margins.
    - **Tablet:** 8 columns, 24px margins, sidebar collapses to icons.
    - **Mobile:** 4 columns, 16px margins, metrics stack vertically.

## Elevation & Depth

Depth is established through **Light Source Simulation** rather than traditional drop shadows.

- **Level 0 (Background):** Solid #050505.
- **Level 1 (Panels):** Semi-transparent glass with a 1px inner border (`rgba(255,255,255,0.08)`).
- **Level 2 (Active States/Modals):** Increased backdrop-blur and a "Signal Red" outer glow (`box-shadow: 0 0 20px rgba(255, 43, 43, 0.15)`).
- **Global Depth:** A faint, large radial gradient (Red, 5% opacity) should sit behind the primary active module to draw the eye and simulate ambient light from a large display.

## Shapes

The design system uses a **Precision Softness** approach. While the vibe is technical, sharp corners are avoided to maintain a premium, modern feel.

- **Base Radius:** 4px (Soft) for most components to ensure they feel like machined parts.
- **Large Containers:** 8px (Rounded-lg) for main dashboard panels to differentiate them from the background void.
- **Interactive Elements:** Buttons and input fields mirror the 4px base radius for consistency.

## Components

### Buttons
- **Primary:** Solid #ff2b2b with white text. On hover, apply a subtle red glow.
- **Ghost:** 1px border `rgba(255,255,255,0.2)` with white text. Background fills slightly on hover.

### Input Fields
- Darker than the surface background (#0a0a0a) with a subtle 1px bottom border. 
- Focus state: Bottom border changes to #ff2b2b with a faint red under-glow.

### Cards & Modules
- Every card must have a header section with a `code-label` font title.
- Incorporate "corner marks" (tiny L-shapes at the corners) to emphasize the tactical intelligence aesthetic.

### Status Indicators
- **Chips:** Small, pill-shaped with low-opacity backgrounds (e.g., `rgba(255,43,43,0.1)`) and high-contrast text.
- **Pulse:** Critical alerts should include a subtle 2-second scale animation to simulate a living system heartbeat.

### AI Copilot
- The "AI Copilot" input should be anchored at the bottom right, appearing as a floating glass layer with a distinct blurred background to separate it from the main data grid.