# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build
- `npm run preview` — Preview production build locally

No test runner, linter, or formatter is configured.

## What This Is

A component library / artboard for **Lenz**, a habit-tracking app. The repo is a standalone Vite + React 19 project that renders every UI component on a single scrollable showcase page (`App.jsx`). The purpose is to iterate on visual components in isolation before integrating them into the real app. Web-only for now; mobile comes later.

## Architecture

**Theme system** — All components receive a `theme` object prop from `src/config/theme.js`. There are two themes (`dark` / `light`) with identical token keys (bg, surface1-3, textPrimary/Secondary/Muted, accent, glassBorder, etc.). Never hardcode colors; always reference theme tokens.

**Habit colors** — Individual habits use a separate palette (`HABIT_COLORS` in `config/theme.js`) identified by `colorId` strings (sage, teal, sky, lavender, coral, amber, rose, slate). Use `getHabitColor(id)` to resolve.

**Styling approach** — Inline styles only. No CSS files, no CSS-in-JS library, no Tailwind. Components use the `style` prop with theme token values. Font is Inter (loaded via Google Fonts in `index.html`).

**Component hierarchy:**
- `foundation/` — Low-level visual primitives (GlassCard, NoiseBackground, SectionLabel)
- `core/` — Reusable interactive elements (Toggle, Checkmark, ProgressBar, FAB, AddHabitButton)
- `habits/` — Habit-specific UI (HabitCard, WeeklyGrid, HabitDetailModal)
- `charts/` — Data viz using Recharts + custom SVG (HabitBarChart, CompletionTrendChart, StreakLeaderboard, RadialProgress, MiniSparkline)
- `insights/` — AI/correlation features (CorrelationCard, InsightCard, AIBannerPill, SensitivitySlider)
- `voice/` — Voice note UI (VoiceNoteCard)
- `navigation/` — App navigation (BottomTabBar)
- `design-system/` — Showcases for tokens/palettes (PaletteSwatches, ToggleShowcase, ColorTokens)

**Data** — `src/data/mockData.js` provides all mock data (habits, bar chart data, correlations, trend generator). Components consume this data; nothing is fetched from an API.

**Key patterns:**
- Every component takes `theme` as its first prop
- The artboard is fixed at 420px max-width to simulate a mobile viewport
- Glass/frosted aesthetic: `GlassCard` wraps sections with `backdrop-filter: blur(20px)`
- Noise texture: `NoiseBackground` uses a deterministic hash function (`config/noise.js`) to generate an SVG tile pattern
- `App.jsx` has section filtering (pills at top) controlled by `activeSection` state — the `show()` helper determines visibility

**Key dependencies:** React 19, Recharts (charts), Radix UI (Switch, Slider), Vaul (drawer/modal)
