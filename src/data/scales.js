/**
 * Rating scales — 4-point developmental scale for clinician, teacher, parent.
 * Self: 4-point self-identification.
 * Scale colors: Yellow (Not Observed), Red (Emerging), Blue (Consistent w/ Support), Green (Consistent Independently)
 */

export const SCALES = {
  clinician: [
    { label: "Not Observed", value: 0, color: "#c0392b", bg: "#fdf0ef", darkBg: "#2e1f24", face: "none" },
    { label: "Emerging", value: 1, color: "#b89446", bg: "#fef9ee", darkBg: "#2a2418", face: "sad" },
    { label: "Consistent with Support", value: 2, color: "#2a6fa0", bg: "#e8f0f7", darkBg: "#1c2530", face: "content" },
    { label: "Consistent Independently", value: 3, color: "#27864e", bg: "#e8f5ed", darkBg: "#1e2b22", face: "happy" },
  ],
  teacher: [
    { label: "Not Observed", value: 0, color: "#c0392b", bg: "#fdf0ef", darkBg: "#2e1f24", face: "none" },
    { label: "Emerging", value: 1, color: "#b89446", bg: "#fef9ee", darkBg: "#2a2418", face: "sad" },
    { label: "Consistent with Support", value: 2, color: "#2a6fa0", bg: "#e8f0f7", darkBg: "#1c2530", face: "content" },
    { label: "Consistent Independently", value: 3, color: "#27864e", bg: "#e8f5ed", darkBg: "#1e2b22", face: "happy" },
  ],
  parent: [
    { label: "Not Observed", value: 0, color: "#c0392b", bg: "#fdf0ef", darkBg: "#2e1f24", face: "none" },
    { label: "Emerging", value: 1, color: "#b89446", bg: "#fef9ee", darkBg: "#2a2418", face: "sad" },
    { label: "Consistent with Support", value: 2, color: "#2a6fa0", bg: "#e8f0f7", darkBg: "#1c2530", face: "content" },
    { label: "Consistent Independently", value: 3, color: "#27864e", bg: "#e8f5ed", darkBg: "#1e2b22", face: "happy" },
  ],
  self: [
    { label: "Not Really Like Me", value: 1, color: "#c0392b", bg: "#fdf0ef", darkBg: "#2e1f24", face: "sad" },
    { label: "A Little Like Me", value: 2, color: "#b89446", bg: "#fef9ee", darkBg: "#2a2418", face: "neutral" },
    { label: "Mostly Like Me", value: 3, color: "#2a6fa0", bg: "#e8f0f7", darkBg: "#1c2530", face: "content" },
    { label: "Very Much Like Me", value: 4, color: "#27864e", bg: "#e8f5ed", darkBg: "#1e2b22", face: "happy" },
  ],
};
