export default function AIBannerPill({ theme }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'5px 12px 5px 10px', borderRadius:9999,
      background:theme.accentFaint, alignSelf:'flex-start',
    }}>
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z" />
        <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </svg>
      <span style={{ fontSize:12, fontWeight:500, color:theme.accent }}>Powered by on-device AI</span>
    </div>
  );
}
