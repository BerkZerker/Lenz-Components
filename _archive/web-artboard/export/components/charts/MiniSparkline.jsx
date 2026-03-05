import { withAlpha } from '../../config/theme';

export default function MiniSparkline({ data, width = 64, height = 24, color, bgColor, style = {} }) {
  if (!data || data.length === 0) return null;
  if (data.length === 1) {
    const cy = height / 2;
    const cx = width / 2;
    return (
      <svg width={width} height={height} aria-hidden="true" style={{ display:'block', flexShrink:0, ...style }}>
        <circle cx={cx} cy={cy} r={2} fill={color} />
      </svg>
    );
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const areaPath = `M0,${height} L${pts.join(' L')} L${width},${height} Z`;
  return (
    <svg width={width} height={height} aria-hidden="true" style={{ display:'block', flexShrink:0, ...style }}>
      <path d={areaPath} fill={withAlpha(color, 0.09)} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
