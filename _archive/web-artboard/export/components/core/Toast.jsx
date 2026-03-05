import { useEffect } from 'react';
import { radius, FONT_FAMILY, MAX_WIDTH } from '../../config/theme';

export default function Toast({ theme, message, type = 'success', visible, onDismiss }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  useEffect(() => {
    const id = 'toast-slide-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes toastSlideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
      @keyframes toastSlideDown { from { transform: translateX(-50%) translateY(0); opacity: 1; } to { transform: translateX(-50%) translateY(20px); opacity: 0; } }
    `;
    document.head.appendChild(s);
  }, []);

  if (!visible) return null;

  const typeColors = {
    success: theme.accent,
    error: theme.danger,
    info: theme.info,
  };

  const typeColor = typeColors[type] || theme.accent;

  const typeIcons = {
    success: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx={12} cy={12} r={10} />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
    error: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    info: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx={12} cy={12} r={10} />
        <line x1={12} y1={16} x2={12} y2={12} />
        <line x1={12} y1={8} x2={12.01} y2={8} />
      </svg>
    ),
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        borderRadius: radius.md,
        background: typeColor,
        color: 'white',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: FONT_FAMILY,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        animation: 'toastSlideUp 0.25s ease-out',
        maxWidth: MAX_WIDTH - 40,
        pointerEvents: 'auto',
      }}
    >
      {typeIcons[type] || typeIcons.success}
      {message}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginLeft: 4,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <line x1={18} y1={6} x2={6} y2={18} />
          <line x1={6} y1={6} x2={18} y2={18} />
        </svg>
      </button>
    </div>
  );
}
