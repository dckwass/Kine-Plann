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
      {/* Header row */}
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

      {/* Target */}
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2,
        color: S.muted, textTransform: "uppercase", marginBottom: 5,
      }}>Ziel</div>
      <div style={{ color: "#8FC49A", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{ex.target}</div>

      {/* Description */}
      <div style={{ color: S.text, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{ex.description}</div>

      {/* Tip */}
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

export default function HomePage() {
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState("idle"); // idle | running | done | error
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

      {/* ── Header ── */}
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

        {/* ── Input card ── */}
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
              Alter, Beschwerdedauer, Schmerzlokalisation und Einschränkungen angeben. <span style={{ color: S.border }}>·</span> <span style={{ color: "#2A3D2F" }}>⌘↵ zum Senden</span>
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

        {/* ── Pipeline status ── */}
        {status !== "idle" && (
          <div style={{
            background: S.card, border: `1px solid ${S.border}`,
            borderRadius: 22, padding: "26px 30px", marginBottom: 28,
            animation: "fadeUp 0.4s ease forwards",
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

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#150808", border: "1px solid #FF6B6B44",
            borderRadius: 14, padding: "18px 22px", marginBottom: 28,
            animation: "fadeUp 0.4s ease forwards",
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

        {/* ── Results ── */}
        {status === "done" && result && (
          <div ref={resultsRef}>

            {/* Intake summary */}
            <div style={{
              background: S.card, border: `1px solid ${S.border}`,
              borderRadius: 22, padding: "26px 30px", marginBottom: 24,
              animation: "fadeUp 0.4s ease forwards",
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

            {/* Patient intro */}
            <div style={{
              background: "#07150E",
              border: `1px solid ${S.border}`,
              borderLeft: `4px solid ${S.accent}`,
              borderRadius: "0 18px 18px 0",
              padding: "22px 26px", marginBottom: 32,
              animation: "fadeUp 0.5s ease 0.1s forwards", opacity: 0,
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: S.accent, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 12,
              }}>
                Für den Patienten
              </div>
              <p style={{ color: S.text, fontSize: 15, lineHeight: 1.8 }}>{result.intro}</p>
            </div>

            {/* Exercise count header */}
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9,
              color: S.muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 18,
            }}>
              Heimübungsprogramm · {result.exercises?.length} Übungen
            </div>

            {/* Exercise cards */}
            <div style={{ display: "grid", gap: 16 }}>
              {result.exercises?.map((ex, i) => (
                <ExerciseCard key={i} ex={ex} index={i} visible={cardsVisible} />
              ))}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 40, textAlign: "center",
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
