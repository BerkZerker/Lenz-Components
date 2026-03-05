import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function RadialProgress({ theme, value, total, size = 120, strokeWidth = 8, color, label, sublabel, style = {} }) {
  const pct = total > 0 ? value / total : 0;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const c = size / 2;

  return (
    <View style={[{ alignItems: 'center', gap: 8 }, style]}>
      <View style={{ width: size, height: size }}>
        <Svg
          width={size}
          height={size}
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
          <Circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={theme.borderSubtle}
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={color || theme.accent}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            strokeDashoffset={offset}
          />
        </Svg>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: size * 0.22,
            fontFamily: 'Inter_600SemiBold',
            color: theme.textPrimary,
            lineHeight: size * 0.28,
          }}>
            {Math.round(pct * 100)}%
          </Text>
          {sublabel && (
            <Text style={{
              fontSize: size * 0.09,
              fontFamily: 'Inter_300Light',
              color: theme.textMuted,
              marginTop: 2,
            }}>
              {sublabel}
            </Text>
          )}
        </View>
      </View>
      {label && (
        <Text style={{
          fontSize: 12,
          fontFamily: 'Inter_400Regular',
          color: theme.textSecondary,
        }}>
          {label}
        </Text>
      )}
    </View>
  );
}
