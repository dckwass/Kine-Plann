import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Du bist ein erfahrener Physiotherapeut und medizinischer Kommunikationsspezialist.

Analysiere die Patientenbeschreibung und erstelle einen vollständigen Heimübungsplan auf Deutsch.

Antworte AUSSCHLIESSLICH mit einem einzigen gültigen JSON-Objekt. Kein Text davor oder danach, keine Markdown-Backticks, kein Kommentar.

Format:
{
  "intake": {
    "bodyZone": "Betroffene Körperzone",
    "issueType": "Art der Beschwerde",
    "severity": "leicht",
    "precautions": ["Vorsichtsmaßnahme 1"],
    "summary": "Klinische Zusammenfassung in einem Satz"
  },
  "intro": "Patientenfreundlicher Einleitungstext in 3-5 Sätzen. Erkläre den Sinn des Programms, setze realistische Erwartungen und erwähne wann der Patient aufhören oder den Physiotherapeuten kontaktieren sollte.",
  "exercises": [
    {
      "name": "Übungsname",
      "target": "Zielstruktur oder -ziel",
      "description": "Klare Schritt-für-Schritt-Anleitung in 2-4 Sätzen.",
      "sets": 3,
      "reps": "10-15",
      "frequency": "2x täglich",
      "tip": "Wichtiger Coaching-Hinweis oder häufiger Fehler",
      "emoji": "🏋️"
    }
  ]
}

Regeln:
- severity muss genau "leicht", "mittel" oder "schwer" sein
- exercises: 5 bis 8 Übungen
- Alle Texte auf Deutsch
- Nur valides JSON, absolut nichts anderes`;

export async function POST(request) {
  try {
    const { problem } = await request.json();

    if (!problem || problem.trim().length < 10) {
      return Response.json(
        { error: "Bitte eine ausreichende Patientenbeschreibung eingeben." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: problem }],
    });

    const raw = message.content.map((b) => b.text || "").join("").trim();
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch (e) {
      return Response.json(
        { error: "Ungültige Antwort vom KI-Modell. Bitte erneut versuchen." },
        { status: 500 }
      );
    }

    return Response.json(plan);
  } catch (err) {
    console.error("API error:", err);
    return Response.json(
      { error: "Serverfehler: " + (err.message || "Unbekannter Fehler") },
      { status: 500 }
    );
  }
}
