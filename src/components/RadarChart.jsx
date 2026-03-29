import React from "react";
import DOMAINS from "../data/domains";
import { VERSION_META, COLORS } from "../data/constants";

/**
 * SVG radar/spider chart — RTN Dark Theme.
 */
export default function RadarChart({ datasets, size = 440 }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.35;
  const n = DOMAINS.length;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;

  const pt = (i, r) => {
    const a = start + i * step;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size, display: "block", margin: "0 auto" }}>
      {/* Background */}
      <circle cx={cx} cy={cy} r={R + 36} fill="#111" />

      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((ring, ri) => {
        const pts = DOMAINS.map((_, i) => pt(i, R * ring));
        return (
          <path
            key={ri}
            d={pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z"}
            fill="none" stroke="#222"
            strokeWidth={ring === 1 ? 1.5 : 0.7}
            strokeDasharray={ring < 1 ? "3,3" : "none"}
          />
        );
      })}

      {/* Ring labels */}
      {[0.25, 0.5, 0.75, 1].map((ring, ri) => (
        <text key={ri} x={cx + 5} y={cy - R * ring + 3} fontSize={8} fill="#444" fontFamily="'Space Mono', monospace">
          {Math.round(ring * 100)}%
        </text>
      ))}

      {/* Spoke lines */}
      {DOMAINS.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1e1e1e" strokeWidth={0.6} />;
      })}

      {/* Data polygons */}
      {datasets.map((ds, di) => {
        const m = VERSION_META[ds.version];
        const pts = DOMAINS.map((d, i) => {
          const v = ds.scores[d.id];
          return pt(i, v != null ? R * Math.max(v, 0.02) : 0);
        });
        return (
          <g key={di}>
            <path
              d={pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z"}
              fill={m.fill} stroke={m.color} strokeWidth={2.5}
              style={{ transition: "all .4s" }}
            />
            {pts.map((p, i) => {
              const v = ds.scores[DOMAINS[i].id];
              return v != null ? (
                <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={m.color} stroke="#111" strokeWidth={1.5} />
              ) : null;
            })}
          </g>
        );
      })}

      {/* Domain labels */}
      {DOMAINS.map((d, i) => {
        const [lx, ly] = pt(i, R + 24);
        const a = start + i * step;
        const anc = Math.cos(a) < -0.1 ? "end" : Math.cos(a) > 0.1 ? "start" : "middle";
        return (
          <text
            key={i} x={lx} y={ly} textAnchor={anc}
            fontSize={9} fontWeight={700} fill="#888" fontFamily="'Space Mono', monospace" dominantBaseline="middle"
          >
            {d.icon} {d.short}
          </text>
        );
      })}
    </svg>
  );
}
