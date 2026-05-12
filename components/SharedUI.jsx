import React from "react";
import Face from "./Face";
import { SCALES } from "../data/scales";
import { SECTION_COLORS } from "../data/constants";

export function SectionHeader({ icon, title, colorKey, num, sub, dark }) {
  const color = SECTION_COLORS[colorKey]?.[dark ? "dark" : "light"] || "#1a7a7a";
  return (
    <div style={{
      borderRadius: 14, padding: "14px 20px",
      marginTop: 28, marginBottom: 14, display: "flex", alignItems: "center", gap: 12,
      background: dark ? "#111" : color,
      border: dark ? `2px solid ${color}` : "none",
    }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 13,
          letterSpacing: 2, textTransform: "uppercase",
          color: dark ? color : "#fff",
        }}>
          <span style={{ opacity: 0.5, marginRight: 5 }}>D{num}</span>{title}
        </div>
        {sub && <div style={{ color: dark ? `${color}99` : "#ffffffbb", fontSize: 11, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function ContextPrompt({ text, color, dark }) {
  if (!text) return null;
  const t = dark
    ? { bg: `${color}10`, border: `${color}33`, textColor: "#a3bfbd" }
    : { bg: `${color}08`, border: `${color}44`, textColor: "#3d5555" };
  return (
    <div style={{
      background: t.bg, borderRadius: 8, padding: "8px 12px",
      marginBottom: 8, border: `1px dashed ${t.border}`,
      fontSize: 11, color: t.textColor, lineHeight: 1.5, fontStyle: "italic",
    }}>
      <span style={{ fontWeight: 700, color, fontStyle: "normal" }}>Observation context: </span>
      {text}
    </div>
  );
}

export function Legend({ version, dark }) {
  const scaleKey = version === "teacher" ? "teacher" : version;
  const t = dark
    ? { bg: "#142322", border: "#1e3332", labelColor: "#6b8886" }
    : { bg: "#f7fafa", border: "#d4dfdf", labelColor: "#7a9191" };
  return (
    <div style={{
      background: t.bg, borderRadius: 10, padding: "8px 14px",
      marginBottom: 12, border: `1px solid ${t.border}`,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: t.labelColor, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>
        Rating Scale
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SCALES[scaleKey].map((o) => (
          <div key={o.value} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
            borderRadius: 8, background: dark ? o.darkBg : o.bg, border: `1.5px solid ${o.color}`,
          }}>
            <Face type={o.face} size={16} />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: o.color }}>{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
