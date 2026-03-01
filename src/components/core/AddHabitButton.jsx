import { useState } from 'react';
import GlassCard from '../foundation/GlassCard';
import { FONT_FAMILY } from '../../config/theme';

export default function AddHabitButton({ theme }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <GlassCard theme={theme} style={{
      marginTop: 12,
      cursor: 'pointer',
      transition: 'transform 0.1s',
      transform: pressed ? 'scale(0.98)' : 'scale(1)',
    }}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          width: '100%', padding: '10px 14px',
          border: 'none',
          borderRadius: 14,
          background: 'transparent',
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,
          cursor: 'pointer',
          fontFamily: FONT_FAMILY,
        }}
      >
        {/* Icon with accent glass background */}
        <div style={{
          width: 32, height: 28, borderRadius: 10, flexShrink: 0,
          background: hovered ? theme.accentMuted : theme.accentGlass,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
            <line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} />
          </svg>
        </div>
        <span style={{
          fontSize: 13, fontWeight: 500, color: theme.accent,
        }}>Add habit</span>
      </button>
    </GlassCard>
  );
}
