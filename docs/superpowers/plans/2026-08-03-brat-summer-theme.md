# Brat Summer Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the app's current DaisyUI theme (green/navy hockey-club colors, Rubik font) with a "brat summer" look — acid lime green, cream card surfaces, near-black text, Arial Narrow, lowercase card titles/buttons with a light blur, and a subtle grain texture — across both `index.html` and `coach.html`.

**Architecture:** Two sequential tasks, both editing build inputs rather than the two large HTML files directly. Task 1 swaps the DaisyUI theme's color/font tokens in `tailwind.config.js`. Task 2 adds a small amount of hand-written CSS in `input.css` targeting DaisyUI's own `.card-title`/`.btn` classes (already present on every card title and button in both HTML files) plus a `body` background texture — so the visual identity applies everywhere with zero edits to `index.html`/`coach.html`. Both tasks rebuild `output.css` via the existing `npm run build` script.

**Tech Stack:** Tailwind CSS v3 + DaisyUI v4 (custom theme `bouncyclassic` in `tailwind.config.js`), no new dependencies, no JS.

## Global Constraints

- Definitive replacement — no theme toggle, no second theme, no `localStorage`, no JS changes.
- Applies to both `index.html` and `coach.html` (both consume the same compiled `output.css`, so the color/font tokens apply automatically to both; the CSS-selector approach in Task 2 also applies automatically to both, since `.card-title` and `.btn` are used identically in both files).
- Semantic colors (`error`, `warning`, `success`, `info`) must remain visually distinct from the new lime primary/accent — do not recolor them to lime.
- User-authored/dynamic content must never be forced lowercase or blurred. Concretely: `index.html:1636` renders `<h3 class="font-bold text-sm sm:text-base">${m.title || ""}</h3>` — a coach-authored "message important" title. Because of this, **do not add a bare `h3` CSS selector** for the lowercase/blur treatment (the spec's "h2.card-title, h3" wording would catch this dynamic title). The treatment in this plan is scoped to `.card-title` (verified below: every `card-title` occurrence in both HTML files is static text, no `${...}` interpolation) and `.btn` (button labels are always static UI chrome). Static `h3` sub-headers (e.g. "Regles de selection", "Compte commun Revolut", the goalie-modal titles, coach.html's "Selectionnees"/"Deliberation"/"Non selectionnees") are left in normal casing/font for this plan — this is a deliberate scope narrowing from the spec's literal wording, done for data-safety, not an oversight.
- No new fonts loaded over the network — Arial Narrow/Arial are system fonts.
- `output.css` is a build artifact — never hand-edit it; always regenerate via `npm run build`.
- `<body class="bg-base-200 min-h-screen">` in both `index.html` and `coach.html` — `base-200` is the literal page-background color, not a spare card tone. It must be the acid lime (`#8ace00`), the same value as `primary`/`accent`, so the page backdrop is lime per the approved design (verified by rendering, not just reading the diff — see Task 1 Step 4). `base-100` (cream) is reserved for card/navbar/tab surfaces sitting on top of that backdrop. `base-200` is also used for a few in-card callout boxes (e.g. "Regles de selection", "Compte commun Revolut") and hover states — these becoming lime accents against their cream card background is an intended, approved side effect, not a bug.
- Two `collapse` wrappers hold dense tabular/list data and must use `bg-base-100` (cream), never `bg-base-200` (lime) — DaisyUI's `table-zebra` stripes even rows with the same `--b2` token as the wrapper, so a lime wrapper cancels the zebra contrast entirely: `index.html`'s "Détail (tableau)" collapse (the match-sheet table) and `coach.html`'s "Detail (raisons)" collapse (selected/deliberation/excluded player lists). Found by rendering the collapse open, not visible in a collapsed screenshot or in a diff.

---

### Task 1: Swap theme colors and font in `tailwind.config.js`

**Files:**
- Modify: `tailwind.config.js` (the `bouncyclassic` theme block and `fontFamily.sans`)

**Interfaces:**
- Produces: the DaisyUI CSS custom properties (`--p`, `--a`, `--b1`, etc., generated from this config) that Task 2's hand-written CSS will sit alongside. Task 2 does not reference any exported JS symbol from this task — it only depends on the *visual result* (lime primary/accent, cream base surfaces) being present in `output.css` after this task's build.

- [ ] **Step 1: Replace the theme color values**

Find (in `tailwind.config.js`):
```js
        bouncyclassic: {
          "primary": "oklch(72% 0.219 149.579)",
          "primary-content": "oklch(27% 0.105 12.094)",
          "secondary": "oklch(62% 0.194 149.214)",
          "secondary-content": "oklch(27% 0.046 192.524)",
          "accent": "oklch(62% 0.214 259.815)",
          "accent-content": "oklch(26% 0.079 36.259)",
          "neutral": "oklch(35% 0.144 278.697)",
          "neutral-content": "oklch(96% 0.018 272.314)",
          "base-100": "oklch(98% 0.002 247.839)",
          "base-200": "oklch(96% 0.003 264.542)",
          "base-300": "oklch(92% 0.006 264.531)",
          "base-content": "oklch(37% 0.146 265.522)",
          "info": "oklch(68% 0.169 237.323)",
          "info-content": "oklch(97% 0.013 236.62)",
          "success": "oklch(69% 0.17 162.48)",
          "success-content": "oklch(97% 0.021 166.113)",
          "warning": "oklch(79% 0.184 86.047)",
          "warning-content": "oklch(98% 0.026 102.212)",
          "error": "oklch(64% 0.246 16.439)",
          "error-content": "oklch(96% 0.015 12.422)",
          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          "--border-btn": "1px",
        },
```

Replace with:
```js
        bouncyclassic: {
          "primary": "#8ace00",
          "primary-content": "#111111",
          "secondary": "#8ace00",
          "secondary-content": "#111111",
          "accent": "#8ace00",
          "accent-content": "#111111",
          "neutral": "#1a1a1a",
          "neutral-content": "#faf9f2",
          "base-100": "#faf9f2",
          "base-200": "#8ace00",
          "base-300": "#d8d4a8",
          "base-content": "#1a1a1a",
          "info": "oklch(68% 0.169 237.323)",
          "info-content": "oklch(97% 0.013 236.62)",
          "success": "oklch(69% 0.17 162.48)",
          "success-content": "oklch(97% 0.021 166.113)",
          "warning": "oklch(79% 0.184 86.047)",
          "warning-content": "oklch(98% 0.026 102.212)",
          "error": "oklch(64% 0.246 16.439)",
          "error-content": "oklch(96% 0.015 12.422)",
          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          "--border-btn": "1px",
        },
```

Note: `info`/`success`/`warning`/`error` are intentionally left untouched (per Global Constraints — semantic colors must stay distinct from lime).

- [ ] **Step 2: Replace the font family**

Find (in `tailwind.config.js`):
```js
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Rubik"', 'sans-serif'],
      },
    },
  },
```

Replace with:
```js
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Arial Narrow"', "Arial", 'sans-serif'],
      },
    },
  },
```

- [ ] **Step 3: Rebuild the CSS and verify the new colors are present**

Run: `npm run build`
Expected: exits 0, `output.css` is rewritten (check with `git diff --stat output.css` — it should show changes).

Then run: `grep -c "8ace00" output.css`
Expected: a number greater than 0 (the new lime hex value appears in the compiled CSS as the resolved `--p`/`--a` custom property values or utility classes).

- [ ] **Step 4: Manually verify the page background/buttons changed**

Since there's no local DB required for this check (colors are pure CSS), open `index.html` directly in a browser (`open index.html` on macOS, or any static file server) and confirm:
- The page background and primary buttons (e.g. "Ajouter" buttons) are now acid lime green instead of the old green/navy.
- Text remains legible (near-black on lime, near-black on cream cards).

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js output.css
git commit -m "$(cat <<'EOF'
Swap theme colors and font to brat summer palette

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add grain texture and lowercase/blur treatment for titles and buttons

**Files:**
- Modify: `input.css` (add body texture + `.card-title`/`.btn` rules)
- Modify: `output.css` (regenerated via `npm run build`, not hand-edited)

**Interfaces:**
- Consumes: the lime/cream palette from Task 1 (this task's CSS doesn't hardcode colors itself — the grain overlay uses `rgba(0,0,0,...)` which sits neutrally on top of whichever background color Task 1 set).
- Produces: nothing further consumed elsewhere in this plan — this is the last task.

- [ ] **Step 1: Add the grain texture and title/button treatment to `input.css`**

Find (the entire current contents of `input.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Replace with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-image: repeating-radial-gradient(
    circle at 10% 20%,
    rgba(0, 0, 0, 0.025) 0,
    rgba(0, 0, 0, 0.025) 1px,
    transparent 1px,
    transparent 3px
  );
}

.card-title {
  text-transform: lowercase;
  filter: blur(1px);
}

.btn {
  text-transform: lowercase;
}
```

- [ ] **Step 2: Rebuild the CSS**

Run: `npm run build`
Expected: exits 0, `output.css` changes (check with `git diff --stat output.css`).

- [ ] **Step 3: Manually verify in both `index.html` and `coach.html`**

Open both files in a browser and confirm:
- Every card title (e.g. "Calendrier", "Thunes", "Arbitrage", "Notes" in `index.html`; "Page Coach", "Changer le mot de passe" in `coach.html`) is lowercase with a light blur, and is still readable at a glance.
- Every button label (e.g. "Ajouter", "Publier", "Copier les dates à couvrir") is lowercase.
- The "message important" card (`index.html`, the `#important-msg-display` area) — add a test message via the "Publier un message important" form with a title containing uppercase letters, and confirm the rendered title is **not** forced lowercase and **not** blurred (this is the dynamic `h3` at `index.html:1636` that Global Constraints says must stay untouched).
- Player names in tables/forms, phone numbers, and notes text all render exactly as typed — no casing or blur changes anywhere outside card titles and buttons.
- Warning/error alerts (e.g. the "indispensable de mettre ses disponibilites" warning box) remain visually distinct from the lime primary color — they should not look green.
- The coach password screen (`coach.html`) is legible: input field and any error message are readable against the new theme.
- A very subtle grain texture is visible on the page background without making text harder to read.

- [ ] **Step 4: Commit**

```bash
git add input.css output.css
git commit -m "$(cat <<'EOF'
Add grain texture and lowercase/blur treatment for card titles and buttons

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
