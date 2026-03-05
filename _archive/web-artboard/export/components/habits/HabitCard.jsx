import { useState } from 'react';
import { getHabitColor } from '../../config/theme';
import Checkmark from '../core/Checkmark';

export default function HabitCard({ theme, habit, onChange, isLast, onClick, style = {} }) {
  const color = getHabitColor(habit.colorId).primary;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${habit.name}, ${habit.completed ? 'completed' : 'not completed'}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick && onClick(habit); } }}
      style={{
        display:'flex', alignItems:'center', padding:'13px 4px', gap:10,
        borderBottom: !isLast ? `1px solid ${theme.borderSubtle}` : undefined,
        background: pressed ? theme.pressOverlay : hovered ? theme.hoverOverlay : 'transparent',
        transition:'background 0.1s',
        borderRadius:10, cursor:'pointer',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <div style={{ flexShrink:0, padding:2, cursor:'pointer' }} onClick={(e) => { e.stopPropagation(); onChange(habit.id); }}>
        <Checkmark checked={habit.completed} color={color} size={21} />
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', gap:12, minWidth:0 }} onClick={() => onClick && onClick(habit)}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontSize:16, fontWeight:300,
            color: habit.completed ? theme.textMuted : theme.textPrimary,
            textDecoration: habit.completed ? 'line-through' : 'none',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:2,
          }}>{habit.name}</div>
          <div style={{ fontSize:11, fontWeight:300, color:theme.textMuted }}>{habit.category}</div>
        </div>
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none"
          stroke={theme.textMuted} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}
