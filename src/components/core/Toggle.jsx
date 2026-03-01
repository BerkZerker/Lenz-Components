import { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';

export default function Toggle({ theme, checked, onChange, size = 'md', style = {} }) {
  const [hovered, setHovered] = useState(false);
  const sizes = { sm: { w:40, h:22, knob:16, pad:3 }, md: { w:48, h:26, knob:20, pad:3 }, lg: { w:56, h:30, knob:24, pad:3 } };
  const s = sizes[size] || sizes.md;
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={(checked) => onChange(checked)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all:'unset', boxSizing:'border-box',
        position:'relative', width:s.w, height:s.h, borderRadius:9999, ...style,
        background: checked ? theme.accentMuted : theme.border,
        cursor:'pointer', transition:'background 0.2s',
        opacity: hovered ? 0.85 : 1, flexShrink:0,
      }}
    >
      <Switch.Thumb
        style={{
          display:'block',
          position:'absolute', top:s.pad, left: checked ? s.w - s.knob - s.pad : s.pad,
          width:s.knob, height:s.knob, borderRadius:9999,
          background: checked ? theme.accent : theme.textMuted,
          transition:'left 0.2s ease, background 0.2s',
        }}
      />
    </Switch.Root>
  );
}
