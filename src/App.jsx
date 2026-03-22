import { useState, useRef, useCallback } from "react";
import DOMAINS from "./data/domains";
import { COLORS, VERSION_META, MAX_VALUES } from "./data/constants";
import { getItems, getContext, computeScores, computeStress } from "./utils/scoring";
import {
  RadarChart, ObserverRow, ParentRow, SelfReportRow,
  SectionHeader, ContextPrompt, Legend, BarChart, ScoreTable,
} from "./components";

/* ═══════════════════════════════════════════════════════════════
   SCDCI — Social-Communication & Developmental Capacities Inventory
   Unified App: Assessment + Profile Dashboard
   RTN Communication & Literacy • v0.3
   ═══════════════════════════════════════════════════════════════ */

const isObserver = (v) => v === "clinician" || v === "teacher";

export default function App() {
  const [mode, setMode] = useState(null);
  const [ver, setVer] = useState(null);
  const [form, setForm] = useState({
    client: "", respondent: "",
    date: new Date().toISOString().slice(0, 10),
    setting: "", notes: {},
  });
  const [resp, setResp] = useState({});
  const [stress, setStress] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [tab, setTab] = useState("radar");
  const fileRef = useRef();

  const sR = (did, i, v) => setResp((r) => ({ ...r, [`${did}_${i}`]: v }));
  const sS = (did, i, v) => setStress((s) => ({ ...s, [`${did}_${i}`]: v }));

  const saveJSON = () => {
    const data = { version: ver, form, responses: resp, stress, exportDate: new Date().toISOString() };
    const b = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `SCDCI_${ver}_${form.client || "client"}_${form.date}.json`;
    a.click();
  };

  const finishAssessment = () => {
    const scores = computeScores(resp, ver);
    const sf = ver === "parent" ? computeStress(stress) : {};
    setProfiles((prev) => [
      ...prev.filter((p) => p.version !== ver),
      { version: ver, scores, stressFlags: sf, client: form.client, date: form.date },
    ]);
    setMode("dash");
    setTab("radar");
  };

  const handleFiles = useCallback((e) => {
    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.version && data.responses) {
            const scores = computeScores(data.responses, data.version);
            const sf = computeStress(data.stress || {});
            setProfiles((prev) => [
              ...prev.filter((p) => p.version !== data.version),
              { version: data.version, scores, stressFlags: sf, client: data.form?.client || "", date: data.form?.date || "" },
            ]);
          }
        } catch (err) {
          alert("Could not parse file: " + err.message);
        }
      };
      reader.readAsText(file);
    });
    e.target.value = "";
  }, []);

  const loadDemo = () => {
    const mk = (v) => {
      const r = {};
      DOMAINS.forEach((d) => getItems(d, v).forEach((_, i) => {
        r[`${d.id}_${i}`] = Math.floor(Math.random() * MAX_VALUES[v]) + Math.round(Math.random());
      }));
      return r;
    };
    const ds = {};
    DOMAINS.forEach((d) => d.parent.forEach((_, i) => { ds[`${d.id}_${i}`] = Math.random() > 0.7; }));

    ["clinician", "teacher", "parent", "self"].forEach((v) => {
      const r = mk(v);
      const scores = computeScores(r, v);
      const sf = v === "parent" ? computeStress(ds) : {};
      setProfiles((prev) => [
        ...prev.filter((p) => p.version !== v),
        { version: v, scores, stressFlags: sf, client: "Demo Student", date: "2026-03-21" },
      ]);
    });
    setMode("dash");
    setTab("radar");
  };

  // ═══ LANDING ═══
  if (!mode) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: COLORS.card, borderRadius: 24, padding: "40px 36px", maxWidth: 720, width: "100%", boxShadow: "0 8px 40px #0001" }}>
          <div style={{ background: COLORS.navy, borderRadius: 14, padding: "18px 20px", marginBottom: 28, textAlign: "center" }}>
            <div style={{ color: "#fff", fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 22 }}>SCDCI</div>
            <div style={{ color: "#fff9", fontSize: 12 }}>Social-Communication & Developmental Capacities Inventory</div>
            <div style={{ color: "#fff5", fontSize: 10, marginTop: 2 }}>RTN Communication & Literacy • v0.3</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <button onClick={() => setMode("assess")} style={{ flex: 1, padding: "28px 20px", borderRadius: 18, border: `3px solid ${COLORS.blue}`, background: "linear-gradient(135deg,#EAF2FF,#D6E8FF)", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 6 }}>📝</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, fontFamily: "'Baloo 2',cursive" }}>New Assessment</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 6, lineHeight: 1.5 }}>Clinician • Teacher • Parent • Self<br />12 domains • 4 informant versions<br />Save as JSON when done</div>
            </button>
            <button onClick={() => setMode("dash")} style={{ flex: 1, padding: "28px 20px", borderRadius: 18, border: `3px solid ${COLORS.teal}`, background: "linear-gradient(135deg,#E0F5F5,#D4F1F7)", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 6 }}>📊</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, fontFamily: "'Baloo 2',cursive" }}>Profile Dashboard</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 6, lineHeight: 1.5 }}>Import saved assessments<br />Radar chart • Bar comparison<br />Cross-informant analysis</div>
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#bbb" }}>
            Informed by: LSP© • FEDC/DIR • BESSI • SSF • Roth & Worthington • Nakamura<br />
            Rachel Terra Norton, MS, CCC-SLP • rachelslp.org
          </div>
        </div>
      </div>
    );
  }

  // ═══ VERSION SELECT — 4 cards ═══
  if (mode === "assess" && !ver) {
    const cards = [
      { v: "clinician", ico: "📋", lbl: "Clinician", clr: COLORS.navy, bg1: "#E8EDF4", bg2: "#D6DFEF", desc: "5-point developmental scale\n~66 items • SA/IU notation\nClinical / therapeutic settings" },
      { v: "teacher", ico: "🏫", lbl: "Teacher", clr: COLORS.teal, bg1: "#E0F5F5", bg2: "#D4F1F7", desc: "5-point developmental scale\n~66 items • SA/IU notation\nClassroom / school settings" },
      { v: "parent", ico: "👨‍👩‍👧", lbl: "Parent / Caregiver", clr: COLORS.green, bg1: "#EBF7EE", bg2: "#D6FADC", desc: "3-point frequency scale\n~43 items • Stress modifier\nHome / community settings" },
      { v: "self", ico: "🧑‍🎓", lbl: "Self-Report (14+)", clr: COLORS.purple, bg1: "#F3EDF9", bg2: "#EDE7F6", desc: "4-point self-identification\n~24 items\nAdolescent / young adult" },
    ];

    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: COLORS.card, borderRadius: 24, padding: "40px 36px", maxWidth: 780, width: "100%", boxShadow: "0 8px 40px #0001" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <button onClick={() => setMode(null)} style={{ padding: "6px 12px", borderRadius: 8, border: "2px solid #ddd", background: "#fff", color: "#888", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>← Back</button>
            <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, fontFamily: "'Baloo 2',cursive" }}>Select Informant Version</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {cards.map(({ v, ico, lbl, clr, bg1, bg2, desc }) => (
              <button key={v} onClick={() => setVer(v)} style={{ padding: "20px 16px", borderRadius: 16, border: `3px solid ${clr}`, background: `linear-gradient(135deg,${bg1},${bg2})`, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 30, marginBottom: 4 }}>{ico}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.navy, fontFamily: "'Baloo 2',cursive" }}>{lbl}</div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 4, lineHeight: 1.5, whiteSpace: "pre-line" }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const vc = VERSION_META[ver]?.color || COLORS.navy;
  const vm = VERSION_META[ver] || {};

  // ═══ ASSESSMENT FORM ═══
  if (mode === "assess" && ver) {
    const respondentLabel = ver === "self" ? "School / Program" : ver === "parent" ? "Respondent Name" : "Respondent (Name, Role)";
    const clientLabel = ver === "self" ? "Your Name" : "Client / Student Name";

    return (
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Top bar */}
        <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 100, background: vc, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "0 0 14px 14px", boxShadow: "0 4px 20px #0002" }}>
          <div>
            <div style={{ color: "#fff", fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 15 }}>SCDCI — {vm.label}</div>
            <div style={{ color: "#fff7", fontSize: 10 }}>RTN Communication & Literacy</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setVer(null); setResp({}); setStress({}); }} style={{ padding: "5px 10px", borderRadius: 7, border: "2px solid #fff3", background: "transparent", color: "#fffa", fontWeight: 700, cursor: "pointer", fontSize: 10 }}>← Back</button>
            <button onClick={saveJSON} style={{ padding: "5px 10px", borderRadius: 7, border: "2px solid #fff4", background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 10 }}>💾 Save</button>
            <button onClick={finishAssessment} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "#fff3", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 10 }}>📊 Dashboard</button>
          </div>
        </div>

        <div className="print-card" style={{ background: COLORS.card, borderRadius: 18, padding: "20px 24px", margin: "12px 0", boxShadow: "0 2px 20px #0001" }}>
          {/* Version badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <span style={{ background: vc + "18", color: vc, padding: "3px 14px", borderRadius: 20, fontWeight: 700, fontSize: 10, border: `2px solid ${vc}` }}>
              {vm.icon} {vm.label}
            </span>
          </div>

          {/* Client info */}
          <div style={{ background: "#F8F9FB", borderRadius: 12, padding: "10px 14px", marginBottom: 12, border: "1px solid #eee" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 8 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#aaa" }}>{clientLabel}</label>
                <input value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #ddd", fontSize: 12, background: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#aaa" }}>{respondentLabel}</label>
                <input value={form.respondent} onChange={(e) => setForm((f) => ({ ...f, respondent: e.target.value }))} style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #ddd", fontSize: 12, background: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#aaa" }}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #ddd", fontSize: 12, background: "#fff" }} />
              </div>
            </div>
            {isObserver(ver) && (
              <div style={{ marginTop: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#aaa" }}>Setting / Context</label>
                <input
                  value={form.setting}
                  onChange={(e) => setForm((f) => ({ ...f, setting: e.target.value }))}
                  placeholder={vm.settingPrompt}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #ddd", fontSize: 12, background: "#fff" }}
                />
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{ background: vc + "0D", borderRadius: 10, padding: "10px 14px", marginBottom: 12, border: `1px solid ${vc}33`, fontSize: 11, color: "#555", lineHeight: 1.6 }}>
            {ver === "self" ? (
              <><b style={{ color: vc }}>Hey! 👋</b> {vm.instructions}</>
            ) : (
              <><b style={{ color: vc }}>Instructions:</b> {vm.instructions}</>
            )}
          </div>

          <Legend version={ver} />

          {/* Domain items */}
          {DOMAINS.map((d) => {
            const items = getItems(d, ver);
            const ctx = getContext(d, ver);
            return (
              <div key={d.id}>
                <SectionHeader icon={d.icon} title={d.title} color={d.color} num={d.n} sub={d.desc} />
                <div style={{ fontSize: 9, color: "#bbb", marginBottom: 6, fontStyle: "italic", paddingLeft: 4 }}>{d.fw}</div>

                {isObserver(ver) && <ContextPrompt text={ctx} color={vc} />}

                {isObserver(ver) && items.map((text, i) => (
                  <ObserverRow key={i} text={text} value={resp[`${d.id}_${i}`]} onChange={(v) => sR(d.id, i, v)} scaleKey={ver} />
                ))}
                {ver === "parent" && items.map((text, i) => (
                  <ParentRow key={i} text={text} value={resp[`${d.id}_${i}`]} onChange={(v) => sR(d.id, i, v)} stress={stress[`${d.id}_${i}`]} onStress={(v) => sS(d.id, i, v)} />
                ))}
                {ver === "self" && items.map((text, i) => (
                  <SelfReportRow key={i} text={text} value={resp[`${d.id}_${i}`]} onChange={(v) => sR(d.id, i, v)} />
                ))}

                {isObserver(ver) && (
                  <textarea
                    value={form.notes[d.id] || ""} placeholder="Observations / contextual notes..."
                    onChange={(e) => setForm((f) => ({ ...f, notes: { ...f.notes, [d.id]: e.target.value } }))}
                    rows={2}
                    style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #eee", fontSize: 11, resize: "vertical", background: "#fafafa", color: "#666", fontStyle: "italic", marginTop: 4 }}
                  />
                )}
              </div>
            );
          })}

          {/* Completion */}
          <div style={{ background: `${vc}0A`, borderRadius: 12, padding: "18px 20px", marginTop: 24, textAlign: "center", border: `1px solid ${vc}33` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.navy, fontFamily: "'Baloo 2',cursive" }}>
              {ver === "self" ? "You're all done — nice work! 🎉" : "Assessment Complete"}
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Save your data, then view the profile dashboard.</div>
          </div>

          <div style={{ textAlign: "center", marginTop: 16, color: "#ccc", fontSize: 9 }}>
            SCDCI v0.3 • RTN Communication & Literacy • Rachel Terra Norton, MS, CCC-SLP • rachelslp.org<br />
            Not for clinical use without further validation
          </div>
        </div>

        {/* Bottom bar */}
        <div className="no-print" style={{ position: "sticky", bottom: 0, background: COLORS.card, padding: "10px 20px", borderRadius: "14px 14px 0 0", boxShadow: "0 -4px 16px #0001", display: "flex", justifyContent: "center", gap: 10, marginTop: 8 }}>
          <button onClick={saveJSON} style={{ padding: "10px 20px", borderRadius: 10, border: `2px solid ${vc}`, background: "#fff", color: vc, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>💾 Save JSON</button>
          <button onClick={finishAssessment} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: vc, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>📊 View Dashboard</button>
          <button onClick={() => window.print()} style={{ padding: "10px 20px", borderRadius: 10, border: "2px solid #ddd", background: "#fff", color: "#888", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>🖨 Print</button>
        </div>
      </div>
    );
  }

  // ═══ DASHBOARD ═══
  if (mode === "dash") {
    const clientName = profiles.length > 0 ? profiles[0].client || "Client" : "Client";

    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 12px" }}>
        {/* Header */}
        <div style={{ background: COLORS.navy, borderRadius: "0 0 18px 18px", padding: "16px 24px", marginBottom: 16, boxShadow: "0 4px 20px #0002" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#fff", fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 18 }}>SCDCI Profile Dashboard</div>
              <div style={{ color: "#fff7", fontSize: 10 }}>RTN Communication & Literacy</div>
            </div>
            <div className="no-print" style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setMode(null)} style={{ padding: "6px 12px", borderRadius: 8, border: "2px solid #fff3", background: "transparent", color: "#fffa", fontWeight: 700, cursor: "pointer", fontSize: 10 }}>← Home</button>
              <button onClick={() => window.print()} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: COLORS.blue, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 10 }}>🖨 Print</button>
            </div>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div style={{ background: COLORS.card, borderRadius: 18, padding: "36px 28px", boxShadow: "0 2px 20px #0001", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>📊</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.navy, fontFamily: "'Baloo 2',cursive", marginBottom: 6 }}>Load SCDCI Profiles</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>
              Import saved JSON files from assessments, or load demo data to explore the dashboard.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => fileRef.current.click()} style={{ padding: "12px 24px", borderRadius: 12, border: `2.5px dashed ${COLORS.blue}`, background: "#EAF2FF", color: COLORS.blue, fontWeight: 800, cursor: "pointer", fontSize: 13 }}>📁 Import JSON</button>
              <button onClick={loadDemo} style={{ padding: "12px 24px", borderRadius: 12, border: "2.5px solid #ddd", background: "#fff", color: "#888", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🎲 Demo Data</button>
              <button onClick={() => { setMode("assess"); setVer(null); setResp({}); setStress({}); }} style={{ padding: "12px 24px", borderRadius: 12, border: `2.5px solid ${COLORS.green}`, background: "#EBF7EE", color: COLORS.green, fontWeight: 800, cursor: "pointer", fontSize: 13 }}>📝 New Assessment</button>
            </div>
            <input ref={fileRef} type="file" accept=".json" multiple onChange={handleFiles} style={{ display: "none" }} />
          </div>
        ) : (
          <>
            {/* Info bar */}
            <div style={{ background: COLORS.card, borderRadius: 12, padding: "10px 16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 6px #0001", flexWrap: "wrap", gap: 6 }}>
              <div>
                <span style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15 }}>{clientName}</span>
                <span style={{ color: "#aaa", fontSize: 11, marginLeft: 10 }}>{profiles[0].date}</span>
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                {profiles.map((p) => (
                  <span key={p.version} style={{ padding: "2px 10px", borderRadius: 16, fontSize: 9, fontWeight: 700, background: VERSION_META[p.version].fill, color: VERSION_META[p.version].color, border: `1.5px solid ${VERSION_META[p.version].color}` }}>
                    {VERSION_META[p.version].label}
                  </span>
                ))}
                <button onClick={() => fileRef.current.click()} className="no-print" style={{ padding: "3px 8px", borderRadius: 6, border: "1.5px solid #ddd", background: "#fff", color: "#888", fontWeight: 700, cursor: "pointer", fontSize: 9, marginLeft: 4 }}>+ Add</button>
                <button onClick={() => setProfiles([])} className="no-print" style={{ padding: "3px 8px", borderRadius: 6, border: "1.5px solid #ddd", background: "#fff", color: "#C25670", fontWeight: 700, cursor: "pointer", fontSize: 9 }}>Clear</button>
                <input ref={fileRef} type="file" accept=".json" multiple onChange={handleFiles} style={{ display: "none" }} />
              </div>
            </div>

            {/* Tabs */}
            <div className="no-print" style={{ display: "flex", gap: 3, marginBottom: 10 }}>
              {[["radar", "🕸️ Radar"], ["bars", "📊 Bars"], ["table", "📋 Table"]].map(([t, lbl]) => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 14px", borderRadius: 10, border: "none", background: tab === t ? COLORS.navy : "#fff", color: tab === t ? "#fff" : "#888", fontWeight: 700, cursor: "pointer", fontSize: 12, boxShadow: "0 1px 3px #0001" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Main card */}
            <div className="print-card" style={{ background: COLORS.card, borderRadius: 18, padding: "20px 24px", boxShadow: "0 2px 20px #0001" }}>
              {profiles.length > 1 && (
                <div style={{ display: "flex", gap: 12, marginBottom: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  {profiles.map((p) => (
                    <div key={p.version} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 14, height: 3, borderRadius: 2, background: VERSION_META[p.version].color }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: VERSION_META[p.version].color }}>{VERSION_META[p.version].label}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "radar" && (
                <>
                  <div style={{ textAlign: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.navy, fontFamily: "'Baloo 2',cursive" }}>
                      {profiles.length > 1 ? "Cross-Informant Comparison" : `${VERSION_META[profiles[0].version].label} Profile`}
                    </div>
                  </div>
                  <RadarChart datasets={profiles} />
                </>
              )}
              {tab === "bars" && (
                <>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.navy, fontFamily: "'Baloo 2',cursive", marginBottom: 10, textAlign: "center" }}>Domain Scores by Informant</div>
                  <BarChart datasets={profiles} />
                </>
              )}
              {tab === "table" && (
                <>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.navy, fontFamily: "'Baloo 2',cursive", marginBottom: 10, textAlign: "center" }}>Domain Score Detail</div>
                  <ScoreTable datasets={profiles} />
                </>
              )}

              {/* Discrepancy analysis */}
              {profiles.length > 1 && (() => {
                const discs = [];
                DOMAINS.forEach((d) => {
                  const vals = profiles.map((p) => ({ v: p.version, s: p.scores[d.id] })).filter((x) => x.s != null);
                  if (vals.length < 2) return;
                  const mx = vals.reduce((a, b) => (a.s > b.s ? a : b));
                  const mn = vals.reduce((a, b) => (a.s < b.s ? a : b));
                  const diff = Math.round((mx.s - mn.s) * 100);
                  if (diff >= 20) discs.push({ d, diff, hi: mx.v, lo: mn.v });
                });
                return discs.length > 0 ? (
                  <div style={{ background: "#FFF8F0", borderRadius: 10, padding: "12px 14px", marginTop: 14, border: "1px solid #FFE0C8" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#B07830" }}>Cross-Informant Discrepancy Analysis</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 4, lineHeight: 1.7 }}>
                      {discs.map((x, i) => (
                        <div key={i}>
                          <b>{x.d.icon} {x.d.title}</b> — {x.diff}pp gap: <span style={{ color: VERSION_META[x.hi].color, fontWeight: 700 }}>{VERSION_META[x.hi].label}</span> rates higher than <span style={{ color: VERSION_META[x.lo].color, fontWeight: 700 }}>{VERSION_META[x.lo].label}</span>.
                          {x.diff >= 30 && <em style={{ color: "#C25670" }}> Notable — explore environmental context.</em>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#EBF7EE", borderRadius: 10, padding: "12px 14px", marginTop: 14, border: "1px solid #B8E6C0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2D7A3E" }}>Cross-Informant Concordance</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>Ratings are generally concordant across informants (all discrepancies &lt;20pp).</div>
                  </div>
                );
              })()}

              {/* Clinician vs Teacher comparison note */}
              {profiles.some((p) => p.version === "clinician") && profiles.some((p) => p.version === "teacher") && (() => {
                const cScores = profiles.find((p) => p.version === "clinician").scores;
                const tScores = profiles.find((p) => p.version === "teacher").scores;
                const envDiscs = [];
                DOMAINS.forEach((d) => {
                  if (cScores[d.id] != null && tScores[d.id] != null) {
                    const diff = Math.round(Math.abs(cScores[d.id] - tScores[d.id]) * 100);
                    if (diff >= 15) {
                      const higher = cScores[d.id] > tScores[d.id] ? "Clinician" : "Teacher";
                      envDiscs.push({ d, diff, higher });
                    }
                  }
                });
                return envDiscs.length > 0 && (
                  <div style={{ background: "#E8F4FF", borderRadius: 10, padding: "12px 14px", marginTop: 10, border: "1px solid #BDD8F0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy }}>🏥↔️🏫 Clinician–Teacher Environmental Comparison</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 4, lineHeight: 1.7 }}>
                      {envDiscs.map((x, i) => (
                        <div key={i}>
                          <b>{x.d.icon} {x.d.short}</b> — {x.diff}pp gap, <b>{x.higher}</b> rates higher. {x.higher === "Clinician" ? "Skill may be more accessible in structured clinical contexts than naturalistic school settings." : "Skill may emerge more in classroom contexts with peer models and naturalistic demands."}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Stress summary */}
              {profiles.some((p) => p.version === "parent") && (() => {
                const pp = profiles.find((p) => p.version === "parent");
                const flagged = DOMAINS.filter((d) => pp.stressFlags[d.id] > 0);
                return flagged.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.purple, marginBottom: 6 }}>⚡ Stress-Context Modifier (Parent Report)</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {flagged.map((d) => (
                        <span key={d.id} style={{ padding: "3px 10px", borderRadius: 16, fontSize: 9, fontWeight: 700, background: "#F3EDF9", color: COLORS.purple, border: "1.5px solid #D8C8E8" }}>
                          {d.icon} {d.short}: {Math.round(pp.stressFlags[d.id] * 100)}%
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 9, color: "#aaa", marginTop: 4, fontStyle: "italic" }}>
                      % of items parent endorsed as "can do this, but not when stressed." Higher values suggest regulation-dependent skill expression.
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ textAlign: "center", marginTop: 14, marginBottom: 32, color: "#ccc", fontSize: 9 }}>
              SCDCI v0.3 • RTN Communication & Literacy • Rachel Terra Norton, MS, CCC-SLP • rachelslp.org<br />
              LSP© • FEDC/DIR • BESSI • SSF • Roth & Worthington • Nakamura<br />
              Not for clinical use without further validation
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
