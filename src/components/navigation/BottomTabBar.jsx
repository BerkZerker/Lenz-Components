import React, { useState, useContext } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { BlurTargetContext } from '../foundation/GlassCard';
import Svg, { Rect as SvgRect, Line, Path } from 'react-native-svg';
import SparkleIcon from '../foundation/SparkleIcon';

const CalendarIcon = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <SvgRect x={3} y={4} width={18} height={18} rx={2} />
    <Line x1={16} y1={2} x2={16} y2={6} />
    <Line x1={8} y1={2} x2={8} y2={6} />
    <Line x1={3} y1={10} x2={21} y2={10} />
    <SvgRect x={8} y={14} width={3} height={3} rx={0.5} fill={color} stroke="none" />
  </Svg>
);

const StatsIcon = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <SvgRect x={4} y={14} width={4} height={7} rx={1} />
    <SvgRect x={10} y={8} width={4} height={13} rx={1} />
    <SvgRect x={16} y={3} width={4} height={18} rx={1} />
  </Svg>
);

const MenuIcon = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={4} y1={6} x2={20} y2={6} />
    <Line x1={4} y1={12} x2={20} y2={12} />
    <Line x1={4} y1={18} x2={20} y2={18} />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

const MicIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <SvgRect x={9} y={2} width={6} height={12} rx={3} />
    <Path d="M5 10a7 7 0 0 0 14 0" />
    <Line x1={12} y1={17} x2={12} y2={21} />
    <Line x1={8} y1={21} x2={16} y2={21} />
  </Svg>
);

const TABS = [
  { id: 'today', label: 'Today', Icon: CalendarIcon },
  { id: 'stats', label: 'Stats', Icon: StatsIcon },
  { id: 'insights', label: 'Insights', Icon: null },
  { id: 'more', label: 'More', Icon: MenuIcon },
];

export default function BottomTabBar({
  theme,
  activeTab,
  onTabChange,
  onAddHabit,
  onVoiceNote,
  inline,
  style = {},
}) {
  const [fabPressed, setFabPressed] = useState(false);

  const leftTabs = TABS.filter(t => t.id === 'today' || t.id === 'stats');
  const rightTabs = TABS.filter(t => t.id === 'insights' || t.id === 'more');

  const isMic = activeTab === 'insights';
  const fabAction = isMic ? onVoiceNote : onAddHabit;

  const renderTab = (tab) => {
    const active = activeTab === tab.id;
    const color = active ? theme.accent : theme.textMuted;

    return (
      <Pressable
        key={tab.id}
        onPress={() => onTabChange(tab.id)}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        style={{
          flex: 1,
          alignItems: 'center',
          gap: 3,
          paddingVertical: 6,
        }}
      >
        {/* Active glow rectangle behind icon */}
        <View style={{
          width: 36,
          height: 28,
          borderRadius: 12,
          backgroundColor: active ? theme.accentGlass : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {tab.id === 'insights' ? (
            <SparkleIcon size={22} color={color} strokeWidth={1.8} />
          ) : (
            <tab.Icon color={color} />
          )}
        </View>
        <Text style={{
          fontSize: 10,
          fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
          color,
        }}>
          {tab.label}
        </Text>
        {/* Glowing dot under label */}
        <View style={{
          width: 4,
          height: 4,
          borderRadius: 9999,
          backgroundColor: active ? theme.accent : 'transparent',
        }} />
      </Pressable>
    );
  };

  const tint = theme.mode === 'dark' ? 'dark' : 'light';
  const blurTarget = useContext(BlurTargetContext);
  const blurProps = Platform.OS === 'android' && blurTarget
    ? { blurTarget, blurMethod: 'dimezisBlurView' }
    : {};

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Main navigation"
      style={{
        ...(inline ? {} : {
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 100,
        }),
        ...style,
      }}
    >
      <View style={{
        borderRadius: 22,
        borderWidth: 1,
        borderColor: theme.glassBorder,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 32,
        elevation: 12,
      }}>
        <BlurView
          intensity={48}
          tint={tint}
          style={StyleSheet.absoluteFill}
          {...blurProps}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            backgroundColor: theme.glassBackground,
          }}
        >
          {/* Left tabs */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {leftTabs.map(renderTab)}
          </View>

          {/* Center FAB */}
          <View style={{
            width: 64,
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Pressable
              onPress={fabAction}
              onPressIn={() => setFabPressed(true)}
              onPressOut={() => setFabPressed(false)}
              accessibilityLabel={isMic ? 'Record voice note' : 'Add new habit'}
              style={{
                width: 54,
                height: 54,
                borderRadius: 9999,
                backgroundColor: theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: fabPressed ? 0.9 : 1 }],
              }}
            >
              {isMic ? <MicIcon /> : <PlusIcon />}
            </Pressable>
          </View>

          {/* Right tabs */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {rightTabs.map(renderTab)}
          </View>
        </View>
      </View>
    </View>
  );
}
