import { useState, useMemo } from 'react';
import { THEMES, MAX_WIDTH, FONT_FAMILY, radius, withAlpha } from './config/theme';
import { INITIAL_HABITS, BAR_DATA, CORRELATION_DATA, makeMultiHabitTrend } from './data/mockData';

import NoiseBackground from './components/foundation/NoiseBackground';
import GlassCard from './components/foundation/GlassCard';
import SectionLabel from './components/foundation/SectionLabel';
import Typography from './components/foundation/Typography';
import Divider from './components/foundation/Divider';
import EmptyState from './components/foundation/EmptyState';

import ProgressBar from './components/core/ProgressBar';
import Toggle from './components/core/Toggle';
import AddHabitButton from './components/core/AddHabitButton';
import Chip from './components/core/Chip';
import Button from './components/core/Button';
import IconButton from './components/core/IconButton';
import Avatar from './components/core/Avatar';
import TextInput from './components/core/TextInput';
import SearchBar from './components/core/SearchBar';
import SegmentedControl from './components/core/SegmentedControl';
import Dropdown from './components/core/Dropdown';
import Skeleton from './components/core/Skeleton';
import SettingsRow from './components/core/SettingsRow';
import Modal from './components/core/Modal';
import Toast from './components/core/Toast';
import DatePicker from './components/core/DatePicker';

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
  { id: 'primitives', label: 'Primitives' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'composition', label: 'Composition' },
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

  // Interactive demo state
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [segmentValue, setSegmentValue] = useState('week');
  const [dropdownValue, setDropdownValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [settingsValues, setSettingsValues] = useState({ notif: true, sync: false, haptic: true });
  const [btnLoading, setBtnLoading] = useState(false);

  const TREND_DATA = useMemo(() => makeMultiHabitTrend(INITIAL_HABITS, 365), []);

  const show = (section) => activeSection === 'all' || activeSection === section;

  const showToast = (type) => {
    setToastType(type);
    setToastVisible(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: FONT_FAMILY, overflow: 'hidden', background: theme.bg }}>
      {/* Sticky Toolbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: theme.surface1, borderBottom: `1px solid ${theme.glassBorder}`,
        padding: '12px 20px 10px',
      }}>
        <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto' }}>
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
              <Chip
                key={s.id}
                theme={theme}
                label={s.label}
                active={activeSection === s.id}
                onClick={() => setActiveSection(s.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <NoiseBackground theme={theme} />
        </div>

        <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto', padding: '24px 20px 90px', position: 'relative', zIndex: 1 }}>
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
                    <HabitCard key={h.id} theme={theme} habit={h} onChange={toggle} isLast={i === habits.length - 1} onClick={setDetailHabit} />
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
                <CompletionTrendChart theme={theme} data={TREND_DATA} habits={INITIAL_HABITS} />

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
                <BottomTabBar theme={theme} activeTab={activeTab}
                  onTabChange={setActiveTab} onAddHabit={() => {}} onVoiceNote={() => {}} inline />
              </>
            )}

            {/* ─── Primitives Section ─── */}
            {show('primitives') && (
              <>
                <SectionLabel theme={theme}>Typography</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <Typography theme={theme} variant="title">Title — 16/500</Typography>
                  <Typography theme={theme} variant="body" style={{ marginTop: 8 }}>Body — 14/400 regular text for paragraphs and descriptions.</Typography>
                  <Typography theme={theme} variant="caption" style={{ marginTop: 8 }}>Caption — 12/400 muted secondary information</Typography>
                </GlassCard>

                <SectionLabel theme={theme}>Divider</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <Typography theme={theme} variant="body">Content above</Typography>
                  <Divider theme={theme} style={{ marginTop: 12, marginBottom: 12 }} />
                  <Typography theme={theme} variant="body">Content below</Typography>
                </GlassCard>

                <SectionLabel theme={theme}>Avatars</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar theme={theme} name="Alice Brown" size="sm" />
                    <Avatar theme={theme} name="Bob Chen" size="md" />
                    <Avatar theme={theme} name="Carol Davis" size="lg" />
                    <Avatar theme={theme} name="Dan" size="md" />
                    <Avatar theme={theme} size="md" />
                  </div>
                  <Typography theme={theme} variant="caption" style={{ marginTop: 10 }}>sm / md / lg / single name / no name</Typography>
                </GlassCard>

                <SectionLabel theme={theme}>Chips</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <Chip theme={theme} label="Active" active onClick={() => {}} />
                    <Chip theme={theme} label="Inactive" onClick={() => {}} />
                    <Chip theme={theme} label="Morning" onClick={() => {}} />
                    <Chip theme={theme} label="Evening" active onClick={() => {}} />
                  </div>
                </GlassCard>

                <SectionLabel theme={theme}>Skeleton</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <Skeleton theme={theme} variant="circle" />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Skeleton theme={theme} variant="text" width="60%" />
                      <Skeleton theme={theme} variant="text" width="40%" />
                    </div>
                  </div>
                  <Skeleton theme={theme} variant="card" />
                </GlassCard>

                <SectionLabel theme={theme}>Empty State</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 0 }}>
                  <EmptyState
                    theme={theme}
                    icon={
                      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x={3} y={3} width={18} height={18} rx={2} />
                        <line x1={12} y1={8} x2={12} y2={16} />
                        <line x1={8} y1={12} x2={16} y2={12} />
                      </svg>
                    }
                    title="No habits yet"
                    description="Tap the + button to create your first habit and start tracking."
                  />
                </GlassCard>
              </>
            )}

            {/* ─── Interactive Section ─── */}
            {show('interactive') && (
              <>
                <SectionLabel theme={theme}>Buttons</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <Button theme={theme} variant="primary">Primary</Button>
                    <Button theme={theme} variant="secondary">Secondary</Button>
                    <Button theme={theme} variant="ghost">Ghost</Button>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <Button theme={theme} variant="primary" size="sm">Small</Button>
                    <Button theme={theme} variant="primary" disabled>Disabled</Button>
                    <Button theme={theme} variant="primary" loading={btnLoading} onClick={() => { setBtnLoading(true); setTimeout(() => setBtnLoading(false), 2000); }}>
                      {btnLoading ? 'Loading' : 'Click Me'}
                    </Button>
                  </div>
                  <Typography theme={theme} variant="caption">Icon Buttons</Typography>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <IconButton theme={theme} ariaLabel="Edit" variant="default">
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </IconButton>
                    <IconButton theme={theme} ariaLabel="Delete" variant="danger">
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
                      </svg>
                    </IconButton>
                    <IconButton theme={theme} ariaLabel="Settings" variant="ghost">
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                        <circle cx={12} cy={12} r={3} /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                    </IconButton>
                    <IconButton theme={theme} ariaLabel="Disabled" variant="default" disabled>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                        <circle cx={12} cy={12} r={10} /><line x1={15} y1={9} x2={9} y2={15} /><line x1={9} y1={9} x2={15} y2={15} />
                      </svg>
                    </IconButton>
                  </div>
                </GlassCard>

                <SectionLabel theme={theme}>Text Input</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <TextInput theme={theme} label="Habit name" value={inputValue} onChange={setInputValue} placeholder="e.g. Morning meditation" />
                  <div style={{ marginTop: 14 }}>
                    <TextInput theme={theme} label="With error" value="" onChange={() => {}} placeholder="Required" error="This field is required" />
                  </div>
                </GlassCard>

                <SectionLabel theme={theme}>Search Bar</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <SearchBar theme={theme} value={searchValue} onChange={setSearchValue} placeholder="Search habits..." />
                </GlassCard>

                <SectionLabel theme={theme}>Segmented Control</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <SegmentedControl
                    theme={theme}
                    options={[{ label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }, { label: 'Year', value: 'year' }]}
                    value={segmentValue}
                    onChange={setSegmentValue}
                  />
                  <Typography theme={theme} variant="caption" style={{ marginTop: 10 }}>Selected: {segmentValue}</Typography>
                </GlassCard>

                <SectionLabel theme={theme}>Dropdown</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <Dropdown
                    theme={theme}
                    options={[
                      { label: 'Daily', value: 'daily' },
                      { label: 'Weekly', value: 'weekly' },
                      { label: 'Monthly', value: 'monthly' },
                    ]}
                    value={dropdownValue}
                    onChange={setDropdownValue}
                    placeholder="Frequency..."
                  />
                  <Typography theme={theme} variant="caption" style={{ marginTop: 10 }}>
                    {dropdownValue ? `Selected: ${dropdownValue}` : 'No selection'}
                  </Typography>
                </GlassCard>

                <SectionLabel theme={theme}>Date Picker</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <DatePicker theme={theme} value={selectedDate} onChange={setSelectedDate} />
                  <Typography theme={theme} variant="caption" style={{ marginTop: 10 }}>
                    Selected: {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </GlassCard>
              </>
            )}

            {/* ─── Composition Section ─── */}
            {show('composition') && (
              <>
                <SectionLabel theme={theme}>Settings Rows</SectionLabel>
                <GlassCard theme={theme} style={{ padding: '4px 20px' }}>
                  <SettingsRow theme={theme} label="Notifications" description="Receive daily reminders" checked={settingsValues.notif} onChange={(v) => setSettingsValues(p => ({ ...p, notif: v }))} />
                  <Divider theme={theme} />
                  <SettingsRow theme={theme} label="Auto-sync" description="Sync data across devices" checked={settingsValues.sync} onChange={(v) => setSettingsValues(p => ({ ...p, sync: v }))} />
                  <Divider theme={theme} />
                  <SettingsRow theme={theme} label="Haptic feedback" checked={settingsValues.haptic} onChange={(v) => setSettingsValues(p => ({ ...p, haptic: v }))} />
                </GlassCard>

                <SectionLabel theme={theme}>Modal</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <Button theme={theme} variant="primary" onClick={() => setModalOpen(true)}>
                    Open Modal
                  </Button>
                </GlassCard>

                <SectionLabel theme={theme}>Toast</SectionLabel>
                <GlassCard theme={theme} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button theme={theme} variant="primary" size="sm" onClick={() => showToast('success')}>Success</Button>
                    <Button theme={theme} variant="secondary" size="sm" onClick={() => showToast('error')}>Error</Button>
                    <Button theme={theme} variant="ghost" size="sm" onClick={() => showToast('info')}>Info</Button>
                  </div>
                </GlassCard>
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

      {/* Demo Modal */}
      <Modal
        theme={theme}
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Delete Habit?"
        actions={[
          { label: 'Cancel', variant: 'secondary', onClick: () => setModalOpen(false) },
          { label: 'Delete', variant: 'danger', onClick: () => setModalOpen(false) },
        ]}
      >
        <Typography theme={theme} variant="body">
          Are you sure you want to delete this habit? This action cannot be undone and all associated data will be lost.
        </Typography>
      </Modal>

      {/* Toast */}
      <Toast
        theme={theme}
        message={toastType === 'success' ? 'Habit saved successfully!' : toastType === 'error' ? 'Something went wrong.' : 'Sync in progress...'}
        type={toastType}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar theme={theme} activeTab={activeTab}
        onTabChange={setActiveTab} onAddHabit={() => {}} onVoiceNote={() => {}} />
    </div>
  );
}
