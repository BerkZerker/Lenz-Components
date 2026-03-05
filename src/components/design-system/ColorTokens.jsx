import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../foundation/GlassCard';

export default function ColorTokens({ theme, style = {} }) {
  const tokens = [
    ['bg', theme.bg],
    ['surface1', theme.surface1],
    ['surface2', theme.surface2],
    ['textPrimary', theme.textPrimary],
    ['textSecondary', theme.textSecondary],
    ['textMuted', theme.textMuted],
    ['border', theme.border],
    ['borderSubtle', theme.borderSubtle],
    ['accent', theme.accent],
    ['accentFaint', theme.accentFaint],
    ['accentMuted', theme.accentMuted],
    ['danger', theme.danger],
    ['glassBackground', theme.glassBackground],
    ['glassBorder', theme.glassBorder],
    ['accentHover', theme.accentHover],
    ['accentGlass', theme.accentGlass],
    ['surface3', theme.surface3],
    ['scrim', theme.scrim],
    ['hoverOverlay', theme.hoverOverlay],
    ['pressOverlay', theme.pressOverlay],
    ['info', theme.info],
    ['warning', theme.warning],
  ];

  return (
    <GlassCard theme={theme} style={[{ padding: 20 }, style]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Color Tokens
      </Text>
      <View style={styles.tokenList}>
        {tokens.map(([name, val]) => (
          <View key={name} style={styles.tokenRow}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: val, borderColor: theme.border },
              ]}
            />
            <Text style={[styles.name, { color: theme.textMuted }]}>
              {name}
            </Text>
            <Text style={[styles.value, { color: theme.textMuted }]}>
              {val}
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
  tokenList: {
    flexDirection: 'column',
    gap: 7,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    flexShrink: 0,
  },
  name: {
    fontSize: 11,
    fontFamily: 'Inter_300Light',
    flex: 1,
  },
  value: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    flexShrink: 0,
  },
});
