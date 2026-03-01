import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../foundation/GlassCard';
import { getHabitColor, FONT_FAMILY } from '../../config/theme';

function CustomTooltip({ active, payload, theme, habits }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      padding: '6px 10px', borderRadius: 8,
      background: theme.surface1, border: `1px solid ${theme.borderSubtle}`,
      fontSize: 10, fontWeight: 500, color: theme.textPrimary,
      fontFamily: FONT_FAMILY,
      display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      {payload.map(entry => {
        const habit = habits.find(h => h.id === entry.dataKey);
        return (
          <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: entry.color, flexShrink: 0,
            }} />
            <span style={{ color: theme.textSecondary }}>{habit?.name ?? entry.dataKey}</span>
            <span style={{ marginLeft: 'auto', paddingLeft: 8 }}>{Math.round(entry.value * 100)}%</span>
          </div>
        );
      })}
    </div>
  );
}

const sliceData = (d, s) => s === 'week' ? d.slice(-7) : s === 'month' ? d.slice(-30) : d;
const getXLabels = (s) => s === 'week' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : s === 'month' ? ['W1','W2','W3','W4'] : ['Jan','Apr','Jul','Oct','Dec'];

export default function CompletionTrendChart({ theme, data, habits, style = {} }) {
  const [span, setSpan] = useState('week');
  const SPANS = [{ label:'Week', value:'week' }, { label:'Month', value:'month' }, { label:'Year', value:'year' }];

  const { chartData, tickMap } = useMemo(() => {
    const pts = sliceData(data, span).map((row, i) => ({ ...row, index: i }));
    const xlabels = getXLabels(span);
    const map = {};
    xlabels.forEach((lbl, li) => {
      const idx = pts.length <= 1 ? 0 : Math.round(li / (xlabels.length - 1) * (pts.length - 1));
      map[idx] = lbl;
    });
    return { chartData: pts, tickMap: map };
  }, [data, span]);

  return (
    <GlassCard theme={theme} style={{ padding: 20, ...style }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: theme.textPrimary, marginBottom: 12 }}>Completion Trend</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {SPANS.map(s => (
          <button key={s.value} onClick={() => setSpan(s.value)} style={{
            borderRadius: 9999, border: 'none', cursor: 'pointer', padding: '4px 12px',
            background: span === s.value ? theme.accentMuted : 'transparent',
            color: span === s.value ? theme.accent : theme.textMuted,
            fontSize: 11, fontWeight: 400, fontFamily: FONT_FAMILY,
            transition: 'background 0.15s, color 0.15s',
          }}>{s.label}</button>
        ))}
      </div>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid horizontal vertical={false} stroke={theme.textMuted} strokeOpacity={0.25} strokeDasharray="4 3" />
            <XAxis
              dataKey="index"
              type="number"
              domain={[0, chartData.length - 1]}
              ticks={Object.keys(tickMap).map(Number)}
              tickFormatter={v => tickMap[v] || ''}
              tick={{ fontSize: 9, fill: theme.textMuted, fontFamily: FONT_FAMILY }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.5, 1]}
              tickFormatter={v => Math.round(v * 100) + '%'}
              tick={{ fontSize: 9, fill: theme.textMuted, fontFamily: FONT_FAMILY }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip theme={theme} habits={habits} />}
              cursor={{ stroke: theme.textSecondary, strokeWidth: 1, strokeOpacity: 0.6 }}
            />
            {habits.map(h => {
              const color = getHabitColor(h.colorId).primary;
              return (
                <Line
                  key={h.id}
                  type="monotone"
                  dataKey={h.id}
                  stroke={color}
                  strokeWidth={1.25}
                  dot={false}
                  activeDot={{ r: 3, fill: theme.surface1, stroke: color, strokeWidth: 1.25 }}
                  animationDuration={500}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10 }}>
        {habits.map(h => {
          const color = getHabitColor(h.colorId).primary;
          return (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 14, height: 0, borderTop: `2px solid ${color}`, flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: theme.textMuted, fontFamily: FONT_FAMILY }}>{h.name}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
