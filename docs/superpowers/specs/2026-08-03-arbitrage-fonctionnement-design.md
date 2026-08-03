# Design : bouton copier-dates arbitrage, onglet Fonctionnement, mise à jour des dates de matchs

Date : 2026-08-03
Fichier concerné : `index.html` (single-page app, pas de changement backend/DB)

## Contexte

`index.html` a deux onglets (`Équipe`, `Présences`) gérés par `switchTab()`. L'onglet
`Équipe` mélange contenu dynamique (messages importants, calendrier) et règles fixes
(sélection, équipement, thunes). La carte Arbitrage affiche un calendrier de dates de
matchs (`MATCH_DATES`, tableau JS codé en dur) avec jusqu'à 2 arbitres par date.

## Feature 1 — Bouton "Copier les dates à couvrir"

- Nouveau bouton sous le tableau arbitrage (entre le tableau et le formulaire d'ajout).
- Au clic : calcule les dates de `MATCH_DATES` où le nombre d'arbitres assignés < 2
  (pas "complet"), les formate (date + heure, ex: "1 sept 15h00"), les joint par
  virgule, copie le résultat via `navigator.clipboard.writeText`.
- Fallback si `navigator.clipboard` indisponible : `<textarea>` temporaire +
  `document.execCommand('copy')`.
- Feedback : le texte du bouton passe à "Copié !" pendant ~1,5s puis revient à son
  libellé normal.
- Cas "rien à copier" (toutes les dates complètes) : bouton désactivé, texte
  "Toutes les dates sont couvertes 👍".
- Uniquement sur `index.html` (pas `coach.html`).

## Feature 2 — Nouvel onglet "Fonctionnement"

- Même pattern que les onglets existants : bouton `role="tab"` (`id="tab-fonctionnement"`,
  label "Fonctionnement") + conteneur `id="page-fonctionnement"`.
- `switchTab()` étendu pour gérer un 3ᵉ état (`equipe` / `presences` / `fonctionnement`),
  toggle `hidden` sur les 3 pages et `tab-active` sur les 3 boutons.
- Contenu déplacé depuis l'onglet Équipe :
  - Carte "Presences" (règles de sélection) → renommée **"Règles de sélection"**
    pour éviter la confusion avec l'onglet "Présences" (tableau de présences aux
    entraînements) qui reste inchangé.
  - Carte "Équipement" (règles de maillot/jupe).
- Reste sur l'onglet Équipe (home, partage d'infos) : messages importants + formulaire,
  alerte "nouveau système de présences", calendrier Google, Thunes, Arbitrage
  (avec le nouveau bouton de la feature 1), Notes.
- Onglet pensé comme évolutif : d'autres règles pourront y être ajoutées plus tard.

## Feature 3 — Mise à jour des dates de matchs

- Remplacer le contenu de `MATCH_DATES` par les dates de la nouvelle saison, avec
  horaire (nécessite de passer d'un format date-seule à date+heure) :
  - 2026-09-01 15:00
  - 2026-09-20 15:00
  - 2026-10-04 13:00
  - 2026-11-15 16:30
  - 2026-11-22 16:30
- `MATCH_DATES` passe d'un tableau de strings `"YYYY-MM-DD"` à un tableau d'objets
  `{ date: "YYYY-MM-DD", time: "HH:MM" }` (ou string ISO `"YYYY-MM-DDTHH:MM"` — à
  trancher en implémentation, l'un ou l'autre fonctionne).
- `formatMatchDate` (et son usage dans l'en-tête du tableau, le `<select>`, et la
  liste copiée de la feature 1) affiche désormais date + heure, ex: "1 sept 15h00".
- Pas de changement de schéma DB : `MATCH_DATES` reste un tableau JS codé en dur,
  seul son contenu et son format changent.

## Hors scope

- Rendre `MATCH_DATES` éditable depuis l'interface (actuellement codé en dur,
  nécessite une édition manuelle du fichier) — noté comme limitation connue,
  pas traité ici.
- Gestion des matchs/scores/stats (couverte par l'app Hockey Belgium, hors scope
  de cette app).
