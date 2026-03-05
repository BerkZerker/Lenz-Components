import { getHabitColor } from '../../config/theme';
import GlassCard from '../foundation/GlassCard';

export default function HabitBarChart({ theme, data, style = {} }) {
  return (
    <GlassCard theme={theme} style={{ padding:20, ...style }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Completion Rates</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.map(item => {
          const color = getHabitColor(item.colorId).primary;
          return (
            <div key={item.habitId} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:100, fontSize:11, fontWeight:300, color:theme.textSecondary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flexShrink:0 }}>
                {item.name}
              </div>
              <div style={{ flex:1, height:16, borderRadius:6, background:theme.borderSubtle, overflow:'hidden' }}>
                <div style={{ height:16, borderRadius:6, background:color, width:`${item.rate*100}%`, transition:'width 0.4s' }} />
              </div>
              <div style={{ width:32, fontSize:11, fontWeight:300, color:theme.textMuted, textAlign:'right', flexShrink:0 }}>
                {Math.round(item.rate*100)}%
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
