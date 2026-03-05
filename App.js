import { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView, BlurTargetView } from 'expo-blur';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import Svg, {
  Rect as SvgRect,
  Line as SvgLine,
  Circle as SvgCircle,
  Path as SvgPath,
  Polyline as SvgPolyline,
} from 'react-native-svg';

import { THEMES, MAX_WIDTH, radius, withAlpha } from './src/config/theme';
import {
  INITIAL_HABITS,
  BAR_DATA,
  CORRELATION_DATA,
  makeMultiHabitTrend,
} from './src/data/mockData';

// Foundation
import NoiseBackground from './src/components/foundation/NoiseBackground';
import GlassCard, { BlurTargetContext } from './src/components/foundation/GlassCard';
import SectionLabel from './src/components/foundation/SectionLabel';
import Typography from './src/components/foundation/Typography';
import Divider from './src/components/foundation/Divider';
import EmptyState from './src/components/foundation/EmptyState';
import SparkleIcon from './src/components/foundation/SparkleIcon';

// Core
import ProgressBar from './src/components/core/ProgressBar';
import Toggle from './src/components/core/Toggle';
import AddHabitButton from './src/components/core/AddHabitButton';
import Chip from './src/components/core/Chip';
import Button from './src/components/core/Button';
import IconButton from './src/components/core/IconButton';
import Avatar from './src/components/core/Avatar';
import TextInput from './src/components/core/TextInput';
import SearchBar from './src/components/core/SearchBar';
import SegmentedControl from './src/components/core/SegmentedControl';
import Dropdown from './src/components/core/Dropdown';
import Skeleton from './src/components/core/Skeleton';
import SettingsRow from './src/components/core/SettingsRow';
import Modal from './src/components/core/Modal';
import DatePicker from './src/components/core/DatePicker';

// Habits
import HabitCard from './src/components/habits/HabitCard';
import WeeklyGrid from './src/components/habits/WeeklyGrid';
import HabitDetailModal from './src/components/habits/HabitDetailModal';

// Charts
import HabitBarChart from './src/components/charts/HabitBarChart';
import CompletionTrendChart from './src/components/charts/CompletionTrendChart';
import StreakLeaderboard from './src/components/charts/StreakLeaderboard';
import RadialProgressShowcase from './src/components/charts/RadialProgressShowcase';

// Insights
import InsightCard from './src/components/insights/InsightCard';
import AIBannerPill from './src/components/insights/AIBannerPill';
import CorrelationCard from './src/components/insights/CorrelationCard';
import SensitivitySlider from './src/components/insights/SensitivitySlider';

// Voice
import VoiceNoteCard from './src/components/voice/VoiceNoteCard';

// Design System
import PaletteSwatches from './src/components/design-system/PaletteSwatches';
import ToggleShowcase from './src/components/design-system/ToggleShowcase';
import ColorTokens from './src/components/design-system/ColorTokens';

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Inline Toast component
// ---------------------------------------------------------------------------
function Toast({ theme, message, type = 'success', visible, onDismiss }) {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 40,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const typeColors = {
    success: theme.accent,
    error: theme.danger,
    info: theme.info,
  };
  const typeColor = typeColors[type] || theme.accent;

  const typeIcons = {
    success: (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <SvgCircle cx={12} cy={12} r={10} />
        <SvgPath d="M8 12l3 3 5-6" />
      </Svg>
    ),
    error: (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <SvgPath d="M12 9v4" />
        <SvgPath d="M12 17h.01" />
        <SvgPath d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </Svg>
    ),
    info: (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <SvgCircle cx={12} cy={12} r={10} />
        <SvgLine x1={12} y1={16} x2={12} y2={12} />
        <SvgLine x1={12} y1={8} x2={12.01} y2={8} />
      </Svg>
    ),
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
        zIndex: 200,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: radius.md,
        backgroundColor: typeColor,
        maxWidth: MAX_WIDTH - 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
        transform: [{ translateY }],
        opacity,
      }}
    >
      {typeIcons[type] || typeIcons.success}
      <Text style={{ color: 'white', fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1 }}>
        {message}
      </Text>
      <Pressable onPress={onDismiss} accessibilityLabel="Dismiss">
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round">
          <SvgLine x1={18} y1={6} x2={6} y2={18} />
          <SvgLine x1={6} y1={6} x2={18} y2={18} />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Inline BottomTabBar component
// ---------------------------------------------------------------------------
const TAB_DEFS = [
  {
    id: 'today',
    label: 'Today',
    icon: (c) => (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <SvgRect x={3} y={4} width={18} height={18} rx={2} fill="none" />
        <SvgLine x1={16} y1={2} x2={16} y2={6} />
        <SvgLine x1={8} y1={2} x2={8} y2={6} />
        <SvgLine x1={3} y1={10} x2={21} y2={10} />
        <SvgRect x={8} y={14} width={3} height={3} rx={0.5} fill={c} stroke="none" />
      </Svg>
    ),
  },
  {
    id: 'stats',
    label: 'Stats',
    icon: (c) => (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <SvgRect x={4} y={14} width={4} height={7} rx={1} fill="none" />
        <SvgRect x={10} y={8} width={4} height={13} rx={1} fill="none" />
        <SvgRect x={16} y={3} width={4} height={18} rx={1} fill="none" />
      </Svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: (c) => <SparkleIcon size={22} color={c} strokeWidth={1.8} />,
  },
  {
    id: 'more',
    label: 'More',
    icon: (c) => (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <SvgLine x1={4} y1={6} x2={20} y2={6} />
        <SvgLine x1={4} y1={12} x2={20} y2={12} />
        <SvgLine x1={4} y1={18} x2={20} y2={18} />
      </Svg>
    ),
  },
];

function BottomTabBar({ theme, activeTab, onTabChange, onAddHabit, onVoiceNote, inline = false, blurTarget }) {
  const leftTabs = TAB_DEFS.filter((t) => t.id === 'today' || t.id === 'stats');
  const rightTabs = TAB_DEFS.filter((t) => t.id === 'insights' || t.id === 'more');
  const isMic = activeTab === 'insights';

  const renderTab = (tab) => {
    const active = activeTab === tab.id;
    const color = active ? theme.accent : theme.textMuted;
    return (
      <Pressable
        key={tab.id}
        onPress={() => onTabChange(tab.id)}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6 }}
      >
        <View
          style={{
            width: 36,
            height: 28,
            borderRadius: 12,
            backgroundColor: active ? theme.accentGlass : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tab.icon(color)}
        </View>
        <Text
          style={{
            fontSize: 10,
            fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
            color,
          }}
        >
          {tab.label}
        </Text>
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 9999,
            backgroundColor: active ? theme.accent : 'transparent',
          }}
        />
      </Pressable>
    );
  };

  const tint = theme.mode === 'dark' ? 'dark' : 'light';
  const blurProps = Platform.OS === 'android' && blurTarget
    ? { blurTarget, blurMethod: 'dimezisBlurView' }
    : {};

  const barContent = (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.glassBorder,
        borderRadius: 22,
        overflow: 'hidden',
      }}
    >
    <BlurView
      intensity={48}
      tint={tint}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.glassBackground,
        paddingVertical: 4,
      }}
      {...blurProps}
    >
      {/* Left tabs */}
      <View style={{ flex: 1, flexDirection: 'row' }}>{leftTabs.map(renderTab)}</View>

      {/* Center FAB */}
      <View style={{ width: 64, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          onPress={isMic ? onVoiceNote : onAddHabit}
          accessibilityLabel={isMic ? 'Record voice note' : 'Add new habit'}
          style={({ pressed }) => ({
            width: 54,
            height: 54,
            borderRadius: 9999,
            backgroundColor: theme.accent,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale: pressed ? 0.9 : 1 }],
          })}
        >
          {isMic ? (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <SvgRect x={9} y={2} width={6} height={12} rx={3} fill="none" />
              <SvgPath d="M5 10a7 7 0 0 0 14 0" fill="none" />
              <SvgLine x1={12} y1={17} x2={12} y2={21} />
              <SvgLine x1={8} y1={21} x2={16} y2={21} />
            </Svg>
          ) : (
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
              <SvgLine x1={12} y1={5} x2={12} y2={19} />
              <SvgLine x1={5} y1={12} x2={19} y2={12} />
            </Svg>
          )}
        </Pressable>
      </View>

      {/* Right tabs */}
      <View style={{ flex: 1, flexDirection: 'row' }}>{rightTabs.map(renderTab)}</View>
    </BlurView>
    </View>
  );

  if (inline) {
    return barContent;
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        zIndex: 100,
        maxWidth: MAX_WIDTH,
        alignSelf: 'center',
      }}
    >
      {barContent}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Loading screen
// ---------------------------------------------------------------------------
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading Lenz...</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const [mode, setMode] = useState('dark');
  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const theme = THEMES[mode];

  const [habits, setHabits] = useState(INITIAL_HABITS);
  const toggleHabit = (id) =>
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  const completed = habits.filter((h) => h.completed).length;

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
  const [settingsValues, setSettingsValues] = useState({
    notif: true,
    sync: false,
    haptic: true,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  const blurTargetRef = useRef(null);
  const TREND_DATA = useMemo(() => makeMultiHabitTrend(INITIAL_HABITS, 365), []);

  const show = (section) => activeSection === 'all' || activeSection === section;

  const showToast = (type) => {
    setToastType(type);
    setToastVisible(true);
  };

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.surface1}
        />

        <BlurTargetContext.Provider value={blurTargetRef}>
        <View style={{ flex: 1 }}>
          {/* ═══════════ Sticky Toolbar ═══════════ */}
          <View
            style={{
              backgroundColor: theme.surface1,
              borderBottomWidth: 1,
              borderBottomColor: theme.glassBorder,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 10,
              zIndex: 50,
            }}
          >
            {/* Title row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter_500Medium',
                  color: theme.textPrimary,
                  letterSpacing: -0.3,
                }}
              >
                Lenz Artboard
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  {mode === 'dark' ? 'Dark' : 'Light'}
                </Text>
                <Toggle
                  theme={theme}
                  checked={mode === 'dark'}
                  onChange={toggleMode}
                  size="sm"
                />
              </View>
            </View>

            {/* Section filter pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingBottom: 2 }}
            >
              {SECTIONS.map((s) => (
                <Chip
                  key={s.id}
                  theme={theme}
                  label={s.label}
                  active={activeSection === s.id}
                  onPress={() => setActiveSection(s.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* ═══════════ Scrollable Content ═══════════ */}
          <BlurTargetView ref={blurTargetRef} style={{ flex: 1, position: 'relative' }}>
            {/* Noise background behind scroll content */}
            <NoiseBackground theme={theme} />

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                maxWidth: MAX_WIDTH,
                alignSelf: 'center',
                width: '100%',
                paddingHorizontal: 20,
                paddingTop: 24,
                paddingBottom: 90,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: 16 }}>
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
                        <HabitCard
                          key={h.id}
                          theme={theme}
                          habit={h}
                          onChange={toggleHabit}
                          isLast={i === habits.length - 1}
                          onClick={setDetailHabit}
                        />
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
                      description="You've completed your Evening Walk for 21 days in a row -- a new personal record! Keep it up."
                    />

                    <SectionLabel theme={theme}>AI Correlations</SectionLabel>
                    <AIBannerPill theme={theme} />
                    {CORRELATION_DATA.map((c) => (
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
                    <VoiceNoteCard
                      theme={theme}
                      habitName="Morning Meditation"
                      duration="0:42"
                      timestamp="7:15 AM"
                      color="#7a9e7e"
                      seed={42}
                    />
                    <VoiceNoteCard
                      theme={theme}
                      habitName="Journal"
                      duration="1:18"
                      timestamp="9:12 PM"
                      color="#9585c1"
                      seed={137}
                    />
                  </>
                )}

                {/* ─── Navigation Section ─── */}
                {show('navigation') && (
                  <>
                    <SectionLabel theme={theme}>Bottom Tab Bar</SectionLabel>
                    <BottomTabBar
                      theme={theme}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      onAddHabit={() => {}}
                      onVoiceNote={() => {}}
                      inline
                    />
                  </>
                )}

                {/* ─── Primitives Section ─── */}
                {show('primitives') && (
                  <>
                    <SectionLabel theme={theme}>Typography</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <Typography theme={theme} variant="title">
                        Title -- 16/500
                      </Typography>
                      <Typography theme={theme} variant="body" style={{ marginTop: 8 }}>
                        Body -- 14/400 regular text for paragraphs and descriptions.
                      </Typography>
                      <Typography theme={theme} variant="caption" style={{ marginTop: 8 }}>
                        Caption -- 12/400 muted secondary information
                      </Typography>
                    </GlassCard>

                    <SectionLabel theme={theme}>Divider</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <Typography theme={theme} variant="body">
                        Content above
                      </Typography>
                      <Divider theme={theme} style={{ marginTop: 12, marginBottom: 12 }} />
                      <Typography theme={theme} variant="body">
                        Content below
                      </Typography>
                    </GlassCard>

                    <SectionLabel theme={theme}>Avatars</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Avatar theme={theme} name="Alice Brown" size="sm" />
                        <Avatar theme={theme} name="Bob Chen" size="md" />
                        <Avatar theme={theme} name="Carol Davis" size="lg" />
                        <Avatar theme={theme} name="Dan" size="md" />
                        <Avatar theme={theme} size="md" />
                      </View>
                      <Typography theme={theme} variant="caption" style={{ marginTop: 10 }}>
                        sm / md / lg / single name / no name
                      </Typography>
                    </GlassCard>

                    <SectionLabel theme={theme}>Chips</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                        <Chip theme={theme} label="Active" active onPress={() => {}} />
                        <Chip theme={theme} label="Inactive" onPress={() => {}} />
                        <Chip theme={theme} label="Morning" onPress={() => {}} />
                        <Chip theme={theme} label="Evening" active onPress={() => {}} />
                      </View>
                    </GlassCard>

                    <SectionLabel theme={theme}>Skeleton</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          marginBottom: 14,
                        }}
                      >
                        <Skeleton theme={theme} variant="circle" />
                        <View style={{ flex: 1, gap: 8 }}>
                          <Skeleton theme={theme} variant="text" width="60%" />
                          <Skeleton theme={theme} variant="text" width="40%" />
                        </View>
                      </View>
                      <Skeleton theme={theme} variant="card" />
                    </GlassCard>

                    <SectionLabel theme={theme}>Empty State</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 0 }}>
                      <EmptyState
                        theme={theme}
                        icon={
                          <Svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={theme.accent}
                            strokeWidth={1.8}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <SvgRect x={3} y={3} width={18} height={18} rx={2} fill="none" />
                            <SvgLine x1={12} y1={8} x2={12} y2={16} />
                            <SvgLine x1={8} y1={12} x2={16} y2={12} />
                          </Svg>
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
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 8,
                          flexWrap: 'wrap',
                          marginBottom: 12,
                        }}
                      >
                        <Button theme={theme} variant="primary">
                          Primary
                        </Button>
                        <Button theme={theme} variant="secondary">
                          Secondary
                        </Button>
                        <Button theme={theme} variant="ghost">
                          Ghost
                        </Button>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 8,
                          flexWrap: 'wrap',
                          marginBottom: 12,
                        }}
                      >
                        <Button theme={theme} variant="primary" size="sm">
                          Small
                        </Button>
                        <Button theme={theme} variant="primary" disabled>
                          Disabled
                        </Button>
                        <Button
                          theme={theme}
                          variant="primary"
                          loading={btnLoading}
                          onPress={() => {
                            setBtnLoading(true);
                            setTimeout(() => setBtnLoading(false), 2000);
                          }}
                        >
                          {btnLoading ? 'Loading' : 'Click Me'}
                        </Button>
                      </View>
                      <Typography theme={theme} variant="caption">
                        Icon Buttons
                      </Typography>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                        <IconButton theme={theme} accessibilityLabel="Edit" variant="default">
                          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth={2} strokeLinecap="round">
                            <SvgPath d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </Svg>
                        </IconButton>
                        <IconButton theme={theme} accessibilityLabel="Delete" variant="danger">
                          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.danger} strokeWidth={2} strokeLinecap="round">
                            <SvgPolyline points="3 6 5 6 21 6" />
                            <SvgPath d="M19 6l-1 14H6L5 6" />
                            <SvgPath d="M10 11v6" />
                            <SvgPath d="M14 11v6" />
                          </Svg>
                        </IconButton>
                        <IconButton theme={theme} accessibilityLabel="Settings" variant="ghost">
                          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round">
                            <SvgCircle cx={12} cy={12} r={3} />
                            <SvgPath d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                          </Svg>
                        </IconButton>
                        <IconButton theme={theme} accessibilityLabel="Disabled" variant="default" disabled>
                          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth={2} strokeLinecap="round">
                            <SvgCircle cx={12} cy={12} r={10} />
                            <SvgLine x1={15} y1={9} x2={9} y2={15} />
                            <SvgLine x1={9} y1={9} x2={15} y2={15} />
                          </Svg>
                        </IconButton>
                      </View>
                    </GlassCard>

                    <SectionLabel theme={theme}>Text Input</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <TextInput
                        theme={theme}
                        label="Habit name"
                        value={inputValue}
                        onChangeText={setInputValue}
                        placeholder="e.g. Morning meditation"
                      />
                      <View style={{ marginTop: 14 }}>
                        <TextInput
                          theme={theme}
                          label="With error"
                          value=""
                          onChangeText={() => {}}
                          placeholder="Required"
                          error="This field is required"
                        />
                      </View>
                    </GlassCard>

                    <SectionLabel theme={theme}>Search Bar</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <SearchBar
                        theme={theme}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        placeholder="Search habits..."
                      />
                    </GlassCard>

                    <SectionLabel theme={theme}>Segmented Control</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <SegmentedControl
                        theme={theme}
                        options={[
                          { label: 'Week', value: 'week' },
                          { label: 'Month', value: 'month' },
                          { label: 'Year', value: 'year' },
                        ]}
                        value={segmentValue}
                        onChange={setSegmentValue}
                      />
                      <Typography theme={theme} variant="caption" style={{ marginTop: 10 }}>
                        Selected: {segmentValue}
                      </Typography>
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
                        Selected:{' '}
                        {selectedDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    </GlassCard>
                  </>
                )}

                {/* ─── Composition Section ─── */}
                {show('composition') && (
                  <>
                    <SectionLabel theme={theme}>Settings Rows</SectionLabel>
                    <GlassCard theme={theme} style={{ paddingVertical: 4, paddingHorizontal: 20 }}>
                      <SettingsRow
                        theme={theme}
                        label="Notifications"
                        description="Receive daily reminders"
                        checked={settingsValues.notif}
                        onChange={(v) => setSettingsValues((p) => ({ ...p, notif: v }))}
                      />
                      <Divider theme={theme} />
                      <SettingsRow
                        theme={theme}
                        label="Auto-sync"
                        description="Sync data across devices"
                        checked={settingsValues.sync}
                        onChange={(v) => setSettingsValues((p) => ({ ...p, sync: v }))}
                      />
                      <Divider theme={theme} />
                      <SettingsRow
                        theme={theme}
                        label="Haptic feedback"
                        checked={settingsValues.haptic}
                        onChange={(v) => setSettingsValues((p) => ({ ...p, haptic: v }))}
                      />
                    </GlassCard>

                    <SectionLabel theme={theme}>Modal</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <Button
                        theme={theme}
                        variant="primary"
                        onPress={() => setModalOpen(true)}
                      >
                        Open Modal
                      </Button>
                    </GlassCard>

                    <SectionLabel theme={theme}>Toast</SectionLabel>
                    <GlassCard theme={theme} style={{ padding: 20 }}>
                      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                        <Button
                          theme={theme}
                          variant="primary"
                          size="sm"
                          onPress={() => showToast('success')}
                        >
                          Success
                        </Button>
                        <Button
                          theme={theme}
                          variant="secondary"
                          size="sm"
                          onPress={() => showToast('error')}
                        >
                          Error
                        </Button>
                        <Button
                          theme={theme}
                          variant="ghost"
                          size="sm"
                          onPress={() => showToast('info')}
                        >
                          Info
                        </Button>
                      </View>
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
              </View>
            </ScrollView>
          </BlurTargetView>

          {/* ═══════════ Modals (outside ScrollView) ═══════════ */}
          <HabitDetailModal
            theme={theme}
            habit={detailHabit}
            onClose={() => setDetailHabit(null)}
          />

          <Modal
            theme={theme}
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Delete Habit?"
            actions={[
              {
                label: 'Cancel',
                variant: 'secondary',
                onClick: () => setModalOpen(false),
              },
              {
                label: 'Delete',
                variant: 'danger',
                onClick: () => setModalOpen(false),
              },
            ]}
          >
            <Typography theme={theme} variant="body">
              Are you sure you want to delete this habit? This action cannot be undone and all
              associated data will be lost.
            </Typography>
          </Modal>

          {/* ═══════════ Toast (at bottom) ═══════════ */}
          <Toast
            theme={theme}
            message={
              toastType === 'success'
                ? 'Habit saved successfully!'
                : toastType === 'error'
                  ? 'Something went wrong.'
                  : 'Sync in progress...'
            }
            type={toastType}
            visible={toastVisible}
            onDismiss={() => setToastVisible(false)}
          />

          {/* ═══════════ Fixed Bottom Tab Bar ═══════════ */}
          <BottomTabBar
            theme={theme}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddHabit={() => {}}
            onVoiceNote={() => {}}
            blurTarget={blurTargetRef}
          />
        </View>
        </BlurTargetContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
  },
  loadingText: {
    color: '#9a9a9a',
    fontSize: 16,
  },
});
