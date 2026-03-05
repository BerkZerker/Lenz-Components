import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import GlassCard from '../foundation/GlassCard';

export default function AddHabitButton({ theme, onPress, style = {} }) {
  return (
    <GlassCard theme={theme} style={[{ marginTop: 12 }, style]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add habit"
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.accentGlass }]}>
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.accent}
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <Line x1={12} y1={5} x2={12} y2={19} />
            <Line x1={5} y1={12} x2={19} y2={12} />
          </Svg>
        </View>
        <Text style={[styles.label, { color: theme.accent }]}>Add habit</Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});
