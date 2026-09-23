---
name: Architectural Menswear
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1a'
  on-tertiary-container: '#838482'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e3e0'
  tertiary-fixed-dim: '#c6c7c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#454745'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
---

## Brand & Style

This design system delivers a disciplined, hyper-standardized neo-grotesque visual environment designed to bridge high-end editorial customer commerce with operational, data-dense administrative consoles. Rooted in structured minimalism and Swiss modernism, the identity prioritizes architectural order, stark high-contrast typography, and restrained tactile warmth.

The brand persona is confident, understated, utilitarian, and uncompromisingly precise. Designed for an audience that values tailoring, tactile material honesty, and curated simplicity, the interface deliberately rejects decorative visual gimmicks—such as saturated gradients, heavy neumorphic drop shadows, and arbitrary radii. Instead, visual authority is achieved through structural hairline grids, deliberate spatial rhythms, off-white baseline canvases, and purposeful typographic scale shifts between customer-facing lookbooks and administrative consoles.

## Colors

The color architecture is built around an 11-token functional palette governed by strict contrast rules and intentional contextual duality. Rather than relying on stark clinical whites, the foundation rests on a warm neutral canvas (`#FAFAF8`), providing an organic tactile quality reminiscent of archival paper and unbleached cotton. Pure white (`#FFFFFF`) is reserved exclusively for elevated surfaces, containment cards, and active input fields.

### Application Guidelines
- **Primary CTA & Brand Accent (`#111111`):** Applied uniformly to primary action triggers, solid state selections, and active administrative tab indicators. Paired strictly with `#FFFFFF` text to achieve WCAG AAA compliance.
- **Structural Lines (`#E7E7E4`):** Used consistently for 1px hairline rules, table separators, input field resting states, and card borders. Avoid multi-tone outlines.
- **Subtle Surface (`#F2F2EF`):** Serves as secondary contrast fills for table headers, inactive chip fills, thumbnail rails, and skeleton placeholders.
- **Semantic Triple:** 
  - `success` (`#238636`): Inventory stock confirmations, checkout completions, and positive KPI trend indicators.
  - `warning` (`#B7791F`): Low stock alerts (<= 5 units), backorder warnings, and pending operational approvals.
  - `error-sale` (`#C53030`): Functions dual-purpose as both the destructive error state and the editorial promotional/sale callout, preserving palette discipline without introducing unnecessary saturated hues.

## Typography

The typographic engine utilizes **Inter** across all typographic levels to enforce neutral, mechanical legibility and strict visual cadence.

### Dual-Density Typographic Hierarchy
1. **Storefront Scale:** Headings embrace negative letter-spacing and substantial vertical scale jumps (`display` down to `headline-md`) to articulate an authoritative editorial tone. Product descriptions and promotional copy leverage `body-lg` to create a relaxed, magazine-style reading rhythm.
2. **Admin Console Scale:** Data grids, forms, and operations rely exclusively on `headline-sm`, `body-sm`, `label-sm`, and `caption`. Typography must remain compact, utilizing tabular numerical figures (`font-variant-numeric: tabular-nums`) for currency formatting (`₹`), stock levels, SKUs, and KPI deltas to preserve vertical alignment in high-density tables.

## Layout & Spacing

The layout philosophy follows a disciplined **8px base grid** with a strict `4px` half-step (`space-xs`) reserved exclusively for micro-alignments, tag internal padding, and badge borders.

### Grid Implementations
- **Storefront (12-Column Responsive Grid):**
  - **Desktop (>= 1280px):** 1440px maximum container constraint, 48px canvas margin (`margin`), 24px column gutter (`gutter`). Product collections layout in 4 distinct columns.
  - **Tablet (768px - 1279px):** 24px canvas margins, 16px column gutter (`gutter-sm`). Collections reflow into 3 columns.
  - **Mobile (< 768px):** 16px canvas margins (`margin-sm`), 12px gutters. Product listings compress to a thumb-optimized 2-column grid.
- **Admin Console (Fixed Rail + Fluid Data Canvas):**
  - **Desktop:** 240px fixed left sidebar, fluid workspace bounded at 1600px width with uniform 24px internal padding (`space-lg`).
  - **Mobile/Tablet:** The navigation rail collapses into a slide-over drawer; data tables reflow into discrete, bordered card blocks.

## Elevation & Depth

This design system rejects deep drop shadows and multi-layered skeuomorphic illusions in favor of **Tonal Layers and Crisp Outlines**. Depth is established strictly through plane stratification and structural boundary lines.

### Elevation Levels
1. **Level 0 (Base Canvas):** Off-white `#FAFAF8` background. Completely flat without shadow.
2. **Level 1 (Card & Module Surfaces):** Solid `#FFFFFF` fill bounded by a crisp `1px solid #E7E7E4` outline. Zero ambient shadow during default rest states.
3. **Level 2 (Hover Surfaces & Quickviews):** Applied to hovering product cards or dropdown popovers. Uses a minimal ambient border shadow: `0 4px 12px rgba(10, 10, 10, 0.04)`, retaining the `1px solid #E7E7E4` structural boundary.
4. **Level 3 (Overlays, Slide-Over Drawers, Modals):** Backdrops utilize a neutral translucent veil (`rgba(10, 10, 10, 0.4)`) paired with a backdrop filter blur of `4px`. Drawer boundaries maintain a single `1px solid #E7E7E4` separator line.

## Shapes

The design system employs a pill-shaped (**`3`**) shape language, introducing smooth, highly rounded perimeters that soften the stark geometric structure and high-contrast palette.

### Perimeter Radius Standard
- **Inputs, Buttons, Badges, Table Rows:** Default to pill-shaped radius tokens (`1rem` and higher), creating friendly, tactile touchpoints.
- **Cards & Modals (`rounded-lg`):** Fixed at `2rem`. 
- **Editorial Imagery & Full-Bleed Modules:** Stand at `0px` (sharp) corner radii to align seamlessly with structural grid gutters.

## Components

### Buttons
- **Primary:** Solid `#111111` fill, `#FFFFFF` text, fully rounded pill radius, `0 1rem` horizontal padding (storefront: 48px height; admin: 36px height). Hover triggers `#0A0A0A` with subtle opacity transition.
- **Secondary:** Transparent fill, `1px solid #E7E7E4` outline, `#0A0A0A` text, fully rounded pill radius. Hover shifts background to `#F2F2EF`.
- **Tertiary / Ghost:** No border or fill, `#0A0A0A` text, underlined strictly on hover.
- **Destructive:** Solid `#C53030` with `#FFFFFF` text, fully rounded, reserved for critical deletion workflows.

### Chips & Status Badges
- Built using `label-sm` or `caption` typography. Internal padding: `2px 8px`. Fully rounded pill radius.
- **In Stock:** `#F2F2EF` background with `#238636` text and an optional 6px circular green dot indicator.
- **Low Stock:** `#F2F2EF` background with `#B7791F` text.
- **Sale / Out of Stock:** `#F2F2EF` background with `#C53030` text.

### Form Inputs & Selects
- Height: 44px (storefront) / 34px (admin).
- Surface: `#FFFFFF` fill with `1px solid #E7E7E4` resting border, fully rounded pill shape. 
- Focus state: `1px solid #111111` outline with zero ring glow. Label sits 4px (`space-xs`) above the field using `label-sm` in `#0A0A0A`.

### Tables (Admin Console)
- Header row: `#F2F2EF` background, 36px height, uppercase `caption` text styled in `#666666`.
- Data rows: `#FFFFFF` background, 44px compact row height, bottom border `1px solid #E7E7E4`. Numerical values display in monospaced/tabular Inter. Hover shifts row fill to `#FAFAF8`.

### Product Display Cards (Storefront)
- Surface: `#FFFFFF` fill or seamless borderless frame over `#FAFAF8`, styled with rounded-lg geometry.
- Image aspect ratio: 3:4 portrait crop. 
- Content stack: Primary product title (`label-md`), category subtitle (`body-sm` in `#666666`), and price lockup (`label-md` bold) with sale price emphasized in `#C53030`.