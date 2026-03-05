import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { radius } from '../../config/theme';

export default function SearchBar({ theme, value, onChangeText, placeholder = 'Search...', style = {} }) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: radius.md,
          backgroundColor: theme.surface2,
          borderColor: focused ? theme.accent : theme.borderSubtle,
        },
        style,
      ]}
    >
      {/* Search icon */}
      <Svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.textMuted}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Circle cx={11} cy={11} r={6} />
        <Line x1={16.5} y1={16.5} x2={21} y2={21} />
      </Svg>

      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={theme.accent}
        style={[
          styles.input,
          { color: theme.textPrimary },
        ]}
        accessibilityLabel={placeholder}
      />

      {/* Clear button */}
      {value ? (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityLabel="Clear search"
          style={[styles.clearButton, { backgroundColor: theme.surface3 }]}
        >
          <Svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.textMuted}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Line x1={18} y1={6} x2={6} y2={18} />
            <Line x1={6} y1={6} x2={18} y2={18} />
          </Svg>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
