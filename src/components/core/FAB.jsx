import { useState } from 'react';

export default function FAB({ theme }) {
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
