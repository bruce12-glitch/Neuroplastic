# Neuroplastic — Epistemic Monograph Studio & Cognitive Depth Reader

**Live website:** [https://bruce12-glitch.github.io/Neuroplastic/](https://bruce12-glitch.github.io/Neuroplastic/)

**Neuroplastic** is an interactive digital garden, monograph publishing studio, and dialectical discourse platform built for cross-disciplinary inquiry across **World View**, **Psychology**, **Philosophy**, **AI Research**, **Psychoanalysis**, and **Finance**.

---

## Core Architecture & Features

### 1. Six Intellectual Domains
Every monograph in Neuroplastic is indexed under one of six fields of inquiry, paired with a signature domain palette and illustrated guide:
- **World View ($\Omega$)** — Geopolitics, macro-history, and polycrisis cartography (*Aristotle*).
- **Psychology ($\Psi$)** — Cognitive dynamics, behavioral attractors, and neuroplasticity (*Plato*).
- **Philosophy ($\Phi$)** — Epistemology, continental ontology, and modal logic (*Socrates*).
- **AI Research ($\Lambda$)** — Sub-quadratic attention, mechanistic interpretability, and entropy-guided inference (*Claude Shannon*).
- **Psychoanalysis ($\Delta$)** — Lacanian topology, the algorithmic unconscious, and desire graphs (*Sigmund Freud*).
- **Finance (↗)** — Money habits, compounding, and risk literacy (*Charlie Munger*, illustrated from the supplied portrait reference).

The **Money Garden** introduces the Finance section with a six-minute article, *Give Your Money Time: A Beginner’s Guide to Compounding*. It includes three reading depths, five linked educational sources from the CFPB and SEC’s Investor.gov, a simple-versus-compound growth experiment, and a knowledge check. Examples are hypothetical and use currency-neutral units. The article is general education, not a personal investment recommendation.

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

### 5. Illustrated Thinkers & Living Atlas
- **Illustrated Portraits (`<NotionMascot />`)** — Eight original portraits, including Charlie Munger as the Finance guide, shared across the garden and reader.
- **Classical Symposium & Dialectical Salon (`<SynapseGraph2D />`)** — Interactive 2D conceptual map connecting monographs across disciplines.
- **Living Atlas (`<LivingAtlas />`)** — An animated sketchbook connects six subject guides. Select a portrait to change the reading invitation, then explore the subject. Includes pause/resume, reduced-motion support, and off-screen suspension.

### 6. Dual-Layer Database Persistence (Cloud Firestore + Server Store)
All newly created monographs, customized blogs, and dialectical comments are automatically persisted across sessions:
- **Cloud Firestore (`src/firebase.ts`)** — Real-time synchronization with Firestore collections (`blogs`, `comments`, and `vault`) governed by zero-trust ABAC security rules (`firestore.rules`).
- **Express Server Persistence (`server.ts` & `db_store.json`)** — Automatic REST synchronization via `/api/db/blogs` and `/api/db/comments` with local fallback storage.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Illustration & Motion**: Native SVG and CSS (`<LivingAtlas />`)
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
node --import tsx --test src/utils/rules.test.ts firestore.rules.test.ts
npm run lint
npm run build
```

## GitHub Pages deployment

The `Deploy to GitHub Pages` Actions workflow installs the locked dependencies, checks TypeScript, runs the rules tests, and publishes `dist/` on pushes to `main`. It can also be started from the Actions tab. Pages uses the GitHub Actions publishing source.

To reproduce the project-path build locally:

```bash
npm ci
GITHUB_PAGES=true npm run build
```

This publishes the frontend. GitHub Pages does not run `server.ts` or its `/api/` endpoints. Server-backed features need a separately hosted API, and Firebase sign-in needs the Pages hostname allowed in Firebase Authentication. Keep server credentials out of the static build.

Finance publishing uses the `finance` pillar and `compound` sandbox values in `firestore.rules`. When using Cloud Firestore writes, deploy this updated rules file to the existing Firebase project through its normal rules deployment process. GitHub Pages deployment does not publish Firebase rules.
