import React from "react";

export default function Face({ type, size = 36 }) {
  const r = size / 2;
  const ey = -r * 0.08;
  const edx = r * 0.28;
  const my = r * 0.3;

  const fills = {
    happy:   ["#d4f5dd", "#27864e"],
    content: ["#d6eaf5", "#2a6fa0"],
    neutral: ["#fef3d6", "#b89446"],
    sad:     ["#fdd", "#c0392b"],
    none:    ["#fdd8d8", "#c0392b"],
  };
  const [bg, sk] = fills[type] || fills.neutral;

  if (type === "none") {
    return (
      <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`}>
        <circle cx={0} cy={0} r={r * 0.88} fill={bg} stroke={sk} strokeWidth={1.5} />
        <line x1={-r * 0.22} y1={ey} x2={-r * 0.08} y2={ey} stroke={sk} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={r * 0.08} y1={ey} x2={r * 0.22} y2={ey} stroke={sk} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={-r * 0.15} y1={my} x2={r * 0.15} y2={my} stroke={sk} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`}>
      <circle cx={0} cy={0} r={r * 0.88} fill={bg} stroke={sk} strokeWidth={1.5} />

      {type === "happy" ? (
        <>
          <path d={`M${-edx - 3},${ey} Q${-edx},${ey - 5} ${-edx + 3},${ey}`} fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round" />
          <path d={`M${edx - 3},${ey} Q${edx},${ey - 5} ${edx + 3},${ey}`} fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-edx} cy={ey} r={r * 0.065} fill="#333" />
          <circle cx={edx} cy={ey} r={r * 0.065} fill="#333" />
        </>
      )}

      {type === "happy" ? (
        <path d={`M${-r * 0.28},${my - 1} Q0,${my + r * 0.28} ${r * 0.28},${my - 1}`} fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round" />
      ) : type === "content" ? (
        <path d={`M${-r * 0.2},${my} Q0,${my + r * 0.15} ${r * 0.2},${my}`} fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round" />
      ) : type === "neutral" ? (
        <line x1={-r * 0.16} y1={my} x2={r * 0.16} y2={my} stroke="#333" strokeWidth={1.8} strokeLinecap="round" />
      ) : type === "sad" ? (
        <path d={`M${-r * 0.18},${my + 3} Q0,${my - 3} ${r * 0.18},${my + 3}`} fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round" />
      ) : null}
    </svg>
  );
}
