# Nureoplastic — Epistemic Monograph Studio & Cognitive Depth Reader

**Nureoplastic** is an interactive digital garden, monograph publishing studio, and dialectical discourse platform built for cross-disciplinary inquiry across **World View**, **Psychology**, **Philosophy**, **AI Research**, and **Psychoanalysis**.

---

## Core Architecture & Features

### 1. Five Intellectual Domains
Every monograph in Nureoplastic is indexed under one of five foundational fields of inquiry, paired with a signature domain palette and classical thinker archetype:
- **World View ($\Omega$)** — Geopolitics, macro-history, and polycrisis cartography (*Plato*).
- **Psychology ($\Psi$)** — Cognitive dynamics, behavioral attractors, and neuroplasticity (*Socrates*).
- **Philosophy ($\Phi$)** — Epistemology, continental ontology, and modal logic (*Aristotle*).
- **AI Research ($\Lambda$)** — Sub-quadratic attention, mechanistic interpretability, and entropy-guided inference (*Claude Shannon*).
- **Psychoanalysis ($\Delta$)** — Lacanian topology, the algorithmic unconscious, and desire graphs (*Sigmund Freud*).

### 2. Three-Level Cognitive Depth Reader (`<CognitiveReader />`)
Rather than static long-form pages, every monograph can be read across three calibrated epistemic depths:
- **Level 1 · Intuition (`L1`)** — High-clarity synthesis and core conceptual takeaways.
- **Level 2 · Dialectical Synthesis (`L2`)** — Full argument structure, historical lineage, and cross-domain bridges.
- **Level 3 · Formal & Axiomatic (`L3`)** — Mathematical formulations, symbolic logic, and structural proofs.
- **Editorial Readability Comfort Bar** — Customize typography family (*Instrument Serif*, *Inter*, *JetBrains Mono*), font scale (`SM`, `MD`, `LG`, `XL`), line spacing, reading paper surface (*Warm Cream*, *Aged Parchment*, *Crisp Ivory*), and distraction-free **Focus Mode**.

### 3. Blog Publishing & Customization Studio (`<BlogCreatorModal />`)
Create, edit, and customize any monograph directly in the browser:
- Choose the intellectual domain, custom card accent color, reading time, and thinker archetype.
- Author all three cognitive depth tiers (`L1`, `L2`, `L3`) or write a unified essay that automatically structures across tiers.
- Attach formal axioms/LaTeX-style formulas, custom reading callouts, and interactive synaptic bridges to related monographs.

### 4. Dialectical Discourse Engine (`<DialecticalComments />`)
Interactive peer annotation and commentary on every monograph:
- Categorize contributions by dialectical stance: **Synthesis**, **Counter-Thesis**, **Axiom Extension**, or **Field Note**.
- Anchor comments to a specific reading depth (`L1`, `L2`, or `L3`), endorse insights, and post threaded replies.

### 5. Classical Thinker Medallions & Philosophical Orrery
- **Classical Thinker Portrait Medallions (`<NotionMascot />`)** — Hand-crafted SVG portrait medallions inspired by Socrates, Plato, Aristotle, Freud, and Shannon.
- **Classical Symposium & Dialectical Salon (`<SynapseGraph2D />`)** — Interactive 2D conceptual map connecting monographs across disciplines.
- **3D Brass Armillary Orrery (`<ThreeSynapseScene />`)** — Interactive Three.js philosophical orrery visualizing cross-domain conceptual orbits.

### 6. Dual-Layer Database Persistence (Cloud Firestore + Server Store)
All newly created monographs, customized blogs, and dialectical comments are automatically persisted across sessions:
- **Cloud Firestore (`src/firebase.ts`)** — Real-time synchronization with Firestore collections (`blogs`, `comments`, and `vault`) governed by zero-trust ABAC security rules (`firestore.rules`).
- **Express Server Persistence (`server.ts` & `db_store.json`)** — Automatic REST synchronization via `/api/db/blogs` and `/api/db/comments` with local fallback storage.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **3D Visualization**: Three.js (`<ThreeSynapseScene />`)
- **Backend & API**: Node.js, Express (`server.ts`), `@google/genai` for server-side epistemic synthesis & Google Search grounding
- **Database & Security**: Firebase Cloud Firestore (`firebase`), `@firebase/eslint-plugin-security-rules`

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your Gemini API key if using the live Epistemic Synthesis assistant:
```bash
cp .env.example .env
```

### 3. Run Development Server
Starts the full-stack Express + Vite server on `http://localhost:3000`:
```bash
npm run dev
```

### 4. Verify Security Rules & Build
```bash
npx eslint firestore.rules
npx tsx --test firestore.rules.test.ts
npm run build
```
