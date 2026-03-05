import React from 'react';
import { View, Text, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { withAlpha, radius } from '../../config/theme';

export default function Modal({ theme, open, onOpenChange, title, children, actions = [] }) {
  return (
    <RNModal
      visible={open}
      animationType="slide"
      transparent={true}
      onRequestClose={() => onOpenChange(false)}
    >
      {/* Semi-transparent overlay */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: theme.scrim,
          justifyContent: 'flex-end',
        }}
        onPress={() => onOpenChange(false)}
      >
        {/* Bottom panel - prevent press propagation */}
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: theme.surface1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '85%',
          }}
        >
          {/* Handle bar */}
          <View style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 9999,
            backgroundColor: theme.border,
            marginTop: 8,
          }} />

          <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Inter_500Medium',
                color: theme.textPrimary,
              }}>
                {title}
              </Text>
              <Pressable
                onPress={() => onOpenChange(false)}
                accessibilityLabel="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.pill,
                  backgroundColor: theme.surface2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2} strokeLinecap="round">
                  <Line x1={18} y1={6} x2={6} y2={18} />
                  <Line x1={6} y1={6} x2={18} y2={18} />
                </Svg>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView style={{ marginBottom: actions.length > 0 ? 20 : 0 }}>
              {children}
            </ScrollView>

            {/* Action buttons */}
            {actions.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {actions.map((action, i) => {
                  const variantStyles = {
                    primary: { backgroundColor: theme.accent, color: 'white' },
                    secondary: { backgroundColor: theme.surface2, color: theme.textPrimary },
                    danger: { backgroundColor: withAlpha(theme.danger, 0.09), color: theme.danger },
                  };
                  const vs = variantStyles[action.variant || 'primary'];
                  return (
                    <Pressable
                      key={i}
                      onPress={action.onClick}
                      style={{
                        flex: action.flex || (action.variant === 'danger' ? undefined : 1),
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: radius.md,
                        backgroundColor: vs.backgroundColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{
                        fontSize: 13,
                        fontFamily: 'Inter_500Medium',
                        color: vs.color,
                      }}>
                        {action.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
