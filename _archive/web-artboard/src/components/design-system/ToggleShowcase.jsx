import { useState } from 'react';
import GlassCard from '../foundation/GlassCard';
import Toggle from '../core/Toggle';

export default function ToggleShowcase({ theme, style = {} }) {
  const [vals, setVals] = useState({ a:true, b:false, c:true });
  const flip = k => setVals(v => ({ ...v, [k]:!v[k] }));
  const rows = [
    { key:'a', label:'Notifications', size:'sm' },
    { key:'b', label:'Auto-sync',     size:'md' },
    { key:'c', label:'Dark mode',     size:'lg' },
  ];
  return (
    <GlassCard theme={theme} style={{ padding:20, ...style }}>
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
