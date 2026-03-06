import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { radius } from '../../config/theme';

const ANIM_CONFIG = { duration: 45, easing: Easing.out(Easing.quad) };

export default function SegmentedControl({ theme, options, value, onChange, style = {} }) {
  const [segmentWidths, setSegmentWidths] = useState([]);
  const animLeft = useSharedValue(0);
  const animWidth = useSharedValue(0);

  const activeIndex = options.findIndex((o) => o.value === value);

  useEffect(() => {
    if (segmentWidths.length === options.length && activeIndex >= 0) {
      let left = 0;
      for (let i = 0; i < activeIndex; i++) {
        left += segmentWidths[i];
      }
      const width = segmentWidths[activeIndex] || 0;
      animLeft.value = withTiming(left, ANIM_CONFIG);
      animWidth.value = withTiming(width, ANIM_CONFIG);
    }
  }, [activeIndex, segmentWidths]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: animLeft.value,
    width: animWidth.value,
  }));

  const handleLayout = (index, event) => {
    const { width } = event.nativeEvent.layout;
    setSegmentWidths((prev) => {
      const next = [...prev];
      next[index] = width;
      return next;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface2, borderRadius: radius.pill }, style]}>
      {/* Sliding indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: theme.accent,
            borderRadius: radius.pill,
          },
          indicatorStyle,
        ]}
      />

      {/* Option buttons */}
      {options.map((option, index) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          onLayout={(e) => handleLayout(index, e)}
          style={styles.segment}
          accessibilityRole="button"
          accessibilityState={{ selected: option.value === value }}
        >
          <Text
            style={[
              styles.label,
              { color: option.value === value ? 'white' : theme.textMuted },
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    padding: 3,
  },
  indicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});
