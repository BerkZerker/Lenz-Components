export default function Divider({ theme, style = {} }) {
  return (
    <div
      style={{
        height: 1,
        background: theme.borderSubtle,
        width: '100%',
        ...style,
      }}
    />
  );
}
