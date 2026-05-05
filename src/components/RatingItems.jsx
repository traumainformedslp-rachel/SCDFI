import React from "react";
import Face from "./Face";
import { SCALES } from "../data/scales";

export function RatingButton({ option, selected, onClick, dark }) {
  const s = selected === option.value;
  const borderColor = s ? option.color : (dark ? "#1e3332" : "#d4dfdf");
  const bg = s ? (dark ? option.darkBg : option.bg) : (dark ? "#142322" : "#fafafa");
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        padding: "6px 6px 5px", borderRadius: 11,
        border: `2px solid ${borderColor}`,
        background: bg,
        cursor: "pointer", transition: "all .18s", flex: 1, minWidth: 0,
        transform: s ? "scale(1.04)" : "scale(1)",
        boxShadow: s ? `0 3px 10px ${option.color}30` : "none",
      }}
    >
      <Face type={option.face} size={s ? 28 : 22} />
      <span style={{
        fontWeight: 700, fontSize: 8.5, color: option.color,
        textAlign: "center", lineHeight: 1.15,
        maxWidth: 72, wordWrap: "break-word",
      }}>
        {option.label}
      </span>
    </button>
  );
}

export function ObserverRow({ text, value, onChange, scaleKey = "clinician", dark }) {
  const t = dark
    ? { bg: value != null ? "#1e3332" : "#142322", border: "#1e3332", text: "#e0edec" }
    : { bg: value != null ? "#f0faf9" : "#fafbfc", border: "#d4dfdf", text: "#1c2d2d" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9,
      background: t.bg, border: `1px solid ${t.border}`, marginBottom: 5,
    }}>
      <div style={{ flex: 1, fontSize: 13, color: t.text, lineHeight: 1.45 }}>{text}</div>
      <div style={{ display: "flex", gap: 3, flexShrink: 0, maxWidth: 420 }}>
        {SCALES[scaleKey].map((o) => (
          <RatingButton key={o.value} option={o} selected={value} onClick={() => onChange(o.value)} dark={dark} />
        ))}
      </div>
    </div>
  );
}

export function ParentRow({ text, value, onChange, stress, onStress, dark }) {
  const t = dark
    ? { bg: value != null ? "#1e3332" : "#142322", border: "#1e3332", text: "#e0edec", stressColor: "#6b8886" }
    : { bg: value != null ? "#f0faf9" : "#fafbfc", border: "#d4dfdf", text: "#1c2d2d", stressColor: "#7a9191" };
  return (
    <div style={{
      padding: "8px 12px", borderRadius: 9,
      background: t.bg, border: `1px solid ${t.border}`, marginBottom: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, fontSize: 13, color: t.text, lineHeight: 1.45 }}>{text}</div>
        <div style={{ display: "flex", gap: 3, flexShrink: 0, maxWidth: 400 }}>
          {SCALES.parent.map((o) => (
            <RatingButton key={o.value} option={o} selected={value} onClick={() => onChange(o.value)} dark={dark} />
          ))}
        </div>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, cursor: "pointer", fontSize: 10, color: t.stressColor }}>
        <input
          type="checkbox" checked={!!stress}
          onChange={(e) => onStress(e.target.checked)}
          style={{ accentColor: "#7a5aaa" }}
        />
        <em>Can do this, but not when stressed / tired / hungry / unfamiliar</em>
      </label>
    </div>
  );
}

export function SelfReportRow({ text, value, onChange, dark }) {
  const t = dark
    ? { bg: value != null ? "#1e3332" : "#142322", border: "#1e3332", text: "#e0edec" }
    : { bg: value != null ? "#f5f0fa" : "#fafbfc", border: "#d4dfdf", text: "#1c2d2d" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9,
      background: t.bg, border: `1px solid ${t.border}`, marginBottom: 5,
    }}>
      <div style={{ flex: 1, fontSize: 13, color: t.text, lineHeight: 1.45 }}>{text}</div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0, maxWidth: 360 }}>
        {SCALES.self.map((o) => (
          <RatingButton key={o.value} option={o} selected={value} onClick={() => onChange(o.value)} dark={dark} />
        ))}
      </div>
    </div>
  );
}
