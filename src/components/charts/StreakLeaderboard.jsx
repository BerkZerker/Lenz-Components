import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import GlassCard from '../foundation/GlassCard';
import { getHabitColor } from '../../config/theme';

export default function StreakLeaderboard({ theme, habits, style = {} }) {
  const sorted = useMemo(() => [...habits].sort((a, b) => b.streak - a.streak), [habits]);

  return (
    <GlassCard theme={theme} style={style}>
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
          color: theme.textPrimary,
          marginBottom: 12,
        }}>
          Streak Leaderboard
        </Text>
        <View style={{ gap: 8 }}>
          {sorted.map((habit, idx) => {
            const color = getHabitColor(habit.colorId).primary;
            const rank = idx + 1;
            const top = rank <= 3;
            return (
              <View key={habit.id} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <Text style={{
                  fontSize: 11,
                  width: 24,
                  flexShrink: 0,
                  color: top ? theme.accent : theme.textMuted,
                  fontFamily: top ? 'Inter_500Medium' : 'Inter_300Light',
                }}>
                  #{rank}
                </Text>
                <View style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: color,
                  flexShrink: 0,
                }} />
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontFamily: 'Inter_300Light',
                    color: theme.textPrimary,
                  }}
                >
                  {habit.name}
                </Text>
                {habit.streak > 0 ? (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3,
                    flexShrink: 0,
                  }}>
                    <Svg width={12} height={12} viewBox="0 0 24 24">
                      <Path
                        d="M12 2s-5 4.5-5 9a5 5 0 0010 0c0-1.5-.8-3-1.5-4 0 0-.5 2-2 2s-2-1.5-2-2.5C11.5 5.5 12 2 12 2z"
                        fill={color}
                      />
                    </Svg>
                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'Inter_500Medium',
                      color: theme.textSecondary,
                    }}>
                      {habit.streak}
                    </Text>
                  </View>
                ) : (
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                  }}>
                    --
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </GlassCard>
  );
}
