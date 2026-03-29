/**
 * Rating scales — RTN Dark Theme
 *
 * Clinician & Teacher share the same 5-point developmental scale.
 * Parent: 3-point frequency + stress modifier.
 * Self: 4-point self-identification.
 */

export const SCALES = {
  clinician: [
    { label: "Not Observed", value: 0, color: "#666", bg: "#1a1a1a", face: "none" },
    { label: "Emerging with Support", value: 1, color: "#e63946", bg: "#1a0a0a", face: "sad" },
    { label: "Emerging Independently", value: 2, color: "#e89b2d", bg: "#1a1208", face: "neutral" },
    { label: "Consistent with Support", value: 3, color: "#27ae60", bg: "#081a10", face: "content" },
    { label: "Consistent Independently", value: 4, color: "#4ade80", bg: "#0a1a10", face: "happy" },
  ],
  teacher: [
    { label: "Not Observed", value: 0, color: "#666", bg: "#1a1a1a", face: "none" },
    { label: "Emerging with Support", value: 1, color: "#e63946", bg: "#1a0a0a", face: "sad" },
    { label: "Emerging Independently", value: 2, color: "#e89b2d", bg: "#1a1208", face: "neutral" },
    { label: "Consistent with Support", value: 3, color: "#27ae60", bg: "#081a10", face: "content" },
    { label: "Consistent Independently", value: 4, color: "#4ade80", bg: "#0a1a10", face: "happy" },
  ],
  parent: [
    { label: "Never / Not Yet", value: 0, color: "#e63946", bg: "#1a0a0a", face: "sad" },
    { label: "Sometimes", value: 1, color: "#e89b2d", bg: "#1a1208", face: "neutral" },
    { label: "Always", value: 2, color: "#4ade80", bg: "#0a1a10", face: "happy" },
  ],
  self: [
    { label: "Not Really Like Me", value: 1, color: "#e63946", bg: "#1a0a0a", face: "sad" },
    { label: "A Little Like Me", value: 2, color: "#e89b2d", bg: "#1a1208", face: "neutral" },
    { label: "Mostly Like Me", value: 3, color: "#27ae60", bg: "#081a10", face: "content" },
    { label: "Very Much Like Me", value: 4, color: "#4ade80", bg: "#0a1a10", face: "happy" },
  ],
};
