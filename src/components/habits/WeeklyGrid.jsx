import { useState, useEffect } from 'react';
import { getHabitColor, withAlpha } from '../../config/theme';
import GlassCard from '../foundation/GlassCard';

export default function WeeklyGrid({ theme, habits }) {
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const [grid, setGrid] = useState(() =>
    habits.map(h => ({
      ...h,
      weekly: h.weekly || Array.from({ length: 7 }, () => Math.random() > 0.4 ? 1 : 0),
    }))
  );

  useEffect(() => {
    setGrid(habits.map(h => ({
      ...h,
      weekly: h.weekly || Array.from({ length: 7 }, () => Math.random() > 0.4 ? 1 : 0),
    })));
  }, [habits]);

  const toggleCell = (habitIdx, dayIdx) => {
    setGrid(prev => prev.map((h, i) => {
      if (i !== habitIdx) return h;
      const w = [...h.weekly];
      w[dayIdx] = w[dayIdx] ? 0 : 1;
      return { ...h, weekly: w };
    }));
  };

  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:14 }}>Weekly Tracker</div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:8 }}>
        <div style={{ width:100, flexShrink:0 }} />
        {DAYS.map((d, i) => (
          <div key={i} style={{ flex:1, textAlign:'center', fontSize:10, fontWeight:500, color:theme.textMuted }}>{d}</div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {grid.map((habit, hi) => {
          const color = getHabitColor(habit.colorId).primary;
          return (
            <div key={habit.id} style={{ display:'flex', alignItems:'center' }}>
              <div style={{
                width:100, flexShrink:0, fontSize:12, fontWeight:300, color:theme.textSecondary,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8,
              }}>{habit.name}</div>
              {habit.weekly.map((val, di) => (
                <div key={di} style={{ flex:1, display:'flex', justifyContent:'center' }}>
                  <button
                    onClick={() => toggleCell(hi, di)}
                    aria-label={`${DAYS[di]}, ${habit.name}, ${val ? 'completed' : 'not completed'}`}
                    style={{
                      width:28, height:28, borderRadius:8, border:'none', cursor:'pointer',
                      background: val ? withAlpha(color, 0.19) : theme.borderSubtle,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'background 0.15s, transform 0.1s',
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {val ? (
                      <svg width={14} height={14} viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M5 10.5L8.5 14L15 6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
