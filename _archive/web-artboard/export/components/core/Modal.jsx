import { Drawer } from 'vaul';
import { withAlpha, radius, FONT_FAMILY, MAX_WIDTH } from '../../config/theme';

export default function Modal({ theme, open, onOpenChange, title, children, actions = [] }) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <Drawer.Portal>
        <Drawer.Overlay style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: theme.scrim,
          backdropFilter: 'blur(4px)',
        }} />
        <Drawer.Content style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 101,
          width: '100%',
          maxWidth: MAX_WIDTH,
          maxHeight: '85vh',
          background: theme.surface1,
          borderRadius: '20px 20px 0 0',
          overflowY: 'auto',
          outline: 'none',
        }}>
          <Drawer.Handle style={{ background: theme.border }} />
          <div style={{ padding: '8px 20px 32px' }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 18,
                fontWeight: 500,
                color: theme.textPrimary,
                fontFamily: FONT_FAMILY,
              }}>
                {title}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.pill,
                  border: 'none',
                  cursor: 'pointer',
                  background: theme.surface2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.textMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ marginBottom: actions.length > 0 ? 20 : 0 }}>
              {children}
            </div>

            {/* Action buttons */}
            {actions.length > 0 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {actions.map((action, i) => {
                  const variantStyles = {
                    primary: { background: theme.accent, color: 'white' },
                    secondary: { background: theme.surface2, color: theme.textPrimary },
                    danger: { background: withAlpha(theme.danger, 0.09), color: theme.danger },
                  };
                  const vs = variantStyles[action.variant || 'primary'];
                  return (
                    <button
                      key={i}
                      onClick={action.onClick}
                      style={{
                        flex: action.flex || (action.variant === 'danger' ? undefined : 1),
                        padding: '12px 16px',
                        borderRadius: radius.md,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: FONT_FAMILY,
                        ...vs,
                      }}
                    >
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
