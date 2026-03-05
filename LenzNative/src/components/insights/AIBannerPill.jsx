import React from 'react';
import { View, Text } from 'react-native';
import SparkleIcon from '../foundation/SparkleIcon';

export default function AIBannerPill({ theme, style = {} }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 5,
      paddingLeft: 10,
      paddingRight: 12,
      borderRadius: 9999,
      backgroundColor: theme.accentFaint,
      alignSelf: 'flex-start',
      ...style,
    }}>
      <SparkleIcon size={13} color={theme.accent} strokeWidth={2} />
      <Text style={{
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        color: theme.accent,
      }}>
        Powered by on-device AI
      </Text>
    </View>
  );
}
