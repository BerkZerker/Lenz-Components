import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { withAlpha, radius } from '../../config/theme';

const SIZES = {
  sm: 28,
  md: 36,
};

function getVariantStyles(theme, variant) {
  switch (variant) {
    case 'ghost':
      return { background: 'transparent', color: theme.textSecondary };
    case 'danger':
      return {
        background: withAlpha(theme.danger, 0.09),
        color: theme.danger,
      };
    default:
      return { background: theme.surface2, color: theme.textPrimary };
  }
}

export default function IconButton({
  theme,
  children,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  accessibilityLabel,
  style = {},
}) {
  const px = SIZES[size] || SIZES.md;
  const variantStyles = getVariantStyles(theme, variant);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          width: px,
          height: px,
          borderRadius: radius.pill,
          backgroundColor: variantStyles.background,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.92 : 1 }],
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
