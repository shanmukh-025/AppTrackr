# 🎨 Companies Section - Visual Design Guide

## Color Palette

### Primary Colors
```
Indigo:  #6366f1 (rgb(99, 102, 241))
Purple:  #8b5cf6 (rgb(139, 92, 246))
```

### Background Colors
```
Slate 50:  #f8fafc
Slate 100: #f1f5f9
Slate 200: #e2e8f0
White:     #ffffff
```

### Text Colors
```
Primary:   #1e293b (dark slate)
Secondary: #64748b (medium slate)
Tertiary:  #94a3b8 (light slate)
```

### Status Colors
```
Success (Hiring):  #16a34a (green)
Danger (Not Hiring): #dc2626 (red)
Warning (Offers):  #d97706 (amber)
Info (Applications): #6366f1 (indigo)
Rating: #f59e0b (yellow)
```

---

## Typography System

### Font Sizes
```css
Mega:    2.5rem (40px) - Main page title
Large:   2rem   (32px) - Modal titles
XL:      1.75rem (28px) - Company names
H2:      1.5rem  (24px) - Section headers
H3:      1.25rem (20px) - Card headers
H4:      1.125rem (18px) - Subheaders
Body:    1rem    (16px) - Standard text
Small:   0.875rem (14px) - Meta info
Tiny:    0.75rem  (12px) - Labels
```

### Font Weights
```css
Regular:  400 - Not used
Medium:   500 - Body text
Semibold: 600 - Emphasis
Bold:     700 - Headings
```

---

## Component Anatomy

### Company Card Structure
```
┌─────────────────────────────────────┐
│ ┌────┐               [Status Badge] │ ← Header
│ │LOGO│                              │
│ └────┘                              │
├─────────────────────────────────────┤
│ Company Name (1.75rem, bold)       │ ← Title
│ Industry • Size (1rem, medium)     │ ← Subtitle
├─────────────────────────────────────┤
│ 📍 Location    👥 Employees        │ ← Meta
├─────────────────────────────────────┤
│ ⭐ 4.5 (15,234 reviews)            │ ← Rating
├─────────────────────────────────────┤
│ SALARY RANGE  │  OPEN POSITIONS    │ ← Highlights
│ $150k - $200k │  3 roles           │
├─────────────────────────────────────┤
│ [Role Tag] [Role Tag] [+1 more]    │ ← Tags
├─────────────────────────────────────┤
│ [View Details →]                   │ ← CTA
└─────────────────────────────────────┘
```

### Tab Layout
```
┌────────────────────────────────────────────┐
│ 🏢 Companies                        [8] [5]│ ← Header
│ Track and manage your applications         │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │[Featured] [Applications] [Interviews]│   │ ← Tabs
│ │                [Insights]            │   │
│ └──────────────────────────────────────┘   │
├────────────────────────────────────────────┤
│ [🔍 Search... ] [Industry ▾] [Status ▾]   │ ← Filters
├────────────────────────────────────────────┤
│ Top Companies (8)                          │ ← Section
│ Explore companies and their open positions │
├────────────────────────────────────────────┤
│ [Card] [Card] [Card]                       │
│ [Card] [Card] [Card]                       │ ← Grid
│ [Card] [Card]                              │
└────────────────────────────────────────────┘
```

### Modal Structure
```
┌──────────────────────────────────────┐
│                               [✕]    │ ← Close
│ ┌────┐                              │
│ │LOGO│ Company Name      [Status]   │ ← Header
│ └────┘ Location, Rating             │
├──────────────────────────────────────┤
│ ┌────────────────┬─────────────────┐│
│ │ 📋 Open        │ 💼 Benefits &   ││
│ │ Positions      │ Perks           ││ ← Grid
│ │ • Role 1       │ ✓ Health        ││
│ │ • Role 2       │ ✓ Stock         ││
│ └────────────────┴─────────────────┘│
│ ┌────────────────┬─────────────────┐│
│ │ 🏢 Company     │ 📊 Your         ││
│ │ Info           │ Activity        ││
│ │ Founded: 1998  │ [12] Apps       ││
│ │ Size: Large    │ [3] Interviews  ││
│ └────────────────┴─────────────────┘│
├──────────────────────────────────────┤
│ [Apply Now] [Save Company]           │ ← Actions
└──────────────────────────────────────┘
```

---

## Spacing System

### Padding Scale
```
Extra Small: 0.5rem  (8px)  - Badges, tags
Small:       1rem    (16px) - Buttons
Medium:      1.5rem  (24px) - Cards
Large:       2rem    (32px) - Sections
XLarge:      3rem    (48px) - Page content
```

### Margin Scale
```
Tight:    0.5rem  (8px)  - Element spacing
Normal:   1rem    (16px) - Standard gaps
Relaxed:  1.5rem  (24px) - Section margins
Spacious: 2rem    (32px) - Major sections
```

### Gap Scale (Grid/Flex)
```
Compact:  0.5rem  (8px)  - Tags, inline
Standard: 1rem    (16px) - Cards in grid
Wide:     1.5rem  (24px) - Large cards
Maximum:  2rem    (32px) - Major grids
```

---

## Border Radius Guide

### Element Types
```css
Small Elements:   8px  - Badges, small buttons
Medium Elements:  12px - Buttons, inputs
Standard Cards:   16px - Most cards
Large Cards:      20px - Featured cards
Containers:       24px - Modals, sections
Circular:         50%  - Avatars, icons
```

### Usage Examples
```
Status Badge:     12px
Company Logo:     20px
Company Card:     24px
Modal:            24px
Search Input:     16px
Filter Dropdown:  16px
Button:           14px
Stat Card:        20px
```

---

## Shadow Elevation System

### Level 1: Resting
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
Use: Input fields, subtle cards
```

### Level 2: Raised
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
Use: Cards, tabs container
```

### Level 3: Elevated
```css
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
Use: Hover states, emphasized cards
```

### Level 4: Floating
```css
box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
Use: Card hover with color tint
```

### Level 5: Modal
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
Use: Modals, overlays
```

---

## Animation Timing

### Duration
```css
Instant:  0.15s - Micro-interactions
Fast:     0.3s  - Buttons, hovers
Standard: 0.4s  - Cards, modals
Slow:     0.6s  - Page transitions
```

### Easing Functions
```css
Standard: cubic-bezier(0.4, 0, 0.2, 1)
  - Most interactions

Smooth In-Out: ease-in-out
  - Keyframe animations

Linear: linear
  - Loading, progress bars
```

### Transform Properties
```css
Scale: transform: scale(1.02);
  - Button hover

Lift: transform: translateY(-12px);
  - Card hover

Slide: transform: translateX(8px);
  - List items

Rotate: transform: rotate(90deg);
  - Close button
```

---

## Icon System

### Emoji Icons Used
```
🏢 - Companies (header)
🔍 - Search
📋 - Applications
🎤 - Interviews
📊 - Insights
⭐ - Featured/Rating
✅ - Success/Offers
📍 - Location
👥 - Employees
💼 - Benefits
🟢 - Active hiring
🔴 - Not hiring
📅 - Calendar/Date
⏰ - Time
🎥 - Video interview
💡 - Tips/Insights
📈 - Growth/Trends
→ - Arrow (CTA)
```

### Icon Sizes
```
Tiny:    1rem    (16px) - Meta icons
Small:   1.125rem (18px) - Industry icons
Medium:  1.25rem  (20px) - Search icon
Large:   1.5rem   (24px) - Card logos
XLarge:  2rem     (32px) - Stat icons
Huge:    2.5rem   (40px) - Modal logos
```

---

## Responsive Grid

### Company Cards Grid
```css
/* Desktop (1400px+) */
grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
gap: 2rem;

/* Tablet (1024px-1400px) */
grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
gap: 1.5rem;

/* Mobile (768px-1024px) */
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
gap: 1.5rem;

/* Small Mobile (<768px) */
grid-template-columns: 1fr;
gap: 1rem;
```

### Stats Grid
```css
/* Desktop */
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

/* Mobile */
grid-template-columns: 1fr;
```

---

## Interactive States

### Button States
```css
Default:
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;

Hover:
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);

Active:
  transform: scale(0.98);

Disabled:
  opacity: 0.5;
  cursor: not-allowed;
```

### Card States
```css
Default:
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);

Hover:
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  
  &::before {
    transform: scaleX(1); /* Top border gradient */
  }
```

### Input States
```css
Default:
  border: 2px solid transparent;

Focus:
  border-color: #6366f1;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
```

---

## Layout Measurements

### Container
```css
Max Width: None (full width)
Padding: 2rem 3rem
Margin Left: 280px (sidebar width)
```

### Header
```css
Margin Bottom: 2rem
Title Size: 2.5rem
Subtitle Size: 1.1rem
```

### Tabs
```css
Padding: 0.75rem (container)
Gap: 0.75rem (between tabs)
Tab Padding: 1rem 1.5rem
Border Radius: 20px (container)
Border Radius: 14px (individual tab)
```

### Company Card
```css
Padding: 2rem
Border Radius: 24px
Min Width: 380px
Logo Size: 80x80px
```

### Modal
```css
Max Width: 900px
Max Height: 90vh
Border Radius: 24px
Padding: 2rem
```

---

## Gradient Recipes

### Primary Gradient (Indigo to Purple)
```css
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
/* Use for: buttons, badges, highlights */
```

### Background Gradient (Slate)
```css
background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
/* Use for: page background */
```

### Text Gradient
```css
background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
/* Use for: headings */
```

### Radial Decoration
```css
background: radial-gradient(circle at 20% 50%, 
  rgba(99, 102, 241, 0.08) 0%, transparent 50%);
/* Use for: subtle background accents */
```

### Top Border Gradient
```css
background: linear-gradient(90deg, #6366f1, #8b5cf6);
/* Use for: card top borders */
```

---

## Status Indicators

### Hiring Status Badge
```css
[data-status="hiring"]:
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  content: "🟢 Hiring"

[data-status="not-hiring"]:
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  content: "🔴 Not Hiring"
```

### Timeline Badges
```css
.timeline-badge.applied:
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;

.timeline-badge.interview:
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;

.timeline-badge.offer:
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
```

---

## Best Practices Applied

### Performance
✓ CSS transforms (GPU accelerated)
✓ Will-change property for animations
✓ Efficient grid layouts
✓ Minimal reflows

### Accessibility
✓ Proper color contrast ratios
✓ Focus states on all interactive elements
✓ Semantic HTML structure
✓ ARIA labels where needed

### Maintainability
✓ CSS custom properties for colors
✓ Consistent naming conventions
✓ Modular component structure
✓ Clear spacing system

### User Experience
✓ Smooth transitions
✓ Clear visual hierarchy
✓ Helpful empty states
✓ Loading state fallbacks

---

## Quick Reference

### Most Used Values
```
Primary Color: #6366f1
Border Radius: 16px
Box Shadow: 0 4px 16px rgba(0,0,0,0.04)
Transition: 0.3s ease
Font Weight: 600
Gap: 1rem
Padding: 1.5rem
Hover Lift: translateY(-4px)
```

### Common Patterns
```css
/* Card Base */
background: white;
border-radius: 20px;
padding: 2rem;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);

/* Button Base */
padding: 1rem 1.5rem;
border-radius: 14px;
font-weight: 600;
transition: all 0.3s ease;

/* Input Base */
padding: 1rem 1.5rem;
border-radius: 16px;
border: 2px solid transparent;
transition: all 0.3s ease;
```

---

*This guide provides the complete visual design system for the Companies section* 🎨
