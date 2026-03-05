import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { radius } from '../../config/theme';

const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function DatePicker({ theme, value, onChange, style = {} }) {
  const [viewDate, setViewDate] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1)
  );

  const prevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7; // Shift so Monday=0
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const monthYearLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const today = new Date();

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < startOffset || i >= startOffset + daysInMonth) {
      cells.push(null);
    } else {
      cells.push(i - startOffset + 1);
    }
  }

  return (
    <View style={style}>
      {/* Header: month/year with nav arrows */}
      <View style={styles.header}>
        <Pressable
          onPress={prevMonth}
          accessibilityLabel="Previous month"
          style={({ pressed }) => [
            styles.navButton,
            {
              backgroundColor: theme.surface2,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.textMuted}
            strokeWidth={2}
            strokeLinecap="round"
          >
            <Polyline points="15 18 9 12 15 6" />
          </Svg>
        </Pressable>

        <Text style={[styles.monthYear, { color: theme.textPrimary }]}>
          {monthYearLabel}
        </Text>

        <Pressable
          onPress={nextMonth}
          accessibilityLabel="Next month"
          style={({ pressed }) => [
            styles.navButton,
            {
              backgroundColor: theme.surface2,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.textMuted}
            strokeWidth={2}
            strokeLinecap="round"
          >
            <Polyline points="9 6 15 12 9 18" />
          </Svg>
        </Pressable>
      </View>

      {/* Day headers */}
      <View style={styles.dayHeaderRow}>
        {DAY_HEADERS.map((d, i) => (
          <View key={i} style={styles.dayHeaderCell}>
            <Text style={[styles.dayHeaderText, { color: theme.textMuted }]}>
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {cells.map((cell, i) => {
          if (cell === null) {
            return <View key={i} style={styles.dayCell} />;
          }

          const isSelected =
            value.getFullYear() === year &&
            value.getMonth() === month &&
            value.getDate() === cell;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === cell;

          return (
            <View key={i} style={styles.dayCell}>
              <Pressable
                onPress={() => onChange(new Date(year, month, cell))}
                accessibilityLabel={`${cell} ${monthYearLabel}`}
                style={({ pressed }) => [
                  styles.dayButton,
                  {
                    borderRadius: radius.lg,
                    backgroundColor: isSelected
                      ? theme.accent
                      : isToday
                        ? theme.accentFaint
                        : 'transparent',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isSelected
                        ? 'white'
                        : isToday
                          ? theme.accent
                          : theme.textPrimary,
                      fontWeight: isSelected || isToday ? '500' : '400',
                      fontFamily:
                        isSelected || isToday
                          ? 'Inter_500Medium'
                          : 'Inter_400Regular',
                    },
                  ]}
                >
                  {cell}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYear: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayHeaderCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayHeaderText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 1,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
  },
});
