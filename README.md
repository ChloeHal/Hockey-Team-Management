# Pantheres - Gestion d'equipe de hockey

Application web de gestion pour une equipe de hockey feminin (les Pantheres). Elle permet de gerer les joueuses, suivre les presences aux entrainements, generer des feuilles de match et organiser l'arbitrage.

## Fonctionnalites

- **Gestion des joueuses** : ajout / suppression avec nom et numero de maillot
- **Suivi des presences** : enregistrement des presences par entrainement avec tableau recapitulatif
- **Feuille de match** : generation automatique basee sur les presences (3 puis 5 derniers entrainements), max 16 joueuses
- **Calendrier des arbitres** : attribution de 2 arbitres par date de match
- **Messages importants** : publication d'annonces avec niveaux (warning, info, success, erreur)
- **Notes** : bloc-notes partage pour l'equipe
- **Calendrier Google** integre

## Stack technique

- **Frontend** : HTML, JavaScript vanilla, [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Backend** : PHP (API REST)
- **Base de donnees** : MySQL
- **Hebergement** : Hostinger

## Installation

### Pre-requis

- PHP 7.4+
- MySQL / MariaDB
- Node.js (pour compiler le CSS)

### Mise en place

1. Cloner le depot :
   ```bash
   git clone https://github.com/chlohal/Hockey-Team-Management.git
   cd Hockey-Team-Management
   ```

2. Installer les dependances Node :
   ```bash
   npm install
   ```

3. Creer la base de donnees MySQL et executer le script de setup :
   ```bash
   mysql -u root -p < setup.sql
   ```

4. Configurer la connexion a la base de donnees dans `config.php` :
   ```php
   $db_host = 'localhost';
   $db_name = 'votre_base';
   $db_user = 'votre_user';
   $db_pass = 'votre_mot_de_passe';
   ```

5. Compiler le CSS :
   ```bash
   npm run build
   ```

### Developpement

Lancer le watcher Tailwind pour recompiler le CSS automatiquement :
```bash
npm run dev
```

## Structure du projet

```
├── index.html          # Interface principale (SPA)
├── api.php             # API REST (PHP)
├── config.php          # Configuration base de donnees
├── setup.sql           # Schema de la base de donnees
├── input.css           # CSS source (Tailwind)
├── output.css          # CSS compile
├── tailwind.config.js  # Configuration Tailwind + theme DaisyUI
├── postcss.config.js   # Configuration PostCSS
└── package.json        # Dependances Node
```

## API

Toutes les routes passent par `api.php?action=<action>` :

| Action | Methode | Description |
|---|---|---|
| `get_players` | GET | Liste des joueuses |
| `add_player` | POST | Ajouter une joueuse |
| `delete_player` | POST | Supprimer une joueuse |
| `get_trainings` | GET | Liste des entrainements avec presences |
| `save_training` | POST | Enregistrer un entrainement |
| `delete_training` | POST | Supprimer un entrainement |
| `get_important_msg` | GET | Messages importants |
| `save_important_msg` | POST | Publier un message |
| `delete_important_msg` | POST | Supprimer un message |
| `get_notes` | GET | Liste des notes |
| `add_note` | POST | Ajouter une note |
| `delete_note` | POST | Supprimer une note |
| `get_referees` | GET | Liste des arbitres |
| `add_referee` | POST | Ajouter un arbitre |
| `delete_referee` | POST | Supprimer un arbitre |

## Regles de selection (feuille de match)

1. Classement par presences sur les **3 derniers entrainements**
2. En cas d'egalite : presences sur les **5 derniers entrainements**
3. En cas d'egalite : ordre alphabetique
4. Maximum **16 joueuses** selectionnees
