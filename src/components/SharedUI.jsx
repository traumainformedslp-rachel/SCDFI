import React from "react";
import { SCALES } from "../data/scales";

/** Colored domain section header with icon */
export function SectionHeader({ icon, title, color, num, sub }) {
  return (
    <div style={{
      background: color + "18", borderRadius: 12, padding: "14px 18px",
      marginTop: 24, marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
      border: `1px solid ${color}33`,
    }}>
      <div style={{
        background: color + "22", borderRadius: 8, width: 38, height: 38,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "#e8e8e8", fontWeight: 700, fontSize: 15, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>
          <span style={{ opacity: 0.4, marginRight: 5 }}>D{num}</span>{title}
        </div>
        {sub && <div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/** Context prompt callout for clinician/teacher versions */
export function ContextPrompt({ text, color }) {
  if (!text) return null;
  return (
    <div style={{
      background: `${color}08`, borderRadius: 8, padding: "10px 14px",
      marginBottom: 8, border: `1px dashed ${color}44`,
      fontSize: 12, color: "#888", lineHeight: 1.6, fontStyle: "italic",
    }}>
      <span style={{ fontWeight: 700, color, fontStyle: "normal" }}>Observation context: </span>
      {text}
    </div>
  );
}

/** Rating scale legend strip — numbers instead of faces */
export function Legend({ version }) {
  const scaleKey = version === "teacher" ? "teacher" : version;
  return (
    <div style={{
      background: "#1a1a1a", borderRadius: 10, padding: "10px 14px",
      marginBottom: 12, border: "1px solid #222",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace" }}>
        Rating Scale
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SCALES[scaleKey].map((o) => (
          <div key={o.value} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
            borderRadius: 8, background: o.bg, border: `1px solid ${o.color}44`,
          }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, color: o.color }}>{o.value}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: o.color }}>{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
