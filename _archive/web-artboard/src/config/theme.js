// Utility
export function withAlpha(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

// Design tokens
export const radius = { sm: 8, md: 12, lg: 14, pill: 9999 };
export const MAX_WIDTH = 420;
export const FONT_FAMILY = 'Inter, system-ui, sans-serif';

export const THEMES = {
  dark: {
    mode: 'dark',
    bg: "#212121",
    surface1: "#282828",
    surface2: "#303030",
    surface3: "#353535",
    textPrimary: "#eeeeee",
    textSecondary: "#d0d0d0",
    textMuted: "#9a9a9a",
    border: "#3c3c3c",
    borderSubtle: "#303030",
    accent: "#4a8d5f",
    accentHover: "#55a06c",
    accentFaint: "rgba(74,141,95,0.08)",
    accentMuted: "rgba(74,141,95,0.16)",
    accentGlass: "rgba(74,141,95,0.12)",
    danger: "#e05555",
    info: '#6b9fd4',
    warning: '#c99a4a',
    glassBackground: "rgba(40,40,40,0.72)",
    glassBorder: "rgba(255,255,255,0.06)",
    scrim: 'rgba(0,0,0,0.5)',
    hoverOverlay: 'rgba(255,255,255,0.06)',
    pressOverlay: 'rgba(255,255,255,0.10)',
  },
  light: {
    mode: 'light',
    bg: "#f5f5f5",
    surface1: "#ffffff",
    surface2: "#ededed",
    surface3: "#e0e0e0",
    textPrimary: "#1a1a1a",
    textSecondary: "#3a3a3a",
    textMuted: "#606060",
    border: "#dcdcdc",
    borderSubtle: "#e8e8e8",
    accent: "#4a8d5f",
    accentHover: "#55a06c",
    accentFaint: "rgba(74,141,95,0.08)",
    accentMuted: "rgba(74,141,95,0.16)",
    accentGlass: "rgba(74,141,95,0.12)",
    danger: "#d44444",
    info: '#6b9fd4',
    warning: '#c99a4a',
    glassBackground: "rgba(255,255,255,0.72)",
    glassBorder: "rgba(0,0,0,0.06)",
    scrim: 'rgba(0,0,0,0.4)',
    hoverOverlay: 'rgba(0,0,0,0.04)',
    pressOverlay: 'rgba(0,0,0,0.08)',
  },
};

export const HABIT_COLORS = [
  { id: "sage", label: "Sage", primary: "#7a9e7e" },
  { id: "teal", label: "Teal", primary: "#5b9ea6" },
  { id: "sky", label: "Sky", primary: "#6b9fd4" },
  { id: "lavender", label: "Lavender", primary: "#9585c1" },
  { id: "coral", label: "Coral", primary: "#d47b6b" },
  { id: "amber", label: "Amber", primary: "#c99a4a" },
  { id: "rose", label: "Rose", primary: "#c46b8a" },
  { id: "slate", label: "Slate", primary: "#7a8a9e" },
  { id: "cedar", label: "Cedar", primary: "#9a7b6b" },
  { id: "ruby", label: "Ruby", primary: "#b86060" },
];

export const getHabitColor = (id) =>
  HABIT_COLORS.find((c) => c.id === id) ?? HABIT_COLORS[0];