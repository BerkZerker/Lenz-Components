import { useState } from 'react';
import { FONT_FAMILY, radius } from '../../config/theme';

export default function SearchBar({ theme, value, onChange, placeholder = 'Search...', style = {} }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: radius.md,
        background: theme.surface2,
        border: `1.5px solid ${focused ? theme.accent : theme.borderSubtle}`,
        transition: 'border-color 0.15s',
        ...style,
      }}
    >
      {/* Search icon */}
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.textMuted}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <circle cx={11} cy={11} r={6} />
        <line x1={16.5} y1={16.5} x2={21} y2={21} />
      </svg>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: theme.textPrimary,
          fontSize: 13,
          fontWeight: 400,
          fontFamily: FONT_FAMILY,
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            width: 20,
            height: 20,
            borderRadius: radius.pill,
            border: 'none',
            cursor: 'pointer',
            background: theme.surface3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.textMuted}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1={18} y1={6} x2={6} y2={18} />
            <line x1={6} y1={6} x2={18} y2={18} />
          </svg>
        </button>
      )}
    </div>
  );
}
