import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import GlassCard from '../foundation/GlassCard';
import { getHabitColor, withAlpha } from '../../config/theme';

const SPANS = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

const sliceData = (d, s) =>
  s === 'week' ? d.slice(-7) : s === 'month' ? d.slice(-30) : d;

const getXLabels = (s) =>
  s === 'week'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : s === 'month'
      ? ['W1', 'W2', 'W3', 'W4']
      : ['Jan', 'Apr', 'Jul', 'Oct', 'Dec'];

export default function CompletionTrendChart({ theme, data, habits, style = {} }) {
  const [span, setSpan] = useState('week');

  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 20;
  const yAxisWidth = 32;
  const rightPadding = 8;
  const chartWidth = Math.min(screenWidth - 40, 380) - yAxisWidth - rightPadding;

  const { dataSet, xLabels } = useMemo(() => {
    const pts = sliceData(data, span);
    const labels = getXLabels(span);

    // Build label map: which data indices get labels
    const labelMap = {};
    labels.forEach((lbl, li) => {
      const idx = pts.length <= 1 ? 0 : Math.round(li / (labels.length - 1) * (pts.length - 1));
      labelMap[idx] = lbl;
    });

    // Build dataSet for each habit
    const sets = habits.map(h => ({
      data: pts.map((row, i) => ({
        value: (row[h.id] ?? 0) * 100,
        label: labelMap[i] || '',
      })),
      color: getHabitColor(h.colorId).primary,
      hideDataPoints: true,
      thickness: 1.25,
    }));

    return { dataSet: sets, xLabels: labels };
  }, [data, span, habits]);

  // Calculate spacing to fill chart width
  const numPoints = dataSet[0]?.data.length || 1;
  const spacing = numPoints > 1 ? chartWidth / (numPoints - 1) : chartWidth;

  return (
    <GlassCard theme={theme} style={style}>
      <View style={{ padding: horizontalPadding }}>
        {/* Title */}
        <Text style={{
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
          color: theme.textPrimary,
          marginBottom: 12,
        }}>
          Completion Trend
        </Text>

        {/* Span selector */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {SPANS.map(s => (
            <Pressable
              key={s.value}
              onPress={() => setSpan(s.value)}
              style={{
                borderRadius: 9999,
                paddingVertical: 4,
                paddingHorizontal: 12,
                backgroundColor: span === s.value ? theme.accentMuted : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 11,
                fontFamily: 'Inter_400Regular',
                color: span === s.value ? theme.accent : theme.textMuted,
              }}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Chart */}
        <LineChart
          dataSet={dataSet}
          height={160}
          maxValue={100}
          noOfSections={2}
          stepValue={50}
          spacing={spacing}
          initialSpacing={0}
          endSpacing={0}
          isAnimated={false}
          yAxisLabelSuffix="%"
          yAxisLabelWidth={yAxisWidth}
          yAxisTextStyle={{
            fontSize: 9,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
          xAxisLabelTextStyle={{
            fontSize: 9,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisThickness={0}
          xAxisThickness={0}
          rulesType="dashed"
          dashWidth={4}
          dashGap={3}
          rulesColor={withAlpha(theme.textMuted, 0.25)}
          backgroundColor="transparent"
          hideRules={false}
          trimYAxisAtTop
          yAxisExtraHeight={0}
        />

        {/* Legend */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 6,
          columnGap: 14,
          marginTop: 10,
        }}>
          {habits.map(h => {
            const color = getHabitColor(h.colorId).primary;
            return (
              <View key={h.id} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}>
                <View style={{
                  width: 14,
                  height: 0,
                  borderTopWidth: 2,
                  borderTopColor: color,
                  flexShrink: 0,
                }} />
                <Text style={{
                  fontSize: 9,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                }}>
                  {h.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </GlassCard>
  );
}
