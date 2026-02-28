export default function BottomTabBar({ theme, activeTab, onTabChange }) {
  const tabs = [
    { id: 'today', label: 'Today', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x={3} y={4} width={18} height={18} rx={2} />
        <line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} />
        <line x1={3} y1={10} x2={21} y2={10} />
        <rect x={8} y={14} width={3} height={3} rx={0.5} fill={c} stroke="none" />
      </svg>
    )},
    { id: 'stats', label: 'Stats', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x={4} y={14} width={4} height={7} rx={1} />
        <rect x={10} y={8} width={4} height={13} rx={1} />
        <rect x={16} y={3} width={4} height={18} rx={1} />
      </svg>
    )},
    { id: 'insights', label: 'Insights', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z" />
        <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </svg>
    )},
    { id: 'more', label: 'More', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1={4} y1={6} x2={20} y2={6} /><line x1={4} y1={12} x2={20} y2={12} /><line x1={4} y1={18} x2={20} y2={18} />
      </svg>
    )},
  ];

  return (
    <div style={{
      background: theme.surface1, borderTop:`1px solid ${theme.glassBorder}`,
      display:'flex', padding:'8px 0 20px', position:'relative',
    }}>
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        const color = active ? theme.accent : theme.textMuted;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
            background:'none', border:'none', cursor:'pointer', padding:'4px 0',
            position:'relative',
          }}>
            {active && (
              <div style={{
                position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)',
                width:20, height:3, borderRadius:9999, background:theme.accent,
              }} />
            )}
            {tab.icon(color)}
            <span style={{ fontSize:10, fontWeight: active ? 500 : 400, color, fontFamily:'Inter, system-ui, sans-serif' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
