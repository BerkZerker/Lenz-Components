import { noiseDots, TILE } from '../../config/noise';

export default function NoiseBackground({ mode }) {
  const isDark = mode === 'dark';
  const base = isDark ? '255,255,255' : '0,0,0';
  const pid = `noise-${mode}`;
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
        <defs>
          <pattern id={pid} x="0" y="0" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            {noiseDots.map((d,i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={d.r}
                fill={`rgba(${base},${(isDark ? d.opDark : d.opLight).toFixed(3)})`} />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
    </div>
  );
}
