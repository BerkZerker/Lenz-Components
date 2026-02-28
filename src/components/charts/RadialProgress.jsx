export default function RadialProgress({ theme, value, total, size = 120, strokeWidth = 8, color, label, sublabel }) {
  const pct = total > 0 ? value / total : 0;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const c = size / 2;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ position:'relative', width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={theme.borderSubtle} strokeWidth={strokeWidth} />
          <circle cx={c} cy={c} r={r} fill="none" stroke={color || theme.accent}
            strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition:'stroke-dashoffset 0.6s ease' }} />
        </svg>
        <div style={{
          position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
        }}>
          <div style={{ fontSize: size * 0.22, fontWeight:600, color: theme.textPrimary, lineHeight:1 }}>
            {Math.round(pct * 100)}%
          </div>
          {sublabel && (
            <div style={{ fontSize: size * 0.09, fontWeight:300, color: theme.textMuted, marginTop:2 }}>{sublabel}</div>
          )}
        </div>
      </div>
      {label && <div style={{ fontSize:12, fontWeight:400, color:theme.textSecondary }}>{label}</div>}
    </div>
  );
}
