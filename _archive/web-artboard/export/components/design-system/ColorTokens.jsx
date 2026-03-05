import GlassCard from '../foundation/GlassCard';

export default function ColorTokens({ theme, style = {} }) {
  const tokens = [
    ['bg', theme.bg], ['surface1', theme.surface1], ['surface2', theme.surface2],
    ['textPrimary', theme.textPrimary], ['textSecondary', theme.textSecondary], ['textMuted', theme.textMuted],
    ['border', theme.border], ['borderSubtle', theme.borderSubtle],
    ['accent', theme.accent], ['accentFaint', theme.accentFaint],
    ['accentMuted', theme.accentMuted], ['danger', theme.danger],
    ['glassBackground', theme.glassBackground], ['glassBorder', theme.glassBorder],
    ['accentHover', theme.accentHover], ['accentGlass', theme.accentGlass],
    ['surface3', theme.surface3], ['scrim', theme.scrim],
    ['hoverOverlay', theme.hoverOverlay], ['pressOverlay', theme.pressOverlay],
    ['info', theme.info], ['warning', theme.warning],
  ];
  return (
    <GlassCard theme={theme} style={{ padding:20, ...style }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Color Tokens</div>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {tokens.map(([name, val]) => (
          <div key={name} style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:20, height:20, borderRadius:4, background:val, border:`1px solid ${theme.border}`, flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:300, color:theme.textMuted, flex:1 }}>{name}</span>
            <span style={{ fontSize:10, fontWeight:400, color:theme.textMuted, fontVariantNumeric:'tabular-nums' }}>{val}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
