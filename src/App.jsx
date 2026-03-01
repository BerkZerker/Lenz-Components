import { useState, useMemo } from 'react';
import { THEMES } from './config/theme';
import { INITIAL_HABITS, BAR_DATA, CORRELATION_DATA, makeTrend } from './data/mockData';

import NoiseBackground from './components/foundation/NoiseBackground';
import GlassCard from './components/foundation/GlassCard';
import SectionLabel from './components/foundation/SectionLabel';

import ProgressBar from './components/core/ProgressBar';
import Toggle from './components/core/Toggle';
import AddHabitButton from './components/core/AddHabitButton';

import HabitCard from './components/habits/HabitCard';
import WeeklyGrid from './components/habits/WeeklyGrid';
import HabitDetailModal from './components/habits/HabitDetailModal';

import HabitBarChart from './components/charts/HabitBarChart';
import CompletionTrendChart from './components/charts/CompletionTrendChart';
import StreakLeaderboard from './components/charts/StreakLeaderboard';
import RadialProgressShowcase from './components/charts/RadialProgressShowcase';

import InsightCard from './components/insights/InsightCard';
import AIBannerPill from './components/insights/AIBannerPill';
import CorrelationCard from './components/insights/CorrelationCard';
import SensitivitySlider from './components/insights/SensitivitySlider';

import VoiceNoteCard from './components/voice/VoiceNoteCard';
import BottomTabBar from './components/navigation/BottomTabBar';

import PaletteSwatches from './components/design-system/PaletteSwatches';
import ToggleShowcase from './components/design-system/ToggleShowcase';
import ColorTokens from './components/design-system/ColorTokens';

const SECTIONS = [
  { id: 'all', label: 'All' },
  { id: 'habits', label: 'Habits' },
  { id: 'charts', label: 'Charts' },
  { id: 'insights', label: 'AI & Insights' },
  { id: 'voice', label: 'Voice' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'design', label: 'Design System' },
];

export default function App() {
  const [mode, setMode] = useState('dark');
  const toggleMode = () => setMode(m => m === 'dark' ? 'light' : 'dark');
  const theme = THEMES[mode];

  const [habits, setHabits] = useState(INITIAL_HABITS);
  const toggle = id => setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  const completed = habits.filter(h => h.completed).length;

  const [activeTab, setActiveTab] = useState('today');
  const [detailHabit, setDetailHabit] = useState(null);
  const [activeSection, setActiveSection] = useState('all');

  const TREND_DATA = useMemo(() => makeTrend(365), []);

  const show = (section) => activeSection === 'all' || activeSection === section;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', background: theme.bg }}>
      {/* Sticky Toolbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: theme.surface1, borderBottom: `1px solid ${theme.glassBorder}`,
        padding: '12px 20px 10px',
      }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: theme.textPrimary, letterSpacing: '-0.3px' }}>
              Lenz Artboard
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 400, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {mode === 'dark' ? 'Dark' : 'Light'}
              </span>
              <Toggle theme={theme} checked={mode === 'dark'} onChange={toggleMode} size="sm" />
            </div>
          </div>
          {/* Section filter pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  borderRadius: 9999, border: 'none', cursor: 'pointer',
                  padding: '5px 12px', whiteSpace: 'nowrap', flexShrink: 0,
                  background: activeSection === s.id ? theme.accentMuted : 'transparent',
                  color: activeSection === s.id ? theme.accent : theme.textMuted,
                  fontSize: 11, fontWeight: 500, fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <NoiseBackground mode={mode} />
        </div>

        <div style={{ maxWidth: 420, margin: '0 auto', padding: '24px 20px 90px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ─── Habits Section ─── */}
            {show('habits') && (
              <>
                <SectionLabel theme={theme}>Progress</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <ProgressBar theme={theme} completed={completed} total={habits.length} />
                </GlassCard>

                <SectionLabel theme={theme}>Habits</SectionLabel>
                <GlassCard theme={theme} style={{ paddingLeft: 16, paddingRight: 16 }}>
                  {habits.map((h, i) => (
                    <HabitCard key={h.id} theme={theme} habit={h} onToggle={toggle} isLast={i === habits.length - 1} onClick={setDetailHabit} />
                  ))}
                </GlassCard>
                <AddHabitButton theme={theme} />

                <SectionLabel theme={theme}>Radial Progress</SectionLabel>
                <RadialProgressShowcase theme={theme} habits={habits} />

                <SectionLabel theme={theme}>Weekly Tracker</SectionLabel>
                <WeeklyGrid theme={theme} habits={habits} />
              </>
            )}

            {/* ─── Charts Section ─── */}
            {show('charts') && (
              <>
                <SectionLabel theme={theme}>Completion Rates</SectionLabel>
                <HabitBarChart theme={theme} data={BAR_DATA} />

                <SectionLabel theme={theme}>Trend</SectionLabel>
                <CompletionTrendChart theme={theme} data={TREND_DATA} uid={mode} />

                <SectionLabel theme={theme}>Leaderboard</SectionLabel>
                <StreakLeaderboard theme={theme} habits={habits} />
              </>
            )}

            {/* ─── AI & Insights Section ─── */}
            {show('insights') && (
              <>
                <SectionLabel theme={theme}>Insight</SectionLabel>
                <InsightCard
                  theme={theme}
                  title="Best streak: Evening Walk"
                  description="You've completed your Evening Walk for 21 days in a row — a new personal record! Keep it up."
                />

                <SectionLabel theme={theme}>AI Correlations</SectionLabel>
                <AIBannerPill theme={theme} />
                {CORRELATION_DATA.map(c => (
                  <CorrelationCard key={c.id} theme={theme} correlation={c} />
                ))}

                <SectionLabel theme={theme}>Insight Sensitivity</SectionLabel>
                <SensitivitySlider theme={theme} />
              </>
            )}

            {/* ─── Voice Section ─── */}
            {show('voice') && (
              <>
                <SectionLabel theme={theme}>Voice Notes</SectionLabel>
                <VoiceNoteCard theme={theme} habitName="Morning Meditation" duration="0:42" timestamp="7:15 AM" color="#7a9e7e" seed={42} />
                <VoiceNoteCard theme={theme} habitName="Journal" duration="1:18" timestamp="9:12 PM" color="#9585c1" seed={137} />
              </>
            )}

            {/* ─── Navigation Section ─── */}
            {show('navigation') && (
              <>
                <SectionLabel theme={theme}>Bottom Tab Bar</SectionLabel>
                <BottomTabBar theme={theme} mode={mode} activeTab={activeTab}
                  onTabChange={setActiveTab} onAddHabit={() => {}} onVoiceNote={() => {}} inline />
              </>
            )}

            {/* ─── Design System Section ─── */}
            {show('design') && (
              <>
                <SectionLabel theme={theme}>Toggles</SectionLabel>
                <ToggleShowcase theme={theme} />

                <SectionLabel theme={theme}>Palette</SectionLabel>
                <PaletteSwatches theme={theme} />

                <SectionLabel theme={theme}>Tokens</SectionLabel>
                <ColorTokens theme={theme} />
              </>
            )}

          </div>
        </div>
      </div>

      {/* Habit Detail Modal */}
      <HabitDetailModal theme={theme} habit={detailHabit} onClose={() => setDetailHabit(null)} />

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar theme={theme} mode={mode} activeTab={activeTab}
        onTabChange={setActiveTab} onAddHabit={() => {}} onVoiceNote={() => {}} />
    </div>
  );
}
