# SCDCI — Social-Communication & Developmental Capacities Inventory

> **Multi-informant assessment tool for social-communication and developmental capacities.**
> RTN Communication & Literacy • Rachel Terra Norton, MS, CCC-SLP

⚠️ **This repository is public but proprietary — All Rights Reserved.** You may view the code but may not copy, modify, distribute, or use it without written permission. See [LICENSE](./LICENSE) for full terms.

⚠️ **Development draft — not validated for clinical use.**

🌐 **Live app:** [traumainformedslp-rachel.github.io/SCDFI](https://traumainformedslp-rachel.github.io/SCDFI/)

---

## What Is the SCDCI?

The SCDCI is a multi-informant inventory that assesses social-communication capacities across 12 unified domains. It combines constructs from developmental, behavioral, and social-skills frameworks into a single tool with four informant versions:

| Version | Respondent | Scale | Items | Setting |
|---|---|---|---|---|
| Clinician | SLP, OT, BCBA | 5-point developmental | ~66 | Clinical / therapeutic |
| Teacher | SPED, Gen Ed, Para | 5-point developmental | ~66 | Classroom / school |
| Parent / Caregiver | Parent, grandparent, foster parent | 3-point frequency + stress modifier | ~43 | Home / community |
| Self-Report (14+) | Adolescent / young adult | 4-point self-identification | ~24 | Self-rated |

The Clinician and Teacher versions share the same item bank but provide different environmental context prompts per domain, supporting direct comparison of skill expression across clinical vs. naturalistic school settings.

### 12 Domains

1. 🌱 Self-Regulation & Emotional Availability
2. 👥 Social Orientation & Engagement
3. 🔗 Joint Attention & Shared Focus
4. 🪞 Social Learning & Imitation
5. 👂 Multi-Partner Social Awareness
6. 🔄 Flexibility & Adaptation
7. 🤝 Shared Control & Problem-Solving
8. 💬 Interaction Style: Init / Maint / Respond
9. 🗣️ Communication: Symbolic, Generative, Intentional
10. 🧩 Executive Function & Planning
11. 📡 Contextual Awareness & Distance Learning
12. ➡️ Transitions & Attentional Shifting

### Dashboard Features

- **Radar / spider chart** — 12-vertex domain profile with multi-informant overlay
- **Bar comparison** — horizontal bars grouped by domain, color-coded by informant
- **Score table** — color-coded percentage pills with automatic discrepancy flagging
- **Cross-informant discrepancy analysis** — auto-generated when 2+ informants loaded
- **Clinician–Teacher environmental comparison** — highlights context-dependent skill expression
- **Stress-context summary** — parent stress modifier aggregated by domain
- **JSON export/import** — save and reload assessment data for longitudinal tracking

---

## Quick Start (Development)

```bash
git clone https://github.com/traumainformedslp-rachel/SCDFI.git
cd SCDFI

npm install
npm run dev      # opens at localhost:3000
npm run build    # production build → dist/
```

Requires **Node.js 18+** and **npm 9+**.

---

## Project Structure

```
SCDFI/
├── index.html              # Entry point
├── package.json
├── vite.config.js
├── LICENSE                  # All Rights Reserved (proprietary)
├── .github/workflows/
│   └── deploy.yml          # Auto-build + deploy to GitHub Pages
├── src/
│   ├── main.jsx            # React mount
│   ├── App.jsx             # Main app (routing, state)
│   ├── styles.css          # Global + print styles
│   ├── data/
│   │   ├── constants.js    # Colors, version metadata (4 versions)
│   │   ├── scales.js       # Rating scale definitions
│   │   └── domains.js      # 12 domains × 4 informant versions
│   ├── utils/
│   │   └── scoring.js      # Score computation, stress calc
│   └── components/
│       ├── index.js         # Barrel export
│       ├── Face.jsx         # SVG face Likert icons
│       ├── RatingItems.jsx  # Observer/Parent/Self item rows
│       ├── SharedUI.jsx     # SectionHeader, ContextPrompt, Legend
│       ├── RadarChart.jsx   # SVG radar/spider chart
│       └── DashboardCharts.jsx  # BarChart, ScoreTable
```

---

## Intellectual Property

### Original Work

**All item language in the SCDCI is original.** No text has been reproduced from any copyrighted source measure. The conceptual architecture is informed by published theoretical frameworks, cited below for academic transparency.

### Source Frameworks (Cited, Not Reproduced)

| Framework | Citation | What We Use |
|---|---|---|
| Learning Style Profile© | Rydell, Lyons, & Harris (2025) | Conceptual components (not items or scales) |
| FEDC / DIR | ICDL | Developmental capacity model (not items) |
| BESSI | Soto, Napolitano, Sewell, Yoon, & Roberts (2022) | Skills-as-capacities definition (not items) |
| Social Skills Framework | Ross, Toth, Heggestad, & Banks (2025) | Anti-conflation principle (not content) |
| Treatment Resource Manual | Roth & Worthington (2021) | Behavioral objectives framework (not text) |
| Multimodal SST | Nakamura (2025) | Digital delivery concepts (not content) |

### Public Repository, Proprietary License

This repo is publicly visible so that collaborators, reviewers, and the clinical community can see the SCDCI's development process. **Public visibility does not grant any usage rights.** Specifically:

1. **No copyrighted content is reproduced.** All items are original; source frameworks are cited, not copied.
2. **The license is All Rights Reserved.** Viewing is permitted; copying, modifying, distributing, or using the Work is not.
3. **Framework citations follow academic norms.** Citing a published theory is standard practice; reproducing its instruments is not. We do the former, not the latter.
4. **ML/AI training on this repository is prohibited.** The LICENSE explicitly prohibits training machine learning models on these contents.
5. **The .gitignore excludes client data.** Assessment JSON files are never committed.

---

## Data Privacy

- Assessment data is processed **entirely client-side** — no server, no database, no tracking
- JSON exports are saved locally to the user's device
- The `.gitignore` excludes all `.json` files (except `package.json`) to prevent accidental commits of client data
- **Never commit assessment data to this repository**

---

## Roadmap

- [ ] Content validity review with additional SLPs
- [ ] Readability analysis for self-report items (Flesch-Kincaid)
- [ ] Pilot administration across all four versions
- [ ] LocalStorage persistence for in-progress assessments
- [ ] Longitudinal comparison (same client, multiple timepoints)
- [ ] Goal-bank feature linking domain scores to treatment targets
- [ ] Additional framework integration (SCERTS, Kim 2020, Catts & Petscher 2022)

---

## Author

**Rachel Terra Norton, MS, CCC-SLP**
RTN Communication & Literacy — [rachelslp.org](https://rachelslp.org)

---

*© 2026 Rachel Terra Norton / RTN Communication & Literacy. All Rights Reserved.*
