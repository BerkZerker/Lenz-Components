import SparkleIcon from '../foundation/SparkleIcon';

export default function AIBannerPill({ theme, style = {} }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'5px 12px 5px 10px', borderRadius:9999,
      background:theme.accentFaint, alignSelf:'flex-start',
      ...style,
    }}>
      <SparkleIcon size={13} color={theme.accent} strokeWidth={2} />
      <span style={{ fontSize:12, fontWeight:500, color:theme.accent }}>Powered by on-device AI</span>
    </div>
  );
}
