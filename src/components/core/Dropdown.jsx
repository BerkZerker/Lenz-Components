import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { radius } from '../../config/theme';

export default function Dropdown({
  theme,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  style = {},
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <View style={style}>
      {/* Trigger */}
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        style={({ pressed }) => [
          styles.trigger,
          {
            borderRadius: radius.md,
            backgroundColor: theme.surface2,
            borderColor: theme.borderSubtle,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            { color: selectedOption ? theme.textPrimary : theme.textMuted },
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.textMuted}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Polyline points="6 9 12 15 18 9" />
        </Svg>
      </Pressable>

      {/* Modal with options */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={[styles.scrim, { backgroundColor: theme.scrim }]} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surface1,
                borderColor: theme.glassBorder,
                borderRadius: radius.md,
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item.value)}
                    style={[
                      styles.option,
                      { borderRadius: radius.sm },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Svg
                        width={12}
                        height={12}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={theme.accent}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Polyline points="20 6 9 17 4 12" />
                      </Svg>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  triggerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
  },
  scrim: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    width: '100%',
    maxHeight: 300,
    borderWidth: 1,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
  },
});
