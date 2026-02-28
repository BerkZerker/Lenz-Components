import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../foundation/GlassCard';

function CustomTooltip({ active, payload, theme }) {
  if (!active || !payload?.[0]) return null;
  const pct = Math.round(payload[0].value * 100);
  return (
    <div style={{
      padding: '4px 8px', borderRadius: 6,
      background: theme.surface1, border: `1px solid ${theme.borderSubtle}`,
      fontSize: 10, fontWeight: 500, color: theme.textPrimary,
      fontFamily: 'Inter, sans-serif',
    }}>
      {pct}%
    </div>
  );
}

export default function CompletionTrendChart({ theme, data, uid }) {
  const [span, setSpan] = useState('week');
  const SPANS = [{ label:'Week', value:'week' }, { label:'Month', value:'month' }, { label:'Year', value:'year' }];
  const sliceData = (d, s) => s === 'week' ? d.slice(-7) : s === 'month' ? d.slice(-30) : d;
  const getXLabels = (s) => s === 'week' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : s === 'month' ? ['W1','W2','W3','W4'] : ['Jan','Apr','Jul','Oct','Dec'];

  const chartData = useMemo(() => {
    const pts = sliceData(data, span);
    const xlabels = getXLabels(span);
    return pts.map((v, i) => {
      let label = '';
      if (pts.length > 1) {
        const labelIdx = Math.round(i / (pts.length - 1) * (xlabels.length - 1));
        const dataIdxForLabel = Math.round(labelIdx / (xlabels.length - 1) * (pts.length - 1));
        if (i === dataIdxForLabel) label = xlabels[labelIdx];
      } else {
        label = xlabels[0] || '';
      }
      return { index: i, value: v, label };
    });
  }, [data, span]);

  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:400, color:theme.textPrimary, marginBottom:12 }}>Completion Trend</div>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {SPANS.map(s => (
          <button key={s.value} onClick={() => setSpan(s.value)} style={{
            borderRadius:9999, border:'none', cursor:'pointer', padding:'4px 12px',
            background: span===s.value ? theme.accentMuted : 'transparent',
            color: span===s.value ? theme.accent : theme.textMuted,
            fontSize:11, fontWeight:400, fontFamily:'Inter, system-ui, sans-serif',
            transition:'background 0.15s, color 0.15s',
          }}>{s.label}</button>
        ))}
      </div>
      <div style={{ width:280, height:160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top:8, right:8, bottom:0, left:-10 }}>
            <CartesianGrid horizontal vertical={false} stroke={theme.borderSubtle} strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize:9, fill:theme.textMuted, fontFamily:'Inter,sans-serif' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.5, 1]}
              tickFormatter={v => Math.round(v * 100) + '%'}
              tick={{ fontSize:9, fill:theme.textMuted, fontFamily:'Inter,sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip theme={theme} />}
              cursor={{ stroke: theme.borderSubtle, strokeDasharray: '3 2' }}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={theme.accent}
              strokeWidth={2}
              dot={false}
              activeDot={{ r:4, fill:theme.surface1, stroke:theme.accent, strokeWidth:2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
