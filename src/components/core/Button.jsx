import React, { useRef, useEffect } from 'react';
import { Pressable, Text, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { radius } from '../../config/theme';

const SIZES = {
  sm: { paddingVertical: 6, paddingHorizontal: 14, fontSize: 12 },
  md: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 13 },
};

function getVariantStyles(theme, variant) {
  switch (variant) {
    case 'secondary':
      return { background: theme.surface2, color: theme.textPrimary };
    case 'ghost':
      return { background: 'transparent', color: theme.textSecondary };
    default:
      return { background: theme.accent, color: 'white' };
  }
}

function Spinner({ variant, theme }) {
  const strokeColor = variant === 'primary' ? 'white' : theme.textPrimary;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Circle
          cx={7}
          cy={7}
          r={5.5}
          stroke={strokeColor}
          strokeOpacity={0.25}
          strokeWidth={2}
        />
        <Circle
          cx={7}
          cy={7}
          r={5.5}
          stroke={strokeColor}
          strokeWidth={2}
          strokeDasharray="20 14"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}

export default function Button({
  theme,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style = {},
}) {
  const isDisabled = disabled || loading;
  const sizeConfig = SIZES[size] || SIZES.md;
  const variantStyles = getVariantStyles(theme, variant);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        {
          borderRadius: radius.md,
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          backgroundColor: variantStyles.background,
          opacity: isDisabled ? 0.5 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {loading && <Spinner variant={variant} theme={theme} />}
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            { fontSize: sizeConfig.fontSize, color: variantStyles.color },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});
