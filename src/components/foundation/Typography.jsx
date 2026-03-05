import React from 'react';
import { Text } from 'react-native';

const WEIGHT_TO_FAMILY = {
  300: 'Inter_300Light',
  400: 'Inter_400Regular',
  500: 'Inter_500Medium',
  600: 'Inter_600SemiBold',
};

const VARIANTS = {
  title: { fontSize: 16, fontWeight: 500, lineHeight: 21 },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 17 },
};

export default function Typography({ theme, variant = 'body', children, style = {} }) {
  const config = VARIANTS[variant] || VARIANTS.body;
  const fontFamily = WEIGHT_TO_FAMILY[config.fontWeight] || 'Inter_400Regular';

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: config.fontSize,
          lineHeight: config.lineHeight,
          color: variant === 'caption' ? theme.textMuted : theme.textPrimary,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
