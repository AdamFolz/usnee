# USNEE Design System
## Извлечено из Base44 референса

---

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--tg-primary` | `#007aff` | Primary actions, selected states, links |
| `--tg-primary-foreground` | `#ffffff` | Text on primary buttons |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--tg-success` | `#34c759` | Success states, achievements, positive stats |
| `--tg-danger` | `#ff3b30` | Destructive actions, errors, emergency |
| `--tg-warning` | `#ff9500` | Warnings, cautionary elements |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--tg-text` | `#ffffff` | Primary text on dark backgrounds |
| `--tg-text-secondary` | `#8e8e93` | Secondary text, labels, placeholders |
| `--tg-text-tertiary` | `#636366` | Tertiary text, metadata, timestamps |

### Background Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--tg-bg` | `#0f0f0f` | App background |
| `--tg-bg-elevated` | `#1c1c1c` | Cards, elevated surfaces |
| `--tg-bg-secondary` | `#2d2d2d` | Secondary surfaces, hover states |
| `--tg-separator` | `#38383a` | Borders, dividers |

### Accent Colors (USNEE Brand)
| Token | Hex | Usage |
|-------|-----|-------|
| `--usnee-900` | `#0f0c29` | Deep gradient start |
| `--usnee-500` | `#7c3aed` | Brand purple |
| `--usnee-400` | `#a855f7` | Light purple accent |
| `--usnee-300` | `#c084fc` | Soft purple highlights |

---

## Typography

### Font Family
- **Primary**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Platform**: Telegram Mini App uses system fonts, Inter as web fallback

### Type Scale
| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| H1 | 28px | Bold (700) | 32px | -0.2px | Screen titles |
| H2 | 22px | Semibold (600) | 28px | -0.1px | Section headers |
| H3 | 17px | Semibold (600) | 22px | 0px | Card titles, labels |
| Body | 15px | Regular (400) | 20px | 0px | Main content |
| Body Small | 13px | Regular (400) | 18px | 0.1px | Secondary info |
| Caption | 12px | Medium (500) | 16px | 0.2px | Timestamps, badges |
| Button | 16px | Medium (500) | 24px | 0.1px | Button labels |

---

## Component Styles

### Card
```css
.card {
  background-color: #1c1c1c;
  border: 1px solid #2d2d2d;
  border-radius: 1rem; /* 16px */
  padding: 1rem; /* 16px */
}
```

### Button — Primary
```css
.btn-primary {
  background-color: #007aff;
  color: #ffffff;
  font-weight: 500;
  padding: 0.75rem 1.5rem; /* 12px 24px */
  border-radius: 0.75rem; /* 12px */
}
```

### Button — Secondary
```css
.btn-secondary {
  background-color: #1c1c1c;
  color: #ffffff;
  border: 1px solid #2d2d2d;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
}
```

### Button — Danger
```css
.btn-danger {
  background-color: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
}
```

### Input
```css
.input {
  background-color: #0f0f0f;
  border: 1px solid #2d2d2d;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
}
.input:focus {
  border-color: #007aff;
}
```

### Skeleton (Loading)
```css
.skeleton {
  background-color: #2d2d2d;
  border-radius: 0.25rem;
  animation: skeleton 1.5s ease-in-out infinite;
}
```

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro spacing, icon gaps |
| sm | 8px | Tight internal padding |
| md | 12px | Default internal padding |
| lg | 16px | Standard margins, card padding |
| xl | 24px | Section gaps |
| 2xl | 32px | Screen padding |

---

## Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| Standard | 200ms | ease-out | Hover states, color transitions |
| Emphasis | 300ms | spring(300, 35) | Modals, popups |
| Micro | 150ms | ease-in-out | Button presses, toggles |
| Page | 350ms | cubic-bezier(0.2, 0.8, 0.2, 1) | Screen transitions |
| Skeleton | 1.5s | ease-in-out | Loading placeholders |

---

## Iconography

- **Library**: Lucide React
- **Primary size**: 24px
- **Small size**: 20px
- **Navigation size**: 28px
- **Color**: Inherit from parent (primary text color)

---

## Layout Principles

1. **Mobile-first**: Design for 375px–430px width (iPhone)
2. **Safe areas**: Account for iPhone notch and home indicator
3. **Bottom navigation**: Fixed tab bar with 3–5 items
4. **Cards**: Rounded rectangles with subtle borders, no heavy shadows
5. **Full-width elements**: Most UI spans full width with 16px horizontal padding
6. **Dark mode only**: USNEE is exclusively dark-themed

---

## Screen Templates

### Header
- Centered title, 28px Bold
- Optional subtitle below, 13px secondary color
- No back button on root screens

### Content Area
- Padding: 16px horizontal
- Gap between cards: 12px
- Scrollable, with bottom padding for nav bar

### Bottom Navigation
- Fixed at bottom
- 3 tabs: Главная, История, Настройки
- Active: primary color + filled icon
- Inactive: tertiary color + outline icon
