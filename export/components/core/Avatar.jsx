import { useState } from 'react';
import { radius, FONT_FAMILY } from '../../config/theme';

const SIZES = {
  sm: { px: 24, fontSize: 10 },
  md: { px: 32, fontSize: 12 },
  lg: { px: 40, fontSize: 14 },
};

function getInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ theme, name, src, size = 'md', style = {} }) {
  const [imgError, setImgError] = useState(false);
  const config = SIZES[size] || SIZES.md;
  const showImage = src && !imgError;

  return (
    <div
      style={{
        width: config.px,
        height: config.px,
        borderRadius: radius.pill,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: showImage ? 'transparent' : theme.surface3,
        ...style,
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span
          style={{
            fontSize: config.fontSize,
            fontWeight: 500,
            fontFamily: FONT_FAMILY,
            color: theme.textSecondary,
            lineHeight: 1,
          }}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
