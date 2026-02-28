import { useMemo } from 'react';
import { getHabitColor } from '../../config/theme';
import GlassCard from '../foundation/GlassCard';

export default function StreakLeaderboard({ theme, habits }) {
  const sorted = useMemo(() => [...habits].sort((a,b) => b.streak - a.streak), [habits]);
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Streak Leaderboard</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {sorted.map((habit, idx) => {
          const color = getHabitColor(habit.colorId).primary;
          const rank = idx+1, top = rank <= 3;
          return (
            <div key={habit.id} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, width:24, flexShrink:0, color: top ? theme.accent : theme.textMuted, fontWeight: top ? 500 : 300 }}>
                #{rank}
              </span>
              <div style={{ width:10, height:10, borderRadius:5, background:color, flexShrink:0 }} />
              <span style={{ flex:1, fontSize:13, fontWeight:300, color:theme.textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {habit.name}
              </span>
              {habit.streak > 0 ? (
                <div style={{ display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>
                  <svg width={12} height={12} viewBox="0 0 24 24" strokeWidth={0}>
                    <path d="M12 2s-5 4.5-5 9a5 5 0 0010 0c0-1.5-.8-3-1.5-4 0 0-.5 2-2 2s-2-1.5-2-2.5C11.5 5.5 12 2 12 2z" fill={color}/>
                  </svg>
                  <span style={{ fontSize:11, fontWeight:500, color:theme.textSecondary }}>{habit.streak}</span>
                </div>
              ) : (
                <span style={{ fontSize:11, color:theme.textMuted }}>--</span>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
