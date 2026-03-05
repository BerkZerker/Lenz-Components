import { useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { FONT_FAMILY, radius } from '../../config/theme';

export default function Dropdown({ theme, options, value, onChange, placeholder = 'Select...', style = {} }) {
  useEffect(() => {
    const id = 'radix-select-hl';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = `[role="option"][data-highlighted] { background: ${theme.hoverOverlay} !important; }`;
  }, [theme]);

  return (
    <div style={{ ...style }}>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          aria-label={placeholder}
          style={{
            all: 'unset',
            boxSizing: 'border-box',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '10px 12px',
            borderRadius: radius.md,
            background: theme.surface2,
            border: `1.5px solid ${theme.borderSubtle}`,
            color: value ? theme.textPrimary : theme.textMuted,
            fontSize: 13,
            fontWeight: 400,
            fontFamily: FONT_FAMILY,
            cursor: 'pointer',
            gap: 8,
          }}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.textMuted}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={4}
            style={{
              background: theme.surface1,
              border: `1px solid ${theme.glassBorder}`,
              borderRadius: radius.md,
              padding: 4,
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 200,
              overflow: 'hidden',
              minWidth: 'var(--radix-select-trigger-width)',
              maxHeight: 'var(--radix-select-content-available-height)',
            }}
          >
            <Select.Viewport style={{ padding: 0 }}>
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  style={{
                    all: 'unset',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: radius.sm,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 400,
                    color: theme.textPrimary,
                    fontFamily: FONT_FAMILY,
                    outline: 'none',
                    justifyContent: 'space-between',
                  }}
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <svg
                      width={12}
                      height={12}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={theme.accent}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
