# Prothèse Care

**Prototype web de gestion d'un service universitaire de prothèse dentaire.**

> ⚠️ **Prototype de démonstration uniquement.** Toutes les données sont fictives.
> Ce logiciel n'est pas un dispositif médical et ne doit pas être utilisé en situation clinique réelle.

🔗 **Version en ligne :** https://nanitanana022-bit.github.io/proth-se-care/

## Ce que contient le prototype

| Écran | Contenu |
|---|---|
| **Tableau de bord** | Les rendez-vous du jour (heure, patient, motif, médecin responsable), calculés à partir de la date du jour |
| **Patients** | Liste des dossiers avec recherche par nom (insensible aux accents et à la casse), statut du dossier, prochain rendez-vous, médecin responsable |
| **Dossier du patient** | Informations du dossier (téléphone, adresse, motif de consultation, antécédents, traitement envisagé, médecin responsable), statut modifiable, création de rendez-vous, plan de traitement en 7 étapes |

### Plan de traitement (7 étapes)

Chaque dossier suit les sept étapes suivantes, chacune pouvant être marquée **En cours** ou **Terminé** :

1. Examen clinique et empreinte préliminaire
2. Empreinte secondaire
3. Prise d'occlusion et mise en articulateur
4. Montage des dents et l'essayage des maquettes en bouche
5. Polymérisation de la prothèse
6. Livraison de la prothèse
7. Equilibration et contrôles périodiques

### Ajout d'un patient

Le formulaire « Ajouter un patient » permet de saisir librement le type de prothèse envisagée, le motif de consultation, les antécédents et le médecin responsable. Ces informations se retrouvent dans le dossier du patient.

### Ajout d'un rendez-vous

Depuis le dossier d'un patient, le bouton « + Rendez-vous » ouvre un formulaire à trois champs : nom du patient (pré-rempli), date et heure, motif. Le rendez-vous apparaît dans les « Rendez-vous du jour » lorsque sa date correspond au jour courant.

## Comment l'ouvrir

Aucune installation n'est nécessaire : l'application est composée de fichiers web classiques (HTML, CSS, JavaScript).

- **En ligne** : https://nanitanana022-bit.github.io/proth-se-care/
- **En local** : ouvrir le fichier `index.html` dans un navigateur, ou lancer `python3 -m http.server 8080` dans le dossier du projet puis ouvrir `http://localhost:8080`.

## Fonctionnement des données

- Les données de démonstration (12 patients fictifs et leurs rendez-vous) sont intégrées au fichier `js/data.js`.
- Les dates sont générées **par rapport au jour d'ouverture** : les « rendez-vous du jour » sont donc toujours d'actualité le jour de la présentation.
- Toute modification effectuée pendant la démonstration (nouveaux patients, rendez-vous, statuts…) est conservée **dans le navigateur** (stockage local, clé `prothese-care-demo-v2`). Les données enregistrées avec l'ancienne version du prototype (`v1`) sont **migrées automatiquement** vers le nouveau format à l'ouverture.
- Le bouton **« ↺ Réinitialiser la démo »**, en bas de la barre latérale, permet de revenir aux données d'origine à tout moment.
- Aucune donnée n'est envoyée sur internet : pas de serveur, pas de compte, pas de connexion requise. Chaque visiteur dispose de sa propre copie des données dans son navigateur.

## Structure du projet

```
├── index.html      → structure des écrans et des formulaires
├── css/style.css   → design (bleu profond, blanc cassé, accent sauge)
├── js/data.js      → données fictives de démonstration et étapes du traitement
└── js/app.js       → logique de l'application (navigation, recherche, formulaires, persistance, migration)
```

## Publication

Le site est publié avec **GitHub Pages** depuis la branche `arena/7431ea3d-proth-se-care` (Settings → Pages → « Deploy from a branch »). Chaque envoi sur cette branche met automatiquement à jour la version en ligne, en quelques minutes.
