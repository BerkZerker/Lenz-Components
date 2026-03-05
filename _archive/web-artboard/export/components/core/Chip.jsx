import { useState } from 'react';
import { radius, FONT_FAMILY } from '../../config/theme';

export default function Chip({ theme, label, active = false, onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      role="option"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: radius.pill,
        border: 'none',
        cursor: 'pointer',
        padding: '5px 12px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        background: active
          ? theme.accentMuted
          : hovered
            ? theme.hoverOverlay
            : 'transparent',
        color: active ? theme.accent : theme.textMuted,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: FONT_FAMILY,
        transition: 'background 0.15s, color 0.15s',
        ...style,
      }}
    >
      {label}
    </button>
  );
}
