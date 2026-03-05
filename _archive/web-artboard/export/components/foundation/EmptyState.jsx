import { radius, FONT_FAMILY } from '../../config/theme';

export default function EmptyState({ theme, icon, title, description, style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.md,
            background: theme.accentFaint,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          {icon}
        </div>
      )}
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: theme.textPrimary,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 300,
          color: theme.textMuted,
          lineHeight: 1.5,
          maxWidth: 240,
        }}
      >
        {description}
      </div>
    </div>
  );
}
