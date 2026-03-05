import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function SparkleIcon({ size = 16, color = '#ffffff', strokeWidth = 1.8, style = {} }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z" />
      <Path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
    </Svg>
  );
}
