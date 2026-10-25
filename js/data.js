/* ============================================================
   PROTHÈSE CARE — Données de démonstration (100 % fictives)
   Les dates sont générées par rapport au jour d'ouverture
   pour que la démonstration soit toujours d'actualité.
   ============================================================ */

function dateRelative(jours) {
  const d = new Date();
  d.setDate(d.getDate() + jours);
  return d.toISOString().slice(0, 10); // AAAA-MM-JJ
}

const DONNEES_INITIALES = {

  etudiants: [
    { id: "e1", nom: "Amine Mansouri", niveau: "5ᵉ année" },
    { id: "e2", nom: "Meriem Mansouri", niveau: "6ᵉ année" },
    { id: "e3", nom: "Omar Cherif", niveau: "5ᵉ année" },
    { id: "e4", nom: "Lina Belkacem", niveau: "Résidente" },
    { id: "e5", nom: "Walid Cherif", niveau: "6ᵉ année" }
  ],

  enseignants: [
    { id: "p1", nom: "Pr Nadia Benali", fonction: "Chef de service" },
    { id: "p2", nom: "Dr Karim Boudiaf", fonction: "Maître-assistant" },
    { id: "p3", nom: "Dr Samira Haddad", fonction: "Maître-assistante" }
  ],

  laboratoires: [
    { id: "l1", nom: "Laboratoire Dentaire El-Amel", ville: "Alger" },
    { id: "l2", nom: "Prothèse Plus", ville: "Constantine" },
    { id: "l3", nom: "Atelier Céramique Moderne", ville: "Oran" }
  ],

  patients: [
    {
      id: "pat1", numero: "PC-2026-0147", nom: "Fatima Merbah", age: 62, sexe: "F",
      telephone: "0550 12 34 56", adresse: "Rue des Frères Bouadou, Alger",
      typeProthese: "Prothèse amovible complète bimaxillaire",
      dents: [], arcade: "Édenté total (haut et bas)",
      statut: "En attente laboratoire",
      etudiantId: "e2", enseignantId: "p2",
      dateAdmission: dateRelative(-38),
      motif: "Édentement total ancien, difficulté masticatoire importante.",
      antecedents: "Hypertension artérielle équilibrée. Extraction dentaire multiples il y a 3 ans.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen clinique et radiologique", statut: "Terminée", date: dateRelative(-38) },
        { etape: "Empreintes primaires (alginate)", statut: "Terminée", date: dateRelative(-31) },
        { etape: "Empreintes secondaires anatomo-fonctionnelles", statut: "Terminée", date: dateRelative(-17) },
        { etape: "Enregistrement de la relation intermaxillaire", statut: "Terminée", date: dateRelative(-9) },
        { etape: "Essayage du montage des dents", statut: "En cours", date: dateRelative(-2) },
        { etape: "Mise en moufle et polymérisation (laboratoire)", statut: "À venir", date: null },
        { etape: "Pose des prothèses et équilibration occlusale", statut: "À venir", date: null },
        { etape: "Contrôle post-insertion à 7 jours", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-38), titre: "Première consultation", texte: "Examen des crêtes : résorption modérée au maxillaire, crête mandibulaire favorable. Radiographie panoramique sans anomalie osseuse.", auteur: "Meriem Mansouri" },
        { date: dateRelative(-17), titre: "Empreintes secondaires", texte: "PPE individualisés, marginage à la pâte de Kerr, empreinte au polysulfure. Bonne extension des bords.", auteur: "Meriem Mansouri" },
        { date: dateRelative(-2), titre: "Essayage du montage", texte: "Teinte A2 retenue avec la patiente. Ligne du sourire harmonieuse, soutien labial correct. Validation par Dr Karim Boudiaf, envoi au laboratoire pour finition.", auteur: "Meriem Mansouri" }
      ]
    },
    {
      id: "pat2", numero: "PC-2026-0152", nom: "Mohamed Belkacem", age: 54, sexe: "M",
      telephone: "0661 98 77 10", adresse: "Cité 200 logements, Sétif",
      typeProthese: "Bridge céramo-métallique 3 éléments",
      dents: [24, 25, 26], arcade: "Maxillaire gauche",
      statut: "En cours de traitement",
      etudiantId: "e1", enseignantId: "p3",
      dateAdmission: dateRelative(-21),
      motif: "Édentement encastré (dent 25 absente), gêne esthétique et alimentaire.",
      antecedents: "Diabète de type 2 équilibré. Traitement endodontique sur 24 et 26 réalisé au service d'odontologie conservatrice.",
      allergies: "Pénicilline",
      plan: [
        { etape: "Examen clinique, étude des modèles", statut: "Terminée", date: dateRelative(-21) },
        { etape: "Préparation des dents piliers 24 et 26", statut: "Terminée", date: dateRelative(-7) },
        { etape: "Empreinte de précision (silicone)", statut: "Terminée", date: dateRelative(-7) },
        { etape: "Essayage de l'infrastructure métallique", statut: "En cours", date: dateRelative(0) },
        { etape: "Essayage biscuit et choix de teinte", statut: "À venir", date: null },
        { etape: "Scellement définitif du bridge", statut: "À venir", date: null },
        { etape: "Contrôle à 1 mois", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-21), titre: "Consultation initiale", texte: "Espace prothétique favorable, dents piliers saines après traitement canalaire. Plan validé : bridge céramo-métallique.", auteur: "Amine Mansouri" },
        { date: dateRelative(-7), titre: "Préparation et empreinte", texte: "Préparations périphériques avec congé, provisoires réalisées et scellées. Empreinte en deux temps envoyée au laboratoire.", auteur: "Amine Mansouri" }
      ]
    },
    {
      id: "pat3", numero: "PC-2026-0139", nom: "Aïcha Cherif", age: 47, sexe: "F",
      telephone: "0770 45 22 89", adresse: "Boulevard du 1ᵉʳ Novembre, Oran",
      typeProthese: "Prothèse amovible partielle (stellite)",
      dents: [35, 36, 37, 46, 47], arcade: "Mandibulaire, édentements postérieurs",
      statut: "En cours de traitement",
      etudiantId: "e3", enseignantId: "p2",
      dateAdmission: dateRelative(-26),
      motif: "Perte des molaires mandibulaires, mastication unilatérale.",
      antecedents: "Aucun antécédent notable. Hygiène bucco-dentaire correcte.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen clinique et analyse au paralléliseur", statut: "Terminée", date: dateRelative(-26) },
        { etape: "Aménagements pré-prothétiques (coronoplasties)", statut: "Terminée", date: dateRelative(-19) },
        { etape: "Empreinte de travail", statut: "Terminée", date: dateRelative(-12) },
        { etape: "Essayage du châssis métallique", statut: "En cours", date: dateRelative(1) },
        { etape: "Enregistrement occlusal et montage des dents", statut: "À venir", date: null },
        { etape: "Pose de la prothèse", statut: "À venir", date: null },
        { etape: "Contrôles d'adaptation", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-26), titre: "Consultation initiale", texte: "Classe I de Kennedy mandibulaire. Dents restantes en bon état parodontal. Tracé du châssis validé en séance d'enseignement.", auteur: "Omar Cherif" },
        { date: dateRelative(-12), titre: "Empreinte de travail", texte: "Empreinte à l'alginate de précision après aménagements. Modèle de travail coulé et transmis au laboratoire.", auteur: "Omar Cherif" }
      ]
    },
    {
      id: "pat4", numero: "PC-2026-0128", nom: "Mohamed Saïd Cherif", age: 68, sexe: "M",
      telephone: "0555 73 40 21", adresse: "Rue Larbi Ben M'hidi n, Algérie",
      typeProthese: "Prothèse amovible complète maxillaire",
      dents: [], arcade: "Édenté total maxillaire",
      statut: "Pose effectuée – en contrôle",
      etudiantId: "e4", enseignantId: "p1",
      dateAdmission: dateRelative(-74),
      motif: "Renouvellement d'une prothèse complète ancienne instable (12 ans).",
      antecedents: "Ancien fumeur (arrêt il y a 5 ans). Prothèse portée jour et nuit auparavant.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen clinique", statut: "Terminée", date: dateRelative(-74) },
        { etape: "Empreintes primaires et secondaires", statut: "Terminée", date: dateRelative(-60) },
        { etape: "Enregistrement intermaxillaire et essayage", statut: "Terminée", date: dateRelative(-45) },
        { etape: "Pose de la prothèse", statut: "Terminée", date: dateRelative(-21) },
        { etape: "Contrôle à 7 jours", statut: "Terminée", date: dateRelative(-14) },
        { etape: "Contrôle à 1 mois", statut: "En cours", date: dateRelative(9) },
        { etape: "Contrôle à 6 mois", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-21), titre: "Pose de la prothèse", texte: "Insertion aisée, rétention satisfaisante, DVO respectée. Conseils d'hygiène et d'alimentation remis au patient.", auteur: "Lina Belkacem" },
        { date: dateRelative(-14), titre: "Contrôle J+7", texte: "Petite ulcération en regard du frein latéral droit : retouche du bord réalisée. Patient satisfait de l'esthétique.", auteur: "Lina Belkacem" }
      ]
    },
    {
      id: "pat5", numero: "PC-2026-0161", nom: "Nadia Mansouri", age: 39, sexe: "F",
      telephone: "0662 14 08 73", adresse: "Hai El Badr, Béjaïa",
      typeProthese: "Couronne unitaire céramique",
      dents: [21], arcade: "Maxillaire antérieur",
      statut: "En cours de traitement",
      etudiantId: "e5", enseignantId: "p3",
      dateAdmission: dateRelative(-12),
      motif: "Fracture coronaire de l'incisive centrale supérieure gauche suite à un traumatisme.",
      antecedents: "Reconstitution par tenon fibré réalisée. Dent dévitalisée, asymptomatique.",
      allergies: "Latex",
      plan: [
        { etape: "Examen clinique et radiographique", statut: "Terminée", date: dateRelative(-12) },
        { etape: "Préparation périphérique et empreinte optique", statut: "En cours", date: dateRelative(2) },
        { etape: "Essayage et validation esthétique", statut: "À venir", date: null },
        { etape: "Collage définitif de la couronne", statut: "À venir", date: null },
        { etape: "Contrôle à 1 mois", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-12), titre: "Consultation initiale", texte: "Racine saine, tenue parodontale bonne. Choix d'une couronne tout-céramique pour le rendu esthétique du secteur antérieur.", auteur: "Walid Cherif" }
      ]
    },
    {
      id: "pat6", numero: "PC-2026-0115", nom: "Mouna Boudiaf", age: 71, sexe: "F",
      telephone: "0549 66 31 04", adresse: "Cité universitaire, Tizi Ouzou",
      typeProthese: "Prothèse amovible complète bimaxillaire",
      dents: [], arcade: "Édenté total (haut et bas)",
      statut: "En attente laboratoire",
      etudiantId: "e1", enseignantId: "p1",
      dateAdmission: dateRelative(-49),
      motif: "Première prothèse complète après extractions multiples récentes.",
      antecedents: "Cicatrisation des sites d'extraction complète à 6 semaines. Arthrose (dextérité réduite).",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen clinique", statut: "Terminée", date: dateRelative(-49) },
        { etape: "Empreintes primaires", statut: "Terminée", date: dateRelative(-42) },
        { etape: "Empreintes secondaires", statut: "Terminée", date: dateRelative(-30) },
        { etape: "Enregistrement intermaxillaire", statut: "Terminée", date: dateRelative(-22) },
        { etape: "Essayage du montage", statut: "Terminée", date: dateRelative(-15) },
        { etape: "Polymérisation au laboratoire", statut: "En cours", date: dateRelative(-13) },
        { etape: "Pose des prothèses", statut: "À venir", date: null },
        { etape: "Contrôles post-insertion", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-15), titre: "Essayage validé", texte: "Montage équilibré, patiente satisfaite de la teinte B1. Envoi au laboratoire le jour même.", auteur: "Amine Mansouri" },
        { date: dateRelative(-3), titre: "Relance laboratoire", texte: "Retour initialement prévu dépassé. Appel au laboratoire : livraison confirmée sous 48 h.", auteur: "Amine Mansouri" }
      ]
    },
    {
      id: "pat7", numero: "PC-2026-0102", nom: "Ali Gherbi", age: 57, sexe: "M",
      telephone: "0775 92 48 60", adresse: "Zone industrielle, Rouiba",
      typeProthese: "Prothèse sur 2 implants mandibulaires",
      dents: [33, 43], arcade: "Mandibulaire (overdenture)",
      statut: "En cours de traitement",
      etudiantId: "e4", enseignantId: "p1",
      dateAdmission: dateRelative(-95),
      motif: "Prothèse mandibulaire instable malgré plusieurs rebasages. Solution implantaire retenue.",
      antecedents: "Pose de 2 implants en 33 et 43 il y a 4 mois (service d'implantologie). Ostéointégration confirmée.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Bilan implantaire et empreinte", statut: "Terminée", date: dateRelative(-95) },
        { etape: "Empreinte des implants (transferts)", statut: "Terminée", date: dateRelative(-28) },
        { etape: "Confection de la prothèse avec attachements", statut: "En cours", date: dateRelative(-10) },
        { etape: "Pose et activation des attachements", statut: "À venir", date: null },
        { etape: "Contrôle à 1 semaine puis 1 mois", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-28), titre: "Empreinte implantaire", texte: "Technique pick-up, contrôle radiographique de l'assise des transferts correct.", auteur: "Lina Belkacem" }
      ]
    },
    {
      id: "pat8", numero: "PC-2026-0168", nom: "Sara Mansouri", age: 33, sexe: "F",
      telephone: "0668 27 55 19", adresse: "Boulevard Mohamed V, Alger",
      typeProthese: "Prothèse amovible partielle provisoire",
      dents: [11, 12], arcade: "Maxillaire antérieur",
      statut: "En cours de traitement",
      etudiantId: "e3", enseignantId: "p3",
      dateAdmission: dateRelative(-5),
      motif: "Avulsion des incisives 11 et 12, besoin esthétique urgent en attendant le traitement définitif.",
      antecedents: "En bonne santé générale.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen clinique et empreinte", statut: "Terminée", date: dateRelative(-5) },
        { etape: "Confection de la prothèse provisoire", statut: "En cours", date: dateRelative(-4) },
        { etape: "Pose de la prothèse provisoire", statut: "À venir", date: null },
        { etape: "Bilan pour solution définitive (implants)", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-5), titre: "Consultation urgente", texte: "Empreinte réalisée le jour même, montage express demandé au laboratoire pour raison professionnelle.", auteur: "Omar Cherif" }
      ]
    },
    {
      id: "pat9", numero: "PC-2026-0091", nom: "Omar Mansouri", age: 64, sexe: "M",
      telephone: "0557 38 14 92", adresse: "Rue de la Liberté, Blida",
      typeProthese: "Prothèse amovible partielle (stellite)",
      dents: [14, 15, 16, 17], arcade: "Maxillaire droit",
      statut: "Pose effectuée – en contrôle",
      etudiantId: "e2", enseignantId: "p2",
      dateAdmission: dateRelative(-88),
      motif: "Édentement terminal maxillaire droit.",
      antecedents: "Hypertension équilibrée.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen et empreintes", statut: "Terminée", date: dateRelative(-88) },
        { etape: "Essayage du châssis", statut: "Terminée", date: dateRelative(-55) },
        { etape: "Pose de la prothèse", statut: "Terminée", date: dateRelative(-32) },
        { etape: "Contrôle à 1 mois", statut: "Terminée", date: dateRelative(-2) },
        { etape: "Contrôle à 6 mois", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-32), titre: "Pose", texte: "Insertion et rétention satisfaisantes, occlusion équilibrée en latéralité.", auteur: "Meriem Mansouri" },
        { date: dateRelative(-2), titre: "Contrôle 1 mois", texte: "Bonne tolérance, légère activation du crochet sur 13. Patient satisfait.", auteur: "Meriem Mansouri" }
      ]
    },
    {
      id: "pat10", numero: "PC-2026-0173", nom: "Leïla Boudiaf", age: 45, sexe: "F",
      telephone: "0791 03 67 44", adresse: "Cité AADL, Ouled Fayet",
      typeProthese: "Bridge céramo-métallique 4 éléments",
      dents: [32, 33, 34, 35], arcade: "Mandibulaire gauche",
      statut: "En cours de traitement",
      etudiantId: "e5", enseignantId: "p2",
      dateAdmission: dateRelative(-14),
      motif: "Édentement intercalé 34, demande de solution fixe.",
      antecedents: "Aucun antécédent notable.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen clinique et montage diagnostique", statut: "Terminée", date: dateRelative(-14) },
        { etape: "Préparations des piliers", statut: "En cours", date: dateRelative(3) },
        { etape: "Empreinte et envoi au laboratoire", statut: "À venir", date: null },
        { etape: "Essayages", statut: "À venir", date: null },
        { etape: "Scellement définitif", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-14), titre: "Consultation initiale", texte: "Évaluation réalisée : bridge de 4 éléments proposé compte tenu de l'état des dents adjacentes déjà restaurées.", auteur: "Walid Cherif" }
      ]
    },
    {
      id: "pat11", numero: "PC-2026-0076", nom: "Rachid Cherif", age: 59, sexe: "M",
      telephone: "0560 84 29 37", adresse: "Centre-ville, Tipaza",
      typeProthese: "Prothèse amovible complète mandibulaire",
      dents: [], arcade: "Édenté total mandibulaire",
      statut: "Traitement terminé",
      etudiantId: "e1", enseignantId: "p1",
      dateAdmission: dateRelative(-150),
      motif: "Édentement mandibulaire total ancien.",
      antecedents: "Aucun antécédent notable.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen et empreintes", statut: "Terminée", date: dateRelative(-150) },
        { etape: "Enregistrement et essayage", statut: "Terminée", date: dateRelative(-120) },
        { etape: "Pose de la prothèse", statut: "Terminée", date: dateRelative(-97) },
        { etape: "Contrôles J+7, 1 mois, 3 mois", statut: "Terminée", date: dateRelative(-10) }
      ],
      historique: [
        { date: dateRelative(-10), titre: "Contrôle 3 mois – fin de traitement", texte: "Adaptation excellente, fonction masticatoire restaurée. Dossier clôturé, contrôle annuel conseillé.", auteur: "Amine Mansouri" }
      ]
    },
    {
      id: "pat12", numero: "PC-2026-0179", nom: "Meriem Belkacem", age: 51, sexe: "F",
      telephone: "0664 51 90 82", adresse: "Hai Garidi, Kouba – Alger",
      typeProthese: "Couronne unitaire céramo-métallique",
      dents: [46], arcade: "Mandibulaire droit",
      statut: "En attente laboratoire",
      etudiantId: "e3", enseignantId: "p3",
      dateAdmission: dateRelative(-19),
      motif: "Première molaire mandibulaire délabrée après traitement endodontique.",
      antecedents: "Inlay-core réalisé au service.",
      allergies: "Aucune connue",
      plan: [
        { etape: "Examen clinique", statut: "Terminée", date: dateRelative(-19) },
        { etape: "Préparation et empreinte", statut: "Terminée", date: dateRelative(-8) },
        { etape: "maquette en cire au laboratoire", statut: "En cours", date: dateRelative(-8) },
        { etape: "Essayage infrastructure puis biscuit", statut: "À venir", date: null },
        { etape: "Scellement définitif", statut: "À venir", date: null }
      ],
      historique: [
        { date: dateRelative(-8), titre: "Empreinte envoyée", texte: "Provisoire en place, occlusion réglée. Fiche de laboratoire complétée (teinte A3).", auteur: "Omar Cherif" }
      ]
    }
  ],

  rendezvous: [
    { id: "rdv1", patientId: "pat2", date: dateRelative(0), heure: "08:30", duree: 60, motif: "Essayage infrastructure métallique", etudiantId: "e1", box: "Box 3", statut: "En cours" },
    { id: "rdv2", patientId: "pat1", date: dateRelative(0), heure: "09:30", duree: 45, motif: "Vérification avant mise en moufle", etudiantId: "e2", box: "Box 1", statut: "Confirmé" },
    { id: "rdv3", patientId: "pat8", date: dateRelative(0), heure: "10:30", duree: 30, motif: "Pose prothèse provisoire", etudiantId: "e3", box: "Box 2", statut: "Confirmé" },
    { id: "rdv4", patientId: "pat4", date: dateRelative(0), heure: "11:15", duree: 30, motif: "Contrôle intermédiaire (gêne signalée)", etudiantId: "e4", box: "Box 4", statut: "En attente" },
    { id: "rdv5", patientId: "pat12", date: dateRelative(0), heure: "13:30", duree: 30, motif: "Contrôle de la provisoire", etudiantId: "e3", box: "Box 2", statut: "Confirmé" },
    { id: "rdv6", patientId: "pat3", date: dateRelative(1), heure: "08:30", duree: 45, motif: "Essayage du châssis métallique", etudiantId: "e3", box: "Box 2", statut: "Confirmé" },
    { id: "rdv7", patientId: "pat5", date: dateRelative(2), heure: "09:00", duree: 75, motif: "Préparation et empreinte optique 21", etudiantId: "e5", box: "Box 5", statut: "Confirmé" },
    { id: "rdv8", patientId: "pat10", date: dateRelative(3), heure: "10:00", duree: 90, motif: "Préparations des piliers du bridge", etudiantId: "e5", box: "Box 5", statut: "En attente" },
    { id: "rdv9", patientId: "pat6", date: dateRelative(4), heure: "08:30", duree: 60, motif: "Pose des prothèses complètes", etudiantId: "e1", box: "Box 3", statut: "En attente" },
    { id: "rdv10", patientId: "pat7", date: dateRelative(5), heure: "09:30", duree: 60, motif: "Essayage overdenture sur implants", etudiantId: "e4", box: "Box 4", statut: "Confirmé" },
    { id: "rdv11", patientId: "pat9", date: dateRelative(-2), heure: "10:00", duree: 30, motif: "Contrôle 1 mois PAP", etudiantId: "e2", box: "Box 1", statut: "Terminé" },
    { id: "rdv12", patientId: "pat1", date: dateRelative(-2), heure: "08:30", duree: 45, motif: "Essayage du montage des dents", etudiantId: "e2", box: "Box 1", statut: "Terminé" },
    { id: "rdv13", patientId: "pat2", date: dateRelative(-7), heure: "09:00", duree: 90, motif: "Préparation des piliers et empreinte", etudiantId: "e1", box: "Box 3", statut: "Terminé" },
    { id: "rdv14", patientId: "pat11", date: dateRelative(-10), heure: "11:00", duree: 30, motif: "Contrôle final 3 mois", etudiantId: "e1", box: "Box 3", statut: "Terminé" },
    { id: "rdv15", patientId: "pat4", date: dateRelative(9), heure: "10:30", duree: 30, motif: "Contrôle 1 mois PAC maxillaire", etudiantId: "e4", box: "Box 4", statut: "Confirmé" }
  ],

  travauxLabo: [
    { id: "lab1", reference: "LAB-1042", patientId: "pat6", laboratoireId: "l1", travail: "Mise en moufle + polymérisation PAC bimaxillaire", dateEnvoi: dateRelative(-13), dateRetourPrevue: dateRelative(-6), dateRetour: null, statut: "En cours de fabrication", teinte: "B1", notes: "Retard signalé par le laboratoire (rupture de résine)." },
    { id: "lab2", reference: "LAB-1048", patientId: "pat1", laboratoireId: "l1", travail: "Montage des dents sur cire (essayage)", dateEnvoi: dateRelative(-9), dateRetourPrevue: dateRelative(-3), dateRetour: dateRelative(-3), statut: "Retourné au service", teinte: "A2", notes: "Essayage validé en bouche." },
    { id: "lab3", reference: "LAB-1051", patientId: "pat2", laboratoireId: "l3", travail: "Infrastructure métallique bridge 24-26", dateEnvoi: dateRelative(-7), dateRetourPrevue: dateRelative(-1), dateRetour: dateRelative(-1), statut: "Retourné au service", teinte: "—", notes: "Essayage prévu aujourd'hui." },
    { id: "lab4", reference: "LAB-1055", patientId: "pat3", laboratoireId: "l2", travail: "Châssis métallique PAP mandibulaire (chrome-cobalt)", dateEnvoi: dateRelative(-12), dateRetourPrevue: dateRelative(0), dateRetour: null, statut: "En cours de fabrication", teinte: "—", notes: "Retour attendu ce jour." },
    { id: "lab5", reference: "LAB-1059", patientId: "pat12", laboratoireId: "l3", travail: "Couronne céramo-métallique 46", dateEnvoi: dateRelative(-8), dateRetourPrevue: dateRelative(2), dateRetour: null, statut: "En cours de fabrication", teinte: "A3", notes: "" },
    { id: "lab6", reference: "LAB-1063", patientId: "pat8", laboratoireId: "l1", travail: "Prothèse provisoire 11-12 (express)", dateEnvoi: dateRelative(-4), dateRetourPrevue: dateRelative(0), dateRetour: dateRelative(0), statut: "Retourné au service", teinte: "A1", notes: "Pose prévue aujourd'hui." },
    { id: "lab7", reference: "LAB-1067", patientId: "pat7", laboratoireId: "l2", travail: "Overdenture mandibulaire avec attachements axiaux", dateEnvoi: dateRelative(-10), dateRetourPrevue: dateRelative(4), dateRetour: null, statut: "Envoyé au laboratoire", teinte: "A3.5", notes: "Attachements fournis par le service." },
    { id: "lab8", reference: "LAB-1035", patientId: "pat4", laboratoireId: "l1", travail: "PAC maxillaire complète (finition)", dateEnvoi: dateRelative(-40), dateRetourPrevue: dateRelative(-25), dateRetour: dateRelative(-24), statut: "Travaux terminés", teinte: "A2", notes: "Prothèse posée le " + dateRelative(-21) + "." },
    { id: "lab9", reference: "LAB-1071", patientId: "pat1", laboratoireId: "l1", travail: "Mise en moufle PAC bimaxillaire (après validation)", dateEnvoi: dateRelative(-1), dateRetourPrevue: dateRelative(6), dateRetour: null, statut: "Envoyé au laboratoire", teinte: "A2", notes: "Suite à l'essayage validé." }
  ],

  suivis: [
    { id: "sui1", patientId: "pat4", type: "Pose", date: dateRelative(-21), statut: "Réalisée", observations: "Insertion aisée, rétention satisfaisante." },
    { id: "sui2", patientId: "pat4", type: "Contrôle J+7", date: dateRelative(-14), statut: "Réalisé", observations: "Retouche du bord (ulcération frein latéral droit)." },
    { id: "sui3", patientId: "pat4", type: "Contrôle 1 mois", date: dateRelative(9), statut: "Programmé", observations: "Vérifier la stabilité et l'occlusion." },
    { id: "sui4", patientId: "pat9", type: "Pose", date: dateRelative(-32), statut: "Réalisée", observations: "Occlusion équilibrée en latéralité." },
    { id: "sui5", patientId: "pat9", type: "Contrôle 1 mois", date: dateRelative(-2), statut: "Réalisé", observations: "Activation du crochet sur 13." },
    { id: "sui6", patientId: "pat9", type: "Contrôle 6 mois", date: null, statut: "À planifier", observations: "À programmer lors du prochain passage du patient." },
    { id: "sui7", patientId: "pat11", type: "Pose", date: dateRelative(-97), statut: "Réalisée", observations: "Bonne adaptation d'emblée." },
    { id: "sui8", patientId: "pat11", type: "Contrôle 3 mois", date: dateRelative(-10), statut: "Réalisé", observations: "Fin de traitement, dossier clôturé." },
    { id: "sui9", patientId: "pat6", type: "Pose", date: dateRelative(4), statut: "Programmée", observations: "Sous réserve du retour du laboratoire (en retard)." },
    { id: "sui10", patientId: "pat8", type: "Pose (provisoire)", date: dateRelative(0), statut: "Programmée", observations: "Prothèse reçue du laboratoire ce matin." }
  ]
};
