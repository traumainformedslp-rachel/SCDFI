import React from "react";
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

const ABBREV = {
  "Not Observed": "NO",
  "Emerging": "EM",
  "Consistent with Support": "CS",
  "Consistent Independently": "CI",
};

export function ProtocolForm({ version, dark, onBack, onToggle }) {
  const t = dark ? THEMES.dark : THEMES.light;
  const vm = VERSION_META[version];
  const scale = SCALES[version];
  const isObs = version === "clinician" || version === "teacher";
  const isParent = version === "parent";

  const versionTitles = {
    clinician: "Clinician Protocol",
    teacher: "Teacher Protocol",
    parent: "Parent / Caregiver Protocol",
  };
  const badgeColor = {
    clinician: "#1b3a4b",
    teacher: "#1a7a7a",
    parent: "#2a7a5a",
  }[version];

  const sectionColor = (colorKey) => SECTION_COLORS[colorKey]?.[dark ? "dark" : "light"] || t.accent;

  // Border + ink colors — formal record-form palette
  const ink = dark ? "#e0edec" : "#1a1a1a";
  const inkDim = dark ? "#a3bfbd" : "#666";
  const inkSub = dark ? "#6b8886" : "#888";
  const ruleColor = dark ? "#3a5a58" : "#1a1a1a";
  const lightRule = dark ? "#1e3332" : "#ddd";
  const zebraBg = dark ? "#0d1b1a" : "#f9f9f9";
  const headerBg = dark ? "#142322" : "#f0f0f0";
  const fieldBg = dark ? "#0d1b1a" : "#fff";

  // Lined paper gradient for note boxes
  const linedBg = dark
    ? "repeating-linear-gradient(to bottom, transparent 0, transparent 19px, #1e3332 19px, #1e3332 20px)"
    : "repeating-linear-gradient(to bottom, transparent 0, transparent 19px, #e8e8e8 19px, #e8e8e8 20px)";

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
      {/* Sticky top bar — screen only */}
      <div className="no-print" style={{
        position: "sticky", top: 6, zIndex: 100,
        background: t.stickyBg, backdropFilter: "saturate(160%) blur(12px)", WebkitBackdropFilter: "saturate(160%) blur(12px)",
        padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderRadius: "0 0 16px 16px", border: `1px solid ${t.border}`, borderTop: "none", flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <div style={{ color: t.text, fontWeight: 500, fontSize: 16, letterSpacing: "-0.005em", lineHeight: 1.1 }}>SCDFI — {versionTitles[version]}</div>
          <div style={{ color: t.textDim, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 3 }}>Printable Protocol Form</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <ThemeToggle dark={dark} toggle={onToggle} />
          <button onClick={onBack} style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>← Back</button>
          <button onClick={() => window.print()} style={{ padding: "7px 18px", borderRadius: 100, border: `1px solid ${t.text}`, background: t.text, color: t.bg, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>Print / Save PDF</button>
        </div>
      </div>

      {/* Printable form body */}
      <div className="pc protocol-sheet" style={{
        background: t.card, padding: "32px 40px", margin: "16px 0",
        border: `1px solid ${t.border}`, borderRadius: 8,
        color: ink, fontSize: 11, lineHeight: 1.4,
      }}>

        {/* ─── TITLE HEADER ─── */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          borderBottom: `3px solid ${ruleColor}`, paddingBottom: 10, marginBottom: 12,
        }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, color: ink }}>SCDFI</div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: inkDim, marginTop: 4 }}>
              Social-Communication &amp; Developmental Functioning Inventory
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 4,
            background: badgeColor, color: "#fff", letterSpacing: "0.08em",
            textTransform: "uppercase", whiteSpace: "nowrap", marginTop: 4,
            WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
          }}>
            {versionTitles[version]}
          </div>
        </div>

        {/* ─── CLIENT INFO GRID ─── */}
        <div style={{
          display: "grid", gridTemplateColumns: isObs ? "2fr 2fr 1fr" : "2fr 2fr 1fr",
          border: `1.5px solid ${ruleColor}`, marginBottom: 10,
        }}>
          {[
            { label: isParent ? "Child's Name" : "Client / Student Name" },
            { label: isParent ? "Your Name (Respondent)" : "Respondent (Name, Role)" },
            { label: "Date" },
          ].map((f, i, arr) => (
            <div key={i} style={{
              padding: "5px 10px",
              borderRight: i < arr.length - 1 ? `1px solid ${lightRule}` : "none",
              borderBottom: isObs ? `1px solid ${lightRule}` : "none",
              background: fieldBg,
            }}>
              <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 2 }}>{f.label}</div>
              <div style={{ minHeight: 16 }}></div>
            </div>
          ))}
          {isObs && (
            <div style={{ gridColumn: "1 / -1", padding: "5px 10px", background: fieldBg }}>
              <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 2 }}>Setting / Context</div>
              <div style={{ minHeight: 16 }}></div>
            </div>
          )}
        </div>

        {/* ─── INSTRUCTIONS ─── */}
        <div style={{
          background: dark ? "#142322" : "#f7f7f7", border: `1px solid ${lightRule}`,
          borderRadius: 3, padding: "7px 10px", fontSize: 9, color: ink,
          lineHeight: 1.5, marginBottom: 10,
        }}>
          <strong>Instructions:</strong> {vm.instructions}
        </div>

        {/* ─── DOMAIN SECTIONS ─── */}
        {DOMAINS.map((d) => {
          const items = getItems(d, version);
          const ctx = getContext(d, version);
          const sc = sectionColor(d.colorKey);
          const headerTextColor = "#fff";
          const numCols = scale.length + (isParent ? 1 : isObs ? 1 : 0) + 1; // +1 for item col
          const itemPoints = (items?.length || 0) * (scale.length - 1);

          return (
            <div key={d.id} className="domain-block" style={{ marginBottom: 14, pageBreakInside: "avoid" }}>

              {/* Rating scale key — repeated on each section so it's clear on every page */}
              <div style={{
                display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap",
                padding: "5px 8px", border: `1.5px solid ${ruleColor}`,
                background: dark ? "#0d1b1a" : "#fafafa", marginBottom: 8,
                WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
              }}>
                <span style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: inkDim, marginRight: 6 }}>Rating Key</span>
                {scale.map((s) => (
                  <span key={s.value} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 7px", borderRadius: 3, fontSize: 8, fontWeight: 700,
                    background: dark ? s.darkBg : s.bg, color: s.color,
                    border: `1px solid ${s.color}`,
                    WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", border: `1.5px solid ${s.color}` }}></span>
                    {ABBREV[s.label] || s.label.split(" ")[0]} — {s.label}
                  </span>
                ))}
                {isParent && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 7px", borderRadius: 3, fontSize: 8, fontWeight: 700,
                    background: dark ? "#2a2030" : "#f3edf9", color: "#7a5aaa",
                    border: "1px solid #7a5aaa",
                    WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                  }}>
                    ⚡ Stress Modifier
                  </span>
                )}
              </div>

              {/* Domain header bar — viridis */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 12px", background: sc, color: headerTextColor,
                borderRadius: "3px 3px 0 0",
                WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
              }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>{d.icon}</span>
                <span style={{ fontSize: 8, fontWeight: 600, opacity: 0.7 }}>D{d.n}</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{d.title}</span>
              </div>

              {/* Sub-line: framework */}
              <div style={{
                fontSize: 7.5, color: inkSub, fontStyle: "italic",
                padding: "3px 10px",
                borderLeft: `1.5px solid ${ruleColor}`, borderRight: `1.5px solid ${ruleColor}`,
                background: dark ? "#0d1b1a" : "#fafafa",
              }}>
                {d.fw}
              </div>

              {/* Context prompt for observer versions */}
              {isObs && ctx && (
                <div style={{
                  fontSize: 8.5, color: ink,
                  padding: "4px 10px",
                  borderLeft: `1.5px solid ${ruleColor}`, borderRight: `1.5px solid ${ruleColor}`,
                  borderBottom: `1px solid ${lightRule}`,
                  background: dark ? "#0d1b1a" : "#fcfcfc",
                  fontStyle: "italic",
                }}>
                  <strong style={{ fontStyle: "normal" }}>Observation context:</strong> {ctx}
                </div>
              )}

              {/* Rating table */}
              <table style={{
                width: "100%", borderCollapse: "collapse", fontSize: 9.5,
                border: `1.5px solid ${ruleColor}`, borderTop: "none",
              }}>
                <thead style={{ display: "table-header-group" }}>
                  <tr>
                    <th style={{
                      textAlign: "left", padding: "4px 8px", fontSize: 7,
                      fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: `2px solid ${ruleColor}`, background: headerBg,
                      color: ink, width: "52%",
                      WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                    }}>Item</th>
                    {scale.map((s) => (
                      <th key={s.value} style={{
                        textAlign: "center", padding: "4px 3px", fontSize: 7,
                        fontWeight: 700, color: s.color,
                        borderBottom: `2px solid ${ruleColor}`, background: headerBg,
                        minWidth: 32,
                        WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                      }}>{ABBREV[s.label] || s.label}</th>
                    ))}
                    {isParent && (
                      <th style={{
                        textAlign: "center", padding: "4px 3px", fontSize: 9, color: "#7a5aaa",
                        borderBottom: `2px solid ${ruleColor}`, background: headerBg, minWidth: 22,
                        WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                      }}>⚡</th>
                    )}
                    {isObs && (
                      <th style={{
                        textAlign: "left", padding: "4px 6px", fontSize: 7,
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                        borderBottom: `2px solid ${ruleColor}`, background: headerBg,
                        color: ink, minWidth: 90,
                        WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                      }}>Notes / SA · IU</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((text, i) => (
                    <tr key={i} style={{
                      background: i % 2 === 1 ? zebraBg : "transparent",
                      WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                    }}>
                      <td style={{
                        padding: "5px 8px", fontSize: 9.5, color: ink,
                        borderBottom: `1px solid ${lightRule}`, lineHeight: 1.35,
                        verticalAlign: "top",
                      }}>
                        <span style={{ fontWeight: 600, color: inkDim, marginRight: 4 }}>{i + 1}.</span>{text}
                      </td>
                      {scale.map((s) => (
                        <td key={s.value} style={{
                          padding: "5px 3px", textAlign: "center",
                          borderBottom: `1px solid ${lightRule}`, verticalAlign: "middle",
                        }}>
                          <span style={{
                            display: "inline-block", width: 16, height: 16, borderRadius: "50%",
                            border: `1.5px solid ${dark ? "#3a5a58" : "#aaa"}`,
                          }}></span>
                        </td>
                      ))}
                      {isParent && (
                        <td style={{
                          padding: "5px 3px", textAlign: "center",
                          borderBottom: `1px solid ${lightRule}`, verticalAlign: "middle",
                        }}>
                          <span style={{
                            display: "inline-block", width: 12, height: 12, borderRadius: 2,
                            border: `1.5px solid ${dark ? "#3a5a58" : "#aaa"}`,
                          }}></span>
                        </td>
                      )}
                      {isObs && (
                        <td style={{
                          padding: "5px 6px",
                          borderBottom: `1px solid ${lightRule}`, verticalAlign: "middle",
                        }}>
                          <div style={{ borderBottom: `1px solid ${dark ? "#3a5a58" : "#bbb"}`, minHeight: 14 }}></div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Domain score totals row */}
              <div style={{
                display: "flex", justifyContent: "flex-end", gap: 14,
                padding: "4px 10px", fontSize: 8, fontWeight: 700,
                color: inkDim, background: dark ? "#142322" : "#f5f5f5",
                border: `1.5px solid ${ruleColor}`, borderTop: "none",
                textTransform: "uppercase", letterSpacing: "0.05em",
                WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Raw Total: <span style={{ display: "inline-block", width: 36, borderBottom: `1.5px solid ${ruleColor}`, minHeight: 12 }}></span>
                  <span style={{ color: inkSub, fontWeight: 500 }}>/ {itemPoints}</span>
                </span>
                {isParent ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Stress Items: <span style={{ display: "inline-block", width: 30, borderBottom: `1.5px solid ${ruleColor}`, minHeight: 12 }}></span>
                    <span style={{ color: inkSub, fontWeight: 500 }}>/ {items.length}</span>
                  </span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    % Score: <span style={{ display: "inline-block", width: 36, borderBottom: `1.5px solid ${ruleColor}`, minHeight: 12 }}></span>
                  </span>
                )}
              </div>

              {/* Lined observation box for observer versions */}
              {isObs && (
                <div style={{
                  border: `1.5px solid ${ruleColor}`, borderTop: "none",
                  borderRadius: "0 0 3px 3px", padding: "5px 8px",
                }}>
                  <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 3 }}>
                    Observations / Contextual Notes
                  </div>
                  <div style={{
                    minHeight: 60, borderTop: `1px solid ${lightRule}`,
                    background: linedBg,
                    WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
                  }}></div>
                </div>
              )}
            </div>
          );
        })}

        {/* ─── SUMMARY & SIGNATURE ─── */}
        <div style={{ marginTop: 24, pageBreakInside: "avoid" }}>
          <div style={{
            background: ruleColor, color: dark ? "#0d1b1a" : "#fff",
            padding: "6px 12px", fontSize: 9, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.1em",
            borderRadius: "3px 3px 0 0",
            WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
          }}>
            📝 Summary &amp; Signature
          </div>
          <div style={{
            border: `1.5px solid ${ruleColor}`, borderTop: "none",
            borderRadius: "0 0 3px 3px", padding: 14,
          }}>
            <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 4 }}>
              Overall Clinical Impressions / Notes
            </div>
            <div style={{
              minHeight: 90, background: linedBg, marginBottom: 14,
              WebkitPrintColorAdjust: "exact", printColorAdjust: "exact",
            }}></div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 2 }}>Signature</div>
                <div style={{ borderBottom: `1.5px solid ${ruleColor}`, minHeight: 22 }}></div>
              </div>
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 2 }}>Date</div>
                <div style={{ borderBottom: `1.5px solid ${ruleColor}`, minHeight: 22 }}></div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 2 }}>Printed Name</div>
                <div style={{ borderBottom: `1.5px solid ${ruleColor}`, minHeight: 22 }}></div>
              </div>
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: inkDim, marginBottom: 2 }}>
                  {isParent ? "Relationship to Child" : "Role / Title"}
                </div>
                <div style={{ borderBottom: `1.5px solid ${ruleColor}`, minHeight: 22 }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <div style={{
          marginTop: 16, paddingTop: 8, borderTop: `1px solid ${lightRule}`,
          fontSize: 7, color: inkSub, textAlign: "center", lineHeight: 1.7,
          letterSpacing: "0.05em",
        }}>
          SCDFI v0.3 · Social-Communication &amp; Developmental Functioning Inventory · Confidential<br />
          Rachel Terra Norton, MS, CCC-SLP<br />
          Inspired by ASHA Social Communication Benchmarks, LSP, FEDC/DIR, BESSI, SSF, Roth &amp; Worthington
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
