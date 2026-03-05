import { useEffect } from 'react';
import { radius } from '../../config/theme';

const VARIANT_DEFAULTS = {
  text: { width: '100%', height: 14, borderRadius: 6 },
  card: { width: '100%', height: 80, borderRadius: radius.md },
  circle: { width: 40, height: 40, borderRadius: radius.pill },
};

export default function Skeleton({ theme, variant = 'text', width, height, style = {} }) {
  useEffect(() => {
    const id = 'skeleton-shimmer-kf';
    if (document.getElementById(id)) return;
    const styleEl = document.createElement('style');
    styleEl.id = id;
    styleEl.textContent = `@keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }`;
    document.head.appendChild(styleEl);
  }, []);

  const defaults = VARIANT_DEFAULTS[variant] || VARIANT_DEFAULTS.text;

  return (
    <div
      style={{
        width: width !== undefined ? width : defaults.width,
        height: height !== undefined ? height : defaults.height,
        borderRadius: defaults.borderRadius,
        background: `linear-gradient(90deg, ${theme.surface2} 25%, ${theme.surface3} 50%, ${theme.surface2} 75%)`,
        backgroundSize: '200px 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}
