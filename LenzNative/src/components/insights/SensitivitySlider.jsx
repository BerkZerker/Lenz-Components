import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import GlassCard from '../foundation/GlassCard';
import AIBannerPill from './AIBannerPill';
import { withAlpha } from '../../config/theme';

export default function SensitivitySlider({ theme, style = {} }) {
  const [value, setValue] = useState(50);

  const isLow = value < 33;
  const isMid = value >= 33 && value <= 66;
  const isHigh = value > 66;
  const modeLabel = isLow
    ? 'Discovery'
    : isMid
      ? 'Balanced'
      : 'High Confidence';
  const modeDesc = isLow
    ? 'See insights quickly with lower accuracy — great for cold start'
    : isMid
      ? 'Balanced mix of speed and reliability'
      : 'Only show insights with strong statistical backing';

  const renderModeIcon = () => {
    if (isLow) {
      return (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx={12} cy={12} r={10} />
          <Path d="M8 12l2 2 4-4" />
        </Svg>
      );
    }
    if (isMid) {
      return (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx={12} cy={12} r={10} />
          <Line x1={12} y1={8} x2={12} y2={12} />
          <Line x1={12} y1={16} x2={12.01} y2={16} />
        </Svg>
      );
    }
    return (
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </Svg>
    );
  };

  return (
    <GlassCard theme={theme} style={{ padding: 20, ...style }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
          color: theme.textPrimary,
        }}>
          Insight Sensitivity
        </Text>
        <AIBannerPill theme={theme} />
      </View>

      {/* Slider */}
      <View style={{ marginBottom: 8 }}>
        <Slider
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={value}
          onValueChange={(v) => setValue(Math.round(v))}
          minimumTrackTintColor={theme.accent}
          maximumTrackTintColor={withAlpha(theme.accent, 0.19)}
          thumbTintColor={theme.surface1}
          style={{ height: 32 }}
        />
      </View>

      {/* Labels */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <Text style={{
          fontSize: 10,
          fontFamily: 'Inter_400Regular',
          color: isLow ? theme.accent : theme.textMuted,
        }}>
          Fast
        </Text>
        <Text style={{
          fontSize: 10,
          fontFamily: 'Inter_400Regular',
          color: isMid ? theme.accent : theme.textMuted,
        }}>
          Balanced
        </Text>
        <Text style={{
          fontSize: 10,
          fontFamily: 'Inter_400Regular',
          color: isHigh ? theme.accent : theme.textMuted,
        }}>
          Accurate
        </Text>
      </View>

      {/* Info card */}
      <View style={{
        padding: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: theme.surface2,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
      }}>
        <View style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          flexShrink: 0,
          backgroundColor: theme.accentFaint,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {renderModeIcon()}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
            color: theme.textPrimary,
            marginBottom: 2,
          }}>
            {modeLabel}
          </Text>
          <Text style={{
            fontSize: 11,
            fontFamily: 'Inter_300Light',
            color: theme.textMuted,
            lineHeight: 11 * 1.45,
          }}>
            {modeDesc}
          </Text>
        </View>
        <View style={{
          paddingVertical: 2,
          paddingHorizontal: 8,
          borderRadius: 9999,
          backgroundColor: theme.accentMuted,
          flexShrink: 0,
        }}>
          <Text style={{
            fontSize: 10,
            fontFamily: 'Inter_600SemiBold',
            color: theme.accent,
          }}>
            {value}%
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}
