"use client";
import { useState, useRef } from "react";

const S = {
  accent: "#00E5A0",
  bg: "#0A0F0D",
  card: "#101810",
  border: "#1A2E1F",
  text: "#E8F5EC",
  muted: "#4A6B52",
};

function AgentDot({ label, detail, status }) {
  const color =
    status === "running" ? S.accent
    : status === "done" ? S.accent
    : status === "error" ? "#FF6B6B"
    : S.muted;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%",
        border: `2px solid ${color}`,
        background: status === "done" ? color : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.4s ease",
        boxShadow: status === "running" ? `0 0 14px ${color}88` : "none",
      }}>
        {status === "running" && (
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: S.accent, animation: "pulse 1s infinite" }} />
        )}
        {status === "done" && <span style={{ color: S.bg, fontSize: 13, fontWeight: 800 }}>✓</span>}
      </div>
      <div style={{ paddingTop: 4 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600,
          color: status === "idle" ? S.muted : S.text,
        }}>{label}</div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

function SeverityBadge({ value }) {
  const map = {
    leicht: { label: "Leicht", color: "#00E5A0" },
    mittel: { label: "Mittel", color: "#FFB830" },
    schwer: { label: "Schwer", color: "#FF6B6B" },
  };
  const s = map[value] || { label: value, color: S.muted };
  return (
    <span style={{
      background: s.color + "22", color: s.color,
      border: `1px solid ${s.color}44`,
      borderRadius: 6, padding: "3px 10px",
      fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1,
    }}>
      {s.label.toUpperCase()}
    </span>
  );
}

function ExerciseCard({ ex, index, visible }) {
  return (
    <div style={{
      background: S.card, border: `1px solid ${S.border}`, borderRadius: 18,
      padding: "22px 26px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${index * 0.09}s, transform 0.5s ease ${index * 0.09}s`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{ex.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2.5,
            color: S.accent, textTransform: "uppercase", marginBottom: 3,
          }}>
            Übung {index + 1}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: S.text, lineHeight: 1.2 }}>{ex.name}</div>
        </div>
        <div style={{
          flexShrink: 0, textAlign: "right",
          background: "#060C08", borderRadius: 10, padding: "8px 14px",
          border: `1px solid ${S.border}`,
        }}>
          <div style={{ color: S.accent, fontSize: 14, fontWeight: 700 }}>{ex.sets} × {ex.reps}</div>
          <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>{ex.frequency}</div>
        </div>
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2,
        color: S.muted, textTransform: "uppercase", marginBottom: 5,
      }}>Ziel</div>
      <div style={{ color: "#8FC49A", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{ex.target}</div>
      <div style={{ color: S.text, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{ex.description}</div>
      <div style={{
        background: "#081208",
        borderLeft: `3px solid ${S.accent}`,
        borderRadius: "0 10px 10px 0",
        padding: "10px 14px",
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
          color: S.accent, letterSpacing: 1, textTransform: "uppercase",
        }}>💡 Hinweis — </span>
        <span style={{ color: "#8FC49A", fontSize: 13 }}>{ex.tip}</span>
      </div>
    </div>
  );
}

function downloadPDF(result) {
  const severityColors = { leicht: "#00C47A", mittel: "#E6A200", schwer: "#E05555" };
  const severityColor = severityColors[result.intake.severity] || "#888";
  const exerciseRows = result.exercises.map((ex, i) => `
    <div style="margin-bottom:24px;padding:18px 20px;border:1px solid #dde8e2;border-radius:12px;background:#f9fdfb;break-inside:avoid;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div>
          <div style="font-family:monospace;font-size:9px;color:#00A070;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;">Übung ${i + 1} ${ex.emoji}</div>
          <div style="font-size:15px;font-weight:700;color:#0A1F12;">${ex.name}</div>
          <div style="font-size:12px;color:#3A7A54;margin-top:3px;">${ex.target}</div>
        </div>
        <div style="text-align:right;background:white;border:1px solid #dde8e2;border-radius:8px;padding:8px 12px;flex-shrink:0;margin-left:12px;">
          <div style="font-size:14px;font-weight:700;color:#00A070;">${ex.sets} × ${ex.reps}</div>
          <div style="font-size:11px;color:#888;margin-top:2px;">${ex.frequency}</div>
        </div>
      </div>
      <div style="font-size:13px;color:#2A3D2F;line-height:1.65;margin-bottom:10px;">${ex.description}</div>
      <div style="background:#eef8f3;border-left:3px solid #00A070;padding:8px 12px;border-radius:0 6px 6px 0;font-size:12px;color:#2A5A3A;">
        <strong>💡 Hinweis:</strong> ${ex.tip}
      </div>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Heimübungsplan</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Georgia,serif; color:#1A2E1F; background:white; padding:40px; max-width:800px; margin:0 auto; }
  @media print { body { padding:20px; } }
</style>
</head>
<body>
  <div style="border-bottom:3px solid #00A070;padding-bottom:20px;margin-bottom:24px;">
    <div style="font-family:monospace;font-size:10px;color:#00A070;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">◆ Physiotherapie · Heimübungsplan</div>
    <h1 style="font-size:26px;font-weight:700;color:#0A1F12;margin-bottom:4px;">Heimübungs-Behandlungsplan</h1>
    <div style="font-size:12px;color:#888;">Erstellt am ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
  </div>
  <div style="background:#f0faf5;border:1px solid #c0e8d0;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
    <div style="font-family:monospace;font-size:9px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Klinische Aufnahmezusammenfassung</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
      <div style="background:white;border:1px solid #dde8e2;border-radius:8px;padding:10px 14px;flex:1;min-width:140px;">
        <div style="font-family:monospace;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Körperzone</div>
        <div style="font-size:13px;font-weight:600;color:#0A1F12;">${result.intake.bodyZone}</div>
      </div>
      <div style="background:white;border:1px solid #dde8e2;border-radius:8px;padding:10px 14px;flex:1;min-width:140px;">
        <div style="font-family:monospace;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Beschwerdetyp</div>
        <div style="font-size:13px;font-weight:600;color:#0A1F12;">${result.intake.issueType}</div>
      </div>
      <div style="background:white;border:1px solid #dde8e2;border-radius:8px;padding:10px 14px;flex:1;min-width:140px;">
        <div style="font-family:monospace;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Schweregrad</div>
        <div style="font-size:13px;font-weight:700;color:${severityColor};text-transform:uppercase;">${result.intake.severity}</div>
      </div>
    </div>
    ${result.intake.precautions?.length > 0 ? `<div style="background:#fff8e6;border:1px solid #f0d080;border-radius:8px;padding:10px 14px;margin-bottom:10px;"><span style="color:#B8860B;font-family:monospace;font-size:10px;font-weight:700;">⚠ VORSICHT — </span><span style="color:#7A5500;font-size:12px;">${result.intake.precautions.join(" · ")}</span></div>` : ""}
    <div style="font-size:13px;color:#4A6A52;font-style:italic;line-height:1.6;">${result.intake.summary}</div>
  </div>
  <div style="background:#f0faf5;border-left:4px solid #00A070;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:28px;">
    <div style="font-family:monospace;font-size:9px;color:#00A070;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Für den Patienten</div>
    <div style="font-size:14px;color:#1A2E1F;line-height:1.75;">${result.intro}</div>
  </div>
  <div style="font-family:monospace;font-size:9px;color:#888;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Heimübungsprogramm · ${result.exercises.length} Übungen</div>
  ${exerciseRows}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => { win.print(); URL.revokeObjectURL(url); };
  }
}

export default function HomePage() {
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [cardsVisible, setCardsVisible] = useState(false);
  const resultsRef = useRef(null);

  const agentStatus = status === "running" ? "running" : status === "done" ? "done" : status === "error" ? "error" : "idle";

  const agents = [
    { label: "Klinischer Analyst", detail: "Beschwerde analysieren & Strukturen identifizieren" },
    { label: "Übungsplaner", detail: "Personalisiertes Heimprogramm erstellen" },
    { label: "Patientenredakteur", detail: "Patientenfreundliche Einleitung verfassen" },
  ];

  async function handleSubmit() {
    if (!problem.trim() || status === "running") return;
    setStatus("running");
    setError("");
    setResult(null);
    setCardsVisible(false);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Serverfehler");
      setResult(data);
      setStatus("done");
      setTimeout(() => setCardsVisible(true), 120);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  }

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 100 }}>
      <header style={{
        borderBottom: `1px solid ${S.border}`,
        padding: "36px 40px 30px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${S.accent} 50%, transparent 100%)`,
        }} />
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10, color: S.accent,
            letterSpacing: 3, textTransform: "uppercase", marginBottom: 10,
          }}>
            ◆ Physiotherapie · KI-System
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 10 }}>
            Heimübungs-<br />
            <span style={{ color: S.accent }}>Behandlungsplaner</span>
          </h1>
          <p style={{ color: S.muted, fontSize: 14, maxWidth: 520, lineHeight: 1.65 }}>
            Patientenbeschreibung eingeben — die KI analysiert die Beschwerde und erstellt sofort ein massgeschneidertes Heimrehabilitationsprogramm.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "44px 24px 0" }}>
        <div className="fade-up" style={{
          background: S.card, border: `1px solid ${S.border}`,
          borderRadius: 22, padding: "28px 30px", marginBottom: 28,
        }}>
          <label style={{
            display: "block", fontFamily: "'DM Mono', monospace",
            fontSize: 10, color: S.accent, letterSpacing: 2.5,
            textTransform: "uppercase", marginBottom: 14,
          }}>
            Patientenbeschreibung
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="z.B. 35-jähriger Büroangestellter mit chronischen Rückenschmerzen seit 3 Monaten, verstärkt durch langes Sitzen. Keine Ausstrahlung in die Beine. Leichte Schwäche der Rumpfmuskulatur. Keine Vorverletzungen."
            rows={5}
            style={{
              width: "100%", background: "#060C08",
              border: `1px solid ${S.border}`, borderRadius: 12,
              padding: "14px 16px", color: S.text, fontSize: 14,
              lineHeight: 1.65, fontFamily: "'Lora', serif",
            }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginTop: 18, flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ color: S.muted, fontSize: 12 }}>
              Alter, Beschwerdedauer, Schmerzlokalisation und Einschränkungen angeben.
            </div>
            <button
              onClick={handleSubmit}
              disabled={status === "running" || !problem.trim()}
              style={{
                background: status === "running" ? S.border : S.accent,
                color: status === "running" ? S.muted : S.bg,
                border: "none", borderRadius: 11,
                padding: "12px 30px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 13, fontWeight: 700,
                cursor: status === "running" ? "not-allowed" : "pointer",
                letterSpacing: 1, textTransform: "uppercase",
                boxShadow: status !== "running" ? "0 4px 24px rgba(0,229,160,0.3)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {status === "running" ? "Wird erstellt…" : "Plan generieren →"}
            </button>
          </div>
        </div>

        {status !== "idle" && (
          <div style={{
            background: S.card, border: `1px solid ${S.border}`,
            borderRadius: 22, padding: "26px 30px", marginBottom: 28,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9,
              color: S.muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 22,
            }}>
              Agenten-Pipeline
            </div>
            {agents.map((a, i) => (
              <AgentDot key={i} label={a.label} detail={a.detail} status={agentStatus} />
            ))}
          </div>
        )}

        {error && (
          <div style={{
            background: "#150808", border: "1px solid #FF6B6B44",
            borderRadius: 14, padding: "18px 22px", marginBottom: 28,
          }}>
            <div style={{ color: "#FF6B6B", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
              ⚠ Fehler
            </div>
            <div style={{ color: "#FF9A9A", fontSize: 13, lineHeight: 1.6 }}>{error}</div>
            <div style={{ color: S.muted, fontSize: 12, marginTop: 10 }}>
              Bitte erneut versuchen oder die Beschreibung anpassen.
            </div>
          </div>
        )}

        {status === "done" && result && (
          <div ref={resultsRef}>
            <div style={{
              background: S.card, border: `1px solid ${S.border}`,
              borderRadius: 22, padding: "26px 30px", marginBottom: 24,
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: S.muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 18,
              }}>
                Klinische Aufnahmezusammenfassung
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 18 }}>
                {[
                  { label: "Körperzone", value: result.intake.bodyZone },
                  { label: "Beschwerdetyp", value: result.intake.issueType },
                ].map((item) => (
                  <div key={item.label} style={{ background: "#060C08", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 9,
                      color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6,
                    }}>{item.label}</div>
                    <div style={{ color: S.text, fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
                <div style={{ background: "#060C08", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9,
                    color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
                  }}>Schweregrad</div>
                  <SeverityBadge value={result.intake.severity} />
                </div>
              </div>
              {result.intake.precautions?.length > 0 && (
                <div style={{
                  background: "#100900", border: "1px solid #3D280044",
                  borderRadius: 12, padding: "12px 16px", marginBottom: 14,
                }}>
                  <span style={{
                    color: "#FFB830", fontSize: 10,
                    fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: 1,
                  }}>⚠ VORSICHT — </span>
                  <span style={{ color: "#C49A4A", fontSize: 13 }}>
                    {result.intake.precautions.join(" · ")}
                  </span>
                </div>
              )}
              <p style={{ color: S.muted, fontSize: 14, fontStyle: "italic", lineHeight: 1.7 }}>
                {result.intake.summary}
              </p>
            </div>

            <div style={{
              background: "#07150E",
              border: `1px solid ${S.border}`,
              borderLeft: `4px solid ${S.accent}`,
              borderRadius: "0 18px 18px 0",
              padding: "22px 26px", marginBottom: 32,
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: S.accent, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 12,
              }}>
                Für den Patienten
              </div>
              <p style={{ color: S.text, fontSize: 15, lineHeight: 1.8 }}>{result.intro}</p>
            </div>

            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9,
              color: S.muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 18,
            }}>
              Heimübungsprogramm · {result.exercises?.length} Übungen
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {result.exercises?.map((ex, i) => (
                <ExerciseCard key={i} ex={ex} index={i} visible={cardsVisible} />
              ))}
            </div>

            <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => downloadPDF(result)}
                style={{
                  background: "transparent", color: S.accent,
                  border: `2px solid ${S.accent}`, borderRadius: 12,
                  padding: "14px 36px", fontFamily: "'DM Mono', monospace",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  letterSpacing: 1, textTransform: "uppercase",
                  boxShadow: "0 0 20px rgba(0,229,160,0.15)",
                }}
              >
                📄 Als PDF herunterladen
              </button>
            </div>

            <div style={{
              marginTop: 24, textAlign: "center",
              color: "#2A4030", fontSize: 12,
              fontFamily: "'DM Mono', monospace", lineHeight: 1.9,
              borderTop: `1px solid ${S.border}`, paddingTop: 28,
            }}>
              Dieses Programm wurde KI-generiert und dient als Ergänzung zur professionellen Physiotherapie.<br />
              Bitte stets mit dem behandelnden Physiotherapeuten abstimmen, bevor es verschrieben wird.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
