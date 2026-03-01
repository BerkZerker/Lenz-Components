import { HABIT_COLORS } from '../../config/theme';
import GlassCard from '../foundation/GlassCard';

export default function PaletteSwatches({ theme, style = {} }) {
  return (
    <GlassCard theme={theme} style={{ padding:20, ...style }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Habit Color Palette</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
        {HABIT_COLORS.map(c => (
          <div key={c.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
            <div style={{ width:36, height:36, borderRadius:9999, background:c.primary }} />
            <span style={{ fontSize:9, fontWeight:400, color:theme.textMuted }}>{c.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
