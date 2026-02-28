import { useState, useRef, useMemo, useEffect } from 'react';
import GlassCard from '../foundation/GlassCard';

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

export default function VoiceNoteCard({ theme, habitName, duration = '0:42', timestamp = '7:15 AM', color, seed = 1, transcription }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const waveform = useMemo(() => generateWaveform(28, seed), [seed]);
  const intervalRef = useRef(null);
  const animRef = useRef(null);

  const togglePlay = () => {
    if (playing) {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(animRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      const start = Date.now();
      const totalMs = 4000;
      const animate = () => {
        const elapsed = Date.now() - start;
        const p = elapsed / totalMs;
        if (p >= 1) {
          setProgress(0);
          setPlaying(false);

          return;
        }
        setProgress(p);

        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => () => {
    clearInterval(intervalRef.current);
    cancelAnimationFrame(animRef.current);
  }, []);

  const accentColor = color || theme.accent;
  const barCount = waveform.length;
  const BAR_W = 3;
  const BAR_GAP = 2;
  const MAX_H = 36;
  const svgW = barCount * (BAR_W + BAR_GAP) - BAR_GAP;
  const svgH = MAX_H;
  const midY = svgH / 2;

  const transcript = transcription || "Had a really good morning session today. Felt focused after about 5 minutes and...";

  return (
    <GlassCard theme={theme} style={{ padding:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
        <div style={{
          width:28, height:28, borderRadius:8, flexShrink:0,
          background: accentColor + '18', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x={9} y={1} width={6} height={12} rx={3} />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1={12} y1={19} x2={12} y2={23} />
            <line x1={8} y1={23} x2={16} y2={23} />
          </svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:500, color:theme.textPrimary }}>{habitName}</div>
          <div style={{ fontSize:10, fontWeight:300, color:theme.textMuted }}>{timestamp}</div>
        </div>
        <div style={{ fontSize:11, fontWeight:400, color:theme.textMuted, fontVariantNumeric:'tabular-nums' }}>{duration}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={togglePlay} style={{
          width:36, height:36, borderRadius:9999, border:'none', cursor:'pointer',
          background: accentColor, display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0, transition:'transform 0.1s',
        }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {playing ? (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
              <rect x={6} y={4} width={4} height={16} rx={1} />
              <rect x={14} y={4} width={4} height={16} rx={1} />
            </svg>
          ) : (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
              <polygon points="7,3 20,12 7,21" />
            </svg>
          )}
        </button>
        <div style={{ flex:1, display:'flex', justifyContent:'center', overflow:'hidden' }}>
          <svg width={svgW} height={svgH} style={{ display:'block' }}>
            {waveform.map((amp, i) => {
              const x = i * (BAR_W + BAR_GAP);
              const barProgress = i / barCount;
              const isPlayed = barProgress < progress;

              const halfH = amp * (MAX_H / 2 - 1);
              const barColor = isPlayed ? accentColor : theme.borderSubtle;

              return (
                <rect
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
          </svg>
        </div>
        {playing && (
          <div style={{
            width:36, height:36, borderRadius:9999, flexShrink:0,
            background: theme.surface2, display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
      <div style={{
        marginTop:10, padding:'8px 10px', borderRadius:8,
        background: theme.surface2, fontSize:11, fontWeight:300,
        color:theme.textMuted, lineHeight:1.5, fontStyle:'italic',
      }}>
        "{transcript}"
      </div>
    </GlassCard>
  );
}
