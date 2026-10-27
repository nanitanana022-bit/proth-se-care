/* ============================================================
   PROTHÈSE CARE — Logique de l'application (prototype)
   Données locales fictives, conservées dans le navigateur.
   ============================================================ */

const CLE_STOCKAGE = "prothese-care-demo-v2";
const ANCIENNE_CLE_STOCKAGE = "prothese-care-demo-v1";

/* Copie profonde compatible avec tous les navigateurs (données 100 % JSON) */
function copieProfonde(obj) { return JSON.parse(JSON.stringify(obj)); }

function nouvelId(prefixe) {
  return prefixe + Date.now().toString(36) + Math.floor(Math.random() * 999);
}

/* ------------------------------------------------------------
   Chargement des données, avec migration douce de l'ancienne
   structure (version 1) vers la structure actuelle (version 2).
   Les dossiers créés dans l'ancienne version restent lisibles.
   ------------------------------------------------------------ */
function migrerAnciennesDonnees(v1) {
  const nomEtudiant = (id) => {
    const e = (v1.etudiants || []).find(x => x.id === id);
    return e ? e.nom : "";
  };
  const patients = (v1.patients || []).map(p => {
    const nbTerminees = Math.min(
      ETAPES_TRAITEMENT.length,
      (p.plan || []).filter(e => e.statut === "Terminée").length
    );
    return {
      id: p.id,
      numero: p.numero || "",
      nom: p.nom || "",
      age: p.age || 0,
      sexe: p.sexe || "F",
      telephone: p.telephone || "",
      adresse: p.adresse || "",
      traitementEnvisage: p.traitementEnvisage || p.typeProthese || "",
      statut: p.statut || "En cours de traitement",
      medecinResponsable: p.medecinResponsable || nomEtudiant(p.etudiantId),
      dateAdmission: p.dateAdmission || aujourdhui(),
      motif: p.motif || "",
      antecedents: p.antecedents || "",
      plan: planifier(nbTerminees)
    };
  });
  const rendezvous = (v1.rendezvous || [])
    .filter(r => r.statut !== "Annulé")
    .map(r => ({ id: r.id, patientId: r.patientId, date: r.date, heure: r.heure, motif: r.motif }));
  return { patients, rendezvous };
}

function chargerDonnees() {
  try {
    const v2 = localStorage.getItem(CLE_STOCKAGE);
    if (v2) return JSON.parse(v2);
    const v1 = localStorage.getItem(ANCIENNE_CLE_STOCKAGE);
    if (v1) {
      const migrees = migrerAnciennesDonnees(JSON.parse(v1));
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(migrees));
      return migrees;
    }
  } catch (e) { /* stockage indisponible ou illisible : on repart des données de démo */ }
  return copieProfonde(DONNEES_INITIALES);
}

let db = chargerDonnees();
let vueActuelle = "dashboard";
let patientOuvertId = null;

function sauvegarder() {
  try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(db)); } catch (e) { /* on continue en mémoire */ }
}

/* ---------- Utilitaires ---------- */
const $ = (sel) => document.querySelector(sel);

function aujourdhui() { return new Date().toISOString().slice(0, 10); }

function formaterDate(iso, avecJour = false) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  const options = avecJour
    ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    : { day: "numeric", month: "short", year: "numeric" };
  return d.toLocaleDateString("fr-FR", options);
}

function initiales(nom) {
  return (nom || "").split(" ").filter(Boolean).slice(0, 2).map(m => m[0]).join("").toUpperCase();
}

function echapper(texte) {
  const div = document.createElement("div");
  div.textContent = texte ?? "";
  return div.innerHTML;
}

/* Recherche insensible aux accents et à la casse : "Rouiba" trouve le patient concerné */
function normaliser(texte) {
  const decompose = (texte ?? "").toLowerCase().normalize("NFD");
  let resultat = "";
  for (const c of decompose) {
    const code = c.codePointAt(0);
    if (code < 0x300 || code > 0x36f) resultat += c;
  }
  return resultat;
}

/* Affiche « Non renseigné » quand une information est absente */
function valeurAffichee(v) {
  const texte = (v ?? "").toString().trim();
  return (texte === "" || texte === "—") ? "Non renseigné" : texte;
}
function classeValeur(v) {
  return valeurAffichee(v) === "Non renseigné" ? "val non-renseigne" : "val";
}

function patientParId(id) { return db.patients.find(p => p.id === id); }

function avatar(patient, classe = "") {
  return `<span class="avatar ${patient.sexe} ${classe}">${initiales(patient.nom)}</span>`;
}

function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("visible");
  clearTimeout(t._delai);
  t._delai = setTimeout(() => t.classList.remove("visible"), 2800);
}

/* ---------- Statuts patients (inchangés) ---------- */
const STATUTS_PATIENT = [
  "En cours de traitement",
  "En attente laboratoire",
  "Pose effectuée – en contrôle",
  "Traitement terminé"
];
const STATUTS_ETAPE = ["En cours", "Terminé"];

function couleurStatutPatient(s) {
  if (s === "En cours de traitement") return "bleu";
  if (s === "En attente laboratoire") return "orange";
  if ((s || "").startsWith("Pose effectuée")) return "violet";
  return "sauge";
}
function badge(texte, couleur) {
  return `<span class="badge ${couleur}">${echapper(texte)}</span>`;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const TITLES = {
  dashboard: ["Tableau de bord", "Consultations et séances cliniques du jour"],
  patients:  ["Patients", "Dossiers du service"],
  patient:   ["Dossier du patient", "Dossier prothétique"]
};

function afficherVue(nom) {
  vueActuelle = nom;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  $("#view-" + nom).classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => {
    const actif = item.dataset.view === nom || (nom === "patient" && item.dataset.view === "patients");
    item.classList.toggle("active", actif);
  });

  const [titre, sousTitre] = TITLES[nom] || ["", ""];
  $("#pageTitle").textContent = titre;
  $("#pageSubtitle").textContent = sousTitre;

  if (nom === "dashboard") rendreDashboard();
  if (nom === "patients") rendrePatients();
  if (nom === "patient" && patientOuvertId) rendreFichePatient(patientOuvertId);

  mettreAJourBadges();
  window.scrollTo({ top: 0 });
}

function ouvrirPatient(id) {
  patientOuvertId = id;
  afficherVue("patient");
}

function mettreAJourBadges() {
  const actifs = db.patients.filter(p => p.statut !== "Traitement terminé").length;
  const b = $("#badgePatients");
  if (b) b.textContent = actifs || "";
}

/* ============================================================
   VUE — TABLEAU DE BORD : rendez-vous du jour uniquement
   ============================================================ */
function rendreDashboard() {
  const jour = aujourdhui();
  const rdvJour = db.rendezvous
    .filter(r => r.date === jour)
    .sort((a, b) => (a.heure || "").localeCompare(b.heure || ""));

  let contenu;
  if (!rdvJour.length) {
    contenu = `<div class="vide">
      <div class="ico">🗓</div>
      <div class="titre">Aucun rendez-vous aujourd'hui</div>
      Aucun rendez-vous n'est prévu ce jour. Vous pouvez en créer un depuis le dossier d'un patient, via le bouton « + Rendez-vous ».
    </div>`;
  } else {
    contenu = rdvJour.map(r => {
      const p = patientParId(r.patientId);
      if (!p) return "";
      return `<div class="ligne-rdv" onclick="ouvrirPatient('${p.id}')" title="Ouvrir le dossier de ${echapper(p.nom)}">
        <div class="heure-bloc"><span class="heure">${echapper(r.heure || "")}</span></div>
        ${avatar(p)}
        <div class="rdv-infos">
          <div class="nom">${echapper(p.nom)}</div>
          <div class="motif">${echapper(r.motif || "")}</div>
        </div>
        <div class="rdv-medecin">${echapper(valeurAffichee(p.medecinResponsable))}</div>
      </div>`;
    }).join("");
  }

  $("#view-dashboard").innerHTML = `
    <div class="dashboard-largeur">
      <div class="card">
        <div class="card-head">
          <div>
            <h3>Rendez-vous du jour</h3>
            <div class="sous-titre">${formaterDate(jour, true)} · ${rdvJour.length} rendez-vous</div>
          </div>
        </div>
        ${contenu}
      </div>
    </div>`;
}

/* ============================================================
   VUE — LISTE DES PATIENTS (recherche par nom)
   ============================================================ */
let recherchePatient = "";

function prochainRendezVous(patientId) {
  const jour = aujourdhui();
  return db.rendezvous
    .filter(r => r.patientId === patientId && r.date >= jour)
    .sort((a, b) => (a.date + (a.heure || "")).localeCompare(b.date + (b.heure || "")))[0] || null;
}

function rendrePatients() {
  const rechercheNorm = normaliser(recherchePatient);
  const liste = db.patients
    .filter(p => normaliser(p.nom).includes(rechercheNorm))
    .sort((a, b) => a.nom.localeCompare(b.nom));

  const lignes = liste.map(p => {
    const prochain = prochainRendezVous(p.id);
    return `<tr class="cliquable" onclick="ouvrirPatient('${p.id}')">
      <td><div class="cellule-patient">${avatar(p)}<div><div class="nom">${echapper(p.nom)}</div><div class="numero">${echapper(p.numero)} · ${p.age} ans</div></div></div></td>
      <td>${echapper(valeurAffichee(p.traitementEnvisage))}</td>
      <td>${badge(p.statut, couleurStatutPatient(p.statut))}</td>
      <td class="texte-doux">${prochain ? formaterDate(prochain.date) + " · " + echapper(prochain.heure || "") : "—"}</td>
      <td class="texte-doux">${echapper(valeurAffichee(p.medecinResponsable))}</td>
      <td><button class="btn-lien" onclick="event.stopPropagation();ouvrirPatient('${p.id}')">Ouvrir →</button></td>
    </tr>`;
  }).join("");

  $("#view-patients").innerHTML = `
    <div class="toolbar">
      <div class="searchbox"><input type="text" id="champRecherche" placeholder="Rechercher un patient par son nom…" value="${echapper(recherchePatient)}"></div>
      <span class="spacer"></span>
      <span class="compteur">${liste.length} patient${liste.length > 1 ? "s" : ""} affiché${liste.length > 1 ? "s" : ""}</span>
      <button class="btn btn-primary" onclick="ouvrirModale('modalPatient')">+ Nouveau patient</button>
    </div>
    <div class="card" style="padding:8px 10px">
      ${liste.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Patient</th><th>Traitement envisagé</th><th>Statut</th><th>Prochain rendez-vous</th><th>Médecin</th><th></th></tr></thead>
        <tbody>${lignes}</tbody></table></div>`
      : `<div class="vide"><div class="ico">⌕</div><div class="titre">Aucun patient trouvé</div>Aucun nom ne correspond à « ${echapper(recherchePatient)} ». Effacez la recherche pour afficher tous les patients.</div>`}
    </div>`;

  const champ = $("#champRecherche");
  champ.addEventListener("input", () => {
    recherchePatient = champ.value;
    const position = champ.selectionStart;
    rendrePatients();
    const nouveau = $("#champRecherche");
    nouveau.focus();
    try { nouveau.setSelectionRange(position, position); } catch (e) { /* champ non sélectionnable */ }
  });
}

/* ============================================================
   VUE — DOSSIER DU PATIENT
   ============================================================ */
function rendreFichePatient(id) {
  const p = patientParId(id);
  if (!p) return;

  const champInfo = (libelle, valeur) =>
    `<li><span class="cle">${libelle}</span><span class="${classeValeur(valeur)}">${echapper(valeurAffichee(valeur))}</span></li>`;

  const etapesHtml = (p.plan || []).map((e, i) => {
    const estTermine = e.statut === "Terminé";
    const boutons = STATUTS_ETAPE.map(s =>
      `<button type="button" data-statut="${s}" class="${e.statut === s ? "actif" : ""}" onclick="changerEtapeStatut('${p.id}', ${i}, '${s}')">${s}</button>`
    ).join("");
    return `<div class="etape ${estTermine ? "termine" : "en-cours"}">
      <span class="etape-point">${estTermine ? "✓" : (i + 1)}</span>
      <div class="etape-contenu">
        <span class="etape-nom">${echapper(e.etape)}</span>
        <span class="segment-controle" role="group" aria-label="Statut de l'étape ${i + 1}">${boutons}</span>
      </div>
    </div>`;
  }).join("");

  $("#view-patient").innerHTML = `
    <button class="btn-retour" onclick="afficherVue('patients')">← Retour à la liste des patients</button>

    <div class="card">
      <div class="fiche-entete">
        ${avatar(p, "big")}
        <div>
          <div class="nom">${echapper(p.nom)}</div>
          <div class="meta">${echapper(p.numero)} · ${p.age} ans · ${p.sexe === "F" ? "Femme" : "Homme"} · admis(e) le ${formaterDate(p.dateAdmission)}</div>
          <div class="meta"><strong>${echapper(valeurAffichee(p.traitementEnvisage))}</strong></div>
        </div>
        <div class="actions">
          <select onchange="changerStatutPatient('${p.id}', this.value)" title="Statut du dossier" aria-label="Statut du dossier">
            ${STATUTS_PATIENT.map(s => `<option ${s === p.statut ? "selected" : ""}>${s}</option>`).join("")}
          </select>
          <button class="btn btn-primary" onclick="ouvrirRdvPour('${p.id}')">+ Rendez-vous</button>
        </div>
      </div>
    </div>

    <div class="fiche-grid">
      <div class="card">
        <div class="card-head"><h3>Informations du dossier</h3></div>
        <ul class="infos-liste">
          ${champInfo("Téléphone", p.telephone)}
          ${champInfo("Adresse", p.adresse)}
          ${champInfo("Motif de consultation", p.motif)}
          ${champInfo("Antécédents", p.antecedents)}
          ${champInfo("Traitement envisagé", p.traitementEnvisage)}
          ${champInfo("Médecin responsable", p.medecinResponsable)}
        </ul>
      </div>

      <div class="card">
        <div class="card-head">
          <div><h3>Plan de traitement</h3><div class="sous-titre">Sept étapes — statut « En cours » ou « Terminé »</div></div>
          ${badge(p.statut, couleurStatutPatient(p.statut))}
        </div>
        ${etapesHtml}
      </div>
    </div>`;
}

function changerStatutPatient(id, statut) {
  const p = patientParId(id);
  if (!p) return;
  p.statut = statut;
  sauvegarder();
  toast(`Statut de ${p.nom} mis à jour : « ${statut} »`);
  rendreFichePatient(id);
  mettreAJourBadges();
}

function changerEtapeStatut(id, index, statut) {
  const p = patientParId(id);
  if (!p || !p.plan || !p.plan[index]) return;
  if (!STATUTS_ETAPE.includes(statut)) return;
  p.plan[index].statut = statut;
  sauvegarder();
  toast(`Étape « ${p.plan[index].etape} » : ${statut}`);
  rendreFichePatient(id);
}

/* ============================================================
   MODALES ET FORMULAIRES
   ============================================================ */
function ouvrirModale(id) { $("#" + id).classList.add("ouvert"); }
function fermerModale(id) { $("#" + id).classList.remove("ouvert"); }

/* Ouvre le formulaire de rendez-vous pour le patient affiché.
   Le nom est pré-rempli et le rendez-vous reste lié à ce patient. */
function ouvrirRdvPour(patientId) {
  const p = patientParId(patientId);
  if (!p) return;
  const form = $("#formRdv");
  form.reset();
  form.dataset.patientId = patientId;
  $("#champPatientRdv").value = p.nom;
  /* Valeur par défaut : demain à 9 h (modifiable par le praticien) */
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  const deux = (n) => String(n).padStart(2, "0");
  form.elements.dateHeure.value =
    `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}T${deux(d.getHours())}:${deux(d.getMinutes())}`;
  ouvrirModale("modalRdv");
}

document.addEventListener("DOMContentLoaded", () => {
  $("#topbarDate").textContent = formaterDate(aujourdhui(), true);

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => afficherVue(item.dataset.view));
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => fermerModale(btn.dataset.close));
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => { if (e.target === overlay) fermerModale(overlay.id); });
  });

  /* --- Création d'un patient --- */
  $("#formPatient").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const numero = "PC-2026-" + String(180 + db.patients.length).padStart(4, "0");
    const nouveau = {
      id: nouvelId("pat"),
      numero: numero,
      nom: f.elements.nom.value.trim(),
      age: parseInt(f.elements.age.value, 10) || 0,
      sexe: f.elements.sexe.value,
      telephone: f.elements.telephone.value.trim(),
      adresse: f.elements.adresse.value.trim(),
      traitementEnvisage: f.elements.traitementEnvisage.value.trim(),
      statut: "En cours de traitement",
      medecinResponsable: f.elements.medecinResponsable.value.trim(),
      dateAdmission: aujourdhui(),
      motif: f.elements.motif.value.trim(),
      antecedents: f.elements.antecedents.value.trim(),
      plan: planifier(0)
    };
    db.patients.push(nouveau);
    sauvegarder();
    fermerModale("modalPatient");
    f.reset();
    toast(`Dossier ${numero} créé pour ${nouveau.nom}`);
    ouvrirPatient(nouveau.id);
  });

  /* --- Création d'un rendez-vous (trois champs) --- */
  $("#formRdv").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const patientId = f.dataset.patientId;
    const p = patientParId(patientId);
    const dateHeure = f.elements.dateHeure.value || "";
    const [date, heureComplete] = dateHeure.split("T");
    if (!p || !date) { toast("Veuillez vérifier la date et l'heure du rendez-vous."); return; }
    const rdv = {
      id: nouvelId("rdv"),
      patientId: patientId,
      date: date,
      heure: (heureComplete || "09:00").slice(0, 5),
      motif: f.elements.motif.value.trim()
    };
    db.rendezvous.push(rdv);
    sauvegarder();
    fermerModale("modalRdv");
    f.reset();
    toast(`Rendez-vous enregistré pour ${p.nom} le ${formaterDate(rdv.date)} à ${rdv.heure}`);
    if (vueActuelle === "dashboard") rendreDashboard();
    mettreAJourBadges();
  });

  /* --- Réinitialisation de la démo --- */
  $("#btnReset").addEventListener("click", () => {
    if (confirm("Réinitialiser toutes les données de démonstration ? Vos modifications seront perdues.")) {
      db = copieProfonde(DONNEES_INITIALES);
      try { localStorage.removeItem(ANCIENNE_CLE_STOCKAGE); } catch (e) { /* sans objet */ }
      sauvegarder();
      patientOuvertId = null;
      recherchePatient = "";
      afficherVue("dashboard");
      toast("Données de démonstration réinitialisées");
    }
  });

  afficherVue("dashboard");
});
