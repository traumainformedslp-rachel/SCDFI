import React from "react";
import Face from "./Face";
import { SCALES } from "../data/scales";

/** Colored domain section header with icon */
export function SectionHeader({ icon, title, color, num, sub }) {
  return (
    <div style={{
      background: color + "18", borderRadius: 12, padding: "12px 16px",
      marginTop: 24, marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
      border: `1px solid ${color}33`,
    }}>
      <div style={{
        background: color + "22", borderRadius: 8, width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "#e8e8e8", fontWeight: 700, fontSize: 13, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>
          <span style={{ opacity: 0.4, marginRight: 5 }}>D{num}</span>{title}
        </div>
        {sub && <div style={{ color: "#666", fontSize: 10, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

/** Context prompt callout for clinician/teacher versions */
export function ContextPrompt({ text, color }) {
  if (!text) return null;
  return (
    <div style={{
      background: `${color}08`, borderRadius: 8, padding: "8px 12px",
      marginBottom: 8, border: `1px dashed ${color}44`,
      fontSize: 10.5, color: "#888", lineHeight: 1.5, fontStyle: "italic",
    }}>
      <span style={{ fontWeight: 700, color, fontStyle: "normal" }}>Observation context: </span>
      {text}
    </div>
  );
}

/** Rating scale legend strip */
export function Legend({ version }) {
  const scaleKey = version === "teacher" ? "teacher" : version;
  return (
    <div style={{
      background: "#1a1a1a", borderRadius: 10, padding: "8px 14px",
      marginBottom: 12, border: "1px solid #222",
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace" }}>
        Rating Scale
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SCALES[scaleKey].map((o) => (
          <div key={o.value} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
            borderRadius: 8, background: o.bg, border: `1px solid ${o.color}44`,
          }}>
            <Face type={o.face} size={16} />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: o.color }}>{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
