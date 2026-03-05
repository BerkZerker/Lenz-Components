import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../foundation/GlassCard';
import Toggle from '../core/Toggle';

export default function ToggleShowcase({ theme, style = {} }) {
  const [vals, setVals] = useState({ a: true, b: false, c: true });
  const flip = (k) => setVals((v) => ({ ...v, [k]: !v[k] }));

  const rows = [
    { key: 'a', label: 'Notifications', size: 'sm' },
    { key: 'b', label: 'Auto-sync', size: 'md' },
    { key: 'c', label: 'Dark mode', size: 'lg' },
  ];

  return (
    <GlassCard theme={theme} style={[{ padding: 20 }, style]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Toggle</Text>
      <View style={styles.rows}>
        {rows.map((r) => (
          <View key={r.key} style={styles.row}>
            <View>
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
                {r.label}
              </Text>
              <Text style={[styles.rowSize, { color: theme.textMuted }]}>
                Size: {r.size}
              </Text>
            </View>
            <Toggle
              theme={theme}
              checked={vals[r.key]}
              onChange={() => flip(r.key)}
              size={r.size}
            />
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
  rows: {
    flexDirection: 'column',
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: 'Inter_300Light',
  },
  rowSize: {
    fontSize: 10,
    fontFamily: 'Inter_300Light',
    marginTop: 1,
  },
});
