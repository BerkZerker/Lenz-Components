import { useState } from 'react';
import { radius, FONT_FAMILY } from '../../config/theme';

export default function DatePicker({ theme, value, onChange, style = {} }) {
  const [viewDate, setViewDate] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7; // Shift so Monday=0
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const monthYearLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const today = new Date();

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < startOffset || i >= startOffset + daysInMonth) {
      cells.push(null);
    } else {
      cells.push(i - startOffset + 1);
    }
  }

  return (
    <div style={{ ...style }}>
      {/* Header: month/year with nav arrows */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          style={{
            width: 28,
            height: 28,
            borderRadius: radius.pill,
            border: 'none',
            cursor: 'pointer',
            background: theme.surface2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{
          fontSize: 14,
          fontWeight: 500,
          color: theme.textPrimary,
          fontFamily: FONT_FAMILY,
        }}>
          {monthYearLabel}
        </div>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          style={{
            width: 28,
            height: 28,
            borderRadius: radius.pill,
            border: 'none',
            cursor: 'pointer',
            background: theme.surface2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
        marginBottom: 4,
      }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} style={{
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 500,
            color: theme.textMuted,
            padding: '4px 0',
            fontFamily: FONT_FAMILY,
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
      }}>
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;

          const isSelected = value.getFullYear() === year && value.getMonth() === month && value.getDate() === cell;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === cell;

          return (
            <button
              key={i}
              onClick={() => onChange(new Date(year, month, cell))}
              aria-label={`${cell} ${monthYearLabel}`}
              aria-current={isToday ? 'date' : undefined}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: radius.lg,
                border: 'none',
                cursor: 'pointer',
                background: isSelected ? theme.accent : isToday ? theme.accentFaint : 'transparent',
                color: isSelected ? 'white' : isToday ? theme.accent : theme.textPrimary,
                fontSize: 12,
                fontWeight: isSelected || isToday ? 500 : 400,
                fontFamily: FONT_FAMILY,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>
    </div>
  );
}
