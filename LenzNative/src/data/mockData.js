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
    confidence: 0.82,
    events: [
      { date: "2026-02-03", label: "Meeting 6:30pm → Skipped gym" },
      { date: "2026-02-07", label: "Meeting 7pm → Skipped gym" },
      { date: "2026-02-10", label: "Meeting 6:15pm → Skipped gym" },
      { date: "2026-02-14", label: "Meeting 6:45pm → Skipped gym" },
      { date: "2026-02-18", label: "Meeting 8pm → Skipped gym" },
      { date: "2026-02-21", label: "Meeting 6pm → Skipped gym" },
      { date: "2026-02-27", label: "Meeting 7:30pm → Skipped gym" },
    ],
  },
  {
    id: "2",
    type: "positive",
    headline: "Meditation + Journal stack → 92% completion",
    detail:
      "When you meditate first, journal completion jumps from 58% to 92%. Consider pairing them.",
    confidence: 0.91,
    events: [
      { date: "2026-01-28", label: "Meditated 7am → Journaled 9pm" },
      { date: "2026-02-01", label: "Meditated 7:15am → Journaled 8:45pm" },
      { date: "2026-02-04", label: "Meditated 6:50am → Journaled 9:10pm" },
      { date: "2026-02-05", label: "Meditated 7am → Journaled 9pm" },
      { date: "2026-02-09", label: "Meditated 7:30am → Journaled 8:30pm" },
      { date: "2026-02-15", label: "Meditated 6:45am → Journaled 9:15pm" },
      { date: "2026-02-19", label: "Meditated 7am → Journaled 9pm" },
      { date: "2026-02-24", label: "Meditated 7:10am → Journaled 8:50pm" },
    ],
  },
  {
    id: "4",
    type: "neutral",
    headline: "Weather has no effect on your reading habit",
    detail:
      "Rain or shine, your reading completion stays around 72%. This habit is well-anchored.",
    confidence: 0.88,
    events: [
      { date: "2026-01-30", label: "Rainy → Read 35 min" },
      { date: "2026-02-03", label: "Sunny → Read 30 min" },
      { date: "2026-02-06", label: "Overcast → Read 28 min" },
      { date: "2026-02-11", label: "Rainy → Read 32 min" },
      { date: "2026-02-16", label: "Sunny → Read 30 min" },
      { date: "2026-02-22", label: "Snow → Read 40 min" },
      { date: "2026-02-26", label: "Cloudy → Read 31 min" },
    ],
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

export function makeMultiHabitTrend(habits, n) {
  const perHabit = habits.map(h => ({ id: h.id, values: makeTrend(n) }));
  return Array.from({ length: n }, (_, i) => {
    const row = { index: i };
    perHabit.forEach(h => { row[h.id] = h.values[i]; });
    return row;
  });
}
