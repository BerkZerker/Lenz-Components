import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius } from '../../config/theme';

export default function EmptyState({ theme, icon, title, description, style = {} }) {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View
          style={[
            styles.iconContainer,
            {
              borderRadius: radius.md,
              backgroundColor: theme.accentFaint,
            },
          ]}
        >
          {icon}
        </View>
      )}
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: theme.textMuted }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_300Light',
    lineHeight: 20,
    maxWidth: 240,
    textAlign: 'center',
  },
});
