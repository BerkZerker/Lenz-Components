import { useState, useEffect } from 'react';
import { radius, FONT_FAMILY } from '../../config/theme';

const SIZES = {
  sm: { padding: '6px 14px', fontSize: 12 },
  md: { padding: '10px 18px', fontSize: 13 },
};

function getVariantStyles(theme, variant, hovered) {
  switch (variant) {
    case 'secondary':
      return {
        background: hovered ? theme.surface3 : theme.surface2,
        color: theme.textPrimary,
      };
    case 'ghost':
      return {
        background: hovered ? theme.hoverOverlay : 'transparent',
        color: theme.textSecondary,
      };
    default:
      return {
        background: hovered ? theme.accentHover : theme.accent,
        color: 'white',
      };
  }
}

function Spinner({ variant, theme }) {
  const strokeColor = variant === 'primary' ? 'white' : theme.textPrimary;

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke={strokeColor}
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray="20 14"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Button({
  theme,
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;
  const sizeConfig = SIZES[size] || SIZES.md;
  const variantStyles = getVariantStyles(theme, variant, hovered);

  useEffect(() => {
    const id = 'btn-spin-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = '@keyframes spin { to { transform: rotate(360deg) } }';
    document.head.appendChild(s);
  }, []);

  return (
    <button
      onClick={onClick}
      aria-busy={loading}
      disabled={isDisabled}
      onMouseEnter={() => { if (!isDisabled) setHovered(true); }}
      onMouseLeave={() => { if (!isDisabled) { setHovered(false); setPressed(false); } }}
      onMouseDown={() => { if (!isDisabled) setPressed(true); }}
      onMouseUp={() => { if (!isDisabled) setPressed(false); }}
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        borderRadius: radius.md,
        border: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        fontWeight: 500,
        fontFamily: FONT_FAMILY,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        opacity: isDisabled ? 0.5 : pressed ? 0.88 : 1,
        transition: 'background 0.15s, opacity 0.1s, transform 0.1s',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        pointerEvents: loading ? 'none' : 'auto',
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        ...variantStyles,
        ...style,
      }}
    >
      {loading && <Spinner variant={variant} theme={theme} />}
      {children}
    </button>
  );
}
