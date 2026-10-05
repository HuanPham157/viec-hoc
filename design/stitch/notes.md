---
name: Academic Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Be Vietnam Pro
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies calm academic focus, systematic clarity, and low cognitive friction. Designed specifically for personal study task management, it prioritizes task completion, mental clarity, and unambiguous progress tracking without distracting dashboards, complex analytics, or transactional noise.

### Brand Personality & Core Principles
- **Focused & Uncluttered:** Surfaces emphasize white space, clean borders, and immediate task hierarchy.
- **Supportive & Affirming:** Completion cues deliver positive reinforcement through clean emerald accents and subtle micro-interactions.
- **Academic Reliability:** Indigo and structural blue establish credibility, order, and structured routine.

### Design Movement
- **Clean Modern Minimalism with Tactile Micro-Affordances:** Pure white and soft neutral containers provide high-contrast text rendering, complemented by soft, diffused elevation and rounded structural cards.

## Colors

The palette employs an intentional semantic division: academic indigo drives structure and primary actions, while functional semantic tokens communicate state without ambiguity.

### Color Tokens & Semantics
- **Primary (`#2563eb` / `#1d4ed8` hover):** Academic Royal Blue. Used for active tabs, primary action buttons, key indicators, and focal interactive states.
- **Secondary / Success (`#10b981` / Light Tint `#ecfdf5`):** Emerald Green. Used exclusively for completed study tasks, verified checkboxes, and positive milestone badges.
- **Tertiary / Pending Warning (`#f59e0b` / Light Tint `#fffbeb`):** Amber Orange. Used for pending tasks, approaching deadlines, and urgent review notices.
- **Destructive (`#ef4444` / Light Tint `#fef2f2`):** Soft Crimson. Reserved for task deletion, dismissal, and cancel actions.
- **Neutrals & Surfaces:**
  - Base canvas: `#f8fafc` (Slate 50)
  - Card & Container surface: `#ffffff` (Pure White)
  - Card stroke / Border: `#e2e8f0` (Slate 200)
  - Typography primary: `#0f172a` (Slate 900)
  - Typography muted / subtext: `#64748b` (Slate 500)

## Typography

The typography system relies entirely on **Be Vietnam Pro**, optimized natively for Vietnamese diacritics, character balance, and high-density legibility.

### Rules & Hierarchy
- **Clarity over Decorative:** Titles use tight negative tracking (`-0.01em` to `-0.02em`) to maintain sharp headlines.
- **Task Titles:** Use `headline-md` or `body-lg` (weight 500/600) to keep task names distinct from supplementary meta-information (dates, subject tags).
- **Completed State:** Completed task labels transition from `#0f172a` to `#94a3b8` with a strikethrough decoration.

## Layout & Spacing

The layout is built around a single-column, centered productivity workspace designed to eliminate side distractions.

### Layout Principles
- **Centered Focus Container:** The main workspace conforms to a max-width of `840px` on desktop, centered with automatic margins, keeping the eye focused on the task stream.
- **Responsive Adaptations:**
  - **Mobile (<640px):** Single-column stack with `margin: 1rem` and compact item gap `space-sm` (0.5rem). Task inputs stick to the bottom or top of the viewport.
  - **Tablet (640px - 1024px):** Single-column with `margin-tablet: 1.5rem`, introducing horizontal sub-item layouts (deadline badge, tag, action buttons in one line).
  - **Desktop (>1024px):** Fixed-width centered stream (`840px`), `gutter-desktop: 1.5rem`, providing comfortable lateral breathing room.

## Elevation & Depth

Visual hierarchy uses flat surfaces bounded by clean outlines and low-opacity, wide-diffusion shadows to create a featherlight, layered appearance.

### Depth Levels
- **Canvas Base:** `#f8fafc` (flat, no shadow).
- **Surface Level 1 (Task Cards, Filters):** Background `#ffffff`, border `1px solid #e2e8f0`, shadow `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Surface Level 2 (Hover & Active Cards):** Background `#ffffff`, border `1px solid #cbd5e1`, shadow `0 8px 20px -4px rgba(37, 99, 235, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)`.
- **Surface Level 3 (Modals, Overlays, Floating New Task Button):** Background `#ffffff`, border `1px solid #e2e8f0`, shadow `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The interface embraces a gentle, rounded aesthetic (`roundedness: 2`), delivering approachable cards and inputs without appearing overly toy-like.

### Token Mapping
- Base elements (Checkboxes, small tags): `rounded` (`0.5rem` / `8px`)
- Standard inputs and cards: `rounded-lg` (`1rem` / `16px`)
- High-level containers and section groups: `rounded-xl` (`1.5rem` / `24px`)
- Pill elements (Status chips, count badges): Fully rounded `rounded-full` (`9999px`)

## Components

### 1. Task Card (`TaskItem`)
- **Structure:** Left-aligned custom checkbox, central content (task title, subject chip, deadline indicator), and right-aligned action group (edit, delete).
- **Surface:** White background (`#ffffff`), `1px solid #e2e8f0`, border radius `1rem` (`rounded-lg`), padding `space-md` (`1rem`).
- **Completed State:** Background shifts to `#f8fafc`, title renders with strikethrough in `#94a3b8`, left border reveals a `3px` solid `#10b981` accent.

### 2. Checkbox
- **Size:** `22px x 22px`, `rounded-md` (6px).
- **Default:** Border `2px solid #cbd5e1`, transparent background.
- **Checked (Complete):** Background `#10b981`, border `#10b981`, crisp white SVG checkmark with subtle bounce animation.

### 3. Buttons
- **Primary ("Thêm việc mới" / "Lưu"):** Background `#2563eb`, hover `#1d4ed8`, text white, `rounded-lg`, height `44px`, font `label-lg`.
- **Destructive ("Xoá"):** Background `transparent`, text `#ef4444`, hover background `#fef2f2`, active `#fee2e2`, `rounded-lg`, padding `space-xs space-sm`.
- **Filter / Ghost Button:** Background transparent, text `#64748b`, hover background `#f1f5f9`, hover text `#0f172a`.

### 4. Status Chips & Badges
- **Completed Chip:** Background `#ecfdf5`, text `#065f46`, border `1px solid #a7f3d0`, pill-shaped.
- **Pending / Incomplete Chip:** Background `#fffbeb`, text `#92400e`, border `1px solid #fde68a`, pill-shaped.
- **Subject Tag:** Background `#eff6ff`, text `#1e40af`, border `1px solid #dbeafe`, `label-sm`.

### 5. Input Fields
- **Container:** Height `48px`, background `#ffffff`, border `1px solid #cbd5e1`, `rounded-lg`, horizontal padding `1rem`.
- **Focus State:** Border color `#2563eb`, outer focus ring `3px solid rgba(37, 99, 235, 0.15)`, smooth transition `150ms ease-in-out`.
- **Placeholder:** `#94a3b8` in `body-md`.

### 6. Study Group / Subject Filter Bar
- Horizontal scrollable or flex row with pill segments (`rounded-full`).
- Active segment: `#2563eb` fill with white text.
- Inactive segment: `#f1f5f9` fill with `#64748b` text, hover `#e2e8f0`.