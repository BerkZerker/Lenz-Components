import { useState } from 'react';
import { FONT_FAMILY, radius } from '../../config/theme';

export default function TextInput({ theme, label, value, onChange, placeholder = '', error, type = 'text', style = {} }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ ...style }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: theme.textSecondary,
            marginBottom: 6,
            display: 'block',
            fontFamily: FONT_FAMILY,
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px',
            borderRadius: radius.md,
            background: theme.surface2,
            border: `1.5px solid ${error ? theme.danger : focused ? theme.accent : theme.borderSubtle}`,
            color: theme.textPrimary,
            fontSize: 14,
            fontWeight: 400,
            fontFamily: FONT_FAMILY,
            outline: 'none',
            transition: 'border-color 0.15s',
            caretColor: theme.accent,
          }}
        />
      </div>
      {error && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 400,
            color: theme.danger,
            marginTop: 5,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
