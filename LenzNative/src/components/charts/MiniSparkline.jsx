import React from 'react';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { withAlpha } from '../../config/theme';

export default function MiniSparkline({ data, width = 64, height = 24, color, bgColor, style = {} }) {
  if (!data || data.length === 0) return null;

  if (data.length === 1) {
    const cy = height / 2;
    const cx = width / 2;
    return (
      <Svg width={width} height={height} style={[{ flexShrink: 0 }, style]}>
        <Circle cx={cx} cy={cy} r={2} fill={color} />
      </Svg>
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
    <Svg width={width} height={height} style={[{ flexShrink: 0 }, style]}>
      <Path d={areaPath} fill={withAlpha(color, 0.09)} />
      <Polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
