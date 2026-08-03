# Arbitrage Copy Button, Fonctionnement Tab & Match Dates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "copy open referee dates" button to the Arbitrage card, split static team-rules content into a new "Fonctionnement" tab, and update the hardcoded match dates to the new season (with kickoff times shown throughout).

**Architecture:** Single-file change to `index.html` (vanilla JS + Tailwind/DaisyUI, no build step, no backend/DB change). Three sequential tasks: (1) change `MATCH_DATES` to carry a time and update `formatMatchDate` accordingly, (2) add the copy button which depends on the new date/time format, (3) add a third tab, move two static cards into it, and add a new "Cotisations" rules card plus a paragraph on the Monday-reminder/Thursday-screenshot attendance process.

**Tech Stack:** Vanilla JS, Tailwind + DaisyUI classes, `navigator.clipboard` API. No automated test framework exists in this repo — verification is manual, done by serving the app locally and exercising it in a browser.

## Global Constraints

- No backend/DB changes — `MATCH_DATES` stays a hardcoded JS array in `index.html`.
- No new dependencies — use only `navigator.clipboard` / `document.execCommand` fallback already available in browsers.
- Match dates/times for the new season (from spec, exact values):
  - `2026-09-01` at `15:00`
  - `2026-09-20` at `15:00`
  - `2026-10-04` at `13:00`
  - `2026-11-15` at `16:30`
  - `2026-11-22` at `16:30`
- Renamed card title: the card with selection rules must be titled **"Règles de sélection"** (not "Presences") once moved, to avoid confusion with the existing "Présences" tab (attendance table).
- The "Fonctionnement" tab must include a new "Cotisations" card with this exact policy: cotisations are requested at 3 points in the year — start of season (team charges), end of Q1 (Lucas + Q2 dues), end of year (Q2 of Lucas's coaching) — payment plans are allowed, but absent any captain being informed in advance, the assumption is a 1-month payment window, and missing it means the player cannot participate in matches. Additionally, any player who referees a match has her team dues reduced accordingly.
- The "Règles de sélection" card must include this exact policy in addition to the existing selection-rules content: a reminder is sent every Monday, a screenshot of availabilities is taken every Thursday to hold each player accountable for entering availability in advance, and selection is based on those screenshots.
- The "Règles de sélection" card must also include this exact policy: a request to change a training's schedule for a given week must be communicated at the latest the Monday preceding that week; such occasional changes are discouraged out of respect for everyone's organization, and attendance is not counted for those training sessions.
- Changes apply to `index.html` only, not `coach.html`.

## Manual Verification Setup

This app has no automated tests. To verify changes in a browser:

```bash
cd /Users/chlohal/Documents/GitHub/Hockey-Team-Management
php -S localhost:8000
```

Then open `http://localhost:8000/index.html`. If `config.php` has no working DB credentials in your environment, the referee table/select will fail to populate (an empty array or console error from `apiGet`), but tab switching, static card content, and button presence/disabled-state logic can still be checked directly in DevTools (Elements/Console tabs) — each task below notes what's checkable without a live DB.

---

### Task 1: Update `MATCH_DATES` to date+time and show time everywhere

**Files:**
- Modify: `index.html:1682-1723` (the `MATCH_DATES` array and `formatMatchDate`)
- Modify: `index.html:1733-1774` (`renderReferees` — all 3 usages of `MATCH_DATES`)

**Interfaces:**
- Produces: `MATCH_DATES` is now `Array<{date: string, time: string}>` (was `Array<string>`). `formatMatchDate(dateStr, timeStr)` now takes two args and returns e.g. `"1 sept 15h00"` (was one arg, returned e.g. `"8 mars"`). Task 2 and Task 3 consume this new shape.

- [ ] **Step 1: Replace the `MATCH_DATES` array**

Find (around line 1682):
```js
      const MATCH_DATES = [
        "2025-03-08",
        "2025-03-22",
        "2025-04-05",
        "2025-04-12",
        "2025-04-19",
        "2025-05-24",
      ];
```

Replace with:
```js
      const MATCH_DATES = [
        { date: "2026-09-01", time: "15:00" },
        { date: "2026-09-20", time: "15:00" },
        { date: "2026-10-04", time: "13:00" },
        { date: "2026-11-15", time: "16:30" },
        { date: "2026-11-22", time: "16:30" },
      ];
```

- [ ] **Step 2: Update `formatMatchDate` to accept and render a time**

Find (around line 1718):
```js
      function formatMatchDate(dateStr) {
        const d = new Date(dateStr + "T00:00:00");
        return d
          .toLocaleDateString("fr-BE", { day: "numeric", month: "short" })
          .replace(".", "");
      }
```

Replace with:
```js
      function formatMatchDate(dateStr, timeStr) {
        const d = new Date(dateStr + "T00:00:00");
        const datePart = d
          .toLocaleDateString("fr-BE", { day: "numeric", month: "short" })
          .replace(".", "");
        const timePart = timeStr ? " " + timeStr.replace(":", "h") : "";
        return datePart + timePart;
      }
```

- [ ] **Step 3: Update `renderReferees` to use `{date, time}` objects**

Find (around line 1725-1781, the whole function body — only the parts touching `MATCH_DATES` change):

```js
        document.getElementById("referee-calendar-head").innerHTML =
          "<tr><th></th>" +
          MATCH_DATES.map(
            (d) => `<th class="text-center text-xs">${formatMatchDate(d)}</th>`,
          ).join("") +
          "</tr>";

        let rows = "";
        for (let i = 0; i < 2; i++) {
          rows +=
            '<tr><td class="font-medium text-xs whitespace-nowrap">Arb. ' +
            (i + 1) +
            "</td>";
          MATCH_DATES.forEach((date) => {
            const refs = byDate[date] || [];
            const ref = refs[i];
            if (ref) {
              const phoneLink = ref.phone
                ? '<br><a href="tel:' +
                  escapeHtml(ref.phone) +
                  '" class="link link-primary text-xs">' +
                  escapeHtml(ref.phone) +
                  "</a>"
                : "";
              rows += `<td class="text-center text-xs">${escapeHtml(ref.name)}${phoneLink} <button class="btn btn-ghost btn-xs" onclick="deleteReferee(${ref.id})">x</button></td>`;
            } else {
              rows += '<td class="text-center text-base-content/30">-</td>';
            }
          });
          rows += "</tr>";
        }
        document.getElementById("referee-calendar-body").innerHTML = rows;

        const select = document.getElementById("referee-date");
        const currentVal = select.value;
        select.innerHTML =
          '<option value="" disabled selected>Choisir...</option>' +
          MATCH_DATES.map((d) => {
            const count = (byDate[d] || []).length;
            const full = count >= 2;
            return `<option value="${d}" ${full ? "disabled" : ""}>${formatMatchDate(d)}${full ? " (complet)" : ""}</option>`;
          }).join("");
```

Replace with:

```js
        document.getElementById("referee-calendar-head").innerHTML =
          "<tr><th></th>" +
          MATCH_DATES.map(
            (d) => `<th class="text-center text-xs">${formatMatchDate(d.date, d.time)}</th>`,
          ).join("") +
          "</tr>";

        let rows = "";
        for (let i = 0; i < 2; i++) {
          rows +=
            '<tr><td class="font-medium text-xs whitespace-nowrap">Arb. ' +
            (i + 1) +
            "</td>";
          MATCH_DATES.forEach((m) => {
            const refs = byDate[m.date] || [];
            const ref = refs[i];
            if (ref) {
              const phoneLink = ref.phone
                ? '<br><a href="tel:' +
                  escapeHtml(ref.phone) +
                  '" class="link link-primary text-xs">' +
                  escapeHtml(ref.phone) +
                  "</a>"
                : "";
              rows += `<td class="text-center text-xs">${escapeHtml(ref.name)}${phoneLink} <button class="btn btn-ghost btn-xs" onclick="deleteReferee(${ref.id})">x</button></td>`;
            } else {
              rows += '<td class="text-center text-base-content/30">-</td>';
            }
          });
          rows += "</tr>";
        }
        document.getElementById("referee-calendar-body").innerHTML = rows;

        const select = document.getElementById("referee-date");
        const currentVal = select.value;
        select.innerHTML =
          '<option value="" disabled selected>Choisir...</option>' +
          MATCH_DATES.map((d) => {
            const count = (byDate[d.date] || []).length;
            const full = count >= 2;
            return `<option value="${d.date}" ${full ? "disabled" : ""}>${formatMatchDate(d.date, d.time)}${full ? " (complet)" : ""}</option>`;
          }).join("");
```

Note: `byDate` itself is unchanged (still keyed by plain date string from the `referees` API response, which stores dates only — no time).

- [ ] **Step 4: Manually verify**

Start the local server and open `index.html` (see Manual Verification Setup). Open DevTools Console and run:
```js
formatMatchDate("2026-09-01", "15:00")
```
Expected: `"1 sept 15h00"`. Then check the Arbitrage table header on the Équipe tab shows `1 sept 15h00`, `20 sept 15h00`, `4 oct 13h00`, `15 nov 16h30`, `22 nov 16h30` as column headers, and the "Date" dropdown in the add-referee form shows the same labels.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Update match dates to new season and show kickoff time in referee calendar

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add "Copier les dates à couvrir" button

**Files:**
- Modify: `index.html:401-402` (HTML — insert button between the table wrapper and the add-referee form)
- Modify: `index.html` script section, near `renderReferees` (add 2 new functions, add 3 lines inside `renderReferees`)

**Interfaces:**
- Consumes: `MATCH_DATES` (`Array<{date, time}>`) and `formatMatchDate(dateStr, timeStr)` from Task 1.
- Produces: `copyOpenRefereeDates()` (onclick handler), `updateCopyRefereeButton()`, `copyTextToClipboard(text)`, and module-level `let openRefereeDates = []`. Nothing later in this plan depends on these.

- [ ] **Step 1: Add the button in the HTML, right after the table**

Find (around line 401):
```html
          </div>

          <!-- Formulaire ajout arbitre -->
```

Replace with:
```html
          </div>

          <button
            id="copy-referee-dates-btn"
            class="btn btn-outline btn-sm w-full mt-3"
            onclick="copyOpenRefereeDates()"
          >
            Copier les dates à couvrir
          </button>

          <!-- Formulaire ajout arbitre -->
```

- [ ] **Step 2: Add the module-level state variable**

Find (around line 1681-1682):
```js
      // ===================== REFEREES =====================
      const MATCH_DATES = [
```

Replace with:
```js
      // ===================== REFEREES =====================
      let openRefereeDates = [];

      const MATCH_DATES = [
```

- [ ] **Step 3: Compute `openRefereeDates` and refresh the button at the end of `renderReferees`**

Find (the tail end of `renderReferees`, right before its closing brace, around line 1779-1781):
```js
        if (
          currentVal &&
          select.querySelector(`option[value="${currentVal}"]:not([disabled])`)
        ) {
          select.value = currentVal;
        }
      }
```

Replace with:
```js
        if (
          currentVal &&
          select.querySelector(`option[value="${currentVal}"]:not([disabled])`)
        ) {
          select.value = currentVal;
        }

        openRefereeDates = MATCH_DATES.filter(
          (d) => (byDate[d.date] || []).length < 2,
        );
        updateCopyRefereeButton();
      }
```

- [ ] **Step 4: Add the button-state, copy, and clipboard-fallback functions**

Insert immediately after the `renderReferees` function closes (i.e., right after the `}` added in Step 3, before the `// ===================== RENDER ALL =====================` comment):

```js
      function updateCopyRefereeButton() {
        const btn = document.getElementById("copy-referee-dates-btn");
        if (openRefereeDates.length === 0) {
          btn.disabled = true;
          btn.textContent = "Toutes les dates sont couvertes 👍";
        } else {
          btn.disabled = false;
          btn.textContent = "Copier les dates à couvrir";
        }
      }

      async function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return;
        }
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      async function copyOpenRefereeDates() {
        if (openRefereeDates.length === 0) return;
        const text = openRefereeDates
          .map((d) => formatMatchDate(d.date, d.time))
          .join(", ");
        await copyTextToClipboard(text);
        const btn = document.getElementById("copy-referee-dates-btn");
        btn.textContent = "Copié !";
        setTimeout(updateCopyRefereeButton, 1500);
      }
```

- [ ] **Step 5: Manually verify**

With the local server running and a working DB (see Manual Verification Setup):
1. Load the Équipe tab. Confirm the new button appears under the Arbitrage table, above the "Date/Telephone" form row.
2. If fewer than 2 referees are assigned to at least one match date, the button should read "Copier les dates à couvrir" and be enabled. Click it, then paste (Cmd+V) into any text field (e.g. the browser URL bar) — the pasted text should be a comma-separated list like `1 sept 15h00, 20 sept 15h00`, matching only dates with fewer than 2 referees assigned. The button should briefly show "Copié !" then revert.
3. Using `add_referee` (via the existing form) to fill 2 referees on every match date, reload, and confirm the button becomes disabled and reads "Toutes les dates sont couvertes 👍".

If no working DB is available, verify structurally instead: in DevTools Console, set `openRefereeDates = MATCH_DATES.slice(0, 2)` then call `updateCopyRefereeButton()` and `copyOpenRefereeDates()` and confirm the button text and clipboard content update as described.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add button to copy referee dates still needing coverage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add "Fonctionnement" tab and move static rule cards into it

**Files:**
- Modify: `index.html:146-167` (tablist — add third tab button)
- Modify: `index.html:276-339` (remove "Presences" rules card from the Équipe tab)
- Modify: `index.html:375-385` (remove "Équipement" card from the Équipe tab)
- Modify: `index.html:673` area (insert new `page-fonctionnement` container with the two moved cards, renamed, plus a new "Cotisations" card)
- Modify: `index.html:710-723` (`switchTab` — handle third state)

**Interfaces:**
- Consumes: nothing from Task 1/2 (independent of the referee/date changes).
- Produces: nothing consumed elsewhere in this plan — this is the last task.

- [ ] **Step 1: Add the third tab button**

Find (around line 159-166):
```html
        <a
          role="tab"
          class="tab flex-1 sm:flex-none"
          onclick="switchTab('presences')"
          id="tab-presences"
          >Présences</a
        >
      </div>
    </div>
```

Replace with:
```html
        <a
          role="tab"
          class="tab flex-1 sm:flex-none"
          onclick="switchTab('presences')"
          id="tab-presences"
          >Présences</a
        >
        <a
          role="tab"
          class="tab flex-1 sm:flex-none"
          onclick="switchTab('fonctionnement')"
          id="tab-fonctionnement"
          >Fonctionnement</a
        >
      </div>
    </div>
```

- [ ] **Step 2: Remove the "Presences" rules card from the Équipe tab**

Find (around line 276-339):
```html
      <!-- Présences - Règles -->
      <div class="card bg-base-100 shadow-xl mt-3">
        <div class="card-body p-3 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl mb-3">Presences</h2>
          <p class="text-sm">
            Si tu dois encore t'inscrire c'est
            <a
              href="https://static.twizzit.com/v2/public/form/fb607f5140322550109666feda694ce9"
              target="_blank"
              class="link link-primary"
              >ici</a
            >
            et puis tu telecharges l'<a
              href="https://apps.apple.com/be/app/hockey-belgium/id1413161236?l=fr-FR"
              target="_blank"
              class="link link-primary"
              >app Hockey Belgium</a
            >.
          </p>

          <div class="alert alert-warning mt-3">
            <div>
              <span class="text-sm"
                >Il est <strong>indispensable</strong> de mettre ses
                disponibilites sur l'application <em>Hockey Belgium</em> !</span
              >
            </div>
          </div>

          <p class="mt-2 text-xs sm:text-sm">
            C'est super important parce que chercher du renfort ne se fait pas
            en derniere minute et ca permet egalement d'adapter
            l'entrainement...
          </p>

          <div class="bg-base-200 rounded-lg p-3 sm:p-4 mt-3">
            <h3 class="font-bold mb-2 text-sm sm:text-base">
              Regles de selection
            </h3>
            <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>
                La selection se fait sur base des
                <strong>3 derniers entrainements</strong>.
              </li>
              <li>
                En cas d'egalite, on regarde les
                <strong>5 derniers entrainements</strong>.
              </li>
              <li>
                S'il y a encore egalite : priorite au
                <strong>placement</strong>, puis au <strong>niveau</strong>.
              </li>
              <li>
                Aucune excuse n'est prise en compte pour les absences : statut
                etudiant, travail, blessure, maladie, etc.
              </li>
              <li>
                Seuls les entrainements reellement et entierement suivis
                comptent.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Thunes -->
```

Replace with just:
```html
      <!-- Thunes -->
```

(This deletes the card entirely from the Équipe tab — it's recreated, renamed, in Step 4 below.)

- [ ] **Step 3: Remove the "Équipement" card from the Équipe tab**

Find (around line 375-386, now shifted up since Step 2 removed lines above it):
```html
      <!-- Équipement -->
      <div class="card bg-base-100 shadow-xl mt-3">
        <div class="card-body p-3 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl mb-3">Equipement</h2>
          <p class="text-xs sm:text-sm">
            Le maillot vert du club, les chaussettes et la jupe bleu marine sont
            <strong>obligatoires</strong>. Si tu ne les as pas encore commandes,
            n'oublie pas de regarder si ton numero est disponible.
          </p>
        </div>
      </div>

      <!-- Arbitrage -->
```

Replace with just:
```html
      <!-- Arbitrage -->
```

- [ ] **Step 4: Insert the new `page-fonctionnement` container after `page-presences` closes**

Find (the closing of `page-presences`, right before the main `<script>` tag):
```html
    </div>

    <script>
      // ===================== API HELPERS =====================
```

Replace with:
```html
    </div>

    <!-- ==================== TAB FONCTIONNEMENT ==================== -->
    <div
      id="page-fonctionnement"
      class="container mx-auto px-3 sm:px-4 py-3 max-w-5xl hidden"
    >
      <!-- Règles de sélection -->
      <div class="card bg-base-100 shadow-xl mt-3">
        <div class="card-body p-3 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl mb-3">
            Règles de sélection
          </h2>
          <p class="text-sm">
            Si tu dois encore t'inscrire c'est
            <a
              href="https://static.twizzit.com/v2/public/form/fb607f5140322550109666feda694ce9"
              target="_blank"
              class="link link-primary"
              >ici</a
            >
            et puis tu telecharges l'<a
              href="https://apps.apple.com/be/app/hockey-belgium/id1413161236?l=fr-FR"
              target="_blank"
              class="link link-primary"
              >app Hockey Belgium</a
            >.
          </p>

          <div class="alert alert-warning mt-3">
            <div>
              <span class="text-sm"
                >Il est <strong>indispensable</strong> de mettre ses
                disponibilites sur l'application <em>Hockey Belgium</em> !</span
              >
            </div>
          </div>

          <p class="mt-2 text-xs sm:text-sm">
            C'est super important parce que chercher du renfort ne se fait pas
            en derniere minute et ca permet egalement d'adapter
            l'entrainement...
          </p>

          <div class="alert alert-info mt-3">
            <div>
              <span class="text-sm"
                >Un rappel est envoyé tous les <strong>lundis</strong>, et un
                <strong>screenshot</strong> des disponibilités est pris chaque
                <strong>jeudi</strong> pour responsabiliser chaque joueuse à
                encoder ses présences à l'avance — cela aide énormément à
                l'organisation des matchs. <strong>La sélection se base sur
                ces screenshots.</strong></span
              >
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3 sm:p-4 mt-3">
            <h3 class="font-bold mb-2 text-sm sm:text-base">
              Regles de selection
            </h3>
            <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>
                La selection se fait sur base des
                <strong>3 derniers entrainements</strong>.
              </li>
              <li>
                En cas d'egalite, on regarde les
                <strong>5 derniers entrainements</strong>.
              </li>
              <li>
                S'il y a encore egalite : priorite au
                <strong>placement</strong>, puis au <strong>niveau</strong>.
              </li>
              <li>
                Aucune excuse n'est prise en compte pour les absences : statut
                etudiant, travail, blessure, maladie, etc.
              </li>
              <li>
                Seuls les entrainements reellement et entierement suivis
                comptent.
              </li>
            </ul>
          </div>

          <p class="mt-3 text-xs sm:text-sm">
            En cas de volonté de changer l'horaire d'un entraînement pour une
            semaine donnée, la demande doit être communiquée au plus tard le
            <strong>lundi précédant</strong> la semaine concernée. Ces
            changements ponctuels ne sont pas encouragés, par respect pour
            l'organisation de chacune —
            <strong
              >les présences ne seront donc pas comptabilisées</strong
            >
            pour ces entraînements.
          </p>
        </div>
      </div>

      <!-- Équipement -->
      <div class="card bg-base-100 shadow-xl mt-3">
        <div class="card-body p-3 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl mb-3">Equipement</h2>
          <p class="text-xs sm:text-sm">
            Le maillot vert du club, les chaussettes et la jupe bleu marine sont
            <strong>obligatoires</strong>. Si tu ne les as pas encore commandes,
            n'oublie pas de regarder si ton numero est disponible.
          </p>
        </div>
      </div>

      <!-- Cotisations -->
      <div class="card bg-base-100 shadow-xl mt-3 mb-6">
        <div class="card-body p-3 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl mb-3">Cotisations</h2>
          <p class="text-xs sm:text-sm">
            Des cotisations seront demandées à plusieurs moments de l'année :
          </p>
          <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm mt-2">
            <li>En début de saison, pour les charges de l'équipe.</li>
            <li>
              Fin du 1er trimestre (Q1), pour payer Lucas et la cotisation du
              2e trimestre (Q2).
            </li>
            <li>
              En fin d'année, pour payer le 2e trimestre (Q2) de coaching de
              Lucas.
            </li>
          </ul>
          <p class="mt-3 text-xs sm:text-sm">
            Des plans de paiement échelonnés peuvent être mis en place. Si
            aucune capitaine n'a été mise au courant, on considère que la
            somme peut être payée en 1 mois. Si ce délai n'est pas respecté,
            la joueuse ne pourra pas participer aux matchs.
          </p>
          <p class="mt-3 text-xs sm:text-sm">
            Toute joueuse qui effectue un arbitrage voit sa cotisation
            d'équipe diminuer en conséquence.
          </p>
        </div>
      </div>
    </div>

    <script>
      // ===================== API HELPERS =====================
```

- [ ] **Step 5: Update `switchTab` to handle the third tab**

Find (around line 710-723):
```js
      function switchTab(tab) {
        document
          .getElementById("page-equipe")
          .classList.toggle("hidden", tab !== "equipe");
        document
          .getElementById("page-presences")
          .classList.toggle("hidden", tab !== "presences");
        document
          .getElementById("tab-equipe")
          .classList.toggle("tab-active", tab === "equipe");
        document
          .getElementById("tab-presences")
          .classList.toggle("tab-active", tab === "presences");
      }
```

Replace with:
```js
      function switchTab(tab) {
        document
          .getElementById("page-equipe")
          .classList.toggle("hidden", tab !== "equipe");
        document
          .getElementById("page-presences")
          .classList.toggle("hidden", tab !== "presences");
        document
          .getElementById("page-fonctionnement")
          .classList.toggle("hidden", tab !== "fonctionnement");
        document
          .getElementById("tab-equipe")
          .classList.toggle("tab-active", tab === "equipe");
        document
          .getElementById("tab-presences")
          .classList.toggle("tab-active", tab === "presences");
        document
          .getElementById("tab-fonctionnement")
          .classList.toggle("tab-active", tab === "fonctionnement");
      }
```

- [ ] **Step 6: Manually verify**

Start the local server and open `index.html` (see Manual Verification Setup, works without a DB for this task — no API calls involved):
1. Confirm three tabs are visible: "Équipe", "Présences", "Fonctionnement".
2. Click "Fonctionnement": confirm it shows exactly three cards, "Règles de sélection" (with the selection-rules content, including the Monday reminder / Thursday screenshot paragraph), "Equipement" (jersey/skirt rules), and "Cotisations" (payment schedule/consequences), and that the tab button gets the active style.
3. Click back to "Équipe": confirm the "Presences"/"Équipement" cards are gone from this tab, and that Thunes, Arbitrage (with its copy button from Task 2), and Notes are still present and in the same relative order.
4. Click "Présences": confirm the existing attendance table tab is unaffected.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add Fonctionnement tab and move team-rules cards out of the home tab

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
