import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { radius } from '../../config/theme';

export default function Toast({ theme, message, type = 'success', visible, onDismiss }) {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 3 seconds
      const t = setTimeout(onDismiss, 3000);
      return () => clearTimeout(t);
    } else {
      // Reset position for next show
      translateY.setValue(40);
      opacity.setValue(0);
    }
  }, [visible, onDismiss, translateY, opacity]);

  if (!visible) return null;

  const typeColors = {
    success: theme.accent,
    error: theme.danger,
    info: theme.info,
  };
  const typeColor = typeColors[type] || theme.accent;

  const typeIcons = {
    success: (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={12} cy={12} r={10} />
        <Path d="M8 12l3 3 5-6" />
      </Svg>
    ),
    error: (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 9v4" />
        <Path d="M12 17h.01" />
        <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </Svg>
    ),
    info: (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={12} cy={12} r={10} />
        <Line x1={12} y1={16} x2={12} y2={12} />
        <Line x1={12} y1={8} x2={12.01} y2={8} />
      </Svg>
    ),
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 200,
        pointerEvents: 'box-none',
      }}
    >
      <Animated.View
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingVertical: 10,
          paddingLeft: 16,
          paddingRight: 8,
          borderRadius: radius.md,
          backgroundColor: typeColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 8,
          transform: [{ translateY }],
          opacity,
        }}
      >
        {typeIcons[type] || typeIcons.success}
        <Text style={{
          fontSize: 13,
          fontFamily: 'Inter_500Medium',
          color: 'white',
          flexShrink: 1,
        }}>
          {message}
        </Text>
        <Pressable
          onPress={onDismiss}
          accessibilityLabel="Dismiss"
          hitSlop={8}
          style={{ padding: 6 }}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
            <Line x1={18} y1={6} x2={6} y2={18} />
            <Line x1={6} y1={6} x2={18} y2={18} />
          </Svg>
        </Pressable>
      </Animated.View>
    </View>
  );
}
