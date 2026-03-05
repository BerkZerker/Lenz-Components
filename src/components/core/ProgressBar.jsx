import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ theme, completed, total, style = {} }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={style}>
      <View style={styles.labelRow}>
        <Text style={{ fontSize: 14, fontWeight: '300', color: theme.textPrimary, fontFamily: 'Inter_300Light' }}>
          {completed}
          <Text style={{ color: theme.textMuted }}> / {total}</Text>
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.borderSubtle }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: theme.accent,
              width: `${pct}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    marginBottom: 4,
  },
  track: {
    height: 10,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    borderRadius: 9999,
  },
});
