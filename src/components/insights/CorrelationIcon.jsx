export default function CorrelationIcon({ type, color, size = 20 }) {
  const icons = {
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x={3} y={4} width={18} height={18} rx={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} />
      </svg>
    ),
    gym: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a2 2 0 013 0l8 8a2 2 0 01-3 3l-8-8a2 2 0 010-3z" />
        <path d="M3.5 14.5l2-2" /><path d="M20.5 9.5l-2 2" />
        <path d="M14.5 3.5l-2 2" /><path d="M9.5 20.5l2-2" />
      </svg>
    ),
    meditation: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={6} r={3} /><path d="M12 9v4" /><path d="M8 21c0-3 1.5-5 4-5s4 2 4 5" /><path d="M6 15c-1.5 1-2 3-2 6" /><path d="M18 15c1.5 1 2 3 2 6" />
      </svg>
    ),
    journal: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1={8} y1={7} x2={16} y2={7} /><line x1={8} y1={11} x2={14} y2={11} />
      </svg>
    ),
    sleep: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    weather: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
    trending: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    water: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
  };
  return icons[type] || icons.calendar;
}
