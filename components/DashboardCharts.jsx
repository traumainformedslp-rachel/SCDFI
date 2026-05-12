import React from "react";
import DOMAINS from "../data/domains";
import { VERSION_META, COLORS } from "../data/constants";

/** Horizontal bar comparison chart grouped by domain */
export function BarChart({ datasets }) {
  return (
    <div>
      {DOMAINS.map((d) => (
        <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ width: 120, fontSize: 10, fontWeight: 700, color: "#555", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <span>{d.icon}</span>{d.short}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {datasets.map((ds, i) => {
              const m = VERSION_META[ds.version];
              const pct = ds.scores[d.id] != null ? Math.round(ds.scores[d.id] * 100) : null;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 55, fontSize: 8, color: m.color, fontWeight: 700, textAlign: "right", flexShrink: 0 }}>
                    {m.label.split("/")[0].trim()}
                  </div>
                  <div style={{ flex: 1, height: 14, background: "#F0F2F5", borderRadius: 7, overflow: "hidden" }}>
                    {pct != null ? (
                      <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 7, transition: "width .5s", minWidth: 2 }} />
                    ) : (
                      <div style={{ padding: "0 6px", fontSize: 8, color: "#ccc", lineHeight: "14px" }}>—</div>
                    )}
                  </div>
                  <div style={{ width: 30, fontSize: 10, fontWeight: 700, color: pct != null ? m.color : "#ccc", textAlign: "right" }}>
                    {pct != null ? `${pct}%` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Detail score table with color-coded percentage pills and discrepancy flagging */
export function ScoreTable({ datasets }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ background: "#F0F2F5" }}>
            <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: "#555", borderBottom: "2px solid #ddd" }}>Domain</th>
            {datasets.map((ds) => (
              <th key={ds.version} style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700, color: VERSION_META[ds.version].color, borderBottom: `2px solid ${VERSION_META[ds.version].color}` }}>
                {VERSION_META[ds.version].label}
              </th>
            ))}
            {datasets.length > 1 && (
              <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700, color: "#888", borderBottom: "2px solid #ddd" }}>Gap</th>
            )}
          </tr>
        </thead>
        <tbody>
          {DOMAINS.map((d, i) => {
            const vals = datasets.map((ds) => ds.scores[d.id]).filter((v) => v != null);
            const disc = vals.length > 1 ? Math.round((Math.max(...vals) - Math.min(...vals)) * 100) : null;
            return (
              <tr key={d.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                <td style={{ padding: "6px 10px", fontWeight: 600, color: "#333", fontSize: 11 }}>
                  {d.icon} {d.title}
                </td>
                {datasets.map((ds) => {
                  const v = ds.scores[d.id];
                  const p = v != null ? Math.round(v * 100) : null;
                  return (
                    <td key={ds.version} style={{ padding: "6px 10px", textAlign: "center" }}>
                      {p != null ? (
                        <span style={{
                          display: "inline-block", padding: "2px 8px", borderRadius: 10, fontWeight: 700, fontSize: 11,
                          background: p >= 75 ? "#D6FADC" : p >= 50 ? "#FFF3E0" : p >= 25 ? "#FFF7D6" : "#FCE4EC",
                          color: p >= 75 ? "#2D7A3E" : p >= 50 ? "#B07830" : p >= 25 ? "#9A7A20" : "#A04050",
                        }}>
                          {p}%
                        </span>
                      ) : (
                        <span style={{ color: "#ccc" }}>—</span>
                      )}
                    </td>
                  );
                })}
                {datasets.length > 1 && (
                  <td style={{ padding: "6px 10px", textAlign: "center" }}>
                    {disc != null ? (
                      <span style={{ fontWeight: 700, fontSize: 11, color: disc >= 30 ? "#C25670" : disc >= 15 ? "#D4995A" : "#5AA867" }}>
                        {disc}pp {disc >= 30 ? "⚠️" : disc >= 15 ? "△" : "✓"}
                      </span>
                    ) : "—"}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {datasets.length > 1 && (
        <div style={{ marginTop: 6, fontSize: 9, color: "#999", display: "flex", gap: 14 }}>
          <span><b style={{ color: COLORS.green }}>✓ &lt;15pp</b> Concordant</span>
          <span><b style={{ color: "#D4995A" }}>△ 15–29pp</b> Moderate</span>
          <span><b style={{ color: "#C25670" }}>⚠️ ≥30pp</b> Notable</span>
        </div>
      )}
    </div>
  );
}
