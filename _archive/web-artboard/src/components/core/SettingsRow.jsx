import { FONT_FAMILY } from '../../config/theme';
import Toggle from './Toggle';

export default function SettingsRow({ theme, label, description, checked, onChange, style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        gap: 12,
        ...style,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: theme.textPrimary,
            fontFamily: FONT_FAMILY,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: theme.textMuted,
              marginTop: 2,
              lineHeight: 1.4,
              fontFamily: FONT_FAMILY,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <Toggle theme={theme} checked={checked} onChange={onChange} size="md" />
    </div>
  );
}
