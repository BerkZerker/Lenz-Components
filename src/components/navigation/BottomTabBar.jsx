import { useState, useEffect } from 'react';
import { noiseDots, TILE } from '../../config/noise';

const TABS = [
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

const PlusIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
    <line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} />
  </svg>
);

const MicIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x={9} y={2} width={6} height={12} rx={3} />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1={12} y1={17} x2={12} y2={21} />
    <line x1={8} y1={21} x2={16} y2={21} />
  </svg>
);

export default function BottomTabBar({ theme, mode, activeTab, onTabChange, onAddHabit, onVoiceNote, inline }) {
  const [fabHovered, setFabHovered] = useState(false);
  const [fabPressed, setFabPressed] = useState(false);

  // Inject pulse keyframe
  useEffect(() => {
    const id = 'fab-pulse-keyframe';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes fabPulse {
        0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.15); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const leftTabs = TABS.filter(t => t.id === 'today' || t.id === 'stats');
  const rightTabs = TABS.filter(t => t.id === 'insights' || t.id === 'more');

  const isMic = activeTab === 'insights';
  const fabAction = isMic ? onVoiceNote : onAddHabit;
  const fabScale = fabPressed ? 'scale(0.9)' : fabHovered ? 'scale(1.06)' : 'scale(1)';

  const noiseOpKey = mode === 'dark' ? 'opDark' : 'opLight';
  const insetShadowColor = mode === 'dark'
    ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
    : 'inset 0 1px 0 rgba(255,255,255,0.5)';

  const renderTab = (tab) => {
    const active = activeTab === tab.id;
    const color = active ? theme.accent : theme.textMuted;
    return (
      <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
        position: 'relative',
      }}>
        {/* Active glow rectangle behind icon */}
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 28, borderRadius: 12,
          background: active ? theme.accentGlass : 'transparent',
          transition: 'background 0.2s ease',
        }}>
          {tab.icon(color)}
        </div>
        <span style={{
          fontSize: 10, fontWeight: active ? 600 : 400, color,
          fontFamily: 'Inter, system-ui, sans-serif',
          transition: 'color 0.2s, font-weight 0.2s',
        }}>
          {tab.label}
        </span>
        {/* Glowing dot under label */}
        <div style={{
          width: 4, height: 4, borderRadius: 9999,
          background: active ? theme.accent : 'transparent',
          boxShadow: 'none',
          transition: 'background 0.2s, box-shadow 0.2s',
        }} />
      </button>
    );
  };

  return (
    <div style={{
      ...(inline ? {} : {
        position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)', maxWidth: 420, zIndex: 100,
      }),
    }}>
      <div style={{
        position: 'relative',
        background: theme.glassBackground,
        border: `1px solid ${theme.glassBorder}`,
        borderRadius: 22,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: `${insetShadowColor}, 0 8px 32px rgba(0,0,0,0.2)`,
        display: 'flex', alignItems: 'center',
        padding: '4px 0',
        overflow: 'hidden',
      }}>
        {/* Noise overlay */}
        <svg style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', opacity: 0.5,
        }}>
          <defs>
            <pattern id="tabbar-noise" x={0} y={0} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
              {noiseDots.map((d, i) => (
                <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={mode === 'dark' ? '#fff' : '#000'} opacity={d[noiseOpKey]} />
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tabbar-noise)" />
        </svg>

        {/* Left tabs */}
        <div style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 1 }}>
          {leftTabs.map(renderTab)}
        </div>

        {/* Center FAB */}
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 64, flexShrink: 0, zIndex: 1,
        }}>
          <button
            onClick={fabAction}
            onMouseEnter={() => setFabHovered(true)}
            onMouseLeave={() => { setFabHovered(false); setFabPressed(false); }}
            onMouseDown={() => setFabPressed(true)}
            onMouseUp={() => setFabPressed(false)}
            style={{
              width: 54, height: 54, borderRadius: 9999,
              background: theme.accent,
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transform: fabScale,
              transition: 'transform 0.15s ease',
            }}
          >
            {isMic ? <MicIcon /> : <PlusIcon />}
          </button>
        </div>

        {/* Right tabs */}
        <div style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 1 }}>
          {rightTabs.map(renderTab)}
        </div>
      </div>
    </div>
  );
}
