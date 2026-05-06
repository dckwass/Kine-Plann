# 🏥 Kiné Behandlungsplaner

KI-gestützter Heimübungsplaner für Physiotherapie-Patienten.

---

## 🚀 Deployment auf Vercel (5 Minuten)

### Schritt 1 — GitHub-Konto erstellen
1. Gehe zu [github.com](https://github.com) und erstelle ein kostenloses Konto (falls noch nicht vorhanden).

### Schritt 2 — Diesen Code hochladen
1. Klicke auf GitHub oben rechts auf **"+"** → **"New repository"**
2. Name: `kine-planner`, dann **"Create repository"**
3. Klicke auf **"uploading an existing file"**
4. Lade den gesamten Ordnerinhalt hoch (alle Dateien aus diesem Zip)
5. Klicke auf **"Commit changes"**

### Schritt 3 — Vercel-Konto erstellen
1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf **"Sign up"** → **"Continue with GitHub"**
3. GitHub-Konto verbinden

### Schritt 4 — Projekt deployen
1. Klicke auf **"Add New Project"**
2. Wähle das Repository `kine-planner` aus
3. Klicke auf **"Deploy"** (Vercel erkennt Next.js automatisch)

### Schritt 5 — API-Key hinzufügen ⚠️ WICHTIG
1. Nach dem ersten Deploy: Gehe zu **Settings** → **Environment Variables**
2. Füge folgende Variable hinzu:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** dein Anthropic API-Key (beginnt mit `sk-ant-...`)
3. Klicke auf **"Save"**
4. Gehe zu **Deployments** → klicke auf die drei Punkte → **"Redeploy"**

### ✅ Fertig!
Die App ist jetzt unter einer URL wie `kine-planner.vercel.app` erreichbar.
Diese URL kann die Physiotherapeutin einfach bookmarken und von überall nutzen.

---

## 🔑 Anthropic API-Key besorgen
1. Gehe zu [console.anthropic.com](https://console.anthropic.com)
2. Erstelle ein Konto und gehe zu **"API Keys"**
3. Klicke auf **"Create Key"** und kopiere den Key
4. ⚠️ Den Key nur in Vercel eintragen, niemals teilen!

---

## 💰 Kosten
- **Vercel:** Kostenlos für persönliche Nutzung
- **Anthropic API:** ca. $0.01–0.03 pro generierten Behandlungsplan
