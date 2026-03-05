import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import { radius } from '../../config/theme';

const VARIANT_DEFAULTS = {
  text: { width: '100%', height: 14, borderRadius: 6 },
  card: { width: '100%', height: 80, borderRadius: radius.md },
  circle: { width: 40, height: 40, borderRadius: radius.pill },
};

export default function Skeleton({ theme, variant = 'text', width, height, style = {} }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const defaults = VARIANT_DEFAULTS[variant] || VARIANT_DEFAULTS.text;

  return (
    <Animated.View
      style={[
        {
          width: width !== undefined ? width : defaults.width,
          height: height !== undefined ? height : defaults.height,
          borderRadius: defaults.borderRadius,
          backgroundColor: theme.surface3,
          opacity,
        },
        style,
      ]}
    />
  );
}
