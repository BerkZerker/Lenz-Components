export default function Checkmark({ checked, color, size = 21 }) {
  const PL = 16;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ display:'block' }} aria-hidden="true">
      <circle cx={10} cy={10} r={9} stroke={color} strokeWidth={1.2} fill="none" />
      <circle cx={10} cy={10} r={9} fill={color}
        style={{ opacity: checked ? 1 : 0, transition:'opacity 0.12s' }} />
      <path d="M6 10.5L8.5 13L14 7.5"
        stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={PL} strokeDashoffset={checked ? 0 : PL}
        style={{ transition:'stroke-dashoffset 0.15s ease' }} />
    </svg>
  );
}
