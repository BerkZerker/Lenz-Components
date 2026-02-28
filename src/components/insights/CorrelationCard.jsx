import { useState, useRef, useEffect } from 'react';
import { Drawer } from 'vaul';
import GlassCard from '../foundation/GlassCard';

export default function CorrelationCard({ theme, correlation }) {
  const { type, headline, detail, confidence, events } = correlation;
  const [open, setOpen] = useState(false);
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (!trackRef.current) return;
    const ro = new ResizeObserver(([e]) => setTrackWidth(e.contentRect.width));
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const id = 'vaul-drawer-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      [vaul-drawer] { touch-action: none; }
      [vaul-drawer][vaul-drawer-direction="bottom"] {
        transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
      }
    `;
    document.head.appendChild(style);
  }, []);

  const typeConfig = {
    positive: { label: 'Positive correlation', color: theme.accent,  glass: theme.accentGlass },
    negative: { label: 'Negative correlation', color: theme.danger,  glass: theme.danger + '18' },
    neutral:  { label: 'No correlation',       color: '#6b9fd4',     glass: 'rgba(107,159,212,0.12)' },
    caution:  { label: 'Caution — emerging',   color: '#c99a4a',     glass: 'rgba(201,154,74,0.12)' },
  };
  const cfg = typeConfig[type] || typeConfig.neutral;
  const typeColor = cfg.color;

  const hasEvents = events && events.length > 0;
  const sorted = hasEvents
    ? [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  // Compute proportional positions for dots
  const dotR = 4;
  const padX = dotR + 2;
  let positions = [];
  if (sorted.length > 0) {
    const timestamps = sorted.map(e => new Date(e.date).getTime());
    const minT = timestamps[0];
    const maxT = timestamps[timestamps.length - 1];
    const range = maxT - minT;
    if (sorted.length === 1 || range === 0) {
      positions = sorted.map((_, i) =>
        sorted.length === 1 ? 0.5 : i / (sorted.length - 1)
      );
    } else {
      positions = timestamps.map(t => (t - minT) / range);
    }
  }

  const svgH = 20;
  const cy = svgH / 2;

  return (
    <>
      <div onClick={hasEvents ? () => setOpen(true) : undefined} style={{ cursor: hasEvents ? 'pointer' : 'default' }}>
        <GlassCard theme={theme} style={{ padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: theme.textPrimary, lineHeight: 1.35, marginBottom: 4 }}>
            {headline}
          </div>

          <div style={{ fontSize: 11, fontWeight: 300, color: theme.textMuted, lineHeight: 1.5, marginBottom: 10 }}>
            {detail}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: hasEvents ? 10 : 0 }}>
            <div style={{
              padding: '3px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 500,
              background: cfg.glass,
              color: typeColor,
            }}>
              {cfg.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 40, height: 4, borderRadius: 9999, background: theme.borderSubtle, overflow: 'hidden',
              }}>
                <div style={{ width: `${confidence * 100}%`, height: '100%', borderRadius: 9999, background: typeColor }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 400, color: theme.textMuted }}>{Math.round(confidence * 100)}%</span>
            </div>
          </div>

          {hasEvents && (
            <>
              <div style={{
                borderTop: `1px solid ${theme.glassBorder}`,
                paddingTop: 10,
              }}>
                <div style={{ fontSize: 10, fontWeight: 400, color: theme.textMuted, marginBottom: 6 }}>
                  {sorted.length} occurrence{sorted.length !== 1 ? 's' : ''} · Tap to view →
                </div>

                <div ref={trackRef} style={{ width: '100%', height: svgH }}>
                  {trackWidth > 0 && (
                    <svg width={trackWidth} height={svgH} style={{ display: 'block' }}>
                      {positions.map((pos, i) => {
                        if (i === 0) return null;
                        const x1 = padX + positions[i - 1] * (trackWidth - padX * 2);
                        const x2 = padX + pos * (trackWidth - padX * 2);
                        return (
                          <line
                            key={`l${i}`}
                            x1={x1} y1={cy} x2={x2} y2={cy}
                            stroke={typeColor + '40'} strokeWidth={1.5} strokeLinecap="round"
                          />
                        );
                      })}
                      {positions.map((pos, i) => {
                        const cx = padX + pos * (trackWidth - padX * 2);
                        return (
                          <circle
                            key={`d${i}`}
                            cx={cx} cy={cy} r={dotR}
                            fill={typeColor}
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>
              </div>
            </>
          )}
        </GlassCard>
      </div>

      {hasEvents && (
        <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
          <Drawer.Portal>
            <Drawer.Overlay style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            }} />
            <Drawer.Content style={{
              position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              zIndex: 101, width: '100%', maxWidth: 420, maxHeight: '85vh',
              background: theme.surface1, borderRadius: '20px 20px 0 0',
              overflowY: 'auto', outline: 'none',
            }}>
              <Drawer.Handle style={{ background: theme.border }} />

              <div style={{ padding: '8px 20px 32px' }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: theme.textPrimary, marginBottom: 4 }}>
                  Correlation History
                </div>
                <div style={{ fontSize: 12, fontWeight: 300, color: theme.textMuted, marginBottom: 20, lineHeight: 1.4 }}>
                  {headline}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {sorted.map((event, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16, flexShrink: 0 }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: 9999,
                          background: typeColor, flexShrink: 0,
                          marginTop: 3,
                        }} />
                        {i < sorted.length - 1 && (
                          <div style={{
                            width: 1.5, flex: 1, minHeight: 16,
                            background: typeColor + '40',
                          }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < sorted.length - 1 ? 16 : 0, flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: theme.textMuted }}>
                          {formatDate(event.date)}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 400, color: theme.textPrimary, lineHeight: 1.4, marginTop: 2 }}>
                          {event.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
