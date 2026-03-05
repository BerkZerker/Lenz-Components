import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import GlassCard from '../foundation/GlassCard';
import { withAlpha } from '../../config/theme';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CorrelationCard({ theme, correlation, style = {} }) {
  const { type, headline, detail, confidence, events } = correlation;
  const [open, setOpen] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  const typeConfig = {
    positive: { label: 'Positive correlation', color: theme.accent, glass: theme.accentGlass },
    negative: { label: 'Negative correlation', color: theme.danger, glass: withAlpha(theme.danger, 0.09) },
    neutral:  { label: 'No correlation',       color: theme.info,   glass: withAlpha(theme.info, 0.12) },
    caution:  { label: 'Caution — emerging',   color: theme.warning, glass: withAlpha(theme.warning, 0.12) },
  };
  const cfg = typeConfig[type] || typeConfig.neutral;
  const typeColor = cfg.color;

  const hasEvents = events && events.length > 0;
  const sorted = hasEvents
    ? [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  // Compute proportional positions for dots
  const dotR = 4;
  const padX = dotR + 2;
  let positions = [];
  if (sorted.length > 0) {
    const timestamps = sorted.map(e => new Date(e.date).getTime());
    const minT = timestamps[0];
    const maxT = timestamps[timestamps.length - 1];
    const range = maxT - minT;
    if (sorted.length === 1 || range === 0) {
      positions = sorted.map((_, i) =>
        sorted.length === 1 ? 0.5 : i / (sorted.length - 1)
      );
    } else {
      positions = timestamps.map(t => (t - minT) / range);
    }
  }

  const svgH = 20;
  const cy = svgH / 2;

  const onTrackLayout = (e) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const cardContent = (
    <GlassCard theme={theme} style={{ padding: 16, ...style }}>
      <Text style={{
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: theme.textPrimary,
        lineHeight: 14 * 1.35,
        marginBottom: 4,
      }}>
        {headline}
      </Text>

      <Text style={{
        fontSize: 11,
        fontFamily: 'Inter_300Light',
        color: theme.textMuted,
        lineHeight: 11 * 1.5,
        marginBottom: 10,
      }}>
        {detail}
      </Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: hasEvents ? 10 : 0,
      }}>
        <View style={{
          paddingVertical: 3,
          paddingHorizontal: 8,
          borderRadius: 9999,
          backgroundColor: cfg.glass,
        }}>
          <Text style={{
            fontSize: 10,
            fontFamily: 'Inter_500Medium',
            color: typeColor,
          }}>
            {cfg.label}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{
            width: 40,
            height: 4,
            borderRadius: 9999,
            backgroundColor: theme.borderSubtle,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${confidence * 100}%`,
              height: '100%',
              borderRadius: 9999,
              backgroundColor: typeColor,
            }} />
          </View>
          <Text style={{
            fontSize: 10,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}>
            {Math.round(confidence * 100)}%
          </Text>
        </View>
      </View>

      {hasEvents && (
        <View style={{
          borderTopWidth: 1,
          borderTopColor: theme.glassBorder,
          paddingTop: 10,
        }}>
          <Text style={{
            fontSize: 10,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            marginBottom: 6,
          }}>
            {sorted.length} occurrence{sorted.length !== 1 ? 's' : ''} · Tap to view
          </Text>

          <View onLayout={onTrackLayout} style={{ width: '100%', height: svgH }}>
            {trackWidth > 0 && (
              <Svg width={trackWidth} height={svgH}>
                {positions.map((pos, i) => {
                  if (i === 0) return null;
                  const x1 = padX + positions[i - 1] * (trackWidth - padX * 2);
                  const x2 = padX + pos * (trackWidth - padX * 2);
                  return (
                    <Line
                      key={`l${i}`}
                      x1={x1} y1={cy} x2={x2} y2={cy}
                      stroke={withAlpha(typeColor, 0.25)}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  );
                })}
                {positions.map((pos, i) => {
                  const cx = padX + pos * (trackWidth - padX * 2);
                  return (
                    <Circle
                      key={`d${i}`}
                      cx={cx} cy={cy} r={dotR}
                      fill={typeColor}
                    />
                  );
                })}
              </Svg>
            )}
          </View>
        </View>
      )}
    </GlassCard>
  );

  return (
    <>
      {hasEvents ? (
        <Pressable onPress={() => setOpen(true)}>
          {cardContent}
        </Pressable>
      ) : (
        cardContent
      )}

      {hasEvents && (
        <Modal
          visible={open}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: theme.scrim,
              justifyContent: 'flex-end',
            }}
            onPress={() => setOpen(false)}
          >
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
                marginBottom: 8,
              }} />

              <ScrollView style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Inter_500Medium',
                  color: theme.textPrimary,
                  marginBottom: 4,
                }}>
                  Correlation History
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter_300Light',
                  color: theme.textMuted,
                  marginBottom: 20,
                  lineHeight: 12 * 1.4,
                }}>
                  {headline}
                </Text>

                <View style={{ paddingBottom: 32 }}>
                  {sorted.map((event, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                      {/* Timeline dot + connecting line */}
                      <View style={{
                        alignItems: 'center',
                        width: 16,
                        flexShrink: 0,
                      }}>
                        <View style={{
                          width: 10,
                          height: 10,
                          borderRadius: 9999,
                          backgroundColor: typeColor,
                          flexShrink: 0,
                          marginTop: 3,
                        }} />
                        {i < sorted.length - 1 && (
                          <View style={{
                            width: 1.5,
                            flex: 1,
                            minHeight: 16,
                            backgroundColor: withAlpha(typeColor, 0.25),
                          }} />
                        )}
                      </View>
                      {/* Event content */}
                      <View style={{
                        paddingBottom: i < sorted.length - 1 ? 16 : 0,
                        flex: 1,
                      }}>
                        <Text style={{
                          fontSize: 11,
                          fontFamily: 'Inter_500Medium',
                          color: theme.textMuted,
                        }}>
                          {formatDate(event.date)}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          fontFamily: 'Inter_400Regular',
                          color: theme.textPrimary,
                          lineHeight: 13 * 1.4,
                          marginTop: 2,
                        }}>
                          {event.label}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}
