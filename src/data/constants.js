/** Design tokens — Spectral palette (Social) */

export const THEMES = {
  dark: {
    bg: "#120f20", card: "#1c1832", border: "#302a50", inputBg: "#161230",
    text: "#e8e4f4", textMuted: "#9e8eb8", textDim: "#6e5c88", textSub: "#c0b4d6",
    accent: "#fdae61", accentDeep: "#5e4fa2",
    stickyBg: "rgba(18,15,32,0.92)",
    footerBg: "#1c1832",
    rowBg: "#120f20", rowBgSel: "#302a50",
    btnBg: "#1c1832", btnBorder: "#302a50",
  },
  light: {
    bg: "#f4f0f5", card: "#ffffff", border: "#c0b8d0", inputBg: "#ffffff",
    text: "#1a1a2a", textMuted: "#3a3050", textDim: "#6b6280", textSub: "#3a3050",
    accent: "#5e4fa2", accentDeep: "#3288bd",
    stickyBg: "rgba(255,255,255,0.92)",
    footerBg: "#ffffff",
    rowBg: "#ffffff", rowBgSel: "rgba(94,79,162,0.06)",
    btnBg: "#ffffff", btnBorder: "#c0b8d0",
  },
};

// Spectral-inspired 12-stop palette for domain sections
export const SECTION_COLORS = {
  reg:      { dark: "#f4a5b0", light: "#9e0142" },  // D1
  orient:   { dark: "#f8927b", light: "#d53e4f" },  // D2
  ja:       { dark: "#fdae61", light: "#f46d43" },  // D3
  learn:    { dark: "#fee08b", light: "#fdae61" },  // D4
  multi:    { dark: "#d4eeb4", light: "#fee08b" },  // D5
  flex:     { dark: "#abdda4", light: "#abdda4" },  // D6
  shared:   { dark: "#88d0b0", light: "#66c2a5" },  // D7
  interact: { dark: "#72b8d4", light: "#3288bd" },  // D8
  comm:     { dark: "#8ea8d8", light: "#5e4fa2" },  // D9
  ef:       { dark: "#a090c8", light: "#7b5ea7" },  // D10
  dist:     { dark: "#c4b0e0", light: "#9370b0" },  // D11
  trans:    { dark: "#dcc8f0", light: "#a880c0" },  // D12
};

// Spectral domain colors for charts/icons (light mode primary)
export const DOMAIN_COLORS = [
  "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#abdda4",
  "#66c2a5", "#3288bd", "#5e4fa2", "#7b5ea7", "#9370b0", "#a880c0",
];

/** Legacy color tokens (used by radar/bar charts) */
export const COLORS = {
  navy: "#1b3a4b",
  blue: "#2a6fa0",
  green: "#2a7a5a",
  purple: "#7a5aaa",
  teal: "#1a7a7a",
  orange: "#b87c4e",
  red: "#a84040",
  gold: "#b89446",
  bg: "#f0f4f4",
  card: "#ffffff",
};

/** Version metadata — 4 informant versions */
export const VERSION_META = {
  clinician: {
    label: "Clinician",
    color: "#1b3a4b",
    fill: "rgba(27,58,75,0.18)",
    icon: "📋",
    settingPrompt: "e.g., 1:1 therapy, small group, diagnostic evaluation",
    instructions: "Rate current functioning based on direct clinical observation. Consider Social Awareness (SA) — noticing cues without instruction — and Independent Use (IU) — acting on cues without prompts. Specify observation context (structured vs. naturalistic, session type, materials) in the notes field per domain.",
  },
  teacher: {
    label: "Teacher",
    color: "#1a7a7a",
    fill: "rgba(26,122,122,0.18)",
    icon: "🏫",
    settingPrompt: "e.g., general ed classroom, special ed, recess, lunch, specials",
    instructions: "Rate current functioning based on classroom and school observations. Consider how the student performs across school contexts — structured instruction, independent work, group activities, unstructured time (recess, hallways, lunch), and transitions between settings. Use notes to describe context per domain.",
  },
  parent: {
    label: "Parent / Caregiver",
    color: "#2a7a5a",
    fill: "rgba(42,122,90,0.18)",
    icon: "👨‍👩‍👧",
    instructions: "Rate your child's current functioning based on what you typically observe at home and in the community. Use the stress modifier if your child can do this but not when stressed, tired, hungry, or in unfamiliar settings. There are no right or wrong answers.",
  },
  self: {
    label: "Self-Report (14+)",
    color: "#7a5aaa",
    fill: "rgba(122,90,170,0.18)",
    icon: "🧑‍🎓",
    instructions: "This is about you — how you interact with people, handle changes, and communicate. There are no right or wrong answers. Being honest helps us understand how to support you best.",
  },
};

/** Maximum scale values per version (used for score normalization) */
export const MAX_VALUES = { clinician: 3, teacher: 3, parent: 3, self: 4 };

/** Ordered version keys */
export const VERSION_ORDER = ["clinician", "teacher", "parent", "self"];
