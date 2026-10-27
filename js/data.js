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

/* Les sept étapes du traitement (libellés officiels du service) */
const ETAPES_TRAITEMENT = [
  "Examen clinique et empreinte préliminaire",
  "Empreinte secondaire",
  "Prise d'occlusion et mise en articulateur",
  "Montage des dents et l'essayage des maquettes en bouche",
  "Polymérisation de la prothèse",
  "Livraison de la prothèse",
  "Equilibration et contrôles périodiques"
];

/* Construit un plan de traitement : les `nbTerminees` premières étapes
   sont marquées « Terminé », les suivantes « En cours ». */
function planifier(nbTerminees) {
  return ETAPES_TRAITEMENT.map((etape, i) => ({
    etape: etape,
    statut: i < nbTerminees ? "Terminé" : "En cours"
  }));
}

const DONNEES_INITIALES = {

  patients: [
    {
      id: "pat1", numero: "PC-2026-0147", nom: "Fatima Merbah", age: 62, sexe: "F",
      telephone: "0550 12 34 56", adresse: "Rue des Frères Bouadou, Alger",
      traitementEnvisage: "Prothèse amovible complète bimaxillaire",
      statut: "En attente laboratoire",
      medecinResponsable: "Dr Karim Boudiaf",
      dateAdmission: dateRelative(-38),
      motif: "Édentement total ancien, difficulté masticatoire importante.",
      antecedents: "Hypertension artérielle équilibrée. Extractions dentaires multiples il y a 3 ans.",
      plan: planifier(3)
    },
    {
      id: "pat2", numero: "PC-2026-0152", nom: "Mohamed Belkacem", age: 54, sexe: "M",
      telephone: "0661 98 77 10", adresse: "Cité 200 logements, Sétif",
      traitementEnvisage: "Bridge céramo-métallique 3 éléments (24-26)",
      statut: "En cours de traitement",
      medecinResponsable: "Dr Samira Haddad",
      dateAdmission: dateRelative(-21),
      motif: "Édentement encastré (dent 25 absente), gêne esthétique et alimentaire.",
      antecedents: "Diabète de type 2 équilibré. Traitement endodontique sur 24 et 26. Allergie à la pénicilline.",
      plan: planifier(3)
    },
    {
      id: "pat3", numero: "PC-2026-0139", nom: "Aïcha Cherif", age: 47, sexe: "F",
      telephone: "0770 45 22 89", adresse: "Boulevard du 1ᵉʳ Novembre, Oran",
      traitementEnvisage: "Prothèse amovible partielle mandibulaire (stellite)",
      statut: "En cours de traitement",
      medecinResponsable: "Dr Karim Boudiaf",
      dateAdmission: dateRelative(-26),
      motif: "Perte des molaires mandibulaires, mastication unilatérale.",
      antecedents: "Aucun antécédent notable. Hygiène bucco-dentaire correcte.",
      plan: planifier(3)
    },
    {
      id: "pat4", numero: "PC-2026-0128", nom: "Mohamed Saïd Cherif", age: 68, sexe: "M",
      telephone: "0555 73 40 21", adresse: "Rue Larbi Ben M'hidi n, Algérie",
      traitementEnvisage: "Prothèse amovible complète maxillaire (renouvellement)",
      statut: "Pose effectuée – en contrôle",
      medecinResponsable: "Dr Lina Belkacem",
      dateAdmission: dateRelative(-74),
      motif: "Renouvellement d'une prothèse complète ancienne instable (12 ans).",
      antecedents: "Ancien fumeur (arrêt il y a 5 ans). Prothèse portée jour et nuit auparavant.",
      plan: planifier(6)
    },
    {
      id: "pat5", numero: "PC-2026-0161", nom: "Nadia Mansouri", age: 39, sexe: "F",
      telephone: "0662 14 08 73", adresse: "Hai El Badr, Béjaïa",
      traitementEnvisage: "Couronne unitaire céramique sur la dent 21",
      statut: "En cours de traitement",
      medecinResponsable: "Dr Samira Haddad",
      dateAdmission: dateRelative(-12),
      motif: "Fracture coronaire de l'incisive centrale supérieure gauche suite à un traumatisme.",
      antecedents: "Reconstitution par tenon fibré réalisée. Dent dévitalisée, asymptomatique. Allergie au latex.",
      plan: planifier(1)
    },
    {
      id: "pat6", numero: "PC-2026-0115", nom: "Mouna Boudiaf", age: 71, sexe: "F",
      telephone: "0549 66 31 04", adresse: "Cité universitaire, Tizi Ouzou",
      traitementEnvisage: "Prothèse amovible complète bimaxillaire",
      statut: "En attente laboratoire",
      medecinResponsable: "Pr Nadia Benali",
      dateAdmission: dateRelative(-49),
      motif: "Première prothèse complète après extractions multiples récentes.",
      antecedents: "Cicatrisation des sites d'extraction complète à 6 semaines. Arthrose (dextérité réduite).",
      plan: planifier(4)
    },
    {
      id: "pat7", numero: "PC-2026-0102", nom: "Ali Gherbi", age: 57, sexe: "M",
      telephone: "0775 92 48 60", adresse: "Zone industrielle, Rouiba",
      traitementEnvisage: "Prothèse amovible mandibulaire stabilisée par 2 implants (33 et 43)",
      statut: "En cours de traitement",
      medecinResponsable: "Dr Lina Belkacem",
      dateAdmission: dateRelative(-95),
      motif: "Prothèse mandibulaire instable malgré plusieurs rebasages. Solution implantaire retenue.",
      antecedents: "Pose de 2 implants en 33 et 43 il y a 4 mois (service d'implantologie). Ostéointégration confirmée.",
      plan: planifier(3)
    },
    {
      id: "pat8", numero: "PC-2026-0168", nom: "Sara Mansouri", age: 33, sexe: "F",
      telephone: "0668 27 55 19", adresse: "Boulevard Mohamed V, Alger",
      traitementEnvisage: "Prothèse amovible partielle provisoire 11-12",
      statut: "En cours de traitement",
      medecinResponsable: "Dr Samira Haddad",
      dateAdmission: dateRelative(-5),
      motif: "Avulsion des incisives 11 et 12, besoin esthétique urgent en attendant le traitement définitif.",
      antecedents: "En bonne santé générale.",
      plan: planifier(1)
    },
    {
      id: "pat9", numero: "PC-2026-0091", nom: "Omar Mansouri", age: 64, sexe: "M",
      telephone: "0557 38 14 92", adresse: "Rue de la Liberté, Blida",
      traitementEnvisage: "Prothèse amovible partielle maxillaire droite (stellite)",
      statut: "Pose effectuée – en contrôle",
      medecinResponsable: "Dr Karim Boudiaf",
      dateAdmission: dateRelative(-88),
      motif: "Édentement terminal maxillaire droit.",
      antecedents: "Hypertension artérielle équilibrée.",
      plan: planifier(6)
    },
    {
      id: "pat10", numero: "PC-2026-0173", nom: "Leïla Boudiaf", age: 45, sexe: "F",
      telephone: "0791 03 67 44", adresse: "Cité AADL, Ouled Fayet",
      traitementEnvisage: "Bridge céramo-métallique 4 éléments (32-35)",
      statut: "En cours de traitement",
      medecinResponsable: "Dr Karim Boudiaf",
      dateAdmission: dateRelative(-14),
      motif: "Édentement intercalé 34, demande de solution fixe.",
      antecedents: "Aucun antécédent notable.",
      plan: planifier(1)
    },
    {
      id: "pat11", numero: "PC-2026-0076", nom: "Rachid Cherif", age: 59, sexe: "M",
      telephone: "0560 84 29 37", adresse: "Centre-ville, Tipaza",
      traitementEnvisage: "Prothèse amovible complète mandibulaire",
      statut: "Traitement terminé",
      medecinResponsable: "Pr Nadia Benali",
      dateAdmission: dateRelative(-150),
      motif: "Édentement mandibulaire total ancien.",
      antecedents: "Aucun antécédent notable.",
      plan: planifier(7)
    },
    {
      id: "pat12", numero: "PC-2026-0179", nom: "Meriem Belkacem", age: 51, sexe: "F",
      telephone: "0664 51 90 82", adresse: "Hai Garidi, Kouba – Alger",
      traitementEnvisage: "Couronne unitaire céramo-métallique sur la dent 46",
      statut: "En attente laboratoire",
      medecinResponsable: "Dr Samira Haddad",
      dateAdmission: dateRelative(-19),
      motif: "Première molaire mandibulaire délabrée après traitement endodontique.",
      antecedents: "Inlay-core réalisé au service.",
      plan: planifier(2)
    }
  ],

  rendezvous: [
    { id: "rdv1", patientId: "pat2", date: dateRelative(0), heure: "08:30", motif: "Essayage de l'infrastructure du bridge" },
    { id: "rdv2", patientId: "pat1", date: dateRelative(0), heure: "09:30", motif: "Essayage des maquettes en bouche" },
    { id: "rdv3", patientId: "pat8", date: dateRelative(0), heure: "10:30", motif: "Livraison de la prothèse provisoire" },
    { id: "rdv4", patientId: "pat4", date: dateRelative(0), heure: "11:15", motif: "Contrôle périodique (gêne signalée)" },
    { id: "rdv5", patientId: "pat12", date: dateRelative(0), heure: "13:30", motif: "Contrôle de la couronne provisoire" },
    { id: "rdv6", patientId: "pat3", date: dateRelative(1), heure: "08:30", motif: "Essayage du châssis métallique" },
    { id: "rdv7", patientId: "pat5", date: dateRelative(2), heure: "09:00", motif: "Empreinte secondaire" },
    { id: "rdv8", patientId: "pat6", date: dateRelative(4), heure: "08:30", motif: "Livraison des prothèses complètes" },
    { id: "rdv9", patientId: "pat4", date: dateRelative(9), heure: "10:30", motif: "Equilibration et contrôle périodique" },
    { id: "rdv10", patientId: "pat1", date: dateRelative(-2), heure: "08:30", motif: "Prise d'occlusion et mise en articulateur" },
    { id: "rdv11", patientId: "pat9", date: dateRelative(-2), heure: "10:00", motif: "Contrôle périodique" }
  ]
};
