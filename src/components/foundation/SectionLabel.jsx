export default function SectionLabel({ theme, children, style = {} }) {
  return (
    <div style={{
      fontSize:10, fontWeight:500, letterSpacing:'0.09em', textTransform:'uppercase',
      color:theme.textMuted, marginBottom:2, marginTop:4,
      ...style,
    }}>{children}</div>
  );
}
