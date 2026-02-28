export default function ProgressBar({ theme, completed, total }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize:14, fontWeight:300, color:theme.textPrimary }}>
          {completed}<span style={{ color:theme.textMuted }}> / {total}</span>
        </span>
      </div>
      <div style={{ height:10, borderRadius:9999, background:theme.borderSubtle, overflow:'hidden' }}>
        <div style={{ height:10, borderRadius:9999, background:theme.accent, width:`${pct}%`, transition:'width 0.42s ease' }} />
      </div>
    </div>
  );
}
