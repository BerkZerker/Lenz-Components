import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SectionLabel({ theme, children, style = {} }) {
  return (
    <Text style={[styles.label, { color: theme.textMuted }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 2,
    marginTop: 4,
  },
});
