# Lenz-Components Codebase Audit

## 1. Theme & Styling Consistency

### Hardcoded colors (should be tokens)

- **Hover/pressed overlays** — `HabitCard.jsx:13` uses `rgba(128,128,128,...)` ignoring theme. Needs a `theme.hoverOverlay`/`theme.pressedOverlay` token.
- **Modal scrim** — `HabitDetailModal.jsx:47` hardcodes `rgba(0,0,0,0.5)`. Should be a `theme.overlay` token (compare with `theme.glassBackground` which _is_ theme-aware).
- **White on accent** — `HabitDetailModal.jsx:140`, `FAB.jsx:19`, `Checkmark.jsx:9`, `VoiceNoteCard.jsx:121-127` all hardcode `"white"` for icons/text on accent backgrounds. Needs a `theme.onAccent` token.
- **Shadows** — `FAB.jsx:13` and `SensitivitySlider.jsx:51` hardcode `rgba(0,0,0,...)` shadow colors.
- **RadialProgressShowcase** — Lines 11-12 hardcode `#6b9fd4` and `#d47b6b` instead of using `getHabitColor('sky').primary` / `getHabitColor('coral').primary`.
- **CorrelationCard type backgrounds** — Lines 11-14 hardcode rgba values that duplicate existing tokens (e.g., `rgba(74,141,95,0.12)` = `theme.accentGlass`).

### Unused tokens

- `theme.accentGlass` — defined but never referenced (CorrelationCard hardcodes the same value)
- `theme.accentHover` — defined but never used anywhere
- `theme.surface3` — defined in both themes, never referenced

### Font family repeated & inconsistent

`'Inter, system-ui, sans-serif'` is hardcoded in **7 locations** across 5 files. Worse, `CompletionTrendChart.jsx` uses `'Inter, sans-serif'` (missing `system-ui`) in 3 places. Should be a single `FONT_FAMILY` constant.

### Ad-hoc opacity via string concatenation

10+ instances of `color + '18'`, `color + '30'`, `color + '60'` etc. across HabitDetailModal, WeeklyGrid, CorrelationCard, MiniSparkline, VoiceNoteCard. Needs a `colorWithAlpha()` utility.

### Spacing inconsistencies

- Card padding: most use `20`, but InsightCard uses `14`, CorrelationCard/VoiceNoteCard use `16`
- Card title `marginBottom`: most use `12`, but WeeklyGrid uses `14`, RadialProgressShowcase uses `16`
- Card title `fontWeight`: CompletionTrendChart uses `400`, every other card uses `500`
- Inner `borderRadius` is scattered across `8`, `9`, `10`, `12` with no clear system

### Duplicated glass styling

`InsightCard.jsx` manually replicates all of `GlassCard`'s styles (borderRadius, border, backdropFilter, etc.) instead of composing it.

---

## 2. Component Quality & Architecture

### Bugs

- **`HabitDetailModal` shows same random data for every habit** — `useMemo` at line 32 has `[]` deps, so the 30-day heatmap is generated once and shared. Should depend on `displayHabit?.id`.
- **`WeeklyGrid` never syncs with parent** — Copies `habits` into local state on mount, then ignores prop changes. Toggling cells inside the grid never propagates up.
- **`MiniSparkline` crashes on empty/single-element arrays** — `Math.min(...[])` returns `Infinity`, and `0 / (data.length - 1)` is division by zero.
- **`VoiceNoteCard` dead `intervalRef`** — Created and cleaned up but never assigned a value. The animation actually uses `animRef`/`requestAnimationFrame`.
- **`VoiceNoteCard` animation duration mismatch** — `totalMs = 4000` has no connection to the `duration` prop (e.g., "0:42" = 42 seconds).

### Dead code

- **`FAB.jsx`** — never imported or used anywhere in the codebase
- **`VoiceNoteCard` `intervalRef`** — dead ref, cleanup does nothing

### Accessibility (pervasive)

- `HabitCard` — clickable `<div>` with no `role`, `tabIndex`, or keyboard handler
- Checkmark toggle — no `role="checkbox"`, `aria-checked`, or `aria-label`
- `WeeklyGrid` buttons — no `aria-label` (screen readers see empty buttons)
- `BottomTabBar` — no `<nav>`, no `role="tablist"`, no `aria-current`
- `FAB`, `AddHabitButton` (has no `onClick` prop at all), close buttons, play/pause button — all missing `aria-label`
- `Toggle` and `SensitivitySlider` use `all:'unset'` which strips accessibility styles

### API inconsistencies

- **`NoiseBackground`** takes `mode` (string) while every other component takes `theme` (object)
- **Callback naming** is inconsistent: `onToggle`, `onChange`, `onTabChange`, `onClick`, `onClose`
- **Self-containment** is inconsistent: some components wrap themselves in `GlassCard` internally (WeeklyGrid, HabitBarChart, StreakLeaderboard, VoiceNoteCard, SensitivitySlider) while others expect the parent to wrap them (ProgressBar, HabitCard list)
- **`style` override**: only `GlassCard` accepts a `style` prop for overrides; others don't
- **`AddHabitButton` and `FAB`** accept no `onClick` — they are non-functional

### Theme prop drilling

`theme` is passed to ~20 component instances from `App.jsx`. Classic candidate for `React.createContext` / `ThemeProvider`, which would also simplify every component's signature.

### Magic numbers

- `borderRadius: 14` (cards), `9999` (pills), `12` (modal internals) — no size scale tokens
- `maxWidth: 420` repeated in App.jsx (x2) and HabitDetailModal
- `blur(20px)` hardcoded in 2 places
- Font sizes (`10`, `11`, `12`, `13`, `14`, `16`, `18`, `20`) used raw everywhere

---

## 3. React Native Readiness

### Blockers (library replacements required)

| Dependency               | Status   | RN Replacement                                   |
| ------------------------ | -------- | ------------------------------------------------ |
| `recharts`               | Web-only | `victory-native` or `react-native-gifted-charts` |
| `vaul`                   | Web-only | `@gorhom/bottom-sheet`                           |
| `@radix-ui/react-switch` | Web-only | RN built-in `Switch` or custom `Pressable`       |
| `@radix-ui/react-slider` | Web-only | `@react-native-community/slider`                 |
| `react-dom`              | Web-only | `react-native`                                   |

### DOM API usage

- `HabitDetailModal.jsx:13-25` — Creates/removes `<style>` tags via `document.createElement`, `document.head.appendChild`. Completely incompatible.

### Web-only CSS (by impact)

| Property                                        | Files affected                               | RN equivalent                                                             |
| ----------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| `backdropFilter`                                | 3 (GlassCard, InsightCard, HabitDetailModal) | `expo-blur` / `@react-native-community/blur`                              |
| `transition`                                    | **11 files, 14 declarations**                | `Animated` / `react-native-reanimated`                                    |
| Mouse events (`onMouseEnter/Leave/Down/Up`)     | 6 files                                      | `Pressable` with `onPressIn`/`onPressOut`                                 |
| `border`/`borderBottom` shorthands              | 6 files                                      | Split into `borderWidth` + `borderColor`                                  |
| `cursor: 'pointer'`                             | 11 files                                     | Remove (not applicable)                                                   |
| `transform` string syntax                       | 5 files                                      | Array-of-objects: `[{ scale: 0.92 }]`                                     |
| Text truncation (`whiteSpace`/`textOverflow`)   | 5 files                                      | `<Text numberOfLines={1}>`                                                |
| `inset: 0`                                      | 4 files                                      | `top:0, right:0, bottom:0, left:0`                                        |
| `position: 'sticky'`                            | 1 (App.jsx)                                  | Fixed header above ScrollView                                             |
| `overflowX`/`overflowY`                         | 3                                            | `ScrollView` / `FlatList`                                                 |
| `boxShadow`                                     | 2                                            | `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` + `elevation` |
| `linear-gradient`                               | 1 (SensitivitySlider)                        | `expo-linear-gradient`                                                    |
| `height: '100vh'` / `maxHeight: '85vh'`         | 2                                            | `Dimensions` / `useWindowDimensions`                                      |
| `background` (shorthand)                        | 4 files                                      | `backgroundColor`                                                         |
| `pointerEvents` (as style)                      | 2                                            | Move to View prop: `<View pointerEvents="none">`                          |
| `fontVariantNumeric`                            | 2                                            | Not supported; use monospace font                                         |
| `e.currentTarget.style` imperative manipulation | 2 (WeeklyGrid, VoiceNoteCard)                | Animated values                                                           |
| `all: 'unset'`                                  | 2                                            | Remove (no browser defaults in RN)                                        |

### SVG conversion

**16 of 27 components** use inline SVG elements (`<svg>`, `<circle>`, `<path>`, `<rect>`, `<line>`, `<polyline>`, `<polygon>`, `<defs>`, `<pattern>`). All must become `react-native-svg` equivalents. The `NoiseBackground` pattern system is the most architecturally complex.

### Font loading

Inter is loaded via Google Fonts CDN. In RN, the `.ttf` files (weights 300, 400, 500, 600) must be bundled and loaded via `expo-font` or `react-native-asset`. Font fallback stacks (`'Inter, system-ui, sans-serif'`) are not supported — must be just `'Inter'`.

---

## Recommended Action Plan

### Phase 1 — Polish the design system (do before RN migration)

1. Create a `ThemeProvider` context to eliminate `theme` prop drilling
2. Add missing tokens: `fontFamily`, `onAccent`, `overlay`, `dangerFaint`, `radiusMd`/`radiusSm`/`radiusFull`
3. Delete unused tokens (`accentHover`, `accentGlass`, `surface3`) or start using them
4. Create a `colorWithAlpha(hex, opacity)` utility to replace string concatenation
5. Standardize card padding (16 dense / 20 standard) and title `marginBottom` (12)
6. Make `InsightCard` compose `GlassCard` instead of duplicating it
7. Fix `NoiseBackground` to accept `theme` instead of `mode`

### Phase 2 — Fix bugs and clean up

8. Fix `HabitDetailModal` useMemo deps (add `displayHabit?.id`)
9. Fix `WeeklyGrid` to sync with parent props and propagate changes
10. Guard `MiniSparkline` against empty/single-element arrays
11. Remove dead `FAB` component and `VoiceNoteCard` `intervalRef`
12. Add `onClick` props to `AddHabitButton` and `FAB` (or delete FAB)
13. Fix `VoiceNoteCard` animation duration to derive from `duration` prop

### Phase 3 — Prepare for RN (abstraction layer)

14. Extract all HTML elements into wrapper components (`Box`/`Text`/`Pressable`) that can be swapped for RN equivalents
15. Replace CSS `transition` with an animation helper that can switch to `Animated`/Reanimated
16. Replace `border` shorthands, `inset`, `transform` strings with RN-compatible style objects
17. Replace `backdropFilter` with a `BlurCard` wrapper that can switch implementations
18. Abstract SVG into icon components that can switch between web SVG and `react-native-svg`
19. Replace recharts, vaul, and Radix with cross-platform alternatives (or build abstraction layers)

The good news: the inline-styles-only approach means zero CSS files to untangle, the theme system maps cleanly to RN, the component hierarchy is sound, and mock data needs no changes. The main work is systematic property replacement and swapping 4 web-only libraries.
