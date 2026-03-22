import React from "react";
import Face from "./Face";
import { SCALES } from "../data/scales";

/** Colored domain section header with icon */
export function SectionHeader({ icon, title, color, num, sub }) {
  return (
    <div style={{
      background: color, borderRadius: 12, padding: "12px 16px",
      marginTop: 24, marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{
        background: "#fff2", borderRadius: 8, width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
          <span style={{ opacity: 0.5, marginRight: 5 }}>D{num}</span>{title}
        </div>
        {sub && <div style={{ color: "#fffb", fontSize: 10, marginTop: 1 }}>{sub}</div>}
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
      fontSize: 10.5, color: "#666", lineHeight: 1.5, fontStyle: "italic",
    }}>
      <span style={{ fontWeight: 700, color, fontStyle: "normal" }}>Observation context: </span>
      {text}
    </div>
  );
}

/** Rating scale legend strip — full labels */
export function Legend({ version }) {
  const scaleKey = version === "teacher" ? "teacher" : version;
  return (
    <div style={{
      background: "#F8F9FB", borderRadius: 10, padding: "8px 14px",
      marginBottom: 12, border: "1px solid #eee",
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#aaa", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>
        Rating Scale
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SCALES[scaleKey].map((o) => (
          <div key={o.value} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
            borderRadius: 8, background: o.bg, border: `1.5px solid ${o.color}`,
          }}>
            <Face type={o.face} size={16} />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: o.color }}>{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
