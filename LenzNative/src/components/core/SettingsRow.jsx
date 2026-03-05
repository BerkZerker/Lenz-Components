import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toggle from './Toggle';

export default function SettingsRow({ theme, label, description, checked, onChange, style = {} }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.description, { color: theme.textMuted }]}>
            {description}
          </Text>
        )}
      </View>
      <Toggle theme={theme} checked={checked} onChange={onChange} size="md" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
  },
  description: {
    fontSize: 12,
    fontWeight: '300',
    fontFamily: 'Inter_300Light',
    marginTop: 2,
    lineHeight: 16.8,
  },
});
