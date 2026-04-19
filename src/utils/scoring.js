/**
 * Scoring utilities for SCDFI — 4 informant versions
 */

import DOMAINS from "../data/domains";
import { MAX_VALUES } from "../data/constants";

/** Get items array for a domain + version */
export function getItems(domain, version) {
  if (version === "clinician" || version === "teacher") return domain.items;
  if (version === "parent") return domain.parent;
  return domain.self;
}

/** Get context prompt for clinician/teacher versions */
export function getContext(domain, version) {
  if (version === "clinician") return domain.clinicianContext || "";
  if (version === "teacher") return domain.teacherContext || "";
  return "";
}

/** Compute normalized 0–1 scores per domain from raw responses */
export function computeScores(responses, version) {
  const mx = MAX_VALUES[version];
  const scores = {};

  DOMAINS.forEach((d) => {
    const items = getItems(d, version);
    let sum = 0;
    let count = 0;

    items.forEach((_, i) => {
      const val = responses[`${d.id}_${i}`];
      if (val != null) {
        sum += typeof val === "number" ? val : 0;
        count++;
      }
    });

    scores[d.id] = count > 0 ? sum / count / mx : null;
  });

  return scores;
}

/** Compute stress-modifier proportions per domain (parent version only) */
export function computeStress(stressFlags) {
  const flags = {};

  DOMAINS.forEach((d) => {
    const n = d.parent.length;
    let flagged = 0;
    for (let i = 0; i < n; i++) {
      if (stressFlags[`${d.id}_${i}`]) flagged++;
    }
    flags[d.id] = n > 0 ? flagged / n : 0;
  });

  return flags;
}
