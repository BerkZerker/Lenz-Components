import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function Checkmark({ checked, color, size = 21, style = {} }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      style={style}
    >
      {/* Outer stroke circle */}
      <Circle cx={10} cy={10} r={9} stroke={color} strokeWidth={1.2} fill="none" />

      {/* Filled circle when checked */}
      {checked && (
        <Circle cx={10} cy={10} r={9} fill={color} />
      )}

      {/* Checkmark path when checked */}
      {checked && (
        <Path
          d="M6 10.5L8.5 13L14 7.5"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </Svg>
  );
}
