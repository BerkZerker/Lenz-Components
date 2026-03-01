import GlassCard from '../foundation/GlassCard';
import SparkleIcon from '../foundation/SparkleIcon';

export default function InsightCard({ theme, title, description }) {
  return (
    <GlassCard theme={theme} style={{
      padding:14,
      display:'flex', gap:12, alignItems:'flex-start',
    }}>
      <div style={{
        width:32, height:32, borderRadius:9, flexShrink:0,
        background:theme.accentFaint, display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <SparkleIcon size={16} color={theme.accent} strokeWidth={1.8} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:theme.textPrimary, marginBottom:3 }}>{title}</div>
        <div style={{ fontSize:12, fontWeight:300, color:theme.textMuted, lineHeight:1.45 }}>{description}</div>
      </div>
    </GlassCard>
  );
}
