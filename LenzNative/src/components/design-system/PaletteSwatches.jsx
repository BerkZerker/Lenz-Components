import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HABIT_COLORS } from '../../config/theme';
import GlassCard from '../foundation/GlassCard';

export default function PaletteSwatches({ theme, style = {} }) {
  return (
    <GlassCard theme={theme} style={[{ padding: 20 }, style]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Habit Color Palette
      </Text>
      <View style={styles.swatchGrid}>
        {HABIT_COLORS.map((c) => (
          <View key={c.id} style={styles.swatchItem}>
            <View style={[styles.swatch, { backgroundColor: c.primary }]} />
            <Text style={[styles.label, { color: theme.textMuted }]}>
              {c.label}
            </Text>
          </View>
        ))}
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
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  swatchItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 9999,
  },
  label: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
  },
});
