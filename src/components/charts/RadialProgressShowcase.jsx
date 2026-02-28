import GlassCard from '../foundation/GlassCard';
import RadialProgress from './RadialProgress';

export default function RadialProgressShowcase({ theme, habits }) {
  const completed = habits.filter(h => h.completed).length;
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:16 }}>Radial Progress</div>
      <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:16 }}>
        <RadialProgress theme={theme} value={completed} total={habits.length} size={110} label="Today" sublabel={`${completed}/${habits.length}`} />
        <RadialProgress theme={theme} value={5} total={7} size={90} color="#6b9fd4" label="This Week" sublabel="5/7 days" strokeWidth={7} />
        <RadialProgress theme={theme} value={23} total={30} size={90} color="#d47b6b" label="This Month" sublabel="23/30 days" strokeWidth={7} />
      </div>
    </GlassCard>
  );
}
