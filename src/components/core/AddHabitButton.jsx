import { useState } from 'react';

export default function AddHabitButton({ theme }) {
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
