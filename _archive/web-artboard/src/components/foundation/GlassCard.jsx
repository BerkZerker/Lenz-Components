export default function GlassCard({ theme, children, style = {} }) {
  return (
    <div style={{
      background: theme.glassBackground,
      border: `1px solid ${theme.glassBorder}`,
      borderRadius: 14,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      ...style,
    }}>
      {children}
    </div>
  );
}
