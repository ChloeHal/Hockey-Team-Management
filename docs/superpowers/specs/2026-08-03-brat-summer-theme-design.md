# Design : thème visuel "brat summer"

Date : 2026-08-03
Fichiers concernés : `tailwind.config.js`, `input.css` (→ `output.css` recompilé), `index.html`, `coach.html`

## Contexte

L'app utilise Tailwind CSS + DaisyUI avec un thème custom unique nommé `bouncyclassic`
défini dans `tailwind.config.js` (couleurs en `oklch`, coins déjà carrés via
`--rounded-box/btn/badge: 0rem`). Police actuelle : Rubik. Pas de mécanisme de
thème multiple ni de toggle aujourd'hui — un seul thème actif.

Décision validée en brainstorming (via compagnon visuel, 3 options comparées) :
remplacement **définitif** du thème actuel par un habillage "brat summer" —
inspiré de l'esthétique de l'album *Brat* de Charli XCX (vert acide, minuscules,
flou/grain léger). Pas de bascule entre deux thèmes : le thème club (vert/bleu
marine) disparaît, remplacé pour de bon.

## Identité visuelle

- **Couleur dominante** : vert acide (`#8ace00`) — devient `primary` et `accent`
  du thème DaisyUI. Utilisé comme fond de page ET pour boutons/liens/bordures actives.
- **Surface de contenu** : cartes, tableaux et formulaires restent posés sur une
  surface claire crème (`#faf9f2` env., mappé sur `base-100`/`base-200`/`base-300`
  en dégradés de crème/blanc cassé) — validé face à l'alternative "tableau flottant
  directement sur le vert", écartée pour la lisibilité des données denses
  (tableaux de présences, formulaires).
- **Texte** : noir quasi-pur (`#1a1a1a` env.) mappé sur `base-content`, police
  Arial Narrow (fallback `Arial, sans-serif`) à la place de Rubik — police système,
  aucun chargement de police externe.
- **Minuscules + flou léger** sur les titres de section (`h2.card-title`, `h3`)
  et les boutons uniquement — clin d'œil au logo flouté de l'album. Implémenté
  en CSS pur : `text-transform: lowercase` + un léger `filter: blur(...)` ou
  effet de texture sur ces éléments précis.
- **Grain subtil** en texture de fond (`body`), très bas en opacité, pour l'ambiance
  "brut" sans nuire à la lecture.
- **Contenu utilisateur jamais transformé** : noms de joueuses, notes, numéros de
  téléphone, dates saisies restent affichés tels quels — le `text-transform:
  lowercase` et le flou ne s'appliquent qu'aux éléments de chrome de l'interface
  (titres statiques, boutons, labels), jamais aux données dynamiques rendues par
  JS.
- **Couleurs sémantiques inchangées** : `error`/`warning`/`success`/`info` gardent
  leurs teintes actuelles (rouge, orange, etc.) — le vert acide ne doit pas
  remplacer les couleurs de statut, pour ne pas casser la lisibilité des alertes
  (ex: messages importants avec icône warning/error).

## Portée

- S'applique à `index.html` **et** `coach.html` : les deux pages partagent le
  même thème DaisyUI compilé (`bouncyclassic` dans `output.css`), donc un seul
  changement de configuration touche les deux automatiquement pour les couleurs ;
  les classes de titre/bouton (minuscules + flou) doivent être ajoutées dans les
  deux fichiers HTML séparément, partout où un titre de carte ou un bouton
  apparaît.
- Écran mot de passe coach (`coach.html`) : même traitement visuel, à vérifier
  spécifiquement pour la lisibilité du champ de saisie et des messages d'erreur
  sur fond vert acide.

## Implémentation technique

- `tailwind.config.js` : remplacer les valeurs de couleur du bloc `bouncyclassic`
  existant (`primary`, `accent`, `base-100/200/300`, `base-content`) par les
  nouvelles teintes vert acide / crème / noir décrites ci-dessus. `secondary`,
  `neutral`, `info`/`success`/`warning`/`error` réévalués au cas par cas pour
  rester cohérents avec la nouvelle palette sans casser leur rôle sémantique.
  Remplacer `fontFamily.sans` (`Rubik`) par `Arial Narrow, Arial, sans-serif`.
- `input.css` : ajouter une classe utilitaire (ex. `.brat-title`) pour le flou
  léger + minuscules sur les titres, et une texture de grain en `background-image`
  sur `body` (dégradé répété très subtil, pas d'image externe).
- `output.css` : régénéré via `npm run build` (`npx tailwindcss -i ./input.css
  -o ./output.css --minify`), jamais édité à la main.
- `index.html` / `coach.html` : appliquer la classe `.brat-title` (ou équivalent)
  aux `h2.card-title`/`h3` de chaque carte, et le style minuscule aux boutons
  d'action — sans toucher au texte inséré dynamiquement par JS (noms, dates,
  notes).
- Pas de nouveau thème DaisyUI, pas de JS de bascule, pas de `localStorage` —
  remplacement direct des valeurs du thème unique existant.

## Vérification

Pas de suite de tests automatisée dans ce repo (confirmé). Vérification manuelle
après `npm run build`, en ouvrant `index.html` et `coach.html` dans un navigateur :
- Contraste et lisibilité des tableaux de présences et du calendrier arbitrage
  sur fond vert acide (cartes crème).
- Lisibilité des formulaires (ajout arbitre, notes, message important) et de
  l'écran mot de passe coach.
- Les alertes warning/error gardent des couleurs distinctes du vert acide
  dominant.
- Le flou/minuscule ne s'applique qu'aux titres et boutons statiques, jamais
  aux noms de joueuses, notes, ou autres données affichées dynamiquement.

## Hors scope

- Mécanisme de bascule entre thèmes (écarté explicitement — remplacement définitif).
- Activation automatique saisonnière (écartée).
- Toute nouvelle police externe chargée via réseau (on reste sur des polices système).
