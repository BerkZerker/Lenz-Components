import React from 'react';
import { View, Text } from 'react-native';
import GlassCard from '../foundation/GlassCard';
import { getHabitColor } from '../../config/theme';

export default function HabitBarChart({ theme, data, style = {} }) {
  return (
    <GlassCard theme={theme} style={style}>
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
          color: theme.textPrimary,
          marginBottom: 12,
        }}>
          Completion Rates
        </Text>
        <View style={{ gap: 8 }}>
          {data.map(item => {
            const color = getHabitColor(item.colorId).primary;
            const pct = Math.round(item.rate * 100);
            return (
              <View key={item.habitId} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <Text
                  numberOfLines={1}
                  style={{
                    width: 100,
                    fontSize: 11,
                    fontFamily: 'Inter_300Light',
                    color: theme.textSecondary,
                    flexShrink: 0,
                  }}
                >
                  {item.name}
                </Text>
                <View style={{
                  flex: 1,
                  height: 16,
                  borderRadius: 6,
                  backgroundColor: theme.borderSubtle,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    height: 16,
                    borderRadius: 6,
                    backgroundColor: color,
                    width: `${pct}%`,
                  }} />
                </View>
                <Text style={{
                  width: 32,
                  fontSize: 11,
                  fontFamily: 'Inter_300Light',
                  color: theme.textMuted,
                  textAlign: 'right',
                  flexShrink: 0,
                }}>
                  {pct}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </GlassCard>
  );
}
