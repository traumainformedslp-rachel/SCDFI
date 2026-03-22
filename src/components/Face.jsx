import React from "react";

/**
 * SVG face icon for Likert-style rating buttons.
 * Types: happy, content, neutral, sad, none
 */
export default function Face({ type, size = 36 }) {
  const r = size / 2;
  const ey = -r * 0.05;
  const edx = r * 0.28;
  const my = r * 0.32;

  const fills = {
    happy: ["#C8F7CE", "#3A9E50"],
    content: ["#D4F1F7", "#2A96A8"],
    neutral: ["#FFF4C2", "#CCA020"],
    sad: ["#FFD4D4", "#D45A6A"],
    none: ["#E8EBF0", "#8E99A4"],
  };
  const [bg, sk] = fills[type] || fills.neutral;

  if (type === "none") {
    return (
      <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`}>
        <circle cx={0} cy={0} r={r * 0.9} fill={bg} stroke={sk} strokeWidth={2} />
        <line x1={-r * 0.2} y1={0} x2={r * 0.2} y2={0} stroke="#8E99A4" strokeWidth={2} strokeLinecap="round" />
      </svg>
    );
  }

  const hasArcEyes = type === "happy" || type === "content";

  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`}>
      <circle cx={0} cy={0} r={r * 0.9} fill={bg} stroke={sk} strokeWidth={2} />

      {/* Eyes */}
      {hasArcEyes ? (
        <>
          <path d={`M${-(edx - 5)},${ey} Q${-edx},${ey - 6} ${-(edx + 5)},${ey}`} fill="none" stroke="#222" strokeWidth={2} strokeLinecap="round" />
          <path d={`M${edx - 5},${ey} Q${edx},${ey - 6} ${edx + 5},${ey}`} fill="none" stroke="#222" strokeWidth={2} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-edx} cy={ey} r={r * 0.07} fill="#222" />
          <circle cx={edx} cy={ey} r={r * 0.07} fill="#222" />
        </>
      )}

      {/* Sad eyebrows */}
      {type === "sad" && (
        <>
          <line x1={-edx - 4} y1={ey - 7} x2={-edx + 4} y2={ey - 5} stroke="#222" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={edx + 4} y1={ey - 7} x2={edx - 4} y2={ey - 5} stroke="#222" strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}

      {/* Mouth */}
      {type === "happy" ? (
        <path d={`M${-r * 0.25},${my - 2} Q0,${my + 9} ${r * 0.25},${my - 2}`} fill="none" stroke="#222" strokeWidth={2} strokeLinecap="round" />
      ) : type === "content" ? (
        <path d={`M${-r * 0.18},${my} Q0,${my + 4} ${r * 0.18},${my}`} fill="none" stroke="#222" strokeWidth={2} strokeLinecap="round" />
      ) : type === "sad" ? (
        <path d={`M${-r * 0.18},${my + 4} Q0,${my - 4} ${r * 0.18},${my + 4}`} fill="none" stroke="#222" strokeWidth={2} strokeLinecap="round" />
      ) : (
        <line x1={-r * 0.18} y1={my} x2={r * 0.18} y2={my} stroke="#222" strokeWidth={2} strokeLinecap="round" />
      )}
    </svg>
  );
}
