import { useState, useRef, useCallback } from "react";
import DOMAINS from "./data/domains";
import { COLORS, THEMES, SECTION_COLORS, VERSION_META, MAX_VALUES } from "./data/constants";
import { getItems, getContext, computeScores, computeStress } from "./utils/scoring";
import {
  RadarChart, ObserverRow, ParentRow, SelfReportRow,
  SectionHeader, ContextPrompt, Legend, BarChart, ScoreTable,
  ProtocolForm,
} from "./components";

const isObserver = (v) => v === "clinician" || v === "teacher";

const ThemeToggle = ({ dark, toggle }) => (
  <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={{
    padding: "7px 14px", borderRadius: 100,
    border: `1px solid ${dark ? "#1e3332" : "#d4dfdf"}`,
    background: dark ? "#142322" : "#ffffff",
    color: dark ? "#6b8886" : "#7a9191",
    fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6, transition: "border-color 0.2s, color 0.2s",
  }}>
    <span style={{ fontSize: 13, lineHeight: 1 }}>{dark ? "☾" : "☀"}</span>
    {dark ? "Dark" : "Light"}
  </button>
);

export default function App() {
  const [mode, setMode] = useState(null);
  const [ver, setVer] = useState(null);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('scdfi-theme') === 'dark'; } catch { return false; }
  });
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

  const t = dark ? THEMES.dark : THEMES.light;
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      try { localStorage.setItem('scdfi-theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  };

  if (typeof window !== 'undefined') {
    document.body.style.background = t.bg;
    document.body.style.color = t.text;
  }

  const sR = (did, i, v) => setResp((r) => ({ ...r, [`${did}_${i}`]: v }));
  const sS = (did, i, v) => setStress((s) => ({ ...s, [`${did}_${i}`]: v }));

  const saveJSON = () => {
    const data = { version: ver, form, responses: resp, stress, exportDate: new Date().toISOString() };
    const b = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `SCDFI_${ver}_${form.client || "client"}_${form.date}.json`;
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

  // ═══ PROTOCOL FORMS ═══
  if (mode === "protocol-clinician") {
    return <ProtocolForm version="clinician" dark={dark} onBack={() => setMode(null)} onToggle={toggle} />;
  }
  if (mode === "protocol-teacher") {
    return <ProtocolForm version="teacher" dark={dark} onBack={() => setMode(null)} onToggle={toggle} />;
  }
  if (mode === "protocol-parent") {
    return <ProtocolForm version="parent" dark={dark} onBack={() => setMode(null)} onToggle={toggle} />;
  }

  // ═══ LANDING ═══
  if (!mode) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: 18, right: 22, zIndex: 100 }}><ThemeToggle dark={dark} toggle={toggle} /></div>

        <div style={{ maxWidth: 700, width: "100%", textAlign: "left" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textDim, marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${t.border}`, display: "inline-block" }}>
            Multi-Informant Assessment · Social Communication · Developmental Functioning
          </p>

          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.08, color: t.text, marginBottom: 14, position: "relative", display: "inline-block", paddingBottom: 10 }}>
            SCDFI
            <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, borderRadius: 2, background: t.accent, opacity: 0.85 }} />
          </h1>
          <div style={{ fontSize: 13, color: t.textDim, marginBottom: 6, letterSpacing: "0.02em" }}>Social-Communication & Developmental Functioning Inventory</div>

          <p style={{ fontSize: 16, color: t.textSub, lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>
            A strengths-based, multi-informant tool for assessing social communication
            and developmental functioning across 12 domains &mdash; informed by the LSP, FEDC/DIR, BESSI, and ASHA social communication benchmarks.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { m: "assess", icon: "📝", label: "Assessment", desc: "Clinician · Teacher · Parent · Self\n12 domains · 4 informant versions", accent: t.accent },
              { m: "dash", icon: "📊", label: "Dashboard", desc: "Import saved assessments\nRadar · Bar · Cross-informant analysis", accent: "#2a6fa0" },
            ].map(({ m, icon, label, desc, accent }) => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: "24px 22px", borderRadius: 18, border: `1px solid ${t.border}`,
                background: t.card, cursor: "pointer", textAlign: "left", transition: "transform 0.25s, border-color 0.25s",
                position: "relative",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: `${accent}15`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</span>
                  <span style={{ fontWeight: 500, fontSize: 19, color: t.text, letterSpacing: "-0.005em" }}>{label}</span>
                </div>
                <div style={{ fontSize: 13, color: t.textSub, lineHeight: 1.7, whiteSpace: "pre-line" }}>{desc}</div>
                <div style={{ marginTop: 14, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: accent }}>Begin →</div>
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textDim, marginBottom: 10, marginTop: 28 }}>Printable Protocol Forms</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
            {[
              { m: "protocol-clinician", icon: "📋", label: "Clinician", desc: "12 domains · 4-point developmental scale · SA/IU notation", tag: "Print-ready" },
              { m: "protocol-teacher", icon: "🏫", label: "Teacher", desc: "12 domains · 4-point developmental scale · SA/IU notation", tag: "Print-ready" },
              { m: "protocol-parent", icon: "🏠", label: "Parent / Caregiver", desc: "12 domains · 4-point scale · Stress modifier column", tag: "Print-ready" },
            ].map(({ m, icon, label, desc, tag }) => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: "20px 20px", borderRadius: 14, border: `1px solid ${t.border}`,
                background: t.card, cursor: "pointer", textAlign: "left", transition: "transform 0.25s, border-color 0.25s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 15, color: t.text }}>{label}</span>
                </div>
                <div style={{ fontSize: 12.5, color: t.textSub, lineHeight: 1.5, marginBottom: 10 }}>{desc}</div>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", color: t.accent, background: `${t.accent}12`, padding: "4px 10px", borderRadius: 3 }}>{tag}</span>
              </button>
            ))}
          </div>

          <div style={{ paddingTop: 20, borderTop: `1px solid ${t.border}`, fontSize: 10, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: t.textDim, lineHeight: 1.9 }}>
            LSP · FEDC/DIR · BESSI · SSF · Roth & Worthington · ASHA Benchmarks<br />
            Rachel Terra Norton, MS, CCC-SLP · rachelslp.org
          </div>
        </div>
      </div>
    );
  }

  // ═══ VERSION SELECT ═══
  if (mode === "assess" && !ver) {
    const cards = [
      { v: "clinician", ico: "📋", lbl: "Clinician", accent: "#1b3a4b", desc: "4-point developmental scale\n~66 items · SA/IU notation\nClinical / therapeutic settings" },
      { v: "teacher", ico: "🏫", lbl: "Teacher", accent: "#1a7a7a", desc: "4-point developmental scale\n~66 items · SA/IU notation\nClassroom / school settings" },
      { v: "parent", ico: "👨‍👩‍👧", lbl: "Parent / Caregiver", accent: "#2a7a5a", desc: "4-point developmental scale\n~43 items · Stress modifier\nHome / community settings" },
      { v: "self", ico: "🧑‍🎓", lbl: "Self-Report (14+)", accent: "#7a5aaa", desc: "4-point self-identification\n~24 items\nAdolescent / young adult" },
    ];

    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ position: "fixed", top: 18, right: 22, zIndex: 100 }}><ThemeToggle dark={dark} toggle={toggle} /></div>
        <div style={{ background: t.card, borderRadius: 20, padding: "40px 36px", maxWidth: 780, width: "100%", border: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <button onClick={() => setMode(null)} style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>← Back</button>
            <div style={{ fontWeight: 500, fontSize: 18, color: t.text }}>Select Informant Version</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {cards.map(({ v, ico, lbl, accent, desc }) => (
              <button key={v} onClick={() => setVer(v)} style={{
                padding: "24px 20px", borderRadius: 18, border: `1px solid ${t.border}`,
                background: t.card, cursor: "pointer", textAlign: "left", transition: "transform 0.2s, border-color 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: `${accent}15`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{ico}</span>
                  <span style={{ fontWeight: 600, fontSize: 16, color: t.text }}>{lbl}</span>
                </div>
                <div style={{ fontSize: 12, color: t.textSub, lineHeight: 1.6, whiteSpace: "pre-line" }}>{desc}</div>
                <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: accent }}>Select →</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const vc = VERSION_META[ver]?.color || t.accent;
  const vm = VERSION_META[ver] || {};

  // ═══ ASSESSMENT FORM ═══
  if (mode === "assess" && ver) {
    const respondentLabel = ver === "self" ? "School / Program" : ver === "parent" ? "Respondent Name" : "Respondent (Name, Role)";
    const clientLabel = ver === "self" ? "Your Name" : "Client / Student Name";

    return (
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="no-print" style={{
          position: "sticky", top: 6, zIndex: 100,
          background: t.stickyBg, backdropFilter: "saturate(160%) blur(12px)", WebkitBackdropFilter: "saturate(160%) blur(12px)",
          padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: "0 0 16px 16px", border: `1px solid ${t.border}`, borderTop: "none", flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <div style={{ color: t.text, fontWeight: 500, fontSize: 16, letterSpacing: "-0.005em", lineHeight: 1.1 }}>SCDFI — {vm.label}</div>
            <div style={{ color: t.textDim, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 3 }}>RTN Communication & Literacy</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <ThemeToggle dark={dark} toggle={toggle} />
            <button onClick={() => { setVer(null); setResp({}); setStress({}); }} style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>← Back</button>
            <button onClick={saveJSON} style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>Save</button>
            <button onClick={finishAssessment} style={{ padding: "7px 18px", borderRadius: 100, border: `1px solid ${t.text}`, background: t.text, color: t.bg, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>Dashboard</button>
          </div>
        </div>

        <div className="pc" style={{ background: t.card, borderRadius: 20, padding: "28px 32px", margin: "16px 0", border: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <span style={{ background: `${vc}15`, color: vc, padding: "4px 16px", borderRadius: 20, fontWeight: 700, fontSize: 12, border: `2px solid ${vc}` }}>
              {vm.icon} {vm.label}
            </span>
          </div>

          <div style={{ background: dark ? "#111" : "#f7fafa", borderRadius: 12, padding: "10px 14px", marginBottom: 12, border: `1px solid ${t.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 8 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px" }}>{clientLabel}</label>
                <input value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${t.border}`, fontSize: 13, background: t.inputBg, color: t.text }} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px" }}>{respondentLabel}</label>
                <input value={form.respondent} onChange={(e) => setForm((f) => ({ ...f, respondent: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${t.border}`, fontSize: 13, background: t.inputBg, color: t.text }} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px" }}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${t.border}`, fontSize: 13, background: t.inputBg, color: t.text }} />
              </div>
            </div>
            {isObserver(ver) && (
              <div style={{ marginTop: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: t.textDim, textTransform: "uppercase", letterSpacing: ".5px" }}>Setting / Context</label>
                <input
                  value={form.setting}
                  onChange={(e) => setForm((f) => ({ ...f, setting: e.target.value }))}
                  placeholder={vm.settingPrompt}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${t.border}`, fontSize: 13, background: t.inputBg, color: t.text }}
                />
              </div>
            )}
          </div>

          <div style={{ background: dark ? `${vc}10` : `${vc}08`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, border: `1px solid ${dark ? `${vc}33` : `${vc}22`}`, fontSize: 13, color: t.textSub, lineHeight: 1.6 }}>
            {ver === "self" ? (
              <><b style={{ color: vc }}>Hey! 👋</b> {vm.instructions}</>
            ) : (
              <><b style={{ color: vc }}>Instructions:</b> {vm.instructions}</>
            )}
          </div>

          <Legend version={ver} dark={dark} />

          {DOMAINS.map((d) => {
            const items = getItems(d, ver);
            const ctx = getContext(d, ver);
            return (
              <div key={d.id}>
                <SectionHeader icon={d.icon} title={d.title} colorKey={d.colorKey} num={d.n} sub={d.desc} dark={dark} />
                <div style={{ fontSize: 10, color: t.textDim, marginBottom: 6, fontStyle: "italic", paddingLeft: 4 }}>{d.fw}</div>

                {isObserver(ver) && <ContextPrompt text={ctx} color={vc} dark={dark} />}

                {isObserver(ver) && items.map((text, i) => (
                  <ObserverRow key={i} text={text} value={resp[`${d.id}_${i}`]} onChange={(v) => sR(d.id, i, v)} scaleKey={ver} dark={dark} />
                ))}
                {ver === "parent" && items.map((text, i) => (
                  <ParentRow key={i} text={text} value={resp[`${d.id}_${i}`]} onChange={(v) => sR(d.id, i, v)} stress={stress[`${d.id}_${i}`]} onStress={(v) => sS(d.id, i, v)} dark={dark} />
                ))}
                {ver === "self" && items.map((text, i) => (
                  <SelfReportRow key={i} text={text} value={resp[`${d.id}_${i}`]} onChange={(v) => sR(d.id, i, v)} dark={dark} />
                ))}

                {isObserver(ver) && (
                  <textarea
                    value={form.notes[d.id] || ""} placeholder="Observations / contextual notes..."
                    onChange={(e) => setForm((f) => ({ ...f, notes: { ...f.notes, [d.id]: e.target.value } }))}
                    rows={2}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${t.border}`, fontSize: 12, resize: "vertical", background: t.inputBg, color: t.textSub, fontStyle: "italic", marginTop: 4 }}
                  />
                )}
              </div>
            );
          })}

          <div style={{ background: dark ? `${vc}10` : "#f0faf9", borderRadius: 14, padding: "20px 24px", marginTop: 28, textAlign: "center", border: `1px solid ${dark ? `${vc}33` : "#d4dfdf"}` }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.text, letterSpacing: -0.3 }}>
              {ver === "self" ? "You're all done — nice work! 🎉" : "Assessment Complete"}
            </div>
            <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>Save your data, then view the profile dashboard.</div>
          </div>

          <div style={{ textAlign: "center", marginTop: 16, color: t.textDim, fontSize: 10, letterSpacing: "0.12em" }}>
            SCDFI v0.3 · RTN Communication & Literacy · Rachel Terra Norton, MS, CCC-SLP · rachelslp.org<br />
            Not for clinical use without further validation
          </div>
        </div>

        <div className="no-print" style={{
          position: "sticky", bottom: 0, background: t.footerBg, padding: "12px 24px",
          borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "center", gap: 12, marginTop: 8,
          border: `1px solid ${t.border}`, borderBottom: "none",
        }}>
          <button onClick={saveJSON} style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${t.accent}`, background: t.card, color: t.accent, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>💾 Save JSON</button>
          <button onClick={finishAssessment} style={{ padding: "12px 28px", borderRadius: 999, border: "none", background: t.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, boxShadow: `0 3px 14px ${t.accent}44` }}>📊 View Dashboard</button>
          <button onClick={() => window.print()} style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.card, color: t.textMuted, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>🖨 Print</button>
        </div>
      </div>
    );
  }

  // ═══ DASHBOARD ═══
  if (mode === "dash") {
    const clientName = profiles.length > 0 ? profiles[0].client || "Client" : "Client";

    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 12px" }}>
        <div className="no-print" style={{
          position: "sticky", top: 6, zIndex: 100,
          background: t.stickyBg, backdropFilter: "saturate(160%) blur(12px)", WebkitBackdropFilter: "saturate(160%) blur(12px)",
          padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: "0 0 16px 16px", border: `1px solid ${t.border}`, borderTop: "none", flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <div style={{ color: t.text, fontWeight: 500, fontSize: 16, letterSpacing: "-0.005em" }}>SCDFI Profile Dashboard</div>
            <div style={{ color: t.textDim, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 3 }}>RTN Communication & Literacy</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <ThemeToggle dark={dark} toggle={toggle} />
            <button onClick={() => setMode(null)} style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>← Home</button>
            <button onClick={() => window.print()} style={{ padding: "7px 18px", borderRadius: 100, border: `1px solid ${t.text}`, background: t.text, color: t.bg, fontWeight: 500, cursor: "pointer", fontSize: 12 }}>Print</button>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div style={{ background: t.card, borderRadius: 20, padding: "36px 28px", border: `1px solid ${t.border}`, textAlign: "center", marginTop: 16 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>📊</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 6 }}>Load SCDFI Profiles</div>
            <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>
              Import saved JSON files from assessments, or load demo data to explore the dashboard.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => fileRef.current.click()} style={{ padding: "12px 24px", borderRadius: 12, border: `2px dashed ${t.accent}`, background: `${t.accent}08`, color: t.accent, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>📁 Import JSON</button>
              <button onClick={loadDemo} style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.card, color: t.textMuted, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🎲 Demo Data</button>
              <button onClick={() => { setMode("assess"); setVer(null); setResp({}); setStress({}); }} style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${t.accent}`, background: `${t.accent}08`, color: t.accent, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>📝 New Assessment</button>
            </div>
            <input ref={fileRef} type="file" accept=".json" multiple onChange={handleFiles} style={{ display: "none" }} />
          </div>
        ) : (
          <>
            <div style={{ background: t.card, borderRadius: 12, padding: "10px 16px", marginTop: 16, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${t.border}`, flexWrap: "wrap", gap: 6 }}>
              <div>
                <span style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{clientName}</span>
                <span style={{ color: t.textDim, fontSize: 11, marginLeft: 10 }}>{profiles[0].date}</span>
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                {profiles.map((p) => (
                  <span key={p.version} style={{ padding: "2px 10px", borderRadius: 16, fontSize: 9, fontWeight: 700, background: VERSION_META[p.version].fill, color: VERSION_META[p.version].color, border: `1.5px solid ${VERSION_META[p.version].color}` }}>
                    {VERSION_META[p.version].label}
                  </span>
                ))}
                <button onClick={() => fileRef.current.click()} className="no-print" style={{ padding: "3px 8px", borderRadius: 6, border: `1.5px solid ${t.border}`, background: t.card, color: t.textMuted, fontWeight: 700, cursor: "pointer", fontSize: 9, marginLeft: 4 }}>+ Add</button>
                <button onClick={() => setProfiles([])} className="no-print" style={{ padding: "3px 8px", borderRadius: 6, border: `1.5px solid ${t.border}`, background: t.card, color: "#a84040", fontWeight: 700, cursor: "pointer", fontSize: 9 }}>Clear</button>
                <input ref={fileRef} type="file" accept=".json" multiple onChange={handleFiles} style={{ display: "none" }} />
              </div>
            </div>

            <div className="no-print" style={{ display: "flex", gap: 3, marginBottom: 10 }}>
              {[["radar", "🕸️ Radar"], ["bars", "📊 Bars"], ["table", "📋 Table"]].map(([ti, lbl]) => (
                <button key={ti} onClick={() => setTab(ti)} style={{ flex: 1, padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: tab === ti ? t.accent : t.card, color: tab === ti ? "#fff" : t.textMuted, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                  {lbl}
                </button>
              ))}
            </div>

            <div className="pc" style={{ background: t.card, borderRadius: 20, padding: "20px 24px", border: `1px solid ${t.border}` }}>
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
                    <div style={{ fontSize: 18, fontWeight: 500, color: t.text }}>
                      {profiles.length > 1 ? "Cross-Informant Comparison" : `${VERSION_META[profiles[0].version].label} Profile`}
                    </div>
                  </div>
                  <RadarChart datasets={profiles} />
                </>
              )}
              {tab === "bars" && (
                <>
                  <div style={{ fontSize: 18, fontWeight: 500, color: t.text, marginBottom: 10, textAlign: "center" }}>Domain Scores by Informant</div>
                  <BarChart datasets={profiles} />
                </>
              )}
              {tab === "table" && (
                <>
                  <div style={{ fontSize: 18, fontWeight: 500, color: t.text, marginBottom: 10, textAlign: "center" }}>Domain Score Detail</div>
                  <ScoreTable datasets={profiles} />
                </>
              )}

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
                  <div style={{ background: dark ? "#2a241810" : "#FFF8F0", borderRadius: 10, padding: "12px 14px", marginTop: 14, border: `1px solid ${dark ? "#3a3020" : "#FFE0C8"}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#B07830" }}>Cross-Informant Discrepancy Analysis</div>
                    <div style={{ fontSize: 12, color: t.textSub, marginTop: 4, lineHeight: 1.7 }}>
                      {discs.map((x, i) => (
                        <div key={i}>
                          <b>{x.d.icon} {x.d.title}</b> — {x.diff}pp gap: <span style={{ color: VERSION_META[x.hi].color, fontWeight: 700 }}>{VERSION_META[x.hi].label}</span> rates higher than <span style={{ color: VERSION_META[x.lo].color, fontWeight: 700 }}>{VERSION_META[x.lo].label}</span>.
                          {x.diff >= 30 && <em style={{ color: "#a84040" }}> Notable — explore environmental context.</em>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: dark ? "#1e2b2210" : "#EBF7EE", borderRadius: 10, padding: "12px 14px", marginTop: 14, border: `1px solid ${dark ? "#2a4030" : "#B8E6C0"}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2a7a5a" }}>Cross-Informant Concordance</div>
                    <div style={{ fontSize: 12, color: t.textSub, marginTop: 3 }}>Ratings are generally concordant across informants (all discrepancies &lt;20pp).</div>
                  </div>
                );
              })()}

              {profiles.some((p) => p.version === "parent") && (() => {
                const pp = profiles.find((p) => p.version === "parent");
                const flagged = DOMAINS.filter((d) => pp.stressFlags[d.id] > 0);
                return flagged.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#7a5aaa", marginBottom: 6 }}>⚡ Stress-Context Modifier (Parent Report)</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {flagged.map((d) => (
                        <span key={d.id} style={{ padding: "3px 10px", borderRadius: 16, fontSize: 9, fontWeight: 700, background: dark ? "#7a5aaa15" : "#F3EDF9", color: "#7a5aaa", border: "1.5px solid #D8C8E8" }}>
                          {d.icon} {d.short}: {Math.round(pp.stressFlags[d.id] * 100)}%
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 9, color: t.textDim, marginTop: 4, fontStyle: "italic" }}>
                      % of items parent endorsed as "can do this, but not when stressed." Higher values suggest regulation-dependent skill expression.
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ textAlign: "center", marginTop: 14, marginBottom: 32, color: t.textDim, fontSize: 10, letterSpacing: "0.12em" }}>
              SCDFI v0.3 · RTN Communication & Literacy · Rachel Terra Norton, MS, CCC-SLP · rachelslp.org<br />
              LSP · FEDC/DIR · BESSI · SSF · Roth & Worthington · ASHA Benchmarks
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
