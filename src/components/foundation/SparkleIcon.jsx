export default function SparkleIcon({ size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z" />
      <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
    </svg>
  );
}
