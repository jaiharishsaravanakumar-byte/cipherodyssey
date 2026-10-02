# CipherQuest — Antigravity Feature Expansion Prompt
## Cipher Pipeline + Cipher Strength Comparison

You are modifying an ALREADY BUILT project called **CipherQuest / CipherOdyssey**.

Do NOT rebuild the application from scratch.

First inspect the entire existing codebase and understand the current architecture, design system, cipher engine, scoring system, state management, API structure, animations, routing, and existing UI components.

The existing project is the source of truth.

Your implementation must feel like these features were part of the original application from day one.

---

# IMPORTANT EXISTING PROJECT RULES

Preserve the existing:

- React architecture
- Vite setup
- Tailwind CSS
- Framer Motion animations
- Zustand state management
- React Router
- Shared cipher engine
- Existing backend architecture
- Existing MongoDB models
- Existing scoring system
- Existing 10 cipher implementations
- Existing typography
- Existing color tokens
- Existing component patterns
- Existing responsive behavior
- Existing navigation
- Existing learning/challenge/progress flow

Do NOT replace existing implementations unless absolutely necessary.

Do NOT duplicate cipher algorithms.

Reuse the existing shared cipher engine wherever possible.

Before writing code, identify:

1. Where the existing 10 cipher algorithms are implemented.
2. How cipher metadata is stored.
3. How cipher configuration is represented.
4. How scoring currently works.
5. How Zustand stores application/game state.
6. How pages and sections are structured.
7. How Framer Motion is currently used.
8. How the backend validates and processes cipher operations.
9. Whether the new functionality should be client-side or server-side based on the existing architecture.
10. Existing reusable UI components that can be extended.

---

# DESIGN DIRECTION

The new features MUST match the existing CipherQuest visual identity.

Do NOT create a generic SaaS dashboard.

Do NOT use a generic neon hacker aesthetic.

Do NOT introduce unrelated colors.

Continue the existing:

- dark cryptography laboratory aesthetic
- analog cryptography / intelligence-lab feeling
- monospace cipher typography
- clean technical UI
- amber signal color
- cyan signal color
- red warning/error color
- dark panels
- subtle borders
- technical labels
- restrained glow
- terminal/lab-inspired visual language

Existing design tokens should remain the source of truth.

Use the existing:

- `--bg-void`
- `--bg-panel`
- `--ink-primary`
- `--ink-dim`
- `--signal-amber`
- `--signal-cyan`
- `--signal-red`

Do not invent a new visual system.

---

# ANIMATION REQUIREMENT

Both features should feel interactive and "alive", but animation must remain consistent with the existing application.

Use Framer Motion and existing animation utilities/variants where possible.

Animations should communicate cryptographic processing rather than simply decorating the interface.

Examples:

- Cipher nodes activating sequentially
- Encoded text traveling from one cipher to another
- Characters transforming
- Connection lines illuminating
- Cipher cards expanding
- Processing indicators
- Result reveal
- Score bars filling
- Comparison rows entering progressively
- Ranking/order transitions
- Pipeline stages activating one by one

Keep animations subtle and technical.

Use approximately the same motion language already present in the project.

Respect:

`prefers-reduced-motion`

Do not create excessive bouncing, spinning, or flashy animations.

---

# FEATURE 1 — CIPHER PIPELINE

Create a new section/page called something like:

**Cipher Pipeline**

Purpose:

Allow the user to combine THREE different ciphers sequentially.

Concept:

Plaintext

↓

Cipher 1

↓

Cipher 2

↓

Cipher 3

↓

Final Ciphertext

The output of one cipher becomes the input of the next cipher.

---

## USER FLOW

The user should be able to:

### Step 1 — Select Cipher 1

Provide a cipher selector.

Example:

`[ Caesar ▼ ]`

### Step 2 — Select Cipher 2

Provide another selector.

Example:

`[ Vigenère ▼ ]`

### Step 3 — Select Cipher 3

Provide another selector.

Example:

`[ Rail Fence ▼ ]`

The user must select exactly three ciphers.

Prevent invalid configurations if the existing project has restrictions around cipher combinations.

If duplicate ciphers are not logically useful, prevent selecting the same cipher more than once.

If the existing architecture supports repeated ciphers, allow them.

Follow the existing project's conventions rather than inventing a new rule.

---

# INPUT

Provide a plaintext input field.

Example:

`ENTER MESSAGE`

User enters:

`HELLO`

Then the user clicks:

`RUN PIPELINE`

or an equivalent existing CTA style.

---

# PIPELINE PROCESSING

The system must execute the selected ciphers sequentially.

Example:

User chooses:

1. Caesar
2. Vigenère
3. Rail Fence

Input:

`HELLO`

Processing:

```text
HELLO
  ↓
Caesar
  ↓
KHOOR
  ↓
Vigenère
  ↓
RIJVS
  ↓
Rail Fence
  ↓
Final Ciphertext
```

The actual values must be generated using the EXISTING cipher engine.

Do not hardcode example outputs.

---

# VERY IMPORTANT — SHOW THE DATA FLOW

The major purpose of this feature is not just to show the final encoded message.

The UI must visually explain:

**how one cipher feeds its output into the next cipher.**

Create a visual pipeline such as:

```text
┌──────────────┐
│ PLAINTEXT    │
│ HELLO        │
└──────┬───────┘
       ↓
┌──────────────┐
│ CAESAR       │
│ +3           │
└──────┬───────┘
       ↓
┌──────────────┐
│ KHOOR        │
└──────┬───────┘
       ↓
┌──────────────┐
│ VIGENÈRE     │
│ KEY: CODE    │
└──────┬───────┘
       ↓
┌──────────────┐
│ XXXXX        │
└──────┬───────┘
       ↓
┌──────────────┐
│ RAIL FENCE   │
└──────┬───────┘
       ↓
┌──────────────┐
│ FINAL OUTPUT │
└──────────────┘
```

The exact design should match CipherQuest's existing visual language.

---

# STAGE TRANSITION ANIMATION

When the pipeline runs:

1. Show plaintext.
2. Activate Cipher 1.
3. Animate the transformed text.
4. Move/pass the resulting text toward Cipher 2.
5. Activate Cipher 2.
6. Transform the text.
7. Pass it toward Cipher 3.
8. Activate Cipher 3.
9. Reveal final ciphertext.

The user should visually understand:

`OUTPUT 1 → INPUT 2`

and:

`OUTPUT 2 → INPUT 3`

Use animated connectors/arrows to reinforce this.

---

# PIPELINE DETAILS

Each stage should display:

- Cipher name
- Difficulty
- Input
- Output
- Relevant key/parameter if required
- Short description of what happened

Example:

```text
STAGE 01
CAESAR

INPUT
HELLO

TRANSFORMATION
Shift +3

OUTPUT
KHOOR
```

Then:

```text
STAGE 02
VIGENÈRE

INPUT
KHOOR

KEY
CODE

OUTPUT
...
```

Then stage 3.

Do not expose internal implementation details unnecessarily.

Keep the explanation understandable for a student learning classical cryptography.

---

# FINAL OUTPUT

At the end, display a prominent:

`FINAL CIPHERTEXT`

with the final encoded message.

Provide an existing-style action for:

- Copy
- Run again
- Change pipeline
- Clear

Reuse existing UI components wherever available.

---

# PIPELINE VALIDATION

Handle:

- Empty plaintext
- Missing cipher selection
- Invalid cipher configuration
- Missing required cipher key/parameter
- Unsupported combinations
- Very long input
- Invalid characters if applicable to the selected cipher

Use the project's existing validation/error style.

Do not introduce browser alerts if the project already uses inline UI feedback.

---

# FEATURE 2 — CIPHER STRENGTH COMPARISON

Create another section/page called:

**Cipher Strength Comparison**

Purpose:

Allow the user to enter ONE word/message and compare how different ciphers transform it.

The user should be able to understand how the same plaintext behaves under different classical ciphers.

---

# INPUT

Provide:

```text
ENTER WORD / MESSAGE
[________________________]

[ COMPARE CIPHERS ]
```

The entered text is used as the common input for every cipher being compared.

---

# PIPELINE TOGGLE

At the beginning of the comparison section, provide an option:

```text
INCLUDE 3-CIPHER PIPELINE
[ ON / OFF ]
```

or an equivalent toggle matching the existing UI.

---

# WHEN PIPELINE IS OFF

Compare the user's input against all existing individual ciphers.

The project currently contains 10 ciphers.

Therefore calculate a comparison for:

1. Caesar
2. Atbash
3. Reverse
4. ROT13
5. Affine
6. Vigenère
7. Columnar Transposition
8. Rail Fence
9. Playfair
10. Bacon's Cipher

Use the existing cipher engine.

Do NOT create separate duplicate implementations.

---

# WHEN PIPELINE IS ON

The comparison should additionally include the user's configured three-cipher pipeline.

Example:

Existing:

10 individual ciphers

PLUS:

`CAESAR → VIGENÈRE → RAIL FENCE`

The comparison therefore contains the 10 individual cipher results plus the combined pipeline result.

Label the pipeline clearly:

```text
PIPELINE
Caesar → Vigenère → Rail Fence
```

Do not confuse the pipeline with one of the original 10 ciphers.

---

# IMPORTANT PIPELINE RELATIONSHIP

The pipeline used in Feature 2 should use the SAME pipeline configuration and logic created in Feature 1.

Do not implement pipeline processing twice.

Create a reusable pipeline utility/service/function.

Feature 1 uses it.

Feature 2 uses it.

This prevents logic duplication and ensures both features always produce identical results.

---

# "HACKABILITY" / "UNHACKABILITY" SCORE

The system should calculate a percentage for each cipher.

Example UI:

```text
CAESAR
████████░░  72%
UNHACKABILITY

Score: 72
```

However, this percentage MUST NOT be presented as a scientifically accurate probability of whether the cipher can actually be hacked.

Classical cipher strength depends on many factors including:

- cipher design
- key space
- plaintext length
- language characteristics
- key reuse
- implementation
- cryptanalysis method
- known/chosen plaintext
- attack model

Therefore implement this as a **CipherQuest educational heuristic / difficulty score**, not a real-world cryptographic security guarantee.

Use terminology such as:

**Estimated Unhackability**

or:

**Resistance Score**

with a small explanatory label such as:

`Educational heuristic — not a real cryptographic security probability.`

---

# SCORE CALCULATION

Before implementing the formula, inspect the existing project for:

- scoring utilities
- cipher metadata
- difficulty levels
- existing challenge scoring
- cipher configuration
- any existing numerical difficulty information

Reuse existing data where appropriate.

Do NOT arbitrarily invent a completely unrelated scoring system if the existing project already contains suitable cipher difficulty metadata.

The score should be deterministic for the same:

`cipher + input`

unless the existing system intentionally uses another mechanism.

---

# SCORE FACTORS

If a new comparison heuristic is required, create it as a clearly isolated utility.

Conceptually, the score can consider factors such as:

- cipher difficulty tier
- structural complexity
- key dependency
- transformation complexity
- ciphertext-to-plaintext relationship
- susceptibility to simple pattern analysis
- effective key variation
- transposition/substitution characteristics

BUT:

Do not claim that the resulting percentage represents actual cryptographic security.

The score is for educational comparison inside CipherQuest.

Document the formula in the code.

Example:

```text
Resistance Score: 0–100

0–30   Low resistance
31–60  Moderate resistance
61–80  High resistance
81–100 Very high resistance
```

Only use these ranges if they fit the existing design and terminology.

---

# SCORE FOR EACH CIPHER

Every comparison entry should display:

- Cipher name
- Difficulty
- Encoded result
- Resistance / Unhackability percentage
- Numeric score
- Short explanation

Example:

```text
┌──────────────────────────────────────┐
│ CAESAR                               │
│ Difficulty: Beginner                 │
│                                      │
│ Output: KHOOR                       │
│                                      │
│ Resistance                           │
│ ███████████░░░░░░░  54%              │
│                                      │
│ Score: 54 / 100                      │
└──────────────────────────────────────┘
```

---

# COMPARISON VISUALIZATION

The comparison should be highly visual.

Possible presentation:

```text
CIPHER STRENGTH

CAESAR
████████████░░░░░░ 54

ATBASH
██████████░░░░░░░░ 48

VIGENÈRE
████████████████░░ 82

PLAYFAIR
█████████████████░ 87

PIPELINE
██████████████████ 91
```

Do not use a generic chart library unless the project already uses one.

Prefer custom React/Tailwind components that match the existing CipherQuest interface.

Animate each score bar when the comparison results appear.

---

# COMPARISON RESULT ORDER

Do NOT automatically call one cipher "the best cipher."

The purpose is educational comparison.

You may sort results by score if useful, but make the ordering clearly descriptive:

`Resistance Score`

rather than:

`Best Cipher`

Avoid language such as:

- Best
- Worst
- Secure
- Completely unbreakable
- Guaranteed protection

Use:

- Resistance Score
- Estimated Difficulty
- Relative Resistance
- Educational Estimate

---

# COMPARISON DETAILS

Clicking/tapping a cipher comparison should optionally expand additional information:

```text
WHY THIS SCORE?

Cipher:
Vigenère

Input:
HELLO

Output:
...

Difficulty:
Intermediate

Resistance Score:
78 / 100

Factors:
• Uses a repeating key
• Multiple substitution alphabets
• More complex than monoalphabetic substitution

Educational note:
This score is a simplified comparison for learning
and does not represent real-world cryptographic security.
```

Reuse existing expandable/collapsible components if present.

---

# RESPONSIVE DESIGN

Both features must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Pipeline layout:

Desktop:

```text
INPUT → CIPHER 1 → CIPHER 2 → CIPHER 3 → OUTPUT
```

Mobile:

```text
INPUT
 ↓
CIPHER 1
 ↓
OUTPUT
 ↓
CIPHER 2
 ↓
OUTPUT
 ↓
CIPHER 3
 ↓
FINAL OUTPUT
```

The comparison cards should stack naturally on smaller screens.

Do not allow horizontal overflow.

---

# STATE MANAGEMENT

Inspect the existing Zustand stores.

Create state only where necessary.

Potential state:

```text
pipelineCiphers
pipelineInput
pipelineResult
pipelineStages
comparisonInput
includePipeline
comparisonResults
```

Do not create unnecessary global state if local component state is sufficient.

Persist only information that logically belongs in the existing application persistence model.

Do not persist temporary inputs unless the current project convention already does so.

---

# ARCHITECTURE

Keep the architecture clean.

Prefer reusable utilities such as:

```text
runCipherPipeline()
calculateResistanceScore()
compareCipherStrength()
```

The exact file names should follow the existing project structure.

Possible conceptual organization:

```text
src/
  components/
    pipeline/
    comparison/

  pages/
    CipherPipeline.jsx
    CipherComparison.jsx

  utils/
    cipherPipeline.js
    cipherStrength.js
```

But DO NOT blindly create these paths.

First inspect the current architecture and place files according to the project's existing conventions.

---

# BACKEND CONSIDERATION

Inspect whether the new functionality needs backend support.

For deterministic educational transformations, do not unnecessarily introduce API calls.

If the existing project architecture requires server-side processing for security/validation, follow that architecture.

If backend support is added:

- create proper routes/controllers
- validate input
- reuse the shared/server cipher engine
- do not duplicate cipher algorithms
- maintain client/server consistency

Do not expose sensitive implementation parameters unnecessarily.

---

# SHARED CIPHER ENGINE

This is extremely important.

The existing project has a shared cipher engine containing the 10 cipher algorithms.

The new features MUST use that existing engine.

Do not write new duplicate cipher implementations if equivalent implementations already exist.

Instead compose the existing functions.

Conceptually:

```text
input
 ↓
existing cipher engine → cipher 1
 ↓
output
 ↓
existing cipher engine → cipher 2
 ↓
output
 ↓
existing cipher engine → cipher 3
 ↓
final output
```

---

# TESTING

Add tests for the new functionality.

At minimum test:

## Pipeline

1. Three valid ciphers produce sequential output.
2. Cipher 2 receives exactly the output of Cipher 1.
3. Cipher 3 receives exactly the output of Cipher 2.
4. Final pipeline output is deterministic.
5. Changing cipher order changes the result where mathematically expected.
6. Invalid cipher selection is handled.
7. Empty input is handled.
8. Required keys/parameters are validated.
9. Feature 1 and Feature 2 produce the same pipeline result for the same configuration.

## Comparison

1. All 10 ciphers are evaluated.
2. Pipeline is excluded when toggle is OFF.
3. Pipeline is included when toggle is ON.
4. Same input is used for every comparison.
5. Each cipher receives the correct input.
6. Scores remain within 0–100.
7. Same input + same cipher produces deterministic score.
8. Empty input is handled.
9. Comparison results render correctly.
10. The pipeline appears as a separate comparison entry.

---

# PERFORMANCE

Avoid unnecessary re-renders.

Do not recompute every cipher on every keystroke unless the existing UI pattern requires live processing.

Prefer:

User enters text

↓

User clicks:

`COMPARE`

↓

Calculate results once

↓

Animate/display results

Similarly:

User configures pipeline

↓

User clicks:

`RUN PIPELINE`

↓

Execute pipeline

↓

Display stages

---

# ACCESSIBILITY

Maintain existing accessibility standards.

Include:

- proper labels
- keyboard navigation
- focus states
- readable contrast
- accessible toggle
- accessible buttons
- meaningful ARIA labels where necessary

Animations must respect:

`prefers-reduced-motion`

---

# NAVIGATION / INTEGRATION

Integrate both features into the existing application naturally.

Do not make them feel like external tools.

Possible navigation:

```text
HOME
LEARN
CHALLENGE
LAB
PROGRESS
ABOUT
```

Under a suitable existing section such as:

`LAB`

include:

```text
Cipher Pipeline
Cipher Comparison
```

However, first inspect the current navigation and choose the location that best fits the existing application.

Do not disrupt existing routes.

Existing pages must continue working exactly as before.

---

# VISUAL LANGUAGE FOR THE NEW FEATURES

Use technical terminology consistent with the existing application.

Examples:

```text
PIPELINE INITIALIZED
STAGE 01 ACTIVE
TRANSFORMATION COMPLETE
OUTPUT TRANSFERRED
STAGE 02 ACTIVE
FINAL CIPHERTEXT GENERATED
```

For comparison:

```text
ANALYSIS INITIALIZED
RUNNING CIPHER COMPARISON
CALCULATING RESISTANCE ESTIMATES
ANALYSIS COMPLETE
```

These should be subtle UI labels, not excessive terminal text.

---

# IMPORTANT UX DETAIL

Make the relationship between the two features obvious.

Feature 1 creates:

```text
Cipher A → Cipher B → Cipher C
```

Feature 2 can analyze:

```text
Cipher A
Cipher B
Cipher C
...
Cipher J
+
A → B → C Pipeline
```

Therefore the user should feel that the Pipeline is a new experimental cipher construction, while Comparison is the analysis laboratory.

---

# DO NOT BREAK EXISTING FEATURES

Before finalizing:

Run the existing application and verify:

- Home works
- Learn works
- All cipher lessons work
- Challenge works
- Progress works
- Existing scoring still works
- Existing achievements still work
- Existing API still works
- Existing animations still work
- Existing responsive layout still works

Run the existing test suite.

Then run the new tests.

Fix regressions before finishing.

---

# IMPLEMENTATION WORKFLOW

Follow this sequence:

### PHASE 1 — INSPECT

Understand the existing codebase.

Identify:

- cipher engine
- cipher metadata
- Zustand stores
- scoring
- routing
- animation utilities
- reusable components
- backend architecture
- test structure

Do not modify anything yet.

### PHASE 2 — DESIGN

Determine where:

- Cipher Pipeline
- Cipher Comparison

should live.

Reuse existing UI patterns.

### PHASE 3 — PIPELINE ENGINE

Implement one reusable pipeline execution mechanism.

It must:

```text
input
→ cipher 1
→ output 1
→ cipher 2
→ output 2
→ cipher 3
→ final output
```

Return structured stage information so the UI can visualize the process.

Conceptually:

```javascript
{
  input,
  stages: [
    {
      cipher,
      input,
      output,
      parameters
    },
    ...
  ],
  finalOutput
}
```

Adapt this structure to the existing project's conventions.

### PHASE 4 — PIPELINE UI

Build the animated Cipher Pipeline interface.

### PHASE 5 — STRENGTH ANALYSIS

Implement the educational resistance-score calculation.

Keep it isolated and documented.

### PHASE 6 — COMPARISON UI

Build the animated comparison interface.

### PHASE 7 — INTEGRATION

Connect both features to navigation and existing application structure.

### PHASE 8 — TEST

Run all tests.

Fix issues.

Check desktop and mobile.

Check reduced-motion behavior.

---

# FINAL QUALITY BAR

The final result should feel like:

**CipherQuest has evolved from a learning/challenge platform into a small interactive cryptography laboratory.**

The user should be able to:

1. Learn a cipher.
2. Experiment with multiple ciphers.
3. Chain three ciphers into a pipeline.
4. Watch the ciphertext move through each transformation.
5. See exactly how each stage feeds the next.
6. Take one plaintext.
7. Compare how every cipher transforms it.
8. See an educational resistance score for each.
9. Optionally include their three-cipher pipeline.
10. Understand why the scores differ.

The features should be visually polished, animated, educational, technically clean, and completely consistent with the existing CipherQuest design.

Most importantly:

**EXTEND THE EXISTING PROJECT. DO NOT REBUILD IT.**

**REUSE THE EXISTING CIPHER ENGINE.**

**REUSE THE EXISTING DESIGN SYSTEM.**

**REUSE THE EXISTING ANIMATION LANGUAGE.**

**REUSE THE EXISTING SCORING/DATA STRUCTURES WHERE APPROPRIATE.**

**DO NOT BREAK EXISTING FEATURES.**
