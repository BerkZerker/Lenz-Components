import { useState } from 'react';
import { withAlpha, radius } from '../../config/theme';

const SIZES = {
  sm: 28,
  md: 36,
};

function getVariantStyles(theme, variant, hovered) {
  switch (variant) {
    case 'ghost':
      return {
        background: hovered ? theme.hoverOverlay : 'transparent',
        color: theme.textSecondary,
      };
    case 'danger':
      return {
        background: hovered
          ? withAlpha(theme.danger, 0.12)
          : withAlpha(theme.danger, 0.09),
        color: theme.danger,
      };
    default:
      return {
        background: hovered ? theme.hoverOverlay : theme.surface2,
        color: theme.textPrimary,
      };
  }
}

export default function IconButton({
  theme,
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  ariaLabel,
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const px = SIZES[size] || SIZES.md;
  const variantStyles = getVariantStyles(theme, variant, hovered);

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      onMouseEnter={() => { if (!disabled) setHovered(true); }}
      onMouseLeave={() => { if (!disabled) { setHovered(false); setPressed(false); } }}
      onMouseDown={() => { if (!disabled) setPressed(true); }}
      onMouseUp={() => { if (!disabled) setPressed(false); }}
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: px,
        height: px,
        borderRadius: radius.pill,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        transition: 'background 0.15s, opacity 0.1s',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
        ...variantStyles,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
