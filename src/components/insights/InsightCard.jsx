export default function InsightCard({ theme, title, description }) {
  return (
    <div style={{
      borderRadius:14, border:`1px solid ${theme.glassBorder}`,
      background:theme.glassBackground, backdropFilter:'blur(20px)',
      WebkitBackdropFilter:'blur(20px)', padding:14,
      display:'flex', gap:12, alignItems:'flex-start',
    }}>
      <div style={{
        width:32, height:32, borderRadius:9, flexShrink:0,
        background:theme.accentFaint, display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
          stroke={theme.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z"/>
          <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>
        </svg>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:theme.textPrimary, marginBottom:3 }}>{title}</div>
        <div style={{ fontSize:12, fontWeight:300, color:theme.textMuted, lineHeight:1.45 }}>{description}</div>
      </div>
    </div>
  );
}
