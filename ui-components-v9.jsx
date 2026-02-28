import { useState, useRef, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// LENZ HABIT TRACKER — UI COMPONENT LIBRARY
// ═══════════════════════════════════════════════════════════════════════════
//
// EXISTING COMPONENTS (implemented below):
//   - Theme system (dark/light with THEMES object)
//   - NoiseBackground, GlassCard
//   - ProgressBar, Checkmark, HabitCard, AddHabitButton, FAB
//   - InsightCard, HabitBarChart, CompletionTrendChart
//   - CalendarHeatmap, StreakLeaderboard
//   - PaletteSwatches, Toggle, ToggleShowcase, ColorTokens
//   - RadialProgress, RadialProgressShowcase
//   - WeeklyGrid
//   - VoiceNoteCard (center-mirrored animated bars)
//   - BottomTabBar (platform-neutral 4-tab)
//   - HabitDetailModal (bottom sheet with stats, weekly grid, voice note)
//   - AIBannerPill, MiniSparkline, CorrelationCard (4-type: positive/negative/neutral/caution)
//   - SensitivitySlider
//
// ═══════════════════════════════════════════════════════════════════════════
// TODO: COMPONENTS ROADMAP
// ═══════════════════════════════════════════════════════════════════════════
//
// ─── Onboarding & Empty States ─────────────────────────────────────────────
//
// TODO: OnboardingCarousel
//   - 3-4 swipeable cards introducing key features (AI insights, voice notes, privacy)
//   - Dot indicators for current page
//   - "Get Started" CTA on final card
//   - Should feel premium — use glass morphism + accent gradients
//
// TODO: EmptyStateCard
//   - Illustration placeholder + call-to-action
//   - Variants needed for: habits list, voice notes, insights, stats
//   - Examples: "Add your first habit", "Record a voice note to get started"
//   - "No insights yet — keep tracking for 3 more days"
//   - Reuse GlassCard as base, centered layout with icon + text + button
//
// TODO: PermissionRequestCard
//   - Styled prompt for HealthKit/Health Connect, microphone, notifications, calendar
//   - Each card explains WHY the permission is needed (privacy-first messaging)
//   - Accept + "Maybe Later" actions
//   - Icon representing the data source (heart for health, mic for voice, bell for notifs)
//
// ─── Data Integration Cards ────────────────────────────────────────────────
//
// TODO: HealthDataCard
//   - Compact card showing pulled-in HealthKit/Health Connect metrics
//   - Displays: steps, sleep hours, heart rate, active energy
//   - Source badge ("HealthKit" / "Health Connect")
//   - Mini sparkline per metric showing 7-day trend
//   - Feeds into correlation engine — should visually connect to CorrelationCard
//
// TODO: CalendarConflictsCard
//   - Shows today's calendar events alongside habit schedule
//   - Highlights conflicts: "Team standup (3-4pm) overlaps with your gym window"
//   - Suggests rescheduling or acknowledges the conflict
//   - Uses calendar icon + event color from user's calendar
//
// TODO: WeatherContextBadge
//   - Small inline indicator showing current weather conditions
//   - Temperature + icon (sun, cloud, rain, snow)
//   - Useful inside CorrelationCards and the Today screen header
//   - Subtle — should not dominate, just provide context
//
// ─── Habit Creation & Editing ──────────────────────────────────────────────
//
// TODO: HabitCreationModal
//   - Full creation flow triggered by AddHabitButton / FAB
//   - Fields: name input, color picker, category selector,
//     frequency picker, time-of-day, optional reminder toggle
//   - Bottom sheet style matching HabitDetailModal
//   - Validation: name required, at least one day selected
//
// TODO: ColorPickerRow
//   - Horizontal selectable row of the 8 HABIT_COLORS
//   - Checkmark overlay on the selected swatch
//   - Reusable inside HabitCreationModal and edit flows
//   - Current PaletteSwatches is display-only — this is interactive
//
// TODO: FrequencyPicker
//   - Day-of-week multi-select pills: M T W T F S S
//   - Tappable toggles with accent color fill when selected
//   - Presets: "Every day", "Weekdays", "Weekends", "Custom"
//   - Returns array like [1,1,1,1,1,0,0] matching WeeklyGrid format
//
// ─── Feedback & Micro-interactions ─────────────────────────────────────────
//
// TODO: Toast / Snackbar
//   - Slides up from bottom with auto-dismiss (3-4 seconds)
//   - Variants: success (green), info (blue), warning (amber), error (coral)
//   - Examples: "Meditation done! 15-day streak 🔥", "Habit deleted", "Undo"
//   - Optional action button (e.g., "Undo" for deletions)
//   - Use glass morphism background consistent with GlassCard
//
// TODO: StreakMilestoneCard
//   - Prominent celebration card for hitting milestones (7, 14, 21, 30, 60, 100 days)
//   - Larger than InsightCard — this is the dopamine hit that keeps users coming back
//   - Shows: milestone number, habit name + color, encouraging message
//   - Could include a mini confetti animation or glow effect
//
// TODO: ConfettiBurst
//   - Subtle particle animation when ALL habits are completed for the day
//   - Triggered once per day on final completion
//   - Uses habit palette colors for particles
//   - Canvas or SVG based, auto-cleans up after ~2 seconds
//
// ─── Settings & Utility ────────────────────────────────────────────────────
//
// TODO: SettingsRow
//   - Label + optional description + right accessory
//   - Accessory types: Toggle, chevron (navigation), value text, badge
//   - Consistent padding and dividers matching the Settings screen spec
//   - Examples: "Dark Mode" + toggle, "Export Data" + chevron, "Version" + "1.0.0"
//
// TODO: DestructiveConfirmationModal
//   - Bottom sheet for "Delete habit" / "Reset all data" / "Clear voice notes"
//   - Uses theme.danger color for the confirm button
//   - Requires explicit confirmation: "Type DELETE to confirm" or two-step tap
//   - Explains what will be lost
//
// TODO: ExportBackupCard
//   - Shows last backup date/time
//   - "Export Data" button (JSON export of all habits, streaks, voice note metadata)
//   - Reassurance copy: "All data stays on your device"
//   - Could show data size estimate
//
// ─── Plan / Schedule View ──────────────────────────────────────────────────
//
// TODO: DayPlanCard
//   - Timeline layout showing a day's habits with time slots
//   - Time markers on the left (7am, 8am, ..., 10pm)
//   - Habit blocks positioned at their scheduled time with color coding
//   - Completion status inline (checkmark or empty circle)
//   - "Now" indicator line showing current time
//
// TODO: TimeOfDayBreakdown
//   - Horizontal segmented bar: Morning / Afternoon / Evening
//   - Shows habit distribution per segment
//   - Completion rate per segment (e.g., "Morning: 4/5 — 80%")
//   - Helps users see when they're strongest/weakest
//   - Could be a stacked bar or three mini radial progress rings
//
// ═══════════════════════════════════════════════════════════════════════════

// ─── Theme ─────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: '#212121', surface1: '#282828', surface2: '#303030', surface3: '#353535',
    textPrimary: '#eeeeee', textSecondary: '#d0d0d0', textMuted: '#9a9a9a',
    border: '#3c3c3c', borderSubtle: '#303030',
    accent: '#4a8d5f', accentHover: '#55a06c',
    accentFaint: 'rgba(74,141,95,0.08)', accentMuted: 'rgba(74,141,95,0.16)',
    accentGlass: 'rgba(74,141,95,0.12)', danger: '#e05555',
    glassBackground: 'rgba(40,40,40,0.72)', glassBorder: 'rgba(255,255,255,0.06)',
  },
  light: {
    bg: '#f5f5f5', surface1: '#ffffff', surface2: '#ededed', surface3: '#e0e0e0',
    textPrimary: '#1a1a1a', textSecondary: '#3a3a3a', textMuted: '#606060',
    border: '#dcdcdc', borderSubtle: '#e8e8e8',
    accent: '#4a8d5f', accentHover: '#55a06c',
    accentFaint: 'rgba(74,141,95,0.08)', accentMuted: 'rgba(74,141,95,0.16)',
    accentGlass: 'rgba(74,141,95,0.12)', danger: '#d44444',
    glassBackground: 'rgba(255,255,255,0.72)', glassBorder: 'rgba(0,0,0,0.06)',
  },
};

// ─── Habit Color Palette ───────────────────────────────────────────────────
const HABIT_COLORS = [
  { id: 'sage',     label: 'Sage',     primary: '#7a9e7e' },
  { id: 'teal',     label: 'Teal',     primary: '#5b9ea6' },
  { id: 'sky',      label: 'Sky',      primary: '#6b9fd4' },
  { id: 'lavender', label: 'Lavender', primary: '#9585c1' },
  { id: 'coral',    label: 'Coral',    primary: '#d47b6b' },
  { id: 'amber',    label: 'Amber',    primary: '#c99a4a' },
  { id: 'rose',     label: 'Rose',     primary: '#c46b8a' },
  { id: 'slate',    label: 'Slate',    primary: '#7a8a9e' },
];
const getHabitColor = (id) => HABIT_COLORS.find(c => c.id === id) ?? HABIT_COLORS[0];

// ─── Noise Background ──────────────────────────────────────────────────────
const TILE = 80, STEP = 8;
function hashNoise(x, y) {
  let h = ((x * 374761393 + y * 668265263 + 1274126177) | 0);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}
const noiseDots = [];
for (let y = 0; y < TILE; y += STEP)
  for (let x = 0; x < TILE; x += STEP) {
    const r = hashNoise(x, y);
    noiseDots.push({ cx: x+1, cy: y+1, r: 0.3+r*0.4, opDark: 0.01+r*0.06, opLight: 0.01+r*0.05 });
  }

function NoiseBackground({ mode }) {
  const isDark = mode === 'dark';
  const base = isDark ? '255,255,255' : '0,0,0';
  const pid = `noise-${mode}`;
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
        <defs>
          <pattern id={pid} x="0" y="0" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            {noiseDots.map((d,i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={d.r}
                fill={`rgba(${base},${(isDark ? d.opDark : d.opLight).toFixed(3)})`} />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
    </div>
  );
}

// ─── GlassCard ─────────────────────────────────────────────────────────────
function GlassCard({ theme, children, style = {} }) {
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

// ─── ProgressBar ───────────────────────────────────────────────────────────
function ProgressBar({ theme, completed, total }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize:14, fontWeight:300, color:theme.textPrimary }}>
          {completed}<span style={{ color:theme.textMuted }}> / {total}</span>
        </span>
      </div>
      <div style={{ height:10, borderRadius:9999, background:theme.borderSubtle, overflow:'hidden' }}>
        <div style={{ height:10, borderRadius:9999, background:theme.accent, width:`${pct}%`, transition:'width 0.42s ease' }} />
      </div>
    </div>
  );
}

// ─── Checkmark ─────────────────────────────────────────────────────────────
function Checkmark({ checked, color, size = 21 }) {
  const PL = 16;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ display:'block' }}>
      <circle cx={10} cy={10} r={9} stroke={color} strokeWidth={1.2} fill="none" />
      <circle cx={10} cy={10} r={9} fill={color}
        style={{ opacity: checked ? 1 : 0, transition:'opacity 0.12s' }} />
      <path d="M6 10.5L8.5 13L14 7.5"
        stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={PL} strokeDashoffset={checked ? 0 : PL}
        style={{ transition:'stroke-dashoffset 0.15s ease' }} />
    </svg>
  );
}

// ─── HabitCard ─────────────────────────────────────────────────────────────
function HabitCard({ theme, habit, onToggle, isLast, onClick }) {
  const color = getHabitColor(habit.colorId).primary;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{
      display:'flex', alignItems:'center', padding:'13px 4px', gap:10,
      borderBottom: !isLast ? `1px solid ${theme.borderSubtle}` : undefined,
      background: pressed ? 'rgba(128,128,128,0.14)' : hovered ? 'rgba(128,128,128,0.08)' : 'transparent',
      transition:'background 0.1s',
      borderRadius:10, cursor:'pointer',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <div style={{ flexShrink:0, padding:2, cursor:'pointer' }} onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}>
        <Checkmark checked={habit.completed} color={color} size={21} />
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', gap:12, minWidth:0 }} onClick={() => onClick && onClick(habit)}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontSize:16, fontWeight:300,
            color: habit.completed ? theme.textMuted : theme.textPrimary,
            textDecoration: habit.completed ? 'line-through' : 'none',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:2,
          }}>{habit.name}</div>
          <div style={{ fontSize:11, fontWeight:300, color:theme.textMuted }}>{habit.category}</div>
        </div>
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none"
          stroke={theme.textMuted} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

// ─── InsightCard ───────────────────────────────────────────────────────────
function InsightCard({ theme, title, description }) {
  return (
    <div style={{
      borderRadius:14, border:`1px solid ${theme.glassBorder}`,
      background:theme.glassBackground, backdropFilter:'blur(20px)',
      WebkitBackdropFilter:'blur(20px)', padding:14,
      display:'flex', gap:12, alignItems:'flex-start',
    }}>
      <div style={{
        width:32, height:32, borderRadius:9, flexShrink:0,
        background:theme.accentFaint, display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
          stroke={theme.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z"/>
          <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>
        </svg>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:theme.textPrimary, marginBottom:3 }}>{title}</div>
        <div style={{ fontSize:12, fontWeight:300, color:theme.textMuted, lineHeight:1.45 }}>{description}</div>
      </div>
    </div>
  );
}

// ─── AddHabitButton ────────────────────────────────────────────────────────
function AddHabitButton({ theme }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:'100%', marginTop:12, padding:'14px',
        border:`1.5px dashed ${hovered ? theme.accent : theme.borderSubtle}`,
        borderRadius:14, background:'transparent',
        display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        cursor:'pointer', transition:'border-color 0.15s, color 0.15s',
        fontFamily:'Inter, system-ui, sans-serif',
      }}
    >
      <span style={{ fontSize:18, fontWeight:300, color: hovered ? theme.accent : theme.textMuted, lineHeight:1 }}>+</span>
      <span style={{ fontSize:13, fontWeight:400, color: hovered ? theme.accent : theme.textMuted }}>Add habit</span>
    </button>
  );
}

// ─── FAB ───────────────────────────────────────────────────────────────────
function FAB({ theme }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width:58, height:58, borderRadius:16, background:theme.accent, border:'none',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', boxShadow:'0 4px 14px rgba(0,0,0,0.35)',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
        transition:'transform 0.1s',
      }}
    >
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth={2.5} strokeLinecap="round">
        <line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} />
      </svg>
    </button>
  );
}

// ─── HabitBarChart ─────────────────────────────────────────────────────────
function HabitBarChart({ theme, data }) {
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Completion Rates</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.map(item => {
          const color = getHabitColor(item.colorId).primary;
          return (
            <div key={item.habitId} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:100, fontSize:11, fontWeight:300, color:theme.textSecondary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flexShrink:0 }}>
                {item.name}
              </div>
              <div style={{ flex:1, height:16, borderRadius:6, background:theme.borderSubtle, overflow:'hidden' }}>
                <div style={{ height:16, borderRadius:6, background:color, width:`${item.rate*100}%`, transition:'width 0.4s' }} />
              </div>
              <div style={{ width:32, fontSize:11, fontWeight:300, color:theme.textMuted, textAlign:'right', flexShrink:0 }}>
                {Math.round(item.rate*100)}%
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─── CompletionTrendChart ──────────────────────────────────────────────────
function CompletionTrendChart({ theme, data, uid }) {
  const [span, setSpan] = useState('week');
  const [hoverIdx, setHoverIdx] = useState(null);
  const svgRef = useRef(null);
  const SPANS = [{ label:'Week', value:'week' }, { label:'Month', value:'month' }, { label:'Year', value:'year' }];
  const sliceData = (d, s) => s === 'week' ? d.slice(-7) : s === 'month' ? d.slice(-30) : d;
  const getXLabels = (s) => s === 'week' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : s === 'month' ? ['W1','W2','W3','W4'] : ['Jan','Apr','Jul','Oct','Dec'];

  const CW=280, CH=160, PL=30, PR=8, PT=8, PB=20;
  const pts = sliceData(data, span);
  const plotW = CW - PL - PR, plotH = CH - PT - PB;
  const toX = i => PL + (i / Math.max(pts.length-1, 1)) * plotW;
  const toY = v => PT + (1-v) * plotH;

  let line = '';
  pts.forEach((v,i) => { line += `${i===0?'M':'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)} `; });
  const xlabels = getXLabels(span);
  const yPos = [PT, PT+plotH/2, PT+plotH];

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
      <svg ref={svgRef} width={CW} height={CH} style={{ cursor:'crosshair' }}
        onMouseMove={e => {
          const rect = svgRef.current.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          let closest = 0, closestDist = Infinity;
          pts.forEach((_,i) => { const d = Math.abs(toX(i) - mx); if(d < closestDist){ closestDist=d; closest=i; }});
          setHoverIdx(closest);
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {yPos.map((y,i) => (
          <line key={i} x1={PL} y1={y} x2={CW-PR} y2={y} stroke={theme.borderSubtle} opacity={0.5} />
        ))}
        {['100%','50%','0%'].map((label,i) => (
          <text key={label} x={PL-4} y={yPos[i]+3} textAnchor="end" fill={theme.textMuted} fontSize={9} fontFamily="Inter,sans-serif">{label}</text>
        ))}
        <path d={line} stroke={theme.accent} strokeWidth={2} fill="none" strokeLinejoin="round" />
        {hoverIdx !== null && (() => {
          const hx = toX(hoverIdx), hy = toY(pts[hoverIdx]);
          const label = Math.round(pts[hoverIdx]*100) + '%';
          const tipW = 36, tipH = 18, tipGap = 8;
          let tipX = hx - tipW/2;
          if(tipX < PL) tipX = PL;
          if(tipX + tipW > CW - PR) tipX = CW - PR - tipW;
          const tipY = hy - tipGap - tipH;
          return <>
            <line x1={hx} y1={PT} x2={hx} y2={PT+plotH} stroke={theme.borderSubtle} opacity={0.6} strokeDasharray="3,2" />
            <circle cx={hx} cy={hy} r={4} fill={theme.surface1} stroke={theme.accent} strokeWidth={2} />
            <g>
              <rect x={tipX} y={tipY} width={tipW} height={tipH} rx={4} fill={theme.surface1} stroke={theme.borderSubtle} strokeWidth={0.5} />
              <text x={tipX+tipW/2} y={tipY+tipH/2+3.5} textAnchor="middle" fill={theme.textPrimary} fontSize={10} fontWeight={500} fontFamily="Inter,sans-serif">{label}</text>
            </g>
          </>;
        })()}
        {xlabels.map((label,i) => {
          const x = PL + (i/Math.max(xlabels.length-1,1))*plotW;
          return <text key={i} x={x} y={CH-2} textAnchor="middle" fill={theme.textMuted} fontSize={9} fontFamily="Inter,sans-serif">{label}</text>;
        })}
      </svg>
    </GlassCard>
  );
}

// ─── CalendarHeatmap ───────────────────────────────────────────────────────
const CELL = 13, GAP_H = 3;
const DAY_LABELS = ['M','T','W','T','F','S','S'];
function cellColor(count, max, accent, subtle) {
  if (!count) return subtle;
  const r = count / max;
  if (r <= 0.25) return accent + '3d';
  if (r <= 0.50) return accent + '70';
  if (r <= 0.75) return accent + 'a6';
  return accent;
}

function CalendarHeatmap({ theme, data, maxCount }) {
  const firstDate = data.length > 0 ? new Date(data[0].date) : new Date();
  const startDay = (firstDate.getDay() + 6) % 7;
  const padded = [...Array.from({ length:startDay }, () => null), ...data];
  const weeks = [];
  for (let i=0; i<padded.length; i+=7) weeks.push(padded.slice(i, i+7));
  const last = weeks[weeks.length-1];
  while (last && last.length < 7) last.push(null);

  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Activity</div>
      <div style={{ display:'flex' }}>
        <div style={{ marginRight:GAP_H }}>
          {DAY_LABELS.map((d,i) => (
            <div key={i} style={{ width:14, height:CELL, marginBottom:GAP_H, display:'flex', alignItems:'center' }}>
              <span style={{ fontSize:10, fontWeight:300, color:theme.textMuted }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:GAP_H, overflowX:'auto' }}>
          {weeks.map((week,wi) => (
            <div key={wi} style={{ display:'flex', flexDirection:'column', gap:GAP_H }}>
              {week.map((day,di) => (
                <div key={di} style={{
                  width:CELL, height:CELL, borderRadius:2,
                  background: day ? cellColor(day.count, maxCount, theme.accent, theme.borderSubtle) : 'transparent',
                  flexShrink:0,
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:GAP_H, marginTop:12, justifyContent:'flex-end' }}>
        <span style={{ fontSize:10, fontWeight:300, color:theme.textMuted }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((r,i) => (
          <div key={i} style={{ width:CELL, height:CELL, borderRadius:2, background:cellColor(r*maxCount, maxCount, theme.accent, theme.borderSubtle) }} />
        ))}
        <span style={{ fontSize:10, fontWeight:300, color:theme.textMuted }}>More</span>
      </div>
    </GlassCard>
  );
}

// ─── StreakLeaderboard ─────────────────────────────────────────────────────
function StreakLeaderboard({ theme, habits }) {
  const sorted = useMemo(() => [...habits].sort((a,b) => b.streak - a.streak), [habits]);
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Streak Leaderboard</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {sorted.map((habit, idx) => {
          const color = getHabitColor(habit.colorId).primary;
          const rank = idx+1, top = rank <= 3;
          return (
            <div key={habit.id} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, width:24, flexShrink:0, color: top ? theme.accent : theme.textMuted, fontWeight: top ? 500 : 300 }}>
                #{rank}
              </span>
              <div style={{ width:10, height:10, borderRadius:5, background:color, flexShrink:0 }} />
              <span style={{ flex:1, fontSize:13, fontWeight:300, color:theme.textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {habit.name}
              </span>
              {habit.streak > 0 ? (
                <div style={{ display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>
                  <svg width={12} height={12} viewBox="0 0 24 24" strokeWidth={0}>
                    <path d="M12 2s-5 4.5-5 9a5 5 0 0010 0c0-1.5-.8-3-1.5-4 0 0-.5 2-2 2s-2-1.5-2-2.5C11.5 5.5 12 2 12 2z" fill={color}/>
                  </svg>
                  <span style={{ fontSize:11, fontWeight:500, color:theme.textSecondary }}>{habit.streak}</span>
                </div>
              ) : (
                <span style={{ fontSize:11, color:theme.textMuted }}>--</span>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─── Color Palette Swatch ──────────────────────────────────────────────────
function PaletteSwatches({ theme }) {
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Habit Color Palette</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
        {HABIT_COLORS.map(c => (
          <div key={c.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
            <div style={{ width:36, height:36, borderRadius:9999, background:c.primary }} />
            <span style={{ fontSize:9, fontWeight:400, color:theme.textMuted }}>{c.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────
function Toggle({ theme, checked, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(false);
  const sizes = { sm: { w:40, h:22, knob:16, pad:3 }, md: { w:48, h:26, knob:20, pad:3 }, lg: { w:56, h:30, knob:24, pad:3 } };
  const s = sizes[size] || sizes.md;
  return (
    <button
      onClick={onChange}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:'relative', width:s.w, height:s.h, borderRadius:9999, border:'none',
        background: checked ? theme.accentMuted : theme.border,
        cursor:'pointer', transition:'background 0.2s',
        opacity: hovered ? 0.85 : 1, flexShrink:0,
      }}
    >
      <div style={{
        position:'absolute', top:s.pad, left: checked ? s.w - s.knob - s.pad : s.pad,
        width:s.knob, height:s.knob, borderRadius:9999,
        background: checked ? theme.accent : theme.textMuted,
        transition:'left 0.2s ease, background 0.2s',
      }} />
    </button>
  );
}

// ─── Toggle Showcase ────────────────────────────────────────────────────────
function ToggleShowcase({ theme }) {
  const [vals, setVals] = useState({ a:true, b:false, c:true });
  const flip = k => setVals(v => ({ ...v, [k]:!v[k] }));
  const rows = [
    { key:'a', label:'Notifications', size:'sm' },
    { key:'b', label:'Auto-sync',     size:'md' },
    { key:'c', label:'Dark mode',     size:'lg' },
  ];
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Toggle</div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {rows.map(r => (
          <div key={r.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:300, color:theme.textPrimary }}>{r.label}</div>
              <div style={{ fontSize:10, fontWeight:300, color:theme.textMuted, marginTop:1 }}>Size: {r.size}</div>
            </div>
            <Toggle theme={theme} checked={vals[r.key]} onChange={() => flip(r.key)} size={r.size} />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Color Tokens ──────────────────────────────────────────────────────────
function ColorTokens({ theme }) {
  const tokens = [
    ['bg', theme.bg], ['surface1', theme.surface1], ['surface2', theme.surface2],
    ['textPrimary', theme.textPrimary], ['textSecondary', theme.textSecondary], ['textMuted', theme.textMuted],
    ['border', theme.border], ['borderSubtle', theme.borderSubtle],
    ['accent', theme.accent], ['accentFaint', theme.accentFaint],
    ['accentMuted', theme.accentMuted], ['danger', theme.danger],
    ['glassBackground', theme.glassBackground], ['glassBorder', theme.glassBorder],
  ];
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:12 }}>Color Tokens</div>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {tokens.map(([name, val]) => (
          <div key={name} style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:20, height:20, borderRadius:4, background:val, border:`1px solid ${theme.border}`, flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:300, color:theme.textMuted, flex:1 }}>{name}</span>
            <span style={{ fontSize:10, fontWeight:400, color:theme.textMuted, fontVariantNumeric:'tabular-nums' }}>{val}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Section Label ─────────────────────────────────────────────────────────
function SectionLabel({ theme, children }) {
  return (
    <div style={{
      fontSize:10, fontWeight:500, letterSpacing:'0.09em', textTransform:'uppercase',
      color:theme.textMuted, marginBottom:2, marginTop:4,
    }}>{children}</div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NEW COMPONENTS (v3)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Radial Progress ──────────────────────────────────────────────────────
function RadialProgress({ theme, value, total, size = 120, strokeWidth = 8, color, label, sublabel }) {
  const pct = total > 0 ? value / total : 0;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const c = size / 2;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ position:'relative', width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={theme.borderSubtle} strokeWidth={strokeWidth} />
          <circle cx={c} cy={c} r={r} fill="none" stroke={color || theme.accent}
            strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition:'stroke-dashoffset 0.6s ease' }} />
        </svg>
        <div style={{
          position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
        }}>
          <div style={{ fontSize: size * 0.22, fontWeight:600, color: theme.textPrimary, lineHeight:1 }}>
            {Math.round(pct * 100)}%
          </div>
          {sublabel && (
            <div style={{ fontSize: size * 0.09, fontWeight:300, color: theme.textMuted, marginTop:2 }}>{sublabel}</div>
          )}
        </div>
      </div>
      {label && <div style={{ fontSize:12, fontWeight:400, color:theme.textSecondary }}>{label}</div>}
    </div>
  );
}

function RadialProgressShowcase({ theme, habits }) {
  const completed = habits.filter(h => h.completed).length;
  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:16 }}>Radial Progress</div>
      <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:16 }}>
        <RadialProgress theme={theme} value={completed} total={habits.length} size={110} label="Today" sublabel={`${completed}/${habits.length}`} />
        <RadialProgress theme={theme} value={5} total={7} size={90} color="#6b9fd4" label="This Week" sublabel="5/7 days" strokeWidth={7} />
        <RadialProgress theme={theme} value={23} total={30} size={90} color="#d47b6b" label="This Month" sublabel="23/30 days" strokeWidth={7} />
      </div>
    </GlassCard>
  );
}

// ─── Weekly Grid ──────────────────────────────────────────────────────────
function WeeklyGrid({ theme, habits }) {
  const DAYS = ['M','T','W','T','F','S','S'];
  const [grid, setGrid] = useState(() =>
    habits.map(h => ({
      ...h,
      weekly: h.weekly || Array.from({ length: 7 }, () => Math.random() > 0.4 ? 1 : 0),
    }))
  );

  const toggleCell = (habitIdx, dayIdx) => {
    setGrid(prev => prev.map((h, i) => {
      if (i !== habitIdx) return h;
      const w = [...h.weekly];
      w[dayIdx] = w[dayIdx] ? 0 : 1;
      return { ...h, weekly: w };
    }));
  };

  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary, marginBottom:14 }}>Weekly Tracker</div>
      {/* Day headers */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:8 }}>
        <div style={{ width:100, flexShrink:0 }} />
        {DAYS.map((d, i) => (
          <div key={i} style={{ flex:1, textAlign:'center', fontSize:10, fontWeight:500, color:theme.textMuted }}>{d}</div>
        ))}
      </div>
      {/* Habit rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {grid.map((habit, hi) => {
          const color = getHabitColor(habit.colorId).primary;
          return (
            <div key={habit.id} style={{ display:'flex', alignItems:'center' }}>
              <div style={{
                width:100, flexShrink:0, fontSize:12, fontWeight:300, color:theme.textSecondary,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8,
              }}>{habit.name}</div>
              {habit.weekly.map((val, di) => (
                <div key={di} style={{ flex:1, display:'flex', justifyContent:'center' }}>
                  <button
                    onClick={() => toggleCell(hi, di)}
                    style={{
                      width:28, height:28, borderRadius:8, border:'none', cursor:'pointer',
                      background: val ? color + '30' : theme.borderSubtle,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'background 0.15s, transform 0.1s',
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {val ? (
                      <svg width={14} height={14} viewBox="0 0 20 20" fill="none">
                        <path d="M5 10.5L8.5 14L15 6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─── Voice Note Card ──────────────────────────────────────────────────────
function generateWaveform(n, seed = 1) {
  // Seeded pseudo-random for consistent waveforms per card
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff; };

  // 1. Generate smooth base using interpolated noise (speech-like cadence)
  const anchors = 8;
  const raw = [];
  for (let i = 0; i < anchors; i++) raw.push(0.15 + rand() * 0.7);
  const interpolated = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (anchors - 1);
    const lo = Math.floor(t);
    const hi = Math.min(lo + 1, anchors - 1);
    const f = t - lo;
    // Smooth hermite interpolation
    const f2 = f * f * (3 - 2 * f);
    interpolated.push(raw[lo] * (1 - f2) + raw[hi] * f2);
  }

  // 2. Apply amplitude envelope (fade in, sustain, fade out — like real speech)
  const env = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let e = 1;
    if (t < 0.06) e = t / 0.06;              // quick attack
    else if (t > 0.92) e = (1 - t) / 0.08;   // gentle release
    env.push(e);
  }

  // 3. Add micro-variation (high-freq jitter like real waveform detail)
  const bars = [];
  for (let i = 0; i < n; i++) {
    const jitter = 1 + (rand() - 0.5) * 0.35;
    // Occasional dips to simulate pauses between words/phrases
    const pause = (rand() < 0.1) ? 0.3 + rand() * 0.25 : 1;
    const val = interpolated[i] * env[i] * jitter * pause;
    bars.push(Math.max(0.06, Math.min(1, val)));
  }
  return bars;
}

function VoiceNoteCard({ theme, habitName, duration = '0:42', timestamp = '7:15 AM', color, seed = 1, transcription }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const waveform = useMemo(() => generateWaveform(28, seed), [seed]);
  const intervalRef = useRef(null);
  const animRef = useRef(null);

  const togglePlay = () => {
    if (playing) {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(animRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      const start = Date.now();
      const totalMs = 4000;
      const animate = () => {
        const elapsed = Date.now() - start;
        const p = elapsed / totalMs;
        if (p >= 1) {
          setProgress(0);
          setPlaying(false);

          return;
        }
        setProgress(p);

        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => () => {
    clearInterval(intervalRef.current);
    cancelAnimationFrame(animRef.current);
  }, []);

  const accentColor = color || theme.accent;
  const barCount = waveform.length;
  const BAR_W = 3;
  const BAR_GAP = 2;
  const MAX_H = 36;
  const svgW = barCount * (BAR_W + BAR_GAP) - BAR_GAP;
  const svgH = MAX_H;
  const midY = svgH / 2;

  const transcript = transcription || "Had a really good morning session today. Felt focused after about 5 minutes and...";

  return (
    <GlassCard theme={theme} style={{ padding:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
        <div style={{
          width:28, height:28, borderRadius:8, flexShrink:0,
          background: accentColor + '18', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x={9} y={1} width={6} height={12} rx={3} />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1={12} y1={19} x2={12} y2={23} />
            <line x1={8} y1={23} x2={16} y2={23} />
          </svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:500, color:theme.textPrimary }}>{habitName}</div>
          <div style={{ fontSize:10, fontWeight:300, color:theme.textMuted }}>{timestamp}</div>
        </div>
        <div style={{ fontSize:11, fontWeight:400, color:theme.textMuted, fontVariantNumeric:'tabular-nums' }}>{duration}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {/* Play / Pause */}
        <button onClick={togglePlay} style={{
          width:36, height:36, borderRadius:9999, border:'none', cursor:'pointer',
          background: accentColor, display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0, transition:'transform 0.1s',
        }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {playing ? (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
              <rect x={6} y={4} width={4} height={16} rx={1} />
              <rect x={14} y={4} width={4} height={16} rx={1} />
            </svg>
          ) : (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
              <polygon points="7,3 20,12 7,21" />
            </svg>
          )}
        </button>
        {/* Center-mirrored bar waveform */}
        <div style={{ flex:1, display:'flex', justifyContent:'center', overflow:'hidden' }}>
          <svg width={svgW} height={svgH} style={{ display:'block' }}>
            {waveform.map((amp, i) => {
              const x = i * (BAR_W + BAR_GAP);
              const barProgress = i / barCount;
              const isPlayed = barProgress < progress;

              const halfH = amp * (MAX_H / 2 - 1);
              const barColor = isPlayed ? accentColor : theme.borderSubtle;

              return (
                <rect
                  key={i}
                  x={x}
                  y={midY - halfH}
                  width={BAR_W}
                  height={halfH * 2}
                  rx={1.5}
                  fill={barColor}
                />
              );
            })}
          </svg>
        </div>
        {/* Done / confirm button when playing */}
        {playing && (
          <div style={{
            width:36, height:36, borderRadius:9999, flexShrink:0,
            background: theme.surface2, display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
      {/* Transcription preview */}
      <div style={{
        marginTop:10, padding:'8px 10px', borderRadius:8,
        background: theme.surface2, fontSize:11, fontWeight:300,
        color:theme.textMuted, lineHeight:1.5, fontStyle:'italic',
      }}>
        "{transcript}"
      </div>
    </GlassCard>
  );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────
function BottomTabBar({ theme, activeTab, onTabChange }) {
  const tabs = [
    { id: 'today', label: 'Today', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x={3} y={4} width={18} height={18} rx={2} />
        <line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} />
        <line x1={3} y1={10} x2={21} y2={10} />
        <rect x={8} y={14} width={3} height={3} rx={0.5} fill={c} stroke="none" />
      </svg>
    )},
    { id: 'stats', label: 'Stats', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x={4} y={14} width={4} height={7} rx={1} />
        <rect x={10} y={8} width={4} height={13} rx={1} />
        <rect x={16} y={3} width={4} height={18} rx={1} />
      </svg>
    )},
    { id: 'insights', label: 'Insights', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z" />
        <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </svg>
    )},
    { id: 'more', label: 'More', icon: (c) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1={4} y1={6} x2={20} y2={6} /><line x1={4} y1={12} x2={20} y2={12} /><line x1={4} y1={18} x2={20} y2={18} />
      </svg>
    )},
  ];

  return (
    <div style={{
      background: theme.surface1, borderTop:`1px solid ${theme.glassBorder}`,
      display:'flex', padding:'8px 0 20px', position:'relative',
    }}>
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        const color = active ? theme.accent : theme.textMuted;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
            background:'none', border:'none', cursor:'pointer', padding:'4px 0',
            position:'relative',
          }}>
            {active && (
              <div style={{
                position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)',
                width:20, height:3, borderRadius:9999, background:theme.accent,
              }} />
            )}
            {tab.icon(color)}
            <span style={{ fontSize:10, fontWeight: active ? 500 : 400, color, fontFamily:'Inter, system-ui, sans-serif' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Habit Detail Modal ───────────────────────────────────────────────────
function HabitDetailModal({ theme, habit, onClose }) {
  if (!habit) return null;
  const color = getHabitColor(habit.colorId).primary;
  const weekly = habit.weekly || [1,1,0,1,1,1,0];
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const completionRate = Math.round((weekly.filter(Boolean).length / 7) * 100);

  // mock 30-day mini trend
  const miniTrend = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) arr.push(Math.random() > 0.35 ? 1 : 0);
    return arr;
  }, []);

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      display:'flex', alignItems:'flex-end', justifyContent:'center',
    }} onClick={onClose}>
      {/* Backdrop */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }} />
      {/* Modal sheet */}
      <div onClick={e => e.stopPropagation()} style={{
        position:'relative', width:'100%', maxWidth:420, maxHeight:'85vh',
        background:theme.surface1, borderRadius:'20px 20px 0 0',
        overflowY:'auto', zIndex:101,
      }}>
        {/* Drag handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 4px' }}>
          <div style={{ width:36, height:4, borderRadius:9999, background:theme.border }} />
        </div>

        <div style={{ padding:'8px 20px 32px' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:color+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:16, height:16, borderRadius:9999, background:color }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:20, fontWeight:500, color:theme.textPrimary }}>{habit.name}</div>
              <div style={{ fontSize:12, fontWeight:300, color:theme.textMuted }}>{habit.category}</div>
            </div>
            <button onClick={onClose} style={{
              width:32, height:32, borderRadius:9999, border:'none', cursor:'pointer',
              background:theme.surface2, display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2} strokeLinecap="round">
                <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display:'flex', gap:12, marginBottom:20 }}>
            {[
              { label:'Streak', value:habit.streak, suffix:' days' },
              { label:'This Week', value:`${weekly.filter(Boolean).length}/7` },
              { label:'Rate', value:`${completionRate}%` },
            ].map(stat => (
              <div key={stat.label} style={{
                flex:1, padding:'12px 10px', borderRadius:12, background:theme.surface2,
                textAlign:'center',
              }}>
                <div style={{ fontSize:18, fontWeight:600, color:theme.textPrimary, lineHeight:1.2 }}>
                  {stat.value}{stat.suffix || ''}
                </div>
                <div style={{ fontSize:10, fontWeight:300, color:theme.textMuted, marginTop:3 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Radial + Weekly side by side */}
          <div style={{ display:'flex', gap:16, marginBottom:20, alignItems:'center' }}>
            <RadialProgress theme={theme} value={weekly.filter(Boolean).length} total={7} size={88} strokeWidth={7} color={color} sublabel={`${weekly.filter(Boolean).length}/7`} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:500, color:theme.textMuted, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>This Week</div>
              <div style={{ display:'flex', gap:4 }}>
                {DAYS.map((day, i) => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                    <div style={{
                      width:28, height:28, borderRadius:8,
                      background: weekly[i] ? color+'30' : theme.borderSubtle,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {weekly[i] ? (
                        <svg width={12} height={12} viewBox="0 0 20 20" fill="none">
                          <path d="M5 10.5L8.5 14L15 6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </div>
                    <span style={{ fontSize:9, fontWeight:400, color:theme.textMuted }}>{day.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 30-day mini calendar */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:500, color:theme.textMuted, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Last 30 Days</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
              {miniTrend.map((val, i) => (
                <div key={i} style={{
                  width:14, height:14, borderRadius:3,
                  background: val ? color+'60' : theme.borderSubtle,
                }} />
              ))}
            </div>
          </div>

          {/* Voice note inside modal */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:500, color:theme.textMuted, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Voice Note</div>
            <VoiceNoteCard theme={theme} habitName={habit.name} duration="0:42" timestamp="7:15 AM" color={color} />
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:10 }}>
            <button style={{
              flex:1, padding:'12px', borderRadius:12, border:'none', cursor:'pointer',
              background:theme.accent, color:'white', fontSize:13, fontWeight:500,
              fontFamily:'Inter, system-ui, sans-serif',
            }}>Edit Habit</button>
            <button style={{
              padding:'12px 16px', borderRadius:12, border:'none', cursor:'pointer',
              background:theme.danger+'18', color:theme.danger, fontSize:13, fontWeight:500,
              fontFamily:'Inter, system-ui, sans-serif',
            }}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NEW COMPONENTS (v4) — AI / Insights
// ═══════════════════════════════════════════════════════════════════════════

// ─── AI Banner Pill ───────────────────────────────────────────────────────
function AIBannerPill({ theme }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'5px 12px 5px 10px', borderRadius:9999,
      background:theme.accentFaint, alignSelf:'flex-start',
    }}>
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z" />
        <path d="M18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </svg>
      <span style={{ fontSize:12, fontWeight:500, color:theme.accent }}>Powered by on-device AI</span>
    </div>
  );
}

// ─── Mini Sparkline (used inside Correlation Card) ────────────────────────
function MiniSparkline({ data, width = 64, height = 24, color, bgColor }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const areaPath = `M0,${height} L${pts.join(' L')} L${width},${height} Z`;
  return (
    <svg width={width} height={height} style={{ display:'block', flexShrink:0 }}>
      <path d={areaPath} fill={color + '18'} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Correlation Card ─────────────────────────────────────────────────────
// Trend colors: green=positive, coral=negative, blue=neutral, amber=caution
const TREND_COLORS = {
  positive: '#4a8d5f',
  negative: '#d47b6b',
  neutral:  '#6b9fd4',
  caution:  '#c9a04a',
};

const CORRELATION_DATA = [
  {
    id: '1',
    type: 'negative',
    headline: 'Gym completion ↓ 40% after meetings past 6pm',
    detail: 'On days with calendar events after 6pm, your gym habit drops from 78% to 38% completion.',
    sourceIcon: 'calendar',
    targetIcon: 'gym',
    confidence: 0.82,
    sparkline: [78, 72, 65, 55, 42, 38, 35, 40, 38],
    sourceColor: '#6b9fd4',
    targetColor: '#d47b6b',
  },
  {
    id: '2',
    type: 'positive',
    headline: 'Meditation + Journal stack → 92% completion',
    detail: 'When you meditate first, journal completion jumps from 58% to 92%. Consider pairing them.',
    sourceIcon: 'meditation',
    targetIcon: 'journal',
    confidence: 0.91,
    sparkline: [55, 62, 70, 78, 85, 88, 90, 91, 92],
    sourceColor: '#7a9e7e',
    targetColor: '#9585c1',
  },
  {
    id: '3',
    type: 'negative',
    headline: 'Sleep under 6hrs → reading streak breaks',
    detail: 'Your reading habit has a 73% failure rate on days following less than 6 hours of sleep.',
    sourceIcon: 'sleep',
    targetIcon: 'book',
    confidence: 0.68,
    sparkline: [80, 75, 60, 45, 30, 28, 25, 30, 27],
    sourceColor: '#7a8a9e',
    targetColor: '#6b9fd4',
  },
  {
    id: '4',
    type: 'neutral',
    headline: 'Weather has no effect on your reading habit',
    detail: 'Rain or shine, your reading completion stays around 72%. This habit is well-anchored.',
    sourceIcon: 'weather',
    targetIcon: 'book',
    confidence: 0.88,
    sparkline: [70, 73, 71, 74, 72, 70, 73, 72, 71],
    sourceColor: '#6b9fd4',
    targetColor: '#6b9fd4',
  },
  {
    id: '5',
    type: 'caution',
    headline: 'Weekend water intake trending down',
    detail: 'Your hydration habit has dropped 25% on weekends over the last 3 weeks. Early sign of a pattern shift.',
    sourceIcon: 'trending',
    targetIcon: 'water',
    confidence: 0.55,
    sparkline: [90, 88, 82, 78, 72, 68, 65, 63, 65],
    sourceColor: '#c9a04a',
    targetColor: '#5b9ea6',
  },
];

function CorrelationIcon({ type, color, size = 20 }) {
  const icons = {
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x={3} y={4} width={18} height={18} rx={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} />
      </svg>
    ),
    gym: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a2 2 0 013 0l8 8a2 2 0 01-3 3l-8-8a2 2 0 010-3z" />
        <path d="M3.5 14.5l2-2" /><path d="M20.5 9.5l-2 2" />
        <path d="M14.5 3.5l-2 2" /><path d="M9.5 20.5l2-2" />
      </svg>
    ),
    meditation: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={6} r={3} /><path d="M12 9v4" /><path d="M8 21c0-3 1.5-5 4-5s4 2 4 5" /><path d="M6 15c-1.5 1-2 3-2 6" /><path d="M18 15c1.5 1 2 3 2 6" />
      </svg>
    ),
    journal: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1={8} y1={7} x2={16} y2={7} /><line x1={8} y1={11} x2={14} y2={11} />
      </svg>
    ),
    sleep: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    weather: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
    trending: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    water: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
  };
  return icons[type] || icons.calendar;
}

function CorrelationCard({ theme, correlation }) {
  const { type, headline, detail, sourceIcon, targetIcon, confidence, sparkline, sourceColor, targetColor } = correlation;
  const trendColor = TREND_COLORS[type] || TREND_COLORS.neutral;

  const typeConfig = {
    positive: { arrow: '↑', label: 'Positive correlation', bg: 'rgba(74,141,95,0.12)' },
    negative: { arrow: '↓', label: 'Negative correlation', bg: 'rgba(212,123,107,0.12)' },
    neutral:  { arrow: '—', label: 'No correlation',       bg: 'rgba(107,159,212,0.12)' },
    caution:  { arrow: '⚠', label: 'Caution — emerging',   bg: 'rgba(201,160,74,0.12)' },
  };
  const cfg = typeConfig[type] || typeConfig.neutral;

  return (
    <GlassCard theme={theme} style={{ padding:16 }}>
      {/* Icon pair + arrow */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <div style={{
          width:34, height:34, borderRadius:10, background:sourceColor+'18',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <CorrelationIcon type={sourceIcon} color={sourceColor} size={18} />
        </div>
        {/* Connecting arrow */}
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
        {/* Sparkline on the right */}
        <div style={{ flex:1 }} />
        <MiniSparkline data={sparkline} width={60} height={26} color={trendColor} />
      </div>

      {/* Headline */}
      <div style={{ fontSize:13, fontWeight:500, color:theme.textPrimary, marginBottom:4, lineHeight:1.35 }}>
        {headline}
      </div>

      {/* Detail */}
      <div style={{ fontSize:11, fontWeight:300, color:theme.textMuted, lineHeight:1.5, marginBottom:10 }}>
        {detail}
      </div>

      {/* Confidence + type badge */}
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

// ─── Sensitivity Slider ───────────────────────────────────────────────────
function SensitivitySlider({ theme }) {
  const [value, setValue] = useState(50);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const updateValue = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setValue(Math.round(pct * 100));
  };

  const onMouseDown = (e) => {
    dragging.current = true;
    updateValue(e.clientX);
    const onMove = (ev) => { if (dragging.current) updateValue(ev.clientX); };
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const isLow = value < 33;
  const isMid = value >= 33 && value <= 66;
  const isHigh = value > 66;
  const modeLabel = isLow ? 'Discovery' : isMid ? 'Balanced' : 'High Confidence';
  const modeDesc = isLow
    ? 'See insights quickly with lower accuracy — great for cold start'
    : isMid
    ? 'Balanced mix of speed and reliability'
    : 'Only show insights with strong statistical backing';

  return (
    <GlassCard theme={theme} style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:500, color:theme.textPrimary }}>Insight Sensitivity</div>
        <AIBannerPill theme={theme} />
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        style={{
          position:'relative', height:32, cursor:'pointer', marginBottom:8,
          display:'flex', alignItems:'center',
        }}
      >
        {/* Track background with gradient zones */}
        <div style={{
          position:'absolute', left:0, right:0, height:6, borderRadius:9999,
          background: `linear-gradient(to right, #6b9fd4, ${theme.accent}, #d47b6b)`,
          opacity:0.25,
        }} />
        {/* Filled portion */}
        <div style={{
          position:'absolute', left:0, height:6, borderRadius:9999,
          width:`${value}%`, background:theme.accent,
          transition: dragging.current ? 'none' : 'width 0.1s',
        }} />
        {/* Thumb */}
        <div style={{
          position:'absolute', left:`${value}%`, transform:'translateX(-50%)',
          width:22, height:22, borderRadius:9999,
          background:theme.surface1, border:`2.5px solid ${theme.accent}`,
          boxShadow:'0 2px 8px rgba(0,0,0,0.25)',
          transition: dragging.current ? 'none' : 'left 0.1s',
        }} />
      </div>

      {/* Labels under track */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:10, fontWeight:400, color: isLow ? theme.accent : theme.textMuted }}>Fast</span>
        <span style={{ fontSize:10, fontWeight:400, color: isMid ? theme.accent : theme.textMuted }}>Balanced</span>
        <span style={{ fontSize:10, fontWeight:400, color: isHigh ? theme.accent : theme.textMuted }}>Accurate</span>
      </div>

      {/* Current mode card */}
      <div style={{
        padding:'10px 14px', borderRadius:10, background:theme.surface2,
        display:'flex', alignItems:'flex-start', gap:10,
      }}>
        <div style={{
          width:28, height:28, borderRadius:8, flexShrink:0,
          background:theme.accentFaint, display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {isLow && <><circle cx={12} cy={12} r={10} /><path d="M8 12l2 2 4-4" /></>}
            {isMid && <><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12.01} y2={16} /></>}
            {isHigh && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>}
          </svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:500, color:theme.textPrimary, marginBottom:2 }}>{modeLabel}</div>
          <div style={{ fontSize:11, fontWeight:300, color:theme.textMuted, lineHeight:1.45 }}>{modeDesc}</div>
        </div>
        <div style={{
          padding:'2px 8px', borderRadius:9999, background:theme.accentMuted,
          fontSize:10, fontWeight:600, color:theme.accent, flexShrink:0,
        }}>{value}%</div>
      </div>
    </GlassCard>
  );
}

// ─── Mock Data ─────────────────────────────────────────────────────────────
const INITIAL_HABITS = [
  { id:'1', name:'Morning Meditation', category:'Mindfulness', colorId:'sage',     streak:14, completed:false, time:'7:00 AM', weekly:[1,1,1,0,1,1,0], hasVoiceNote:true },
  { id:'2', name:'Read 30 Minutes',    category:'Learning',    colorId:'sky',      streak:7,  completed:false, time:'8:30 PM', weekly:[1,0,1,1,0,1,1] },
  { id:'3', name:'Drink 8 Glasses',    category:'Health',      colorId:'teal',     streak:3,  completed:true,  time:'All day', weekly:[1,1,0,1,1,1,1] },
  { id:'4', name:'Evening Walk',       category:'Fitness',     colorId:'coral',    streak:21, completed:false, time:'6:00 PM', weekly:[0,1,0,1,0,0,0] },
  { id:'5', name:'Journal',            category:'Mindfulness', colorId:'lavender', streak:5,  completed:false, time:'9:00 PM', weekly:[1,1,1,1,1,1,0], hasVoiceNote:true },
];
const BAR_DATA = [
  { habitId:'1', name:'Morning Meditation', colorId:'sage',     rate:0.87 },
  { habitId:'2', name:'Read 30 Minutes',    colorId:'sky',      rate:0.72 },
  { habitId:'3', name:'Drink 8 Glasses',    colorId:'teal',     rate:0.94 },
  { habitId:'4', name:'Evening Walk',       colorId:'coral',    rate:0.65 },
  { habitId:'5', name:'Journal',            colorId:'lavender', rate:0.58 },
];
function makeTrend(n) {
  const arr = []; let v = 0.55;
  for (let i=0; i<n; i++) { v = Math.max(0.05, Math.min(0.98, v+(Math.random()-0.47)*0.18)); arr.push(v); }
  return arr;
}
const TREND_DATA = makeTrend(365);
function makeCalendar() {
  const days = [], now = new Date();
  for (let i=89; i>=0; i--) {
    const d = new Date(now); d.setDate(d.getDate()-i);
    days.push({ date:d.toISOString().slice(0,10), count:Math.floor(Math.random()*6) });
  }
  return days;
}
const CALENDAR_DATA = makeCalendar();

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState('dark');
  const toggleMode = () => setMode(m => m === 'dark' ? 'light' : 'dark');
  const theme = THEMES[mode];
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const toggle = id => setHabits(prev => prev.map(h => h.id===id ? {...h, completed:!h.completed} : h));
  const completed = habits.filter(h => h.completed).length;
  const dateStr = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  const [activeTab, setActiveTab] = useState('today');
  const [detailHabit, setDetailHabit] = useState(null);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', fontFamily:'Inter, system-ui, sans-serif', overflow:'hidden' }}>
      <div style={{ flex:1, minWidth:0, minHeight:0, position:'relative', background:theme.bg, display:'flex', flexDirection:'column' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
          <NoiseBackground mode={mode} />
        </div>

        {/* Scrollable content */}
        <div style={{ flex:1, minHeight:0, overflowY:'auto', overflowX:'hidden', padding:'28px 20px 24px', position:'relative', zIndex:1 }}>

          {/* Header */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <div style={{ fontSize:10, fontWeight:400, letterSpacing:'0.12em', textTransform:'uppercase', color:theme.textMuted }}>
                {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </div>
              <Toggle theme={theme} checked={mode === 'dark'} onChange={toggleMode} />
            </div>
            <div style={{ fontSize:26, fontWeight:300, color:theme.textPrimary, letterSpacing:'-0.5px' }}>Today</div>
            <div style={{ fontSize:12, fontWeight:300, color:theme.textMuted, marginTop:3 }}>{dateStr}</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Progress */}
            <SectionLabel theme={theme}>Progress</SectionLabel>
            <GlassCard theme={theme} style={{ padding:20 }}>
              <ProgressBar theme={theme} completed={completed} total={habits.length} />
            </GlassCard>

            {/* Habits — click to open detail modal */}
            <SectionLabel theme={theme}>Habits</SectionLabel>
            <GlassCard theme={theme} style={{ paddingLeft:16, paddingRight:16 }}>
              {habits.map((h,i) => (
                <HabitCard key={h.id} theme={theme} habit={h} onToggle={toggle} isLast={i===habits.length-1} onClick={setDetailHabit} />
              ))}
            </GlassCard>
            <AddHabitButton theme={theme} />

            {/* ═══ NEW: Radial Progress ═══ */}
            <SectionLabel theme={theme}>Radial Progress</SectionLabel>
            <RadialProgressShowcase theme={theme} habits={habits} />

            {/* ═══ NEW: Weekly Grid ═══ */}
            <SectionLabel theme={theme}>Weekly Tracker</SectionLabel>
            <WeeklyGrid theme={theme} habits={habits} />

            {/* ═══ NEW: Voice Notes ═══ */}
            <SectionLabel theme={theme}>Voice Notes</SectionLabel>
            <VoiceNoteCard theme={theme} habitName="Morning Meditation" duration="0:42" timestamp="7:15 AM" color="#7a9e7e" seed={42} />
            <VoiceNoteCard theme={theme} habitName="Journal" duration="1:18" timestamp="9:12 PM" color="#9585c1" seed={137} />

            {/* Insight */}
            <SectionLabel theme={theme}>Insight</SectionLabel>
            <InsightCard
              theme={theme}
              title="Best streak: Evening Walk"
              description="You've completed your Evening Walk for 21 days in a row — a new personal record! Keep it up."
            />

            {/* ═══ NEW v4: AI Insights ═══ */}
            <SectionLabel theme={theme}>AI Correlations</SectionLabel>
            <AIBannerPill theme={theme} />
            {CORRELATION_DATA.map(c => (
              <CorrelationCard key={c.id} theme={theme} correlation={c} />
            ))}

            {/* ═══ NEW v4: Sensitivity Slider ═══ */}
            <SectionLabel theme={theme}>Insight Sensitivity</SectionLabel>
            <SensitivitySlider theme={theme} />

            {/* Bar Chart */}
            <SectionLabel theme={theme}>Completion Rates</SectionLabel>
            <HabitBarChart theme={theme} data={BAR_DATA} />

            {/* Trend Chart */}
            <SectionLabel theme={theme}>Trend</SectionLabel>
            <CompletionTrendChart theme={theme} data={TREND_DATA} uid={mode} />

            {/* Calendar */}
            <SectionLabel theme={theme}>Activity Heatmap</SectionLabel>
            <CalendarHeatmap theme={theme} data={CALENDAR_DATA} maxCount={5} />

            {/* Leaderboard */}
            <SectionLabel theme={theme}>Leaderboard</SectionLabel>
            <StreakLeaderboard theme={theme} habits={habits} />

            {/* Toggles */}
            <SectionLabel theme={theme}>Toggles</SectionLabel>
            <ToggleShowcase theme={theme} />

            {/* Palette */}
            <SectionLabel theme={theme}>Palette</SectionLabel>
            <PaletteSwatches theme={theme} />

            {/* Tokens */}
            <SectionLabel theme={theme}>Tokens</SectionLabel>
            <ColorTokens theme={theme} />

          </div>
        </div>

        {/* ═══ NEW: Bottom Tab Bar ═══ */}
        <BottomTabBar theme={theme} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ═══ NEW: Habit Detail Modal ═══ */}
      {detailHabit && <HabitDetailModal theme={theme} habit={detailHabit} onClose={() => setDetailHabit(null)} />}
    </div>
  );
}
