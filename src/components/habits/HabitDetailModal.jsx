import { useMemo, useRef, useEffect } from 'react';
import { Drawer } from 'vaul';
import { getHabitColor } from '../../config/theme';
import RadialProgress from '../charts/RadialProgress';
import VoiceNoteCard from '../voice/VoiceNoteCard';

export default function HabitDetailModal({ theme, habit, onClose }) {
  const lastHabitRef = useRef(null);
  if (habit) lastHabitRef.current = habit;
  const displayHabit = habit || lastHabitRef.current;

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
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const color = displayHabit ? getHabitColor(displayHabit.colorId).primary : '#888';
  const weekly = displayHabit?.weekly || [1,1,0,1,1,1,0];
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const completionRate = Math.round((weekly.filter(Boolean).length / 7) * 100);

  const miniTrend = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) arr.push(Math.random() > 0.35 ? 1 : 0);
    return arr;
  }, []);

  return (
    <Drawer.Root
      open={!!habit}
      onOpenChange={(open) => { if (!open) onClose(); }}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay style={{
          position:'fixed', inset:0, zIndex:100,
          background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)',
        }} />
        <Drawer.Content style={{
          position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
          zIndex:101, width:'100%', maxWidth:420, maxHeight:'85vh',
          background:theme.surface1, borderRadius:'20px 20px 0 0',
          overflowY:'auto', outline:'none',
        }}>
          <Drawer.Handle style={{ background:theme.border }} />

          {displayHabit && (
            <div style={{ padding:'8px 20px 32px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:color+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:16, height:16, borderRadius:9999, background:color }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:20, fontWeight:500, color:theme.textPrimary }}>{displayHabit.name}</div>
                  <div style={{ fontSize:12, fontWeight:300, color:theme.textMuted }}>{displayHabit.category}</div>
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

              <div style={{ display:'flex', gap:12, marginBottom:20 }}>
                {[
                  { label:'Streak', value:displayHabit.streak, suffix:' days' },
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

              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:500, color:theme.textMuted, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Voice Note</div>
                <VoiceNoteCard theme={theme} habitName={displayHabit.name} duration="0:42" timestamp="7:15 AM" color={color} />
              </div>

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
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
