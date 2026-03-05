import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Divider({ theme, style = {} }) {
  return (
    <View style={[styles.divider, { backgroundColor: theme.borderSubtle }, style]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
