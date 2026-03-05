import React, { createContext, useContext } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export const BlurTargetContext = createContext(null);

const PADDING_KEYS = new Set([
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'paddingHorizontal', 'paddingVertical', 'paddingStart', 'paddingEnd',
]);

function splitStyle(style) {
  // Flatten arrays into a single object
  const flat = StyleSheet.flatten(style) || {};
  const inner = {};
  const outer = {};
  for (const key of Object.keys(flat)) {
    if (PADDING_KEYS.has(key)) {
      inner[key] = flat[key];
    } else {
      outer[key] = flat[key];
    }
  }
  return { inner, outer };
}

export default function GlassCard({ theme, children, style }) {
  const tint = theme.mode === 'dark' ? 'dark' : 'light';
  const { inner, outer } = splitStyle(style);
  const blurTarget = useContext(BlurTargetContext);

  const blurProps = Platform.OS === 'android' && blurTarget
    ? { blurTarget, blurMethod: 'dimezisBlurView' }
    : {};

  return (
    <View style={[styles.container, { borderColor: theme.glassBorder }, outer]}>
      <BlurView
        intensity={40}
        tint={tint}
        style={[styles.blur, { backgroundColor: theme.glassBackground }]}
        {...blurProps}
      >
        {Object.keys(inner).length > 0 ? (
          <View style={inner}>{children}</View>
        ) : (
          children
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  blur: {
    overflow: 'hidden',
  },
});
