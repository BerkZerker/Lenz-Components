import React from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { getHabitColor } from '../../config/theme';
import Checkmark from '../core/Checkmark';

export default function HabitCard({ theme, habit, onChange, isLast, onClick, style = {} }) {
  const color = getHabitColor(habit.colorId).primary;

  return (
    <Pressable
      onPress={() => onClick && onClick(habit)}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomWidth: !isLast ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: !isLast ? theme.borderSubtle : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}, ${habit.completed ? 'completed' : 'not completed'}`}
    >
      {/* Checkmark - separate press target */}
      <TouchableOpacity
        onPress={() => onChange(habit.id)}
        style={styles.checkmarkHitArea}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.completed }}
        accessibilityLabel={`Mark ${habit.name} as ${habit.completed ? 'not completed' : 'completed'}`}
      >
        <Checkmark checked={habit.completed} color={color} size={21} />
      </TouchableOpacity>

      {/* Name + Category + Chevron */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: habit.completed ? theme.textMuted : theme.textPrimary,
                textDecorationLine: habit.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {habit.name}
          </Text>
          <Text style={[styles.category, { color: theme.textMuted }]}>
            {habit.category}
          </Text>
        </View>

        {/* Chevron */}
        <Svg
          width={17}
          height={17}
          viewBox="0 0 24 24"
          fill="none"
        >
          <Polyline
            points="9 18 15 12 9 6"
            stroke={theme.textMuted}
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 4,
    gap: 10,
    borderRadius: 10,
  },
  checkmarkHitArea: {
    flexShrink: 0,
    padding: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter_300Light',
    marginBottom: 2,
  },
  category: {
    fontSize: 11,
    fontFamily: 'Inter_300Light',
  },
});
