import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { radius } from '../../config/theme';

const SIZES = {
  sm: { px: 24, fontSize: 10 },
  md: { px: 32, fontSize: 12 },
  lg: { px: 40, fontSize: 14 },
};

function getInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ theme, name, src, size = 'md', style = {} }) {
  const [imgError, setImgError] = useState(false);
  const config = SIZES[size] || SIZES.md;
  const showImage = src && !imgError;

  return (
    <View
      style={[
        styles.container,
        {
          width: config.px,
          height: config.px,
          borderRadius: radius.pill,
          backgroundColor: showImage ? 'transparent' : theme.surface3,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={typeof src === 'string' ? { uri: src } : src}
          onError={() => setImgError(true)}
          style={styles.image}
          accessibilityLabel={name}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize: config.fontSize,
              color: theme.textSecondary,
            },
          ]}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});
