import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { radius } from '../../config/theme';

export default function TextInput({
  theme,
  label,
  value,
  onChangeText,
  placeholder = '',
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  style = {},
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.danger
    : focused
      ? theme.accent
      : theme.borderSubtle;

  return (
    <View style={style}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={theme.accent}
        style={[
          styles.input,
          {
            borderRadius: radius.md,
            backgroundColor: theme.surface2,
            borderColor,
            color: theme.textPrimary,
          },
        ]}
      />
      {error && (
        <Text style={[styles.error, { color: theme.danger }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    marginBottom: 6,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
  },
  error: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },
});
