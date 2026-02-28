export const THEMES = {
  dark: {
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
    glassBackground: "rgba(40,40,40,0.72)",
    glassBorder: "rgba(255,255,255,0.06)",
  },
  light: {
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
    glassBackground: "rgba(255,255,255,0.72)",
    glassBorder: "rgba(0,0,0,0.06)",
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
];

export const getHabitColor = (id) =>
  HABIT_COLORS.find((c) => c.id === id) ?? HABIT_COLORS[0];