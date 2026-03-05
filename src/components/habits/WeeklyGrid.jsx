import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getHabitColor, withAlpha } from '../../config/theme';
import GlassCard from '../foundation/GlassCard';

export default function WeeklyGrid({ theme, habits, style = {} }) {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [grid, setGrid] = useState(() =>
    habits.map((h) => ({
      ...h,
      weekly: h.weekly || Array.from({ length: 7 }, () => (Math.random() > 0.4 ? 1 : 0)),
    }))
  );

  useEffect(() => {
    setGrid(
      habits.map((h) => ({
        ...h,
        weekly: h.weekly || Array.from({ length: 7 }, () => (Math.random() > 0.4 ? 1 : 0)),
      }))
    );
  }, [habits]);

  const toggleCell = (habitIdx, dayIdx) => {
    setGrid((prev) =>
      prev.map((h, i) => {
        if (i !== habitIdx) return h;
        const w = [...h.weekly];
        w[dayIdx] = w[dayIdx] ? 0 : 1;
        return { ...h, weekly: w };
      })
    );
  };

  return (
    <GlassCard theme={theme} style={[{ padding: 20 }, style]}>
      {/* Title */}
      <Text style={[styles.title, { color: theme.textPrimary }]}>Weekly Tracker</Text>

      {/* Day header row */}
      <View style={styles.headerRow}>
        <View style={styles.nameColumn} />
        {DAYS.map((d, i) => (
          <View key={i} style={styles.dayHeaderCell}>
            <Text style={[styles.dayHeaderText, { color: theme.textMuted }]}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Habit rows */}
      <View style={styles.gridBody}>
        {grid.map((habit, hi) => {
          const color = getHabitColor(habit.colorId).primary;
          return (
            <View key={habit.id} style={styles.habitRow}>
              {/* Habit name */}
              <View style={styles.nameColumn}>
                <Text
                  numberOfLines={1}
                  style={[styles.habitName, { color: theme.textSecondary }]}
                >
                  {habit.name}
                </Text>
              </View>

              {/* 7 day cells */}
              {habit.weekly.map((val, di) => (
                <View key={di} style={styles.cellContainer}>
                  <Pressable
                    onPress={() => toggleCell(hi, di)}
                    style={({ pressed }) => [
                      styles.cell,
                      {
                        backgroundColor: val
                          ? withAlpha(color, 0.19)
                          : theme.borderSubtle,
                        transform: [{ scale: pressed ? 0.88 : 1 }],
                      },
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: !!val }}
                    accessibilityLabel={`${DAYS[di]}, ${habit.name}, ${val ? 'completed' : 'not completed'}`}
                  >
                    {val ? (
                      <Svg width={14} height={14} viewBox="0 0 20 20" fill="none">
                        <Path
                          d="M5 10.5L8.5 14L15 6.5"
                          stroke={color}
                          strokeWidth={2.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </Svg>
                    ) : null}
                  </Pressable>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameColumn: {
    width: 100,
    flexShrink: 0,
    paddingRight: 8,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  gridBody: {
    gap: 6,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 12,
    fontFamily: 'Inter_300Light',
  },
  cellContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cell: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
