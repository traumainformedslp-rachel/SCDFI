import React, { useState } from "react";
import DOMAINS from "../data/domains";
import { THEMES, SECTION_COLORS, VERSION_META } from "../data/constants";
import { SCALES } from "../data/scales";
import { getItems, getContext } from "../utils/scoring";

const ThemeToggle = ({ dark, toggle }) => (
  <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={{
    padding: "7px 14px", borderRadius: 100,
    border: `1px solid ${dark ? "#1e3332" : "#d4dfdf"}`,
    background: dark ? "#142322" : "#ffffff",
    color: dark ? "#6b8886" : "#7a9191",
    fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6,
  }}>
    <span style={{ fontSize: 13, lineHeight: 1 }}>{dark ? "☾" : "☀"}</span>
    {dark ? "Dark" : "Light"}
  </button>
);

export function ProtocolForm({ version, dark, onBack, onToggle }) {
  const t = dark ? THEMES.dark : THEMES.light;
  const vm = VERSION_META[version];
  const scale = SCALES[version];
  const isObs = version === "clinician" || version === "teacher";
  const isParent = version === "parent";

  const [form, setForm] = useState({
    client: "", respondent: "", date: new Date().toISOString().slice(0, 10), setting: "",
  });

  const versionTitles = {
    clinician: "Clinician Protocol",
    teacher: "Teacher Protocol",
    parent: "Parent / Caregiver Protocol",
  };

  const sectionColor = (colorKey) => SECTION_COLORS[colorKey]?.[dark ? "dark" : "light"] || t.accent;

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
      {/* Sticky top bar — screen only */}
      <div className="no-print" style={{
        position: "sticky", top: 6, zIndex: 100,
        background: t.stickyBg, backdropFilter: "saturate(160%) blur(12px)", WebkitBackdropFilter: "saturate(160%) blur(12px)",
        padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderRadius: "0 0 16px 16px", border: `1px solid ${t.border}`, borderTop: "none", flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <div style={{ color: t.text, fontWeight: 500, fontSize: 16, letterSpacing: "-0.005em", lineHeight: 1.1 }}>SCDFI — {versionTitles[version]}</div>
          <div style={{ color: t.textDim, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 3 }}>Printable Form</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <ThemeToggle dark={dark} toggle={onToggle} />
          <button onClick={onBack} style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>← Back</button>
          <button onClick={() => window.print()} style={{ padding: "7px 18px", borderRadius: 100, border: `1px solid ${t.text}`, background: t.text, color: t.bg, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>Print / Save PDF</button>
        </div>
      </div>

      {/* Printable form body */}
      <div className="pc" style={{ background: t.card, borderRadius: 20, padding: "28px 32px", margin: "16px 0", border: `1px solid ${t.border}` }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textDim, marginBottom: 8 }}>
            Social-Communication & Developmental Functioning Inventory
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, color: t.text, letterSpacing: "-0.01em" }}>
            {vm.icon} {versionTitles[version]}
          </div>
          <div style={{ fontSize: 11, color: t.textDim, marginTop: 4 }}>
            Rachel Terra Norton, MS, CCC-SLP · v0.3
          </div>
        </div>

        {/* Client info block */}
        <div style={{ background: dark ? "#111" : "#f7fafa", borderRadius: 12, padding: "14px 18px", marginBottom: 16, border: `1px solid ${t.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Client / Student Name</div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 24, padding: "2px 0" }}></div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>
                {isParent ? "Respondent Name" : "Respondent (Name, Role)"}
              </div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 24, padding: "2px 0" }}></div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Date</div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 24, padding: "2px 0" }}></div>
            </div>
          </div>
          {isObs && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Setting / Context</div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 24, padding: "2px 0" }}></div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{ background: dark ? `${vm.color}10` : `${vm.color}08`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, border: `1px solid ${dark ? `${vm.color}33` : `${vm.color}22`}`, fontSize: 13, color: t.textSub, lineHeight: 1.6 }}>
          <b style={{ color: vm.color }}>Instructions:</b> {vm.instructions}
        </div>

        {/* Domain sections */}
        {DOMAINS.map((d) => {
          const items = getItems(d, version);
          const ctx = getContext(d, version);
          const sc = sectionColor(d.colorKey);

          return (
            <div key={d.id} style={{ marginBottom: 24, pageBreakInside: "avoid" }}>
              {/* Rating scale key — repeated per section for print */}
              <div style={{ background: dark ? "#142322" : "#f7fafa", borderRadius: 8, padding: "6px 12px", marginBottom: 8, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: 1, marginRight: 2 }}>Key:</span>
                {scale.map((s) => (
                  <div key={s.value} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 6, background: dark ? s.darkBg : s.bg, border: `1.5px solid ${s.color}` }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", border: `1.5px solid ${s.color}`, background: "transparent", flexShrink: 0 }}></div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: s.color }}>{s.label}</span>
                  </div>
                ))}
                {isParent && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 6, background: dark ? "#2a2030" : "#f3edf9", border: "1.5px solid #7a5aaa" }}>
                    <span style={{ fontSize: 10 }}>⚡</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#7a5aaa" }}>Stress</span>
                  </div>
                )}
              </div>
              {/* Domain header */}
              <div style={{
                borderRadius: 14, padding: "12px 18px", marginBottom: 10,
                display: "flex", alignItems: "center", gap: 10,
                background: dark ? "#111" : sc, border: dark ? `2px solid ${sc}` : "none",
                WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
              }}>
                <span style={{ fontSize: 22 }}>{d.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: dark ? sc : "#fff" }}>
                    <span style={{ opacity: 0.5, marginRight: 5 }}>D{d.n}</span>{d.title}
                  </div>
                  <div style={{ color: dark ? `${sc}aa` : "#ffffffcc", fontSize: 11, marginTop: 1 }}>{d.desc}</div>
                </div>
              </div>

              {/* Framework reference */}
              <div style={{ fontSize: 9, color: t.textDim, marginBottom: 6, fontStyle: "italic", paddingLeft: 4 }}>{d.fw}</div>

              {/* Context prompt for observer versions */}
              {isObs && ctx && (
                <div style={{ background: dark ? `${sc}10` : `${sc}08`, borderRadius: 8, padding: "8px 12px", marginBottom: 8, border: `1px dashed ${dark ? `${sc}44` : `${sc}44`}`, fontSize: 11, color: t.textSub, lineHeight: 1.5, fontStyle: "italic" }}>
                  <span style={{ fontWeight: 700, color: sc, fontStyle: "normal" }}>Observation context: </span>{ctx}
                </div>
              )}

              {/* Rating table */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 700, color: dark ? sc : t.accentDeep, textTransform: "uppercase", letterSpacing: ".5px", borderBottom: `2px solid ${sc}`, background: dark ? "#0d1b1a" : `${sc}0a`, width: "50%" }}>Item</th>
                    {scale.map((s) => {
                      const abbrev = { "Not Observed": "NO", "Emerging": "EM", "Consistent with Support": "CS", "Consistent Independently": "CI" };
                      return (
                        <th key={s.value} style={{ textAlign: "center", padding: "6px 2px", fontSize: 8, fontWeight: 700, color: s.color, letterSpacing: ".3px", borderBottom: `2px solid ${sc}`, background: dark ? "#0d1b1a" : `${sc}0a`, minWidth: 40 }}>
                          <div style={{ fontSize: 8, lineHeight: 1.2, marginBottom: 2 }}>{abbrev[s.label] || s.label.split(" ")[0]}</div>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${s.color}`, margin: "0 auto" }}></div>
                        </th>
                      );
                    })}
                    {isParent && (
                      <th style={{ textAlign: "center", padding: "8px 4px", fontSize: 9, fontWeight: 700, color: "#7a5aaa", borderBottom: `2px solid ${sc}`, background: dark ? "#0d1b1a" : `${sc}0a`, minWidth: 28 }}>⚡</th>
                    )}
                    {isObs && (
                      <th style={{ textAlign: "left", padding: "8px 8px", fontSize: 10, fontWeight: 700, color: dark ? sc : t.accentDeep, textTransform: "uppercase", letterSpacing: ".3px", borderBottom: `2px solid ${sc}`, background: dark ? "#0d1b1a" : `${sc}0a`, minWidth: 100 }}>Notes</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((text, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                      <td style={{ padding: "8px 10px", fontSize: 12.5, color: t.text, lineHeight: 1.4 }}>{text}</td>
                      {scale.map((s) => (
                        <td key={s.value} style={{ textAlign: "center", padding: "6px 4px" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${t.border}`, margin: "0 auto" }}></div>
                        </td>
                      ))}
                      {isParent && (
                        <td style={{ textAlign: "center", padding: "6px 4px" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${t.border}`, margin: "0 auto" }}></div>
                        </td>
                      )}
                      {isObs && (
                        <td style={{ padding: "4px 8px" }}>
                          <div style={{ borderBottom: `1px solid ${t.border}`, minHeight: 20 }}></div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Notes area for observer */}
              {isObs && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 4 }}>Observations / Contextual Notes</div>
                  <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, minHeight: 80, padding: 8 }}></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Summary / signature area */}
        <div style={{ pageBreakInside: "avoid", marginTop: 32 }}>
          <div style={{
            borderRadius: 14, padding: "14px 18px", marginBottom: 14,
            display: "flex", alignItems: "center", gap: 10,
            background: dark ? "#111" : t.accent, border: dark ? `2px solid ${t.accent}` : "none",
            WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
          }}>
            <span style={{ fontSize: 22 }}>📝</span>
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: dark ? t.accent : "#fff" }}>
              Summary & Signature
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 6 }}>Overall Clinical Impressions / Notes</div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, minHeight: 80, padding: 8, marginBottom: 16 }}></div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Signature</div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 30 }}></div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Date</div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 30 }}></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Printed Name</div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 30 }}></div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>
                {isParent ? "Relationship to Child" : "Role / Title"}
              </div>
              <div style={{ borderBottom: `1.5px solid ${t.border}`, minHeight: 30 }}></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 28, paddingTop: 16, borderTop: `1px solid ${t.border}`, color: t.textDim, fontSize: 10, lineHeight: 1.8, letterSpacing: "0.1em" }}>
          SCDFI v0.3 · Social-Communication & Developmental Functioning Inventory<br />
          Rachel Terra Norton, MS, CCC-SLP · Confidential<br />
          Inspired by ASHA Social Communication Benchmarks, LSP, FEDC/DIR, BESSI, SSF, Roth & Worthington
        </div>
      </div>

      {/* Bottom bar — screen only */}
      <div className="no-print" style={{
        position: "sticky", bottom: 0, background: t.footerBg, padding: "12px 24px",
        borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "center", gap: 12,
        marginTop: 8, border: `1px solid ${t.border}`, borderBottom: "none",
      }}>
        <button onClick={() => window.print()} style={{ padding: "12px 28px", borderRadius: 999, border: "none", background: t.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, boxShadow: `0 3px 14px ${t.accent}44` }}>🖨 Print / Save PDF</button>
      </div>
    </div>
  );
}
