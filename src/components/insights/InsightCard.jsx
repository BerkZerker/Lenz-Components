import React from 'react';
import { View, Text } from 'react-native';
import GlassCard from '../foundation/GlassCard';
import SparkleIcon from '../foundation/SparkleIcon';

export default function InsightCard({ theme, title, description, style = {} }) {
  return (
    <GlassCard theme={theme} style={{ padding: 14, ...style }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          backgroundColor: theme.accentFaint,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <SparkleIcon size={16} color={theme.accent} strokeWidth={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 13,
            fontFamily: 'Inter_500Medium',
            color: theme.textPrimary,
            marginBottom: 3,
          }}>
            {title}
          </Text>
          <Text style={{
            fontSize: 12,
            fontFamily: 'Inter_300Light',
            color: theme.textMuted,
            lineHeight: 12 * 1.45,
          }}>
            {description}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}
