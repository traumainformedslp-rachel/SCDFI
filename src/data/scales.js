/**
 * Rating scales — full labels on all buttons, no abbreviations.
 *
 * Clinician & Teacher share the same 5-point developmental scale
 * (aligned with Roth & Worthington behavioral objectives).
 * Parent: 3-point frequency + stress modifier (FEDC "Not Under Stress").
 * Self: 4-point self-identification (BESSI skills-inventory methodology).
 */

export const SCALES = {
  clinician: [
    { label: "Not Observed", value: 0, color: "#8E99A4", bg: "#F0F2F4", face: "none" },
    { label: "Emerging with Support", value: 1, color: "#C25670", bg: "#FCE4EC", face: "sad" },
    { label: "Emerging Independently", value: 2, color: "#D4995A", bg: "#FFF3E0", face: "neutral" },
    { label: "Consistent with Support", value: 3, color: "#3BA0A8", bg: "#E0F5F5", face: "content" },
    { label: "Consistent Independently", value: 4, color: "#2FAB4F", bg: "#D6FADC", face: "happy" },
  ],
  teacher: [
    { label: "Not Observed", value: 0, color: "#8E99A4", bg: "#F0F2F4", face: "none" },
    { label: "Emerging with Support", value: 1, color: "#C25670", bg: "#FCE4EC", face: "sad" },
    { label: "Emerging Independently", value: 2, color: "#D4995A", bg: "#FFF3E0", face: "neutral" },
    { label: "Consistent with Support", value: 3, color: "#3BA0A8", bg: "#E0F5F5", face: "content" },
    { label: "Consistent Independently", value: 4, color: "#2FAB4F", bg: "#D6FADC", face: "happy" },
  ],
  parent: [
    { label: "Never / Not Yet", value: 0, color: "#C25670", bg: "#FCE4EC", face: "sad" },
    { label: "Sometimes", value: 1, color: "#D4995A", bg: "#FFF3E0", face: "neutral" },
    { label: "Always", value: 2, color: "#2FAB4F", bg: "#D6FADC", face: "happy" },
  ],
  self: [
    { label: "Not Really Like Me", value: 1, color: "#C25670", bg: "#FCE4EC", face: "sad" },
    { label: "A Little Like Me", value: 2, color: "#D4995A", bg: "#FFF3E0", face: "neutral" },
    { label: "Mostly Like Me", value: 3, color: "#3BA0A8", bg: "#E0F5F5", face: "content" },
    { label: "Very Much Like Me", value: 4, color: "#2FAB4F", bg: "#D6FADC", face: "happy" },
  ],
};
