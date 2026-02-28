export default function MiniSparkline({ data, width = 64, height = 24, color, bgColor }) {
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
    <svg width={width} height={height} style={{ display:'block', flexShrink:0 }}>
      <path d={areaPath} fill={color + '18'} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
