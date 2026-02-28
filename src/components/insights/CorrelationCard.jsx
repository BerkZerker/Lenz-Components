import { TREND_COLORS } from '../../config/theme';
import GlassCard from '../foundation/GlassCard';
import MiniSparkline from '../charts/MiniSparkline';
import CorrelationIcon from './CorrelationIcon';

export default function CorrelationCard({ theme, correlation }) {
  const { type, headline, detail, sourceIcon, targetIcon, confidence, sparkline, sourceColor, targetColor } = correlation;
  const trendColor = TREND_COLORS[type] || TREND_COLORS.neutral;

  const typeConfig = {
    positive: { arrow: '\u2191', label: 'Positive correlation', bg: 'rgba(74,141,95,0.12)' },
    negative: { arrow: '\u2193', label: 'Negative correlation', bg: 'rgba(212,123,107,0.12)' },
    neutral:  { arrow: '\u2014', label: 'No correlation',       bg: 'rgba(107,159,212,0.12)' },
    caution:  { arrow: '\u26A0', label: 'Caution \u2014 emerging',   bg: 'rgba(201,160,74,0.12)' },
  };
  const cfg = typeConfig[type] || typeConfig.neutral;

  return (
    <GlassCard theme={theme} style={{ padding:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <div style={{
          width:34, height:34, borderRadius:10, background:sourceColor+'18',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <CorrelationIcon type={sourceIcon} color={sourceColor} size={18} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:3 }}>
          <div style={{ width:16, height:1.5, background:theme.border, borderRadius:1 }} />
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <path d="M2 5H8M6 3L8 5L6 7" stroke={trendColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ width:8, height:1.5, background:theme.border, borderRadius:1 }} />
        </div>
        <div style={{
          width:34, height:34, borderRadius:10, background:targetColor+'18',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <CorrelationIcon type={targetIcon} color={targetColor} size={18} />
        </div>
        <div style={{ flex:1 }} />
        <MiniSparkline data={sparkline} width={60} height={26} color={trendColor} />
      </div>

      <div style={{ fontSize:13, fontWeight:500, color:theme.textPrimary, marginBottom:4, lineHeight:1.35 }}>
        {headline}
      </div>

      <div style={{ fontSize:11, fontWeight:300, color:theme.textMuted, lineHeight:1.5, marginBottom:10 }}>
        {detail}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{
          padding:'3px 8px', borderRadius:9999, fontSize:10, fontWeight:500,
          background: cfg.bg,
          color: trendColor,
        }}>
          {cfg.arrow} {cfg.label}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{
            width:40, height:4, borderRadius:9999, background:theme.borderSubtle, overflow:'hidden',
          }}>
            <div style={{ width:`${confidence*100}%`, height:'100%', borderRadius:9999, background:theme.accent }} />
          </div>
          <span style={{ fontSize:10, fontWeight:400, color:theme.textMuted }}>{Math.round(confidence*100)}%</span>
        </div>
      </div>
    </GlassCard>
  );
}
