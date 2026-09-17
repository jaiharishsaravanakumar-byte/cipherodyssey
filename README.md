# 🔐 CipherOdyssey

> **A hands-on, gamified classical cryptography laboratory.**  
> Learn how historical ciphers work, experiment with interactive visualizers, crack intercepted transmissions, and track your cryptanalysis skills on a visual progression tree.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.0-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Tests-35%20Passing-brightgreen?style=flat)](https://nodejs.org/api/test.html)

---

## What is CipherOdyssey?

Most cryptography resources either drown you in dry math formulas or stick to the same basic Caesar cipher tutorial. **CipherOdyssey** takes a different approach: it treats classical cryptography like an analog research laboratory.

Instead of clichéd neon-green terminal matrix aesthetics, CipherOdyssey is styled with deep slate surfaces, warm oscilloscope amber accents, and clean monospace readouts. Everything is visual, interactive, and immediate:

- **Touch and tweak the machinery:** Drag cipher wheels, invert Atbash mirrors, align Vigenère tableaus, zigzag letters across rail fences, and construct Playfair matrices in real time.
- **Learn step-by-step:** Each cipher includes its historical origin, cryptographic weaknesses, and step-by-step encryption/decryption walkthroughs.
- **Single-page vertical flow:** Seamlessly jump between the hero briefing, the cipher deck, the interactive laboratory, live challenges, and your career telemetry without jarring page reloads.
- **Crack live transmissions:** Test your skills in the Challenge Arena with randomized difficulty tiers, progressive hint disclosure, and score multipliers.
- **Follow a skill tree (DAG):** Unlock more advanced polyalphabetic and transposition ciphers as you master fundamental substitution techniques.

---

## The 10 Ciphers in the Lab

CipherOdyssey covers 10 iconic historical ciphers across four major families:

| # | Cipher | Family | How It Works | Dedicated Interactive Visualizer |
|:---|:---|:---|:---|:---|
| **1** | **Caesar** | Monoalphabetic Substitution | Shifts alphabet by a fixed key (mod 26). Used by Julius Caesar in 58 BC. | Draggable dual-alphabet slider with live letter mapping |
| **2** | **Atbash** | Monoalphabetic Substitution | Inverts the alphabet symmetrically ($A \leftrightarrow Z$, $B \leftrightarrow Y$). Biblical origin. | Symmetric dual-row mirror with reflection connectors |
| **3** | **Reverse** | Transposition | Simple character sequence reversal. | Character-by-character animation flipping text in reverse |
| **4** | **ROT13** | Monoalphabetic Substitution | Caesar cipher with a fixed shift of 13. Self-inverting reciprocal cipher. | Continuous 26-letter rotation slider with 13-offset pairing |
| **5** | **Affine** | Monoalphabetic Substitution | Mathematical formula $E(x) = (ax + b) \pmod{26}$. Requires coprime slope $a$. | Dual modular sliders for slope $a$ and intercept $b$ |
| **6** | **Vigenère** | Polyalphabetic Substitution | Uses a repeating keyword to shift letters along a 26×26 Tabula Recta. | Key alignment visualizer matching keyword characters to plaintext |
| **7** | **Columnar Transposition** | Transposition | Writes text into rows and reads columns out in alphabetical key order. | Dynamic grid showing row filling and column extraction |
| **8** | **Rail Fence** | Transposition | Writes letters along a zigzag wave across $N$ rails, then reads row by row. | Multi-rail zigzag wave showing letter trajectory |
| **9** | **Playfair** | Digraph Substitution | Encrypts letter pairs using a 5×5 keyword matrix ($I/J$ merged). | 5×5 interactive keyed Polybius matrix highlighting pair rules |
| **10** | **Bacon** | Steganographic Substitution | Encodes letters into 5-bit binary tokens composed of 'A' and 'B' symbols. | 5-bit binary card visualizer toggling between plain and stego modes |

---

## Application Structure (Single-Page Layout)

CipherOdyssey is built as a single-page scrolling application. Everything is organized into five sequential sections:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Sticky Navbar: [CO] CipherOdyssey   Home · Ciphers · Lab · Challenge · Progress  │
├────────────────────────────────────────────────────────────────────────┤
│  #hero        • Animated particle canvas & typewriter hero headline    │
│               • Quick-jump action buttons                              │
├────────────────────────────────────────────────────────────────────────┤
│  #ciphers     • The Cipher Deck: 10 interactive cipher cards           │
│               • Toggleable SVG Directed Acyclic Graph (DAG) skill tree │
├────────────────────────────────────────────────────────────────────────┤
│  #lab         • The Laboratory Workbench                               │
│               • Quick-selector pill bar across all 10 ciphers          │
│               • Active interactive demo + Theory + Walkthroughs        │
│               • TryItYourself live scratchpad with instant mastery     │
├────────────────────────────────────────────────────────────────────────┤
│  #challenge   • Intercepted Transmissions Arena                        │
│               • Difficulty selector (Easy / Medium / Hard)             │
│               • Heart meter (5 lives), hint drawer (-20 pts), popups   │
├────────────────────────────────────────────────────────────────────────┤
│  #progress    • Agent Telemetry Dashboard                              │
│               • Solves count, accuracy rate, best streak, masteries    │
│               • Achievement badge shelf with celebrate burst modal     │
├────────────────────────────────────────────────────────────────────────┤
│  Footer       • System status, quick section jumps, Back-to-Top (↑)    │
└────────────────────────────────────────────────────────────────────────┘
```

- **Smooth Navigation:** Clicking any navbar tab, CTA button, or cipher card smoothly scrolls straight to the relevant section with fixed navbar offset compensation.
- **Scrollspy:** As you scroll down the page, a sliding amber indicator in the navbar automatically tracks your current position using Framer Motion spring physics.
- **Workbench Quick-Selector:** Inside `#lab`, switch between ciphers in a single click using the horizontal pill bar, complete with unlock and mastery indicators.

---

## Quick Start Guide

### Prerequisites
- **Node.js**: v20 or v24 (LTS recommended)
- **MongoDB**: v7 or v8 running locally on port `27017`
- **npm**: v10+

### Option A: Standard 3-Terminal Setup (Recommended)

Open three terminal tabs in `/home/sjh/cipher`:

#### 1. Start MongoDB
```bash
# Ensure storage directory exists
mkdir -p data/db

# Start MongoDB
mongod --dbpath ./data/db --bind_ip 127.0.0.1 --port 27017
```

#### 2. Seed & Start the Backend API
```bash
cd server

# Seed the 10 canonical ciphers (first run or reset)
npm run seed

# Start the Express API server on http://localhost:5000
npm start
```
*Tip: Verify the backend is up by running `curl http://localhost:5000/api/health`.*

#### 3. Start the Frontend Dev Server
```bash
cd /home/sjh/cipher

# Start Vite dev server on http://localhost:5173
npm run dev
```

Open your browser at **`http://localhost:5173`** and start decoding!

---

### Option B: Single-Terminal Startup (Background Mode)

Run all three services from a single shell:

```bash
# 1. Start MongoDB in background
mkdir -p data/db
mongod --dbpath ./data/db --bind_ip 127.0.0.1 --port 27017 --logpath ./data/mongod.log --fork

# 2. Seed database & start API in background
cd server && npm run seed && node server.js &

# 3. Start Frontend (foreground)
cd .. && npm run dev
```

To stop all services later:
```bash
pkill -f "vite"
pkill -f "node server.js"
mongod --dbpath ./data/db --shutdown
```

---

## Project Architecture & Directory Tour

```text
cipher/
├── package.json               ← Client dependencies, scripts & build config
├── vite.config.js             ← Vite 6 configuration (with data/server watch ignore)
├── index.html                 ← Application HTML entry point
├── DOCUMENTATION.md           ← Complete technical manual & in-depth architectural guide
├── FILE_CALLS.md              ← Detailed file-to-file calling maps & sequence diagrams
│
├── shared/                    ← CANONICAL SHARED LAYER
│   ├── cipherEngine.js        ← 10 cipher algorithms (single source of truth for client & server)
│   └── wordBank.js            ← 162-phrase tactical word bank categorized by difficulty
│
├── src/                       ← FRONTEND (React 19 + Tailwind v4 + Zustand)
│   ├── main.jsx               ← React root mount point (renders <App /> directly)
│   ├── App.jsx                ← Root container: 5 vertical sections + scrollspy + footer
│   │
│   ├── pages/                 ← Section Views
│   │   ├── Home.jsx           ← Hero landing section (#hero)
│   │   ├── Learn.jsx          ← Cipher library & DAG map section (#ciphers)
│   │   ├── CipherDetails.jsx  ← Interactive laboratory workbench (#lab)
│   │   ├── Challenge.jsx      ← Challenge arena console (#challenge)
│   │   └── Progress.jsx       ← Telemetry stats & achievement shelf (#progress)
│   │
│   ├── components/            ← Reusable UI & Visualizers
│   │   ├── Navbar.jsx         ← Fixed top bar with smooth scroll & Framer Motion pill
│   │   ├── AnimatedBackground.jsx ← Drifting canvas grid with floating cipher glyphs
│   │   ├── TypingHeadline.jsx ← Typewriter hero headline effect
│   │   ├── CipherCard.jsx     ← Visual cards with per-cipher micro-animations
│   │   ├── CipherLearningMap.jsx ← Interactive SVG Directed Acyclic Graph (DAG)
│   │   ├── CipherAlphabet.jsx ← Dual-alphabet shift slider with live transforms
│   │   ├── LetterMap.jsx      ← Animated single-letter substitution widget
│   │   ├── TryItYourself.jsx  ← Practice scratchpad with instant mastery validation
│   │   ├── ChallengeCard.jsx  ← Transmission terminal with animated heart meters
│   │   ├── HintBox.jsx        ← Progressive disclosure hint accordion
│   │   ├── ScorePopup.jsx     ← Floating point notifications queue
│   │   ├── ProgressBar.jsx    ← Mastery percentage bars with loading skeletons
│   │   ├── Achievement.jsx    ← Celebration particle burst modal & badge cards
│   │   │
│   │   ├── demos/             ← Dedicated Interactive Visualizers (one per cipher)
│   │   │   ├── AffineControls.jsx
│   │   │   ├── AtbashMirror.jsx
│   │   │   ├── BaconBinaryReveal.jsx
│   │   │   ├── ColumnarGrid.jsx
│   │   │   ├── PlayfairGrid.jsx
│   │   │   ├── RailFenceZigzag.jsx
│   │   │   ├── ReverseDemo.jsx
│   │   │   └── VigenereKeyInput.jsx
│   │   │
│   │   └── sections/          ← Modular Lesson Subsections
│   │       ├── ConceptSection.jsx
│   │       ├── EncryptionSection.jsx
│   │       └── DecryptionSection.jsx
│   │
│   ├── store/                 ← Zustand Stores
│   │   ├── useAppStore.js     ← Persistent progress & mastery (localStorage)
│   │   └── useGameStore.js    ← Active gameplay loop & optimistic scoring (in-memory)
│   │
│   ├── api/                   ← HTTP Client Wrappers (fetch to localhost:5000/api)
│   │   ├── client.js          ← Base request helper + anonymous agent ID
│   │   ├── ciphers.js         ← Cipher catalog API calls
│   │   ├── challenges.js      ← Challenge generator & submission calls
│   │   └── scores.js          ← Score summary & achievements calls
│   │
│   ├── utils/                 ← Helpers
│   │   ├── cipherHelpers.js   ← Re-exports shared/cipherEngine.js
│   │   ├── wordBank.js        ← Re-exports shared/wordBank.js
│   │   ├── scoring.js         ← Client-side score estimation
│   │   ├── challengeGenerator.js ← Offline fallback challenge generator
│   │   ├── achievements.js    ← Achievement rules evaluation
│   │   └── animationVariants.js ← Framer Motion transitions & spring configs
│   │
│   └── styles/
│       └── tokens.css         ← Theme variables (Void, Panel, Signal Amber, Cyan, Red)
│
├── server/                    ← BACKEND (Express 4 + Mongoose 8)
│   ├── server.js              ← Express bootstrap, MongoDB connection, CORS setup
│   ├── routes/api.js          ← API route definitions
│   ├── controllers/           ← Business logic (ciphers, challenges, scores, achievements)
│   ├── models/                ← Mongoose schemas (Cipher, Challenge, Score)
│   ├── scripts/seedCiphers.js ← Database seed script
│   └── utils/                 ← Server cipher engine & scoring helpers
│
└── test/                      ← CLIENT TEST SUITE (Node.js native test runner)
    ├── ciphers.test.js        ← 10 round-trip tests for all ciphers
    ├── gameplay.test.js       ← 4 gameplay & scoring tests
    ├── achievements.test.js   ← 2 achievement evaluation tests
    └── lessons.test.js        ← 3 lesson curricula & mastery tests
```

---

## How It Works Under the Hood

### 1. Zero Logic Drift (`shared/cipherEngine.js`)
Both the client UI (for live practice in `TryItYourself.jsx` and interactive sliders) and the backend (for grading submitted answers) import from the **exact same canonical module**: `shared/cipherEngine.js`. There is never any discrepancy between how the frontend encodes/decodes text and how the backend verifies answers.

### 2. Optimistic UI with Silent Server Reconciliation
When you solve a challenge in `#challenge`:
1. The UI immediately projects your points (+100 base, +25 fast time bonus, +25 no-hint bonus), plays the point toast animation, and increments your streak. You never wait on network latency.
2. In the background, `POST /api/challenges/:id/submit` verifies the answer with MongoDB.
3. If confirmed, the score is saved to the database. If there was a minor time-drift difference, the store silently syncs. If an answer was incorrect, the store reverses the score, decrements a heart, and triggers a card shake animation.

### 3. Smart State Split
- **`useGameStore` (Session State — Memory Only):** Tracks the active challenge, running timer, hearts remaining, and toast queue. Wiped cleanly when the session resets.
- **`useAppStore` (Lifetime State — `localStorage`):** Tracks your unlocked ciphers, mastered ciphers, cumulative solves, and achievement badges. It automatically restores on page reload.
- **Fresh Intro on Reload:** While progress is preserved, the intro typewriter animation state is kept in-memory so you always enjoy a crisp intro when refreshing the page.

---

## REST API Reference

The backend Express server listens at `http://localhost:5000/api`:

| Method | Endpoint | Description | Query / Body | Sample Response |
|:---|:---|:---|:---|:---|
| `GET` | `/health` | Service health check | None | `{"status": "ok", "timestamp": "..."}` |
| `GET` | `/ciphers` | All 10 cipher records | None | `{"success": true, "data": [...]}` |
| `GET` | `/ciphers/:slug` | Specific cipher by slug | None | `{"success": true, "data": {...}}` |
| `GET` | `/challenges/random` | Random challenge *(sanitized, no plaintext)* | `?difficulty=easy\|medium\|hard` | `{"success": true, "challenge": {...}}` |
| `POST` | `/challenges/:id/submit` | Submit answer for grading | Body: `{ answer, hintsUsed, timeTakenSec }` | `{"success": true, "correct": true, "pointsAwarded": 150}` |
| `GET` | `/scores/summary` | User score & mastery telemetry | `?userId=cq_agent_...` | `{"success": true, "summary": {...}}` |
| `GET` | `/achievements` | Evaluates badge unlock status | `?userId=cq_agent_...` | `{"success": true, "achievements": [...]}` |

---

## Testing & Verification

CipherOdyssey uses Node.js's built-in test runner (`node:test`) — fast, dependency-free, and clean.

```bash
# Run all frontend tests (19 tests)
npm test

# Run backend engine & API tests (16 tests)
cd server && npm test

# Run all 35 tests in sequence
npm test && cd server && npm test
```

### What is tested?
- ✅ Round-trip encoding and decoding for all 10 ciphers.
- ✅ Prerequisite DAG unlocking logic and cipher mastery threshold validation.
- ✅ Scoring edge cases (speed bonuses, hint penalties, wrong answer deductions).
- ✅ Challenge generation difficulty constraints (short words on easy, phrase masking on hard).
- ✅ Single-trigger guards on achievement celebrations.
- ✅ API payload sanitization (verifying secret plaintext is never sent to the client).

---

## Production Build

To build the optimized static production bundle:

```bash
# Build the production bundle
npm run build

# Preview the production build locally
npm run preview
```

The compiled assets will be placed in the `/dist` directory, ready to be deployed to any modern static hosting service (Vercel, Netlify, Cloudflare Pages) with the backend hosted on Node/Docker.

---

## Built With

- **Frontend:** [React 19](https://react.dev/), [Vite 6](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion 12](https://motion.dev/), [Zustand 5](https://github.com/pmndrs/zustand), [Lucide React](https://lucide.dev/)
- **Backend:** [Node.js 24](https://nodejs.org/), [Express 4](https://expressjs.com/), [Mongoose 8](https://mongoosejs.com/), [MongoDB](https://www.mongodb.com/)
- **Fonts:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) & [Inter](https://fonts.google.com/specimen/Inter)

---

## Additional Documentation

For deeper architectural analysis, check out:
- **[DOCUMENTATION.md](file:///home/sjh/cipher/DOCUMENTATION.md)** — Comprehensive technical manual, flowcharts, database connection guides, and step-by-step setup details.
- **[FILE_CALLS.md](file:///home/sjh/cipher/FILE_CALLS.md)** — Exhaustive file-to-file calling maps, sequence diagrams, and caller/callee matrices across frontend, backend, and database.
