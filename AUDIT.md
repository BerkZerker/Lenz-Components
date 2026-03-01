# Lenz Components — Codebase Audit

**Date:** 2026-02-28
**Scope:** Code quality, React Native portability, missing components

---

## 1. Code Quality

**Overall: Strong.** ~2,300 lines across 26 components, clean and readable.

### Bugs / Functional Issues

| Issue                                           | Location                                                  | Fix                                                                                                                                          | Status   |
| ----------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Vaul CSS injection race**                     | `HabitDetailModal.jsx:13-25`, `CorrelationCard.jsx:19-30` | Both inject the same `<style>` tag; Modal's cleanup can remove it while Correlation still needs it. Lift to a single injection in `main.jsx` | **Fixed** |
| **`miniTrend` same for every habit**            | `HabitDetailModal.jsx:32-36`                              | `useMemo([])` runs once — opening different habits shows identical 30-day grids. Add `displayHabit?.id` to deps                              | **Fixed** |
| **WeeklyGrid ignores prop updates**             | `WeeklyGrid.jsx:7-12`                                     | `useState` initializer never re-syncs when parent `habits` changes via toggle                                                                | **Fixed** |
| **Duplicate SVG id**                            | `BottomTabBar.jsx:140`                                    | `id="tabbar-noise"` collides when BottomTabBar renders twice (inline showcase + fixed bar)                                                   | **Fixed** (noise removed entirely) |
| **`uid` prop unused**                           | `CompletionTrendChart.jsx:33`                             | Destructured but never referenced — was likely meant to key the chart on theme switch                                                        | **Fixed** |
| **`MiniSparkline` crashes on empty data**       | `MiniSparkline.jsx`                                       | `Math.min(...[])` returns `Infinity`, and `0 / (data.length - 1)` is division by zero                                                        | **Fixed** |
| **`VoiceNoteCard` animation duration mismatch** | `VoiceNoteCard.jsx`                                       | `totalMs = 4000` has no connection to the `duration` prop (e.g., "0:42" = 42 seconds)                                                        | **Fixed** |

### Hardcoded Colors (violates project rule) — **All Fixed**

- ~~`RadialProgressShowcase.jsx:11-12` — `#6b9fd4` and `#d47b6b`~~ → now uses `getHabitColor('sky').primary` / `getHabitColor('coral').primary`
- ~~`CorrelationCard.jsx:35-36` — `#6b9fd4` and `#c99a4a`~~ → now uses `theme.info` / `theme.warning`
- ~~`CorrelationCard.jsx:11-14` — hardcoded rgba values~~ → now uses `theme.accentGlass` and `withAlpha()`
- ~~`HabitCard.jsx:13` — `rgba(128,128,128,...)` hover overlay~~ → now uses `theme.hoverOverlay` / `theme.pressOverlay`
- ~~`HabitDetailModal.jsx:47` — hardcoded `rgba(0,0,0,0.5)` scrim~~ → now uses `theme.scrim`

### Unused Theme Tokens — **All Fixed**

- ~~`theme.accentGlass`~~ — now referenced in CorrelationCard, AddHabitButton, BottomTabBar
- ~~`theme.accentHover`~~ — now displayed in ColorTokens showcase
- ~~`theme.surface3`~~ — now displayed in ColorTokens showcase

### DRY Violations — **All Fixed**

- ~~**Sparkle icon SVG**~~ → extracted to shared `SparkleIcon` component in `foundation/`
- ~~**Glass card styles**~~ → `InsightCard` and `AddHabitButton` now use `<GlassCard>`
- ~~**`fontFamily` declarations**~~ → all replaced with `FONT_FAMILY` constant from `config/theme.js`
- ~~**Vaul style injection**~~ → removed from both components, single injection in `main.jsx`

### Minor Code Smells — **All Fixed** (except FAB.jsx)

- ~~`Toggle.jsx:11`~~ — `onCheckedChange` now properly passes boolean through
- ~~`VoiceNoteCard.jsx:45`~~ — dead `intervalRef` removed
- ~~`CompletionTrendChart.jsx:36-37`~~ — `sliceData` and `getXLabels` hoisted to module scope
- ~~`color + '18'` hex-alpha pattern~~ — all replaced with `withAlpha()` utility
- `FAB.jsx` — still dead code (not in scope for this cleanup)

### Spacing / Sizing Inconsistencies — **Partially Fixed**

- Card padding: most use `20`, but InsightCard uses `14`, CorrelationCard/VoiceNoteCard use `16` *(intentional — denser cards)*
- Card title `marginBottom`: most use `12`, but WeeklyGrid uses `14`, RadialProgressShowcase uses `16` *(not changed)*
- ~~Card title `fontWeight`: CompletionTrendChart uses `400`~~ → **Fixed** to `500`
- Inner `borderRadius` now uses `radius` tokens (`radius.sm=8`, `radius.md=12`, `radius.lg=14`, `radius.pill=9999`) in HabitDetailModal
- ~~`maxWidth: 420` repeated~~ → **Fixed**, all replaced with `MAX_WIDTH` constant

### API Inconsistencies — **Partially Fixed**

- ~~`NoiseBackground` takes `mode` (string)~~ → **Fixed**, now takes `theme` (object) like all others
- Callback naming inconsistent: `onToggle`, `onChange`, `onTabChange`, `onClick`, `onClose` *(not changed — low impact)*
- Self-containment inconsistent *(not changed — would be a larger refactor)*
- Only `GlassCard` accepts a `style` prop for overrides; others don't *(not changed)*

### Accessibility Issues — **All Fixed**

- ~~Interactive `<div>` elements with no `role`/`tabIndex`/keyboard handler~~ → HabitCard and CorrelationCard now have `role="button"`, `tabIndex={0}`, `onKeyDown`
- ~~Ambiguous `T`/`S` day headers~~ → changed to `Mon`/`Tue`/`Wed`/`Thu`/`Fri`/`Sat`/`Sun`
- ~~Missing `aria-label`s~~ → added to grid cells, FAB, close button, play/pause button
- ~~SVG icons missing `aria-hidden="true"`~~ → added across all decorative SVGs
- ~~`BottomTabBar` missing semantics~~ → wrapped in `<nav>`, added `role="tablist"`, `role="tab"`, `aria-selected`, `aria-current`

---

## 2. React Native Portability

**The theme system, data layer, component hierarchy, and all business logic are fully portable.** The pain is in the rendering layer.

### The Big 5 Issues

| Issue                                 | Impact                                                                                                                 | Solution                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **`backdropFilter` (glass morphism)** | Core to the aesthetic, used everywhere via `GlassCard`                                                                 | `expo-blur` or redesign to flat semi-transparent surfaces            |
| **CSS `transition` animations**       | Every animated component (Toggle, Checkmark, ProgressBar, RadialProgress, HabitCard, etc. — 11 files, 14 declarations) | Replace with `react-native-reanimated` or `Animated` API             |
| **Recharts**                          | `CompletionTrendChart` only                                                                                            | Swap to `victory-native`                                             |
| **Radix UI + Vaul**                   | Toggle, SensitivitySlider, HabitDetailModal, CorrelationCard                                                           | Custom Toggle, `react-native-awesome-slider`, `@gorhom/bottom-sheet` |
| **Canvas API**                        | `VoiceNoteCard` blob animation                                                                                         | `@shopify/react-native-skia` or redesign with animated SVG           |

### Library Replacements Required

| Dependency               | Status   | RN Replacement                                                    |
| ------------------------ | -------- | ----------------------------------------------------------------- |
| `recharts`               | Web-only | `victory-native` or `react-native-gifted-charts`                  |
| `vaul`                   | Web-only | `@gorhom/bottom-sheet`                                            |
| `@radix-ui/react-switch` | Web-only | Custom `Pressable` + `Animated` or RN built-in `Switch`           |
| `@radix-ui/react-slider` | Web-only | `react-native-awesome-slider` or `@react-native-community/slider` |
| `react-dom`              | Web-only | `react-native`                                                    |

### Mechanical Changes (tedious but straightforward)

- `div` → `View`, `span` → `Text`, `button` → `Pressable` (every file)
- All inline SVGs need `react-native-svg` imports with PascalCase tags (~45 instances across 16 files)
- `onClick` → `onPress`, remove all `onMouse*` events and `cursor` styles
- `border` shorthand → `borderWidth` + `borderColor` + `borderStyle`
- `inset: 0` → `top: 0, bottom: 0, left: 0, right: 0` (7 files)
- `lineHeight: 1.45` → explicit pixel values (5 files)
- `textOverflow: 'ellipsis'` → `numberOfLines={1}` prop (4 files)
- `position: 'fixed'`/`'sticky'` → restructure component tree
- `ResizeObserver` → `onLayout` callback
- `boxShadow` → `shadowColor` + `shadowOffset` + `shadowOpacity` + `shadowRadius` (iOS) / `elevation` (Android)
- `height: '100vh'` → `flex: 1` or `Dimensions.get('window').height`
- `margin: '0 auto'` → `alignSelf: 'center'`
- Remove `cursor`, `userSelect`, `touchAction`, `display: 'flex'` (implicit in RN)
- `color-mix()` → JS color interpolation utility
- `linear-gradient` style → `expo-linear-gradient` component
- `pointerEvents` from style → prop on `<View>`
- `fontVariantNumeric: 'tabular-nums'` → remove (no RN equivalent)
- `window.devicePixelRatio` → `PixelRatio.get()`
- `getBoundingClientRect` → `onLayout`
- `overflowX`/`overflowY` → `<ScrollView>` components
- `transform` string syntax → array-of-objects: `[{ scale: 0.92 }]`
- Bundle Inter font via `expo-font` instead of Google Fonts CDN
- Bare text in `<div>` containers must be wrapped in `<Text>` (RN throws on bare strings)
- `flexDirection` defaults to `'column'` in RN (web defaults to `'row'`) — audit all flex containers

### What Ports for Free

- `theme.js` — 100% portable, no changes needed
- `noise.js` — portable (just math)
- `mockData.js` — 100% portable
- Component hierarchy and composition patterns — portable
- All state management logic — portable

### Rough Estimate

~12-20 engineer-days for a skilled RN developer, broken into 4 phases:

1. **Trivial find-replace** (1-2 days) — CSS property renames, removing web-only properties
2. **Library swaps** (3-5 days) — `react-native-svg`, `victory-native`, `@gorhom/bottom-sheet`, `expo-font`
3. **Animation rebuild** (3-5 days) — CSS transitions → `Animated` / `reanimated`
4. **Significant rebuilds** (5-8 days) — Glass blur strategy, canvas port, layout restructuring

---

## 3. Missing Components

### Primitives (high priority)

| Component                 | Why                                                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Button**                | No reusable button. `AddHabitButton` is specialized. Need a general `Button` with variants (primary, secondary, ghost, danger), sizes, loading state |
| **TextInput / TextField** | Habit names, notes, search — styled input with label, placeholder, error state                                                                       |
| **IconButton**            | Small circular buttons (close, edit, delete, share) — currently hardcoded inline in `HabitDetailModal`                                               |
| **Typography**            | Heading/Body/Caption text components with preset sizes. Font sizes are currently scattered as magic numbers                                          |
| **Chip / Tag**            | Section filter pills in `App.jsx` are hardcoded inline — should be a reusable `Chip` component                                                       |
| **Avatar / UserIcon**     | Profile/settings screen will need this                                                                                                               |
| **Divider**               | Horizontal rule — currently done with inline `borderTop` styles                                                                                      |

### Interactive (medium priority)

| Component             | Why                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Modal / Dialog**    | Confirmation dialogs (delete habit, reset streak). Different from the bottom drawer    |
| **Toast / Snackbar**  | Feedback after actions ("Habit completed!", "Streak lost")                             |
| **SegmentedControl**  | The week/month/year toggle in `CompletionTrendChart` is hardcoded — should be reusable |
| **Dropdown / Select** | Category selection, time picker for habit reminders                                    |
| **SearchBar**         | For finding habits when the list grows                                                 |
| **SwipeAction**       | Swipe-to-delete or swipe-to-complete on habit cards                                    |

### Screens / Composition (lower priority for the artboard)

| Component              | Why                                                         |
| ---------------------- | ----------------------------------------------------------- |
| **EmptyState**         | "No habits yet" / "No insights available" placeholder       |
| **Loading / Skeleton** | Skeleton cards while data loads                             |
| **Onboarding**         | First-run screens                                           |
| **Settings rows**      | Toggle rows for notifications, theme selection, data export |
| **DatePicker**         | For setting habit start dates, viewing history by date      |
