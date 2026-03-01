import { useRef, useState, useLayoutEffect } from 'react';
import { FONT_FAMILY, radius } from '../../config/theme';

export default function SegmentedControl({ theme, options, value, onChange, style = {} }) {
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const idx = options.findIndex(o => o.value === value);
    if (idx < 0) return;
    const btn = container.children[idx];
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [value, options]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        borderRadius: radius.pill,
        background: theme.surface2,
        padding: 3,
        ...style,
      }}
    >
      {/* Sliding indicator */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 3,
          left: indicator.left,
          width: indicator.width,
          height: 'calc(100% - 6px)',
          borderRadius: radius.pill,
          background: theme.accent,
          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 0,
        }}
      />

      <div
        ref={containerRef}
        role="radiogroup"
        style={{
          display: 'flex',
          flex: 1,
          gap: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            role="radio"
            aria-checked={option.value === value}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              borderRadius: radius.pill,
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              background: 'transparent',
              color: option.value === value ? 'white' : theme.textMuted,
              fontSize: 11,
              fontWeight: 500,
              fontFamily: FONT_FAMILY,
              transition: 'color 0.2s',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
