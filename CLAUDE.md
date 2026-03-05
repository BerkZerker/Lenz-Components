# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Web artboard (root)
- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build
- `npm run preview` — Preview production build locally

### React Native app (`LenzNative/`)
- `npx expo start --clear` — Start Expo dev server (clear Metro cache)
- `npx expo run:android` — Build and run Android dev build
- `npx expo run:ios` — Build and run iOS dev build

No test runner, linter, or formatter is configured in either project.

## What This Is

A component library / artboard for **Lenz**, a habit-tracking app. The repo contains two projects:

1. **Root (`/`)** — A standalone Vite + React 19 web project that renders every UI component on a single scrollable showcase page (`App.jsx`).
2. **`LenzNative/`** — An Expo SDK 55 + React Native app that mirrors the same component showcase natively. Uses `react-native-gifted-charts` for line charts.

## Architecture

**Theme system** — All components receive a `theme` object prop from `src/config/theme.js` (same structure in both projects). There are two themes (`dark` / `light`) with identical token keys (bg, surface1-3, textPrimary/Secondary/Muted, accent, glassBorder, glassBackground, etc.). Never hardcode colors; always reference theme tokens.

**Habit colors** — Individual habits use a separate palette (`HABIT_COLORS` in `config/theme.js`) identified by `colorId` strings (sage, teal, sky, lavender, coral, amber, rose, slate). Use `getHabitColor(id)` to resolve.

**Styling approach** — Inline styles only. No CSS files, no CSS-in-JS library, no Tailwind. Components use the `style` prop with theme token values. Font is Inter (loaded via Google Fonts in web, `@expo-google-fonts/inter` in native).

**Component hierarchy (shared across both projects):**
- `foundation/` — Low-level visual primitives (GlassCard, NoiseBackground, SectionLabel)
- `core/` — Reusable interactive elements (Toggle, Checkmark, ProgressBar, FAB, AddHabitButton)
- `habits/` — Habit-specific UI (HabitCard, WeeklyGrid, HabitDetailModal)
- `charts/` — Data viz (web: Recharts + custom SVG; native: react-native-gifted-charts + react-native-svg)
- `insights/` — AI/correlation features (CorrelationCard, InsightCard, AIBannerPill, SensitivitySlider)
- `voice/` — Voice note UI (VoiceNoteCard)
- `navigation/` — App navigation (BottomTabBar)
- `design-system/` — Showcases for tokens/palettes (PaletteSwatches, ToggleShowcase, ColorTokens)

**Data** — `src/data/mockData.js` provides all mock data (habits, bar chart data, correlations, trend generator). Components consume this data; nothing is fetched from an API.

**Key patterns:**
- Every component takes `theme` as its first prop
- The artboard is fixed at 420px max-width to simulate a mobile viewport
- Glass/frosted aesthetic: `GlassCard` wraps sections with blur (web: `backdrop-filter: blur(20px)`; native: `expo-blur` BlurView)
- Noise texture: `NoiseBackground` uses a deterministic hash function (`config/noise.js`) to generate an SVG tile pattern
- `App.jsx` / `App.js` has section filtering (pills at top) controlled by `activeSection` state — the `show()` helper determines visibility

## Android Blur (expo-blur SDK 55)

On Android, `BlurView` requires the `BlurTargetView` pattern to produce real blur:
1. Wrap background content in `<BlurTargetView ref={ref}>`
2. Pass `blurTarget={ref}` and `blurMethod="dimezisBlurView"` to `<BlurView>`
3. Without this, Android renders only a semi-transparent view (no blur)

`GlassCard.jsx` exports `BlurTargetContext` — a React Context that provides the blur target ref. `App.js` wraps the content area in `<BlurTargetView>` + `<BlurTargetContext.Provider>` so all GlassCards and BottomTabBar can consume the ref automatically.

**Key dependencies (web):** React 19, Recharts, Radix UI (Switch, Slider), Vaul (drawer/modal)

**Key dependencies (native):** React 19.2, React Native 0.83, Expo SDK 55, expo-blur, react-native-gifted-charts, react-native-reanimated, react-native-svg
