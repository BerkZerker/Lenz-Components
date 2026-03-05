import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Path, Line, Rect, Polygon } from 'react-native-svg';
import { getHabitColor, withAlpha, radius } from '../../config/theme';

// ---------------------------------------------------------------------------
// Inline RadialProgress (avoids dependency on charts/ which may not be ported)
// ---------------------------------------------------------------------------
function RadialProgress({ theme, value, total, size = 88, strokeWidth = 7, color, sublabel }) {
  const pct = total > 0 ? value / total : 0;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const c = size / 2;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size, height: size }}>
        {/* SVG ring – RN doesn't support CSS rotate so we use rotation prop */}
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Background track */}
          <Circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={theme.borderSubtle}
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <Circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={color || theme.accent}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            strokeDashoffset={offset}
          />
        </Svg>

        {/* Center label */}
        <View style={[StyleSheet.absoluteFill, styles.radialCenter]}>
          <Text
            style={{
              fontSize: size * 0.22,
              fontFamily: 'Inter_600SemiBold',
              color: theme.textPrimary,
              lineHeight: size * 0.26,
            }}
          >
            {Math.round(pct * 100)}%
          </Text>
          {sublabel ? (
            <Text
              style={{
                fontSize: size * 0.09,
                fontFamily: 'Inter_300Light',
                color: theme.textMuted,
                marginTop: 2,
              }}
            >
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Inline VoiceNoteCard (simplified for modal context, no canvas blob animation)
// ---------------------------------------------------------------------------
function generateWaveform(n, seed = 1) {
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
  const anchors = 8;
  const raw = [];
  for (let i = 0; i < anchors; i++) raw.push(0.15 + rand() * 0.7);
  const interpolated = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (anchors - 1);
    const lo = Math.floor(t);
    const hi = Math.min(lo + 1, anchors - 1);
    const f = t - lo;
    const f2 = f * f * (3 - 2 * f);
    interpolated.push(raw[lo] * (1 - f2) + raw[hi] * f2);
  }
  const env = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let e = 1;
    if (t < 0.06) e = t / 0.06;
    else if (t > 0.92) e = (1 - t) / 0.08;
    env.push(e);
  }
  const bars = [];
  for (let i = 0; i < n; i++) {
    const jitter = 1 + (rand() - 0.5) * 0.35;
    const pause = rand() < 0.1 ? 0.3 + rand() * 0.25 : 1;
    const val = interpolated[i] * env[i] * jitter * pause;
    bars.push(Math.max(0.06, Math.min(1, val)));
  }
  return bars;
}

function VoiceNoteCardInline({ theme, habitName, duration = '0:42', timestamp = '7:15 AM', color }) {
  const accentColor = color || theme.accent;
  const waveform = useMemo(() => generateWaveform(28, 1), []);

  const BAR_W = 3;
  const BAR_GAP = 2;
  const MAX_H = 36;
  const barCount = waveform.length;
  const svgW = barCount * (BAR_W + BAR_GAP) - BAR_GAP;
  const svgH = MAX_H;
  const midY = svgH / 2;

  return (
    <View
      style={[
        styles.voiceCard,
        { backgroundColor: theme.surface2, borderColor: theme.glassBorder },
      ]}
    >
      {/* Header: mic icon + name + duration */}
      <View style={styles.voiceHeader}>
        <View
          style={[
            styles.voiceMicBg,
            { backgroundColor: withAlpha(accentColor, 0.09) },
          ]}
        >
          <Svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Rect x={9} y={1} width={6} height={12} rx={3} fill="none" />
            <Path d="M19 10v2a7 7 0 01-14 0v-2" fill="none" />
            <Line x1={12} y1={19} x2={12} y2={23} />
            <Line x1={8} y1={23} x2={16} y2={23} />
          </Svg>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.voiceName, { color: theme.textPrimary }]}>{habitName}</Text>
          <Text style={[styles.voiceTimestamp, { color: theme.textMuted }]}>{timestamp}</Text>
        </View>
        <Text style={[styles.voiceDuration, { color: theme.textMuted }]}>{duration}</Text>
      </View>

      {/* Waveform + play button */}
      <View style={styles.voiceWaveRow}>
        <TouchableOpacity
          style={[styles.voicePlayBtn, { backgroundColor: accentColor }]}
          activeOpacity={0.8}
          accessibilityLabel="Play voice note"
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="white">
            <Polygon points="7,3 20,12 7,21" fill="white" />
          </Svg>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', overflow: 'hidden' }}>
          <Svg width={svgW} height={svgH}>
            {waveform.map((amp, i) => {
              const x = i * (BAR_W + BAR_GAP);
              const halfH = amp * (MAX_H / 2 - 1);
              return (
                <Rect
                  key={i}
                  x={x}
                  y={midY - halfH}
                  width={BAR_W}
                  height={halfH * 2}
                  rx={1.5}
                  fill={theme.borderSubtle}
                />
              );
            })}
          </Svg>
        </View>
      </View>

      {/* Transcript */}
      <View style={[styles.voiceTranscript, { backgroundColor: theme.surface2 }]}>
        <Text style={[styles.voiceTranscriptText, { color: theme.textMuted }]}>
          "Had a really good morning session today. Felt focused after about 5 minutes and..."
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Inline Button
// ---------------------------------------------------------------------------
function Button({ theme, children, onPress, variant = 'primary', style = {} }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: theme.surface2, textColor: theme.textPrimary };
      case 'ghost':
        return { backgroundColor: 'transparent', textColor: theme.textSecondary };
      default:
        return { backgroundColor: theme.accent, textColor: 'white' };
    }
  };
  const v = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: v.backgroundColor,
          borderRadius: radius.md,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: v.textColor }]}>{children}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Inline IconButton
// ---------------------------------------------------------------------------
function IconButton({ theme, children, onPress, size = 36, style = {} }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          width: size,
          height: size,
          backgroundColor: theme.surface2,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      {children}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// HabitDetailModal
// ---------------------------------------------------------------------------
export default function HabitDetailModal({ theme, habit, onClose, style = {} }) {
  const lastHabitRef = useRef(null);
  if (habit) lastHabitRef.current = habit;
  const displayHabit = habit || lastHabitRef.current;

  const color = displayHabit ? getHabitColor(displayHabit.colorId).primary : theme.textMuted;
  const weekly = displayHabit?.weekly || [1, 1, 0, 1, 1, 1, 0];
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completionRate = Math.round((weekly.filter(Boolean).length / 7) * 100);

  const miniTrend = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) arr.push(Math.random() > 0.35 ? 1 : 0);
    return arr;
  }, [displayHabit?.id]);

  return (
    <Modal
      visible={!!habit}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Scrim overlay */}
      <Pressable style={[styles.overlay, { backgroundColor: theme.scrim }]} onPress={onClose}>
        {/* Prevent taps on inner panel from closing */}
        <View />
      </Pressable>

      {/* Bottom sheet panel */}
      <View
        style={[
          styles.panel,
          {
            backgroundColor: theme.surface1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          style,
        ]}
      >
        {/* Drag handle indicator */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
        </View>

        {displayHabit && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* ---- Header ---- */}
            <View style={styles.header}>
              {/* Color dot in rounded square */}
              <View
                style={[
                  styles.colorSquare,
                  {
                    borderRadius: radius.md,
                    backgroundColor: withAlpha(color, 0.13),
                  },
                ]}
              >
                <View
                  style={[
                    styles.colorDot,
                    { borderRadius: radius.pill, backgroundColor: color },
                  ]}
                />
              </View>

              {/* Name + Category */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.habitName, { color: theme.textPrimary }]}>
                  {displayHabit.name}
                </Text>
                <Text style={[styles.habitCategory, { color: theme.textMuted }]}>
                  {displayHabit.category}
                </Text>
              </View>

              {/* Close button */}
              <IconButton theme={theme} onPress={onClose}>
                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.textMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <Line x1={18} y1={6} x2={6} y2={18} />
                  <Line x1={6} y1={6} x2={18} y2={18} />
                </Svg>
              </IconButton>
            </View>

            {/* ---- Stats Row ---- */}
            <View style={styles.statsRow}>
              {[
                { label: 'Streak', value: displayHabit.streak, suffix: ' days' },
                { label: 'This Week', value: `${weekly.filter(Boolean).length}/7` },
                { label: 'Rate', value: `${completionRate}%` },
              ].map((stat) => (
                <View
                  key={stat.label}
                  style={[
                    styles.statBox,
                    { borderRadius: radius.md, backgroundColor: theme.surface2 },
                  ]}
                >
                  <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                    {stat.value}
                    {stat.suffix || ''}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* ---- Radial Progress + Weekly Days ---- */}
            <View style={styles.progressRow}>
              <RadialProgress
                theme={theme}
                value={weekly.filter(Boolean).length}
                total={7}
                size={88}
                strokeWidth={7}
                color={color}
                sublabel={`${weekly.filter(Boolean).length}/7`}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>This Week</Text>
                <View style={styles.weekDayRow}>
                  {DAYS.map((day, i) => (
                    <View key={i} style={styles.weekDayCol}>
                      <View
                        style={[
                          styles.weekDayCell,
                          {
                            borderRadius: radius.sm,
                            backgroundColor: weekly[i]
                              ? withAlpha(color, 0.19)
                              : theme.borderSubtle,
                          },
                        ]}
                      >
                        {weekly[i] ? (
                          <Svg width={12} height={12} viewBox="0 0 20 20" fill="none">
                            <Path
                              d="M5 10.5L8.5 14L15 6.5"
                              stroke={color}
                              strokeWidth={2.2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </Svg>
                        ) : null}
                      </View>
                      <Text style={[styles.weekDayLabel, { color: theme.textMuted }]}>
                        {day.charAt(0)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* ---- Last 30 Days Mini Heatmap ---- */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Last 30 Days</Text>
              <View style={styles.heatmapGrid}>
                {miniTrend.map((val, i) => (
                  <View
                    key={i}
                    style={[
                      styles.heatmapCell,
                      {
                        backgroundColor: val
                          ? withAlpha(color, 0.38)
                          : theme.borderSubtle,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* ---- Voice Note ---- */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Voice Note</Text>
              <VoiceNoteCardInline
                theme={theme}
                habitName={displayHabit.name}
                duration="0:42"
                timestamp="7:15 AM"
                color={color}
              />
            </View>

            {/* ---- Action Buttons ---- */}
            <View style={styles.actionRow}>
              <Button theme={theme} variant="primary" style={{ flex: 1 }}>
                Edit Habit
              </Button>
              <Button
                theme={theme}
                variant="ghost"
                style={{ borderColor: 'transparent' }}
              >
                <Text style={{ color: theme.danger, fontFamily: 'Inter_500Medium', fontSize: 13 }}>
                  Delete
                </Text>
              </Button>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 2,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  colorSquare: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
  },
  habitName: {
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
  },
  habitCategory: {
    fontSize: 12,
    fontFamily: 'Inter_300Light',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter_300Light',
    marginTop: 3,
  },

  // Progress + weekly row
  progressRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  weekDayRow: {
    flexDirection: 'row',
    gap: 4,
  },
  weekDayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekDayCell: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayLabel: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
  },

  // Shared section
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },

  // Heatmap
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  heatmapCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },

  // RadialProgress center overlay
  radialCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Voice note card (inline)
  voiceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  voiceMicBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceName: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  voiceTimestamp: {
    fontSize: 10,
    fontFamily: 'Inter_300Light',
  },
  voiceDuration: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  voiceWaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voicePlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceTranscript: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  voiceTranscriptText: {
    fontSize: 11,
    fontFamily: 'Inter_300Light',
    fontStyle: 'italic',
    lineHeight: 16.5,
  },

  // Buttons
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  iconButton: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Action row
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
