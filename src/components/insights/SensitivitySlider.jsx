import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import GlassCard from "../foundation/GlassCard";
import AIBannerPill from "./AIBannerPill";

export default function SensitivitySlider({ theme }) {
  const [value, setValue] = useState(50);

  const isLow = value < 33;
  const isMid = value >= 33 && value <= 66;
  const isHigh = value > 66;
  const modeLabel = isLow
    ? "Discovery"
    : isMid
      ? "Balanced"
      : "High Confidence";
  const modeDesc = isLow
    ? "See insights quickly with lower accuracy \u2014 great for cold start"
    : isMid
      ? "Balanced mix of speed and reliability"
      : "Only show insights with strong statistical backing";

  return (
    <GlassCard theme={theme} style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{ fontSize: 14, fontWeight: 500, color: theme.textPrimary }}
        >
          Insight Sensitivity
        </div>
        <AIBannerPill theme={theme} />
      </div>

      <Slider.Root
        value={[value]}
        onValueChange={([v]) => setValue(v)}
        min={0}
        max={100}
        step={1}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: 32,
          cursor: "pointer",
          marginBottom: 8,
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <Slider.Track
          style={{
            position: "relative",
            flexGrow: 1,
            height: 3,
            borderRadius: 9999,
            background: `linear-gradient(to right, ${theme.accent}30, ${theme.accent})`,
          }}
        >
          <Slider.Range
            style={{
              position: "absolute",
              height: "100%",
              borderRadius: 9999,
            }}
          />
        </Slider.Track>
        <Slider.Thumb
          style={{
            all: "unset",
            display: "block",
            width: 22,
            height: 22,
            borderRadius: 9999,
            background: theme.surface1,
            border: `2.5px solid color-mix(in srgb, ${theme.accent} ${30 + value * 0.7}%, transparent)`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        />
      </Slider.Root>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 400,
            color: isLow ? theme.accent : theme.textMuted,
          }}
        >
          Fast
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 400,
            color: isMid ? theme.accent : theme.textMuted,
          }}
        >
          Balanced
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 400,
            color: isHigh ? theme.accent : theme.textMuted,
          }}
        >
          Accurate
        </span>
      </div>

      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: theme.surface2,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            background: theme.accentFaint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.accent}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isLow && (
              <>
                <circle cx={12} cy={12} r={10} />
                <path d="M8 12l2 2 4-4" />
              </>
            )}
            {isMid && (
              <>
                <circle cx={12} cy={12} r={10} />
                <line x1={12} y1={8} x2={12} y2={12} />
                <line x1={12} y1={16} x2={12.01} y2={16} />
              </>
            )}
            {isHigh && (
              <>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </>
            )}
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: theme.textPrimary,
              marginBottom: 2,
            }}
          >
            {modeLabel}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 300,
              color: theme.textMuted,
              lineHeight: 1.45,
            }}
          >
            {modeDesc}
          </div>
        </div>
        <div
          style={{
            padding: "2px 8px",
            borderRadius: 9999,
            background: theme.accentMuted,
            fontSize: 10,
            fontWeight: 600,
            color: theme.accent,
            flexShrink: 0,
          }}
        >
          {value}%
        </div>
      </div>
    </GlassCard>
  );
}
