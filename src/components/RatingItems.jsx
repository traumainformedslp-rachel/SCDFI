import React from "react";
import { SCALES } from "../data/scales";

/**
 * Rating button — shows number + full label. No face icons.
 */
export function RatingButton({ option, selected, onClick }) {
  const s = selected === option.value;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "8px 8px 6px", borderRadius: 11,
        border: `2px solid ${s ? option.color : "#333"}`,
        background: s ? option.bg : "#1a1a1a",
        cursor: "pointer", transition: "all .18s", flex: 1, minWidth: 0,
        transform: s ? "scale(1.04)" : "scale(1)",
        boxShadow: s ? `0 3px 10px ${option.color}30` : "none",
      }}
    >
      <span style={{
        fontFamily: "'Space Mono', monospace", fontWeight: 700,
        fontSize: s ? 18 : 15, color: s ? option.color : "#555",
        lineHeight: 1,
      }}>
        {option.value}
      </span>
      <span style={{
        fontWeight: 700, fontSize: 9.5, color: option.color,
        textAlign: "center", lineHeight: 1.2,
        maxWidth: 80, wordWrap: "break-word",
      }}>
        {option.label}
      </span>
    </button>
  );
}

/**
 * Clinician / Teacher item row — 5-point scale.
 */
export function ObserverRow({ text, value, onChange, scaleKey = "clinician" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9,
      background: value != null ? "#111" : "#0d0d0d", border: "1px solid #1e1e1e", marginBottom: 5,
    }}>
      <div style={{ flex: 1, fontSize: 14, color: "#ccc", lineHeight: 1.5 }}>{text}</div>
      <div style={{ display: "flex", gap: 3, flexShrink: 0, maxWidth: 440 }}>
        {SCALES[scaleKey].map((o) => (
          <RatingButton key={o.value} option={o} selected={value} onClick={() => onChange(o.value)} />
        ))}
      </div>
    </div>
  );
}

/**
 * Parent item row — 3-point scale + stress modifier checkbox.
 */
export function ParentRow({ text, value, onChange, stress, onStress }) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 9,
      background: value != null ? "#111" : "#0d0d0d", border: "1px solid #1e1e1e", marginBottom: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, fontSize: 14, color: "#ccc", lineHeight: 1.5 }}>{text}</div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0, maxWidth: 300 }}>
          {SCALES.parent.map((o) => (
            <RatingButton key={o.value} option={o} selected={value} onClick={() => onChange(o.value)} />
          ))}
        </div>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, cursor: "pointer", fontSize: 12, color: "#666" }}>
        <input
          type="checkbox" checked={!!stress}
          onChange={(e) => onStress(e.target.checked)}
          style={{ accentColor: "#9b59b6" }}
        />
        <em>Can do this, but not when stressed / tired / hungry / unfamiliar</em>
      </label>
    </div>
  );
}

/**
 * Self-report item row — 4-point Likert.
 */
export function SelfReportRow({ text, value, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9,
      background: value != null ? "#140a1a" : "#0d0d0d", border: "1px solid #1e1e1e", marginBottom: 5,
    }}>
      <div style={{ flex: 1, fontSize: 14, color: "#ccc", lineHeight: 1.5 }}>{text}</div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0, maxWidth: 360 }}>
        {SCALES.self.map((o) => (
          <RatingButton key={o.value} option={o} selected={value} onClick={() => onChange(o.value)} />
        ))}
      </div>
    </div>
  );
}
