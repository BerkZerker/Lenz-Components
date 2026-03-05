import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';

const SIZES = {
  sm: { w: 40, h: 22, knob: 16, pad: 3 },
  md: { w: 48, h: 26, knob: 20, pad: 3 },
  lg: { w: 56, h: 30, knob: 24, pad: 3 },
};

export default function Toggle({ theme, checked, onChange, size = 'md', style = {} }) {
  const s = SIZES[size] || SIZES.md;
  const animValue = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: checked ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [checked]);

  const knobLeft = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [s.pad, s.w - s.knob - s.pad],
  });

  const trackColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border, theme.accentMuted],
  });

  const knobColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.textMuted, theme.accent],
  });

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: s.w,
            height: s.h,
            backgroundColor: trackColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              width: s.knob,
              height: s.knob,
              backgroundColor: knobColor,
              left: knobLeft,
              top: s.pad,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 9999,
    position: 'relative',
  },
  knob: {
    position: 'absolute',
    borderRadius: 9999,
  },
});
