export const INITIAL_HABITS = [
  {
    id: "1",
    name: "Morning Meditation",
    category: "Mindfulness",
    colorId: "sage",
    streak: 14,
    completed: false,
    time: "7:00 AM",
    weekly: [1, 1, 1, 0, 1, 1, 0],
    hasVoiceNote: true,
  },
  {
    id: "2",
    name: "Read 30 Minutes",
    category: "Learning",
    colorId: "sky",
    streak: 7,
    completed: false,
    time: "8:30 PM",
    weekly: [1, 0, 1, 1, 0, 1, 1],
  },
  {
    id: "3",
    name: "Drink 8 Glasses",
    category: "Health",
    colorId: "teal",
    streak: 3,
    completed: true,
    time: "All day",
    weekly: [1, 1, 0, 1, 1, 1, 1],
  },
  {
    id: "4",
    name: "Evening Walk",
    category: "Fitness",
    colorId: "coral",
    streak: 21,
    completed: false,
    time: "6:00 PM",
    weekly: [0, 1, 0, 1, 0, 0, 0],
  },
  {
    id: "5",
    name: "Journal",
    category: "Mindfulness",
    colorId: "lavender",
    streak: 5,
    completed: false,
    time: "9:00 PM",
    weekly: [1, 1, 1, 1, 1, 1, 0],
    hasVoiceNote: true,
  },
];

export const BAR_DATA = [
  { habitId: "1", name: "Morning Meditation", colorId: "sage", rate: 0.87 },
  { habitId: "2", name: "Read 30 Minutes", colorId: "sky", rate: 0.72 },
  { habitId: "3", name: "Drink 8 Glasses", colorId: "teal", rate: 0.94 },
  { habitId: "4", name: "Evening Walk", colorId: "coral", rate: 0.65 },
  { habitId: "5", name: "Journal", colorId: "lavender", rate: 0.58 },
];

export const CORRELATION_DATA = [
  {
    id: "1",
    type: "negative",
    headline: "Gym completion ↓ 40% after meetings past 6pm",
    detail:
      "On days with calendar events after 6pm, your gym habit drops from 78% to 38% completion.",
    sourceIcon: "calendar",
    targetIcon: "gym",
    confidence: 0.82,
    sparkline: [78, 72, 65, 55, 42, 38, 35, 40, 38],
    sourceColor: "#6b9fd4",
    targetColor: "#d47b6b",
  },
  {
    id: "2",
    type: "positive",
    headline: "Meditation + Journal stack → 92% completion",
    detail:
      "When you meditate first, journal completion jumps from 58% to 92%. Consider pairing them.",
    sourceIcon: "meditation",
    targetIcon: "journal",
    confidence: 0.91,
    sparkline: [55, 62, 70, 78, 85, 88, 90, 91, 92],
    sourceColor: "#7a9e7e",
    targetColor: "#9585c1",
  },
  {
    id: "3",
    type: "negative",
    headline: "Sleep under 6hrs → reading streak breaks",
    detail:
      "Your reading habit has a 73% failure rate on days following less than 6 hours of sleep.",
    sourceIcon: "sleep",
    targetIcon: "book",
    confidence: 0.68,
    sparkline: [80, 75, 60, 45, 30, 28, 25, 30, 27],
    sourceColor: "#7a8a9e",
    targetColor: "#6b9fd4",
  },
  {
    id: "4",
    type: "neutral",
    headline: "Weather has no effect on your reading habit",
    detail:
      "Rain or shine, your reading completion stays around 72%. This habit is well-anchored.",
    sourceIcon: "weather",
    targetIcon: "book",
    confidence: 0.88,
    sparkline: [70, 73, 71, 74, 72, 70, 73, 72, 71],
    sourceColor: "#6b9fd4",
    targetColor: "#6b9fd4",
  },
];

export function makeTrend(n) {
  const arr = [];
  let v = 0.55;
  for (let i = 0; i < n; i++) {
    v = Math.max(0.05, Math.min(0.98, v + (Math.random() - 0.47) * 0.18));
    arr.push(v);
  }
  return arr;
}

