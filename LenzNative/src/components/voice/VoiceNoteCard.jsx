import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Rect as SvgRect, Polygon, Polyline, Line, Path } from 'react-native-svg';
import GlassCard from '../foundation/GlassCard';
import { withAlpha } from '../../config/theme';

function generateWaveform(n, seed = 1) {
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff; };

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
    const pause = (rand() < 0.1) ? 0.3 + rand() * 0.25 : 1;
    const val = interpolated[i] * env[i] * jitter * pause;
    bars.push(Math.max(0.06, Math.min(1, val)));
  }
  return bars;
}

function parseDurationMs(duration) {
  const parts = duration.split(':');
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return (minutes * 60 + seconds) * 1000;
}

export default function VoiceNoteCard({
  theme,
  habitName,
  duration = '0:42',
  timestamp = '7:15 AM',
  color,
  seed = 1,
  transcription,
  style = {},
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const waveform = useMemo(() => generateWaveform(28, seed), [seed]);

  const accentColor = color || theme.accent;

  const togglePlay = () => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      const totalMs = parseDurationMs(duration);
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const p = elapsed / totalMs;
        if (p >= 1) {
          clearInterval(intervalRef.current);
          setProgress(0);
          setPlaying(false);
          return;
        }
        setProgress(p);
      }, 50);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const barCount = waveform.length;
  const BAR_W = 3;
  const BAR_GAP = 2;
  const MAX_H = 36;
  const svgW = barCount * (BAR_W + BAR_GAP) - BAR_GAP;
  const svgH = MAX_H;
  const midY = svgH / 2;

  const transcript = transcription || 'Had a really good morning session today. Felt focused after about 5 minutes and...';

  return (
    <GlassCard theme={theme} style={{ padding: 16, overflow: 'hidden', ...style }}>
      {/* Subtle background color change when playing */}
      {playing && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: withAlpha(accentColor, 0.04),
          borderRadius: 14,
        }} />
      )}

      <View style={{ position: 'relative' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}>
          {/* Mic icon */}
          <View style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            backgroundColor: withAlpha(accentColor, 0.09),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <SvgRect x={9} y={1} width={6} height={12} rx={3} />
              <Path d="M19 10v2a7 7 0 01-14 0v-2" />
              <Line x1={12} y1={19} x2={12} y2={23} />
              <Line x1={8} y1={23} x2={16} y2={23} />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Inter_500Medium',
              color: theme.textPrimary,
            }}>
              {habitName}
            </Text>
            <Text style={{
              fontSize: 10,
              fontFamily: 'Inter_300Light',
              color: theme.textMuted,
            }}>
              {timestamp}
            </Text>
          </View>
          <Text style={{
            fontSize: 11,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            fontVariant: ['tabular-nums'],
          }}>
            {duration}
          </Text>
        </View>

        {/* Play button + waveform + checkmark */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
          {/* Play/Pause button */}
          <Pressable
            onPress={togglePlay}
            accessibilityLabel={playing ? 'Pause voice note' : 'Play voice note'}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: 9999,
              backgroundColor: accentColor,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            {playing ? (
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="white">
                <SvgRect x={6} y={4} width={4} height={16} rx={1} />
                <SvgRect x={14} y={4} width={4} height={16} rx={1} />
              </Svg>
            ) : (
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="white">
                <Polygon points="7,3 20,12 7,21" />
              </Svg>
            )}
          </Pressable>

          {/* Waveform */}
          <View style={{ flex: 1, alignItems: 'center', overflow: 'hidden' }}>
            <Svg width={svgW} height={svgH}>
              {waveform.map((amp, i) => {
                const x = i * (BAR_W + BAR_GAP);
                const barProgress = i / barCount;
                const isPlayed = barProgress < progress;
                const halfH = amp * (MAX_H / 2 - 1);
                const barColor = isPlayed ? accentColor : theme.borderSubtle;

                return (
                  <SvgRect
                    key={i}
                    x={x}
                    y={midY - halfH}
                    width={BAR_W}
                    height={halfH * 2}
                    rx={1.5}
                    fill={barColor}
                  />
                );
              })}
            </Svg>
          </View>

          {/* Checkmark button when playing */}
          {playing && (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 9999,
              flexShrink: 0,
              backgroundColor: theme.surface2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <Polyline points="20 6 9 17 4 12" />
              </Svg>
            </View>
          )}
        </View>

        {/* Transcript */}
        <View style={{
          marginTop: 10,
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 8,
          backgroundColor: theme.surface2,
        }}>
          <Text style={{
            fontSize: 11,
            fontFamily: 'Inter_300Light',
            color: theme.textMuted,
            lineHeight: 11 * 1.5,
            fontStyle: 'italic',
          }}>
            &ldquo;{transcript}&rdquo;
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}
