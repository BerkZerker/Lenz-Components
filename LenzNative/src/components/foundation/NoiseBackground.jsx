import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';
import { noiseDots, TILE } from '../../config/noise';

export default function NoiseBackground({ theme, style = {} }) {
  const isDark = theme.mode === 'dark';
  const base = isDark ? '255,255,255' : '0,0,0';
  const pid = `noise-${theme.mode}`;

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id={pid}
            x="0"
            y="0"
            width={TILE}
            height={TILE}
            patternUnits="userSpaceOnUse"
          >
            {noiseDots.map((d, i) => (
              <Circle
                key={i}
                cx={d.cx}
                cy={d.cy}
                r={d.r}
                fill={`rgba(${base},${(isDark ? d.opDark : d.opLight).toFixed(3)})`}
              />
            ))}
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${pid})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
