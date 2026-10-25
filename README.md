# Prothèse Care 🦷

**Prototype web de gestion d'un service universitaire de prothèse dentaire.**

> ⚠️ **Prototype de démonstration uniquement.** Toutes les données sont fictives.
> Ce logiciel n'est pas un dispositif médical et ne doit pas être utilisé en situation clinique réelle.

## Ce que contient le prototype

| Écran | Contenu |
|---|---|
| **Tableau de bord** | Indicateurs du service, rendez-vous du jour, alertes (retards laboratoire, contrôles à planifier), activité de la semaine |
| **Patients** | Liste complète avec recherche instantanée (insensible aux accents), filtres par statut et par type de prothèse, avancement du traitement |
| **Fiche patient** | Dossier prothétique, schéma dentaire FDI, plan de traitement par étapes (statuts modifiables), historique clinique (notes ajoutables), rendez-vous et travaux du patient |
| **Rendez-vous** | Planning par jour (aujourd'hui / à venir / passés), création et modification des statuts |
| **Laboratoire externe** | Suivi des envois aux prothésistes externes, détection automatique des retards, changement de statut |
| **Poses & contrôles** | Poses programmées, contrôles post-insertion, contrôles à planifier, historique |

## Comment l'ouvrir

Aucune installation n'est nécessaire : l'application est composée de fichiers web classiques (HTML, CSS, JavaScript).

- **Option simple** : ouvrir le fichier `index.html` dans un navigateur (Chrome, Firefox, Edge…).
- **Option serveur local** : dans le dossier du projet, lancer `python3 -m http.server 8080`, puis ouvrir `http://localhost:8080`.

## Fonctionnement des données

- Les données de démonstration (12 patients fictifs, rendez-vous, travaux de laboratoire) sont intégrées au fichier `js/data.js`.
- Les dates sont générées **par rapport au jour d'ouverture** : les « rendez-vous du jour » et les alertes sont donc toujours d'actualité le jour de la présentation.
- Toute modification effectuée pendant la démonstration (statuts, nouveaux patients, rendez-vous…) est conservée **dans le navigateur** (stockage local). Le bouton **« ↺ Réinitialiser la démo »**, en bas de la barre latérale, permet de revenir aux données d'origine à tout moment.
- Aucune donnée n'est envoyée sur internet : pas de serveur, pas de compte, pas de connexion requise.

## Structure du projet

```
├── index.html      → structure des écrans et des formulaires
├── css/style.css   → design (bleu profond, blanc cassé, accent sauge)
├── js/data.js      → données fictives de démonstration
└── js/app.js       → logique de l'application (navigation, filtres, formulaires)
```

## Pistes d'évolution (hors prototype)

- Base de données partagée et comptes utilisateurs (étudiants / enseignants / secrétariat)
- Notifications de retard laboratoire et rappels de rendez-vous (SMS / e-mail)
- Impression des fiches de laboratoire et des ordonnances de prothèse
- Statistiques d'activité du service (actes par étudiant, délais moyens des laboratoires)
- Conformité hébergement de données de santé avant tout usage réel
