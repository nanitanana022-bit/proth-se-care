/* ============================================================
   PROTHÈSE CARE — Logique de l'application (prototype)
   Données locales fictives, conservées dans le navigateur.
   ============================================================ */

const CLE_STOCKAGE = "prothese-care-demo-v1";

/* ---------- État global ---------- */
/* Copie profonde compatible avec tous les navigateurs (données 100 % JSON) */
function copieProfonde(obj) { return JSON.parse(JSON.stringify(obj)); }

let db;
try {
  const sauvegarde = localStorage.getItem(CLE_STOCKAGE);
  db = sauvegarde ? JSON.parse(sauvegarde) : copieProfonde(DONNEES_INITIALES);
} catch (e) {
  db = copieProfonde(DONNEES_INITIALES);
}

let vueActuelle = "dashboard";
let patientOuvertId = null;
let filtreRdv = "aujourdhui";

function sauvegarder() {
  try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(db)); } catch (e) { /* stockage indisponible : on continue en mémoire */ }
}

function nouvelId(prefixe) {
  return prefixe + Date.now().toString(36) + Math.floor(Math.random() * 999);
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

function ecartJours(iso) {
  if (!iso) return null;
  const ms = new Date(iso + "T12:00:00") - new Date(aujourdhui() + "T12:00:00");
  return Math.round(ms / 86400000);
}

function initiales(nom) {
  return nom.split(" ").filter(Boolean).slice(0, 2).map(m => m[0]).join("").toUpperCase();
}

function echapper(texte) {
  const div = document.createElement("div");
  div.textContent = texte ?? "";
  return div.innerHTML;
}

/* Recherche insensible aux accents et à la casse : "Rouiba" trouve le patient concerne */
function normaliser(texte) {
  const decompose = (texte ?? "").toLowerCase().normalize("NFD");
  let resultat = "";
  for (const c of decompose) {
    const code = c.codePointAt(0);
    if (code < 0x300 || code > 0x36f) resultat += c;
  }
  return resultat;
}

function patientParId(id) { return db.patients.find(p => p.id === id); }
function etudiantParId(id) { return db.etudiants.find(e => e.id === id); }
function enseignantParId(id) { return db.enseignants.find(e => e.id === id); }
function laboParId(id) { return db.laboratoires.find(l => l.id === id); }

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

/* ---------- Statuts : libellés et couleurs ---------- */
const STATUTS_PATIENT = [
  "En cours de traitement",
  "En attente laboratoire",
  "Pose effectuée – en contrôle",
  "Traitement terminé"
];
const STATUTS_RDV = ["En attente", "Confirmé", "En cours", "Terminé", "Annulé", "Absent"];
const STATUTS_LABO = ["Envoyé au laboratoire", "En cours de fabrication", "Retourné au service", "Travaux terminés"];
const STATUTS_ETAPE = ["À venir", "En cours", "Terminée"];

function couleurStatutPatient(s) {
  if (s === "En cours de traitement") return "bleu";
  if (s === "En attente laboratoire") return "orange";
  if (s.startsWith("Pose effectuée")) return "violet";
  return "sauge";
}
function couleurStatutRdv(s) {
  if (s === "Confirmé") return "sauge";
  if (s === "En cours") return "bleu";
  if (s === "En attente") return "orange";
  if (s === "Terminé") return "gris";
  return "rouge";
}
function couleurStatutLabo(s) {
  if (s === "Envoyé au laboratoire") return "bleu";
  if (s === "En cours de fabrication") return "orange";
  if (s === "Retourné au service") return "violet";
  return "sauge";
}
function badge(texte, couleur) {
  return `<span class="badge ${couleur}">${echapper(texte)}</span>`;
}

function progressionPatient(p) {
  if (!p.plan || p.plan.length === 0) return 0;
  const finies = p.plan.filter(e => e.statut === "Terminée").length;
  return Math.round((finies / p.plan.length) * 100);
}

function travailEnRetard(t) {
  if (t.dateRetour || t.statut === "Travaux terminés") return false;
  const ecart = ecartJours(t.dateRetourPrevue);
  return ecart !== null && ecart < 0;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const TITLES = {
  dashboard:   ["Tableau de bord", "Activité du service de prothèse"],
  patients:    ["Patients", "Dossiers du service"],
  patient:     ["Fiche patient", "Dossier prothétique"],
  rendezvous:  ["Rendez-vous", "Planning des consultations et séances cliniques"],
  laboratoire: ["Laboratoire externe", "Suivi des travaux confiés aux prothésistes"],
  poses:       ["Poses & contrôles", "Insertion des prothèses et suivi post-prothétique"]
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

  const rendus = {
    dashboard: rendreDashboard,
    patients: rendrePatients,
    rendezvous: rendreRendezvous,
    laboratoire: rendreLaboratoire,
    poses: rendrePoses
  };
  if (rendus[nom]) rendus[nom]();
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
  $("#badgePatients").textContent = actifs || "";
  const rdvJour = db.rendezvous.filter(r => r.date === aujourdhui() && r.statut !== "Annulé").length;
  $("#badgeRdv").textContent = rdvJour || "";
  const retards = db.travauxLabo.filter(travailEnRetard).length;
  $("#badgeLabo").textContent = retards || "";
  const aPlanifier = db.suivis.filter(s => s.statut === "À planifier").length;
  $("#badgePoses").textContent = aPlanifier || "";
}

/* ============================================================
   VUE — TABLEAU DE BORD
   ============================================================ */
function rendreDashboard() {
  const jour = aujourdhui();
  const patientsActifs = db.patients.filter(p => p.statut !== "Traitement terminé");
  const rdvJour = db.rendezvous.filter(r => r.date === jour && r.statut !== "Annulé")
    .sort((a, b) => a.heure.localeCompare(b.heure));
  const laboEnCours = db.travauxLabo.filter(t => !t.dateRetour && t.statut !== "Travaux terminés");
  const retards = db.travauxLabo.filter(travailEnRetard);
  const posesSemaine = db.suivis.filter(s => s.date && ecartJours(s.date) >= 0 && ecartJours(s.date) <= 7 && s.statut.startsWith("Programmé"));
  const controlesAPlanifier = db.suivis.filter(s => s.statut === "À planifier");

  /* Activité des 7 prochains jours (rendez-vous par jour) */
  let barresHtml = "";
  const joursNoms = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  const compteParJour = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const nb = db.rendezvous.filter(r => r.date === iso && r.statut !== "Annulé").length;
    compteParJour.push({ nom: joursNoms[d.getDay()], nb, estAujourdhui: i === 0 });
  }
  const maxBarre = Math.max(...compteParJour.map(c => c.nb), 1);
  for (const c of compteParJour) {
    const hauteur = Math.max(8, (c.nb / maxBarre) * 100);
    barresHtml += `<div class="barre-col">
      <span class="barre-nombre">${c.nb || ""}</span>
      <div class="barre ${c.estAujourdhui ? "aujourdhui" : ""}" style="height:${hauteur}%"></div>
      <span class="barre-jour">${c.estAujourdhui ? "Auj." : c.nom}</span>
    </div>`;
  }

  /* Alertes */
  let alertesHtml = "";
  for (const t of retards) {
    const p = patientParId(t.patientId);
    const jours = Math.abs(ecartJours(t.dateRetourPrevue));
    alertesHtml += `<div class="alerte rouge"><span class="ico">⚠</span><div>
      <strong>Retard laboratoire — ${echapper(p ? p.nom : "")}</strong>
      <span>${echapper(t.travail)} · retour attendu il y a ${jours} jour${jours > 1 ? "s" : ""} (${echapper(laboParId(t.laboratoireId)?.nom || "")}).</span>
    </div></div>`;
  }
  for (const s of controlesAPlanifier) {
    const p = patientParId(s.patientId);
    alertesHtml += `<div class="alerte orange"><span class="ico">🗓</span><div>
      <strong>Contrôle à planifier — ${echapper(p ? p.nom : "")}</strong>
      <span>${echapper(s.type)} : aucun rendez-vous n'est encore programmé.</span>
    </div></div>`;
  }
  const retoursProches = laboEnCours.filter(t => !travailEnRetard(t) && ecartJours(t.dateRetourPrevue) <= 2);
  for (const t of retoursProches) {
    const p = patientParId(t.patientId);
    const ecart = ecartJours(t.dateRetourPrevue);
    alertesHtml += `<div class="alerte sauge"><span class="ico">📦</span><div>
      <strong>Retour laboratoire ${ecart === 0 ? "aujourd'hui" : "sous " + ecart + " j"} — ${echapper(p ? p.nom : "")}</strong>
      <span>${echapper(t.travail)}.</span>
    </div></div>`;
  }
  if (!alertesHtml) alertesHtml = `<div class="vide"><div class="ico">✓</div><div class="titre">Aucune alerte</div>Tous les travaux et contrôles sont à jour.</div>`;

  /* Rendez-vous du jour */
  let rdvHtml = rdvJour.length ? "" : `<div class="vide"><div class="ico">🗓</div><div class="titre">Aucun rendez-vous aujourd'hui</div>Le planning du jour est libre.</div>`;
  for (const r of rdvJour) {
    const p = patientParId(r.patientId);
    const etu = etudiantParId(r.etudiantId);
    rdvHtml += `<div class="ligne-rdv">
      <div class="heure-bloc"><div class="heure">${r.heure}</div><div class="duree">${r.duree} min</div></div>
      ${p ? avatar(p) : ""}
      <div class="rdv-infos">
        <div class="nom">${echapper(p ? p.nom : "Patient inconnu")}</div>
        <div class="motif">${echapper(r.motif)}</div>
      </div>
      <div class="rdv-meta">${echapper(r.box)}<br>${echapper(etu ? etu.nom : "")}</div>
      ${badge(r.statut, couleurStatutRdv(r.statut))}
    </div>`;
  }

  /* Travaux laboratoire récents */
  const travauxRecents = [...db.travauxLabo].sort((a, b) => b.dateEnvoi.localeCompare(a.dateEnvoi)).slice(0, 5);
  let laboHtml = `<div class="table-wrap"><table><thead><tr><th>Référence</th><th>Patient</th><th>Travail</th><th>Retour prévu</th><th>Statut</th></tr></thead><tbody>`;
  for (const t of travauxRecents) {
    const p = patientParId(t.patientId);
    const retard = travailEnRetard(t);
    laboHtml += `<tr class="cliquable" onclick="ouvrirPatient('${t.patientId}')">
      <td><strong>${echapper(t.reference)}</strong></td>
      <td>${echapper(p ? p.nom : "")}</td>
      <td class="texte-doux">${echapper(t.travail)}</td>
      <td class="${retard ? "retard-texte" : ""}">${formaterDate(t.dateRetourPrevue)}${retard ? " (en retard)" : ""}</td>
      <td>${retard ? badge("En retard", "rouge") : badge(t.statut, couleurStatutLabo(t.statut))}</td>
    </tr>`;
  }
  laboHtml += `</tbody></table></div>`;

  $("#view-dashboard").innerHTML = `
    <div class="kpi-grid">
      <div class="card kpi">
        <div class="kpi-valeur">${patientsActifs.length}</div>
        <div class="kpi-label">Patients en traitement</div>
        <div class="kpi-detail">${db.patients.length} dossiers au total dans le service</div>
      </div>
      <div class="card kpi bleu">
        <div class="kpi-valeur">${rdvJour.length}</div>
        <div class="kpi-label">Rendez-vous aujourd'hui</div>
        <div class="kpi-detail">Séances cliniques et consultations</div>
      </div>
      <div class="card kpi orange">
        <div class="kpi-valeur">${laboEnCours.length}</div>
        <div class="kpi-label">Travaux au laboratoire</div>
        <div class="kpi-detail">${retards.length ? `<span class="retard-texte">${retards.length} en retard</span>` : "Aucun retard signalé"}</div>
      </div>
      <div class="card kpi violet">
        <div class="kpi-valeur">${posesSemaine.length}</div>
        <div class="kpi-label">Poses / contrôles (7 j)</div>
        <div class="kpi-detail">${controlesAPlanifier.length} contrôle(s) à planifier</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-head">
          <div><h3>Rendez-vous du jour</h3><div class="sous-titre">${formaterDate(jour, true)}</div></div>
          <button class="btn-lien" onclick="afficherVue('rendezvous')">Tout le planning →</button>
        </div>
        ${rdvHtml}
      </div>
      <div class="card">
        <div class="card-head"><div><h3>Points d'attention</h3><div class="sous-titre">À traiter en priorité</div></div></div>
        ${alertesHtml}
      </div>
    </div>

    <div class="grid-2-inverse">
      <div class="card">
        <div class="card-head"><div><h3>Activité de la semaine</h3><div class="sous-titre">Nombre de rendez-vous par jour</div></div></div>
        <div class="barres">${barresHtml}</div>
      </div>
      <div class="card">
        <div class="card-head">
          <div><h3>Laboratoire — derniers envois</h3><div class="sous-titre">Cliquez sur une ligne pour ouvrir le dossier</div></div>
          <button class="btn-lien" onclick="afficherVue('laboratoire')">Tout voir →</button>
        </div>
        ${laboHtml}
      </div>
    </div>`;
}

/* ============================================================
   VUE — LISTE DES PATIENTS
   ============================================================ */
let recherchePatient = "";
let filtreStatutPatient = "tous";
let filtreTypePatient = "tous";

function rendrePatients() {
  const types = [...new Set(db.patients.map(p => p.typeProthese))];

  let liste = db.patients.filter(p => {
    const okRecherche = normaliser(p.nom + " " + p.numero + " " + p.typeProthese)
      .includes(normaliser(recherchePatient));
    const okStatut = filtreStatutPatient === "tous" || p.statut === filtreStatutPatient;
    const okType = filtreTypePatient === "tous" || p.typeProthese === filtreTypePatient;
    return okRecherche && okStatut && okType;
  });
  liste.sort((a, b) => a.nom.localeCompare(b.nom));

  let lignes = "";
  for (const p of liste) {
    const etu = etudiantParId(p.etudiantId);
    const prog = progressionPatient(p);
    const prochainRdv = db.rendezvous
      .filter(r => r.patientId === p.id && r.date >= aujourdhui() && r.statut !== "Annulé")
      .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure))[0];
    lignes += `<tr class="cliquable" onclick="ouvrirPatient('${p.id}')">
      <td><div class="cellule-patient">${avatar(p)}<div><div class="nom">${echapper(p.nom)}</div><div class="numero">${echapper(p.numero)} · ${p.age} ans</div></div></div></td>
      <td>${echapper(p.typeProthese)}<div class="texte-doux texte-petit">${echapper(p.arcade || "")}</div></td>
      <td>${badge(p.statut, couleurStatutPatient(p.statut))}</td>
      <td><div class="progression"><div class="progression-barre"><div class="progression-remplissage" style="width:${prog}%"></div></div><span class="progression-texte">${prog} %</span></div></td>
      <td class="texte-doux">${prochainRdv ? formaterDate(prochainRdv.date) + " · " + prochainRdv.heure : "—"}</td>
      <td class="texte-doux">${echapper(etu ? etu.nom : "")}</td>
      <td><button class="btn-lien" onclick="event.stopPropagation();ouvrirPatient('${p.id}')">Ouvrir →</button></td>
    </tr>`;
  }

  $("#view-patients").innerHTML = `
    <div class="toolbar">
      <div class="searchbox"><input type="text" id="champRecherche" placeholder="Rechercher un patient, un n° de dossier…" value="${echapper(recherchePatient)}"></div>
      <select id="filtreStatut">
        <option value="tous">Tous les statuts</option>
        ${STATUTS_PATIENT.map(s => `<option value="${echapper(s)}" ${filtreStatutPatient === s ? "selected" : ""}>${echapper(s)}</option>`).join("")}
      </select>
      <select id="filtreType">
        <option value="tous">Tous les types de prothèse</option>
        ${types.map(t => `<option value="${echapper(t)}" ${filtreTypePatient === t ? "selected" : ""}>${echapper(t)}</option>`).join("")}
      </select>
      <span class="spacer"></span>
      <span class="compteur">${liste.length} patient${liste.length > 1 ? "s" : ""} affiché${liste.length > 1 ? "s" : ""}</span>
      <button class="btn btn-primary" onclick="ouvrirModale('modalPatient')">+ Nouveau patient</button>
    </div>
    <div class="card" style="padding:8px 10px">
      ${liste.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Patient</th><th>Traitement prothétique</th><th>Statut</th><th>Avancement</th><th>Prochain RDV</th><th>Étudiant</th><th></th></tr></thead>
        <tbody>${lignes}</tbody></table></div>`
      : `<div class="vide"><div class="ico">⌕</div><div class="titre">Aucun patient trouvé</div>Essayez de modifier la recherche ou les filtres.</div>`}
    </div>`;

  const champ = $("#champRecherche");
  champ.addEventListener("input", () => {
    recherchePatient = champ.value;
    const position = champ.selectionStart;
    rendrePatients();
    const nouveau = $("#champRecherche");
    nouveau.focus();
    nouveau.setSelectionRange(position, position);
  });
  $("#filtreStatut").addEventListener("change", e => { filtreStatutPatient = e.target.value; rendrePatients(); });
  $("#filtreType").addEventListener("change", e => { filtreTypePatient = e.target.value; rendrePatients(); });
}

/* ============================================================
   VUE — FICHE PATIENT
   ============================================================ */
function schemaDentaire(p) {
  const haut = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
  const bas  = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
  const ligne = (dents, label) => `
    <div class="schema-arcade">
      <span class="schema-label">${label}</span>
      <div class="dents">${dents.map(d => `<span class="dent ${p.dents.includes(d) ? "concernee" : ""}">${d}</span>`).join("")}</div>
    </div>`;
  const legende = p.dents.length
    ? `Dents concernées (FDI) : <strong>${p.dents.join(", ")}</strong> — ${echapper(p.arcade || "")}`
    : `${echapper(p.arcade || "Arcade complète")}`;
  return `<div class="schema">${ligne(haut, "Maxillaire")}${ligne(bas, "Mandibulaire")}<p class="schema-legende">${legende}</p></div>`;
}

function rendreFichePatient(id) {
  const p = patientParId(id);
  if (!p) return;
  const etu = etudiantParId(p.etudiantId);
  const ens = enseignantParId(p.enseignantId);
  const prog = progressionPatient(p);

  const etapesHtml = p.plan.map((e, i) => {
    const classe = e.statut === "Terminée" ? "terminee" : (e.statut === "En cours" ? "en-cours" : "");
    const marqueur = e.statut === "Terminée" ? "✓" : (i + 1);
    return `<div class="etape ${classe}">
      <span class="etape-point">${marqueur}</span>
      <div class="etape-contenu">
        <div>
          <div class="etape-nom">${echapper(e.etape)}</div>
          <div class="etape-date">${e.date ? formaterDate(e.date) : "Date à définir"}</div>
        </div>
        <select onchange="changerEtapeStatut('${p.id}', ${i}, this.value)" title="Modifier le statut de l'étape">
          ${STATUTS_ETAPE.map(s => `<option ${s === e.statut ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
    </div>`;
  }).join("");

  const histoHtml = [...p.historique].reverse().map(h => `
    <div class="histo-item">
      <div class="haut"><span class="titre">${echapper(h.titre)}</span><span class="date">${formaterDate(h.date)}</span></div>
      <p class="texte">${echapper(h.texte)}</p>
      <p class="auteur">Rédigé par ${echapper(h.auteur)}</p>
    </div>`).join("");

  const rdvPatient = db.rendezvous.filter(r => r.patientId === p.id)
    .sort((a, b) => (b.date + b.heure).localeCompare(a.date + a.heure));
  const rdvHtml = rdvPatient.length ? rdvPatient.map(r => `
    <div class="ligne-rdv">
      <div class="heure-bloc"><div class="heure">${r.heure}</div><div class="duree">${r.duree} min</div></div>
      <div class="rdv-infos"><div class="nom">${echapper(r.motif)}</div><div class="motif">${formaterDate(r.date, true)} · ${echapper(r.box)}</div></div>
      ${badge(r.statut, couleurStatutRdv(r.statut))}
    </div>`).join("")
    : `<p class="texte-doux">Aucun rendez-vous enregistré pour ce patient.</p>`;

  const laboPatient = db.travauxLabo.filter(t => t.patientId === p.id);
  const laboHtml = laboPatient.length ? laboPatient.map(t => `
    <div class="ligne-rdv">
      <div class="rdv-infos">
        <div class="nom">${echapper(t.reference)} — ${echapper(t.travail)}</div>
        <div class="motif">${echapper(laboParId(t.laboratoireId)?.nom || "")} · envoyé le ${formaterDate(t.dateEnvoi)} · retour ${t.dateRetour ? "le " + formaterDate(t.dateRetour) : "prévu le " + formaterDate(t.dateRetourPrevue)}</div>
      </div>
      ${travailEnRetard(t) ? badge("En retard", "rouge") : badge(t.statut, couleurStatutLabo(t.statut))}
    </div>`).join("")
    : `<p class="texte-doux">Aucun travail envoyé au laboratoire pour ce patient.</p>`;

  $("#view-patient").innerHTML = `
    <button class="btn-retour" onclick="afficherVue('patients')">← Retour à la liste des patients</button>

    <div class="card">
      <div class="fiche-entete">
        ${avatar(p, "big")}
        <div>
          <div class="nom">${echapper(p.nom)}</div>
          <div class="meta">${echapper(p.numero)} · ${p.age} ans · ${p.sexe === "F" ? "Femme" : "Homme"} · admis(e) le ${formaterDate(p.dateAdmission)}</div>
          <div class="meta"><strong>${echapper(p.typeProthese)}</strong></div>
        </div>
        <div class="actions">
          <select onchange="changerStatutPatient('${p.id}', this.value)" title="Statut du dossier">
            ${STATUTS_PATIENT.map(s => `<option ${s === p.statut ? "selected" : ""}>${s}</option>`).join("")}
          </select>
          <button class="btn btn-primary" onclick="preparerRdvPour('${p.id}')">+ Rendez-vous</button>
        </div>
      </div>
      <div class="progression" style="margin-top:18px">
        <span class="progression-texte">Avancement du plan de traitement</span>
        <div class="progression-barre"><div class="progression-remplissage" style="width:${prog}%"></div></div>
        <span class="progression-texte">${prog} %</span>
      </div>
    </div>

    <div class="fiche-grid">
      <div class="fiche-col">
        <div class="card">
          <div class="card-head"><h3>Informations du dossier</h3></div>
          <ul class="infos-liste">
            <li><span class="cle">Téléphone</span><span class="val">${echapper(p.telephone || "—")}</span></li>
            <li><span class="cle">Adresse</span><span class="val">${echapper(p.adresse || "—")}</span></li>
            <li><span class="cle">Étudiant responsable</span><span class="val">${echapper(etu ? etu.nom + " (" + etu.niveau + ")" : "—")}</span></li>
            <li><span class="cle">Superviseur</span><span class="val">${echapper(ens ? ens.nom : "—")}</span></li>
            <li><span class="cle">Allergies</span><span class="val">${echapper(p.allergies || "—")}</span></li>
          </ul>
          <div class="bloc-texte" style="margin-top:14px"><div class="titre">Motif de consultation</div>${echapper(p.motif || "—")}</div>
          <div class="bloc-texte"><div class="titre">Antécédents</div>${echapper(p.antecedents || "—")}</div>
        </div>

        <div class="card">
          <div class="card-head"><div><h3>Schéma dentaire</h3><div class="sous-titre">Numérotation FDI — dents du traitement en couleur</div></div></div>
          ${schemaDentaire(p)}
        </div>

        <div class="card">
          <div class="card-head"><h3>Travaux de laboratoire</h3></div>
          ${laboHtml}
        </div>
      </div>

      <div class="fiche-col">
        <div class="card">
          <div class="card-head"><div><h3>Plan de traitement</h3><div class="sous-titre">Étapes cliniques — modifiez le statut au fur et à mesure</div></div>
          ${badge(p.statut, couleurStatutPatient(p.statut))}</div>
          ${etapesHtml}
        </div>

        <div class="card">
          <div class="card-head"><div><h3>Historique clinique</h3><div class="sous-titre">Comptes rendus des séances</div></div></div>
          ${histoHtml}
          <form class="ajout-note" onsubmit="ajouterNote(event, '${p.id}')">
            <input type="text" name="titre" required placeholder="Titre de la séance (ex. Essayage du montage)">
            <textarea name="texte" rows="2" required placeholder="Observations cliniques, décisions prises…"></textarea>
            <div style="text-align:right"><button class="btn btn-bleu btn-petit" type="submit">Ajouter au dossier</button></div>
          </form>
        </div>

        <div class="card">
          <div class="card-head"><h3>Rendez-vous du patient</h3></div>
          ${rdvHtml}
        </div>
      </div>
    </div>`;
}

function changerStatutPatient(id, statut) {
  const p = patientParId(id);
  p.statut = statut;
  sauvegarder();
  toast(`Statut de ${p.nom} mis à jour : « ${statut} »`);
  rendreFichePatient(id);
  mettreAJourBadges();
}

function changerEtapeStatut(id, index, statut) {
  const p = patientParId(id);
  p.plan[index].statut = statut;
  if (statut === "Terminée" && !p.plan[index].date) p.plan[index].date = aujourdhui();
  sauvegarder();
  toast(`Étape « ${p.plan[index].etape} » : ${statut}`);
  rendreFichePatient(id);
}

function ajouterNote(event, id) {
  event.preventDefault();
  const form = event.target;
  const p = patientParId(id);
  const etu = etudiantParId(p.etudiantId);
  p.historique.push({
    date: aujourdhui(),
    titre: form.elements.titre.value.trim(),
    texte: form.elements.texte.value.trim(),
    auteur: etu ? etu.nom : "Service de prothèse"
  });
  sauvegarder();
  toast("Note clinique ajoutée au dossier");
  rendreFichePatient(id);
}

function preparerRdvPour(patientId) {
  remplirSelectPatients();
  $("#selectPatientRdv").value = patientId;
  ouvrirModale("modalRdv");
}

/* ============================================================
   VUE — RENDEZ-VOUS
   ============================================================ */
function rendreRendezvous() {
  const jour = aujourdhui();
  let liste = [...db.rendezvous].sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  if (filtreRdv === "aujourdhui") liste = liste.filter(r => r.date === jour);
  if (filtreRdv === "avenir") liste = liste.filter(r => r.date > jour);
  if (filtreRdv === "passes") liste = liste.filter(r => r.date < jour).reverse();

  /* Regroupement par jour */
  const groupes = {};
  for (const r of liste) (groupes[r.date] ||= []).push(r);

  let contenu = "";
  for (const date of Object.keys(groupes)) {
    const ecart = ecartJours(date);
    const etiquette = ecart === 0 ? badge("Aujourd'hui", "sauge") : ecart === 1 ? badge("Demain", "bleu") : ecart === -1 ? badge("Hier", "gris") : "";
    contenu += `<div class="groupe-date card" style="padding:16px 20px">
      <div class="groupe-date-titre">${formaterDate(date, true)} ${etiquette}</div>`;
    for (const r of groupes[date]) {
      const p = patientParId(r.patientId);
      const etu = etudiantParId(r.etudiantId);
      contenu += `<div class="ligne-rdv">
        <div class="heure-bloc"><div class="heure">${r.heure}</div><div class="duree">${r.duree} min</div></div>
        ${p ? avatar(p) : ""}
        <div class="rdv-infos">
          <div class="nom" style="cursor:pointer" onclick="ouvrirPatient('${r.patientId}')">${echapper(p ? p.nom : "")}</div>
          <div class="motif">${echapper(r.motif)} · ${echapper(r.box)} · ${echapper(etu ? etu.nom : "")}</div>
        </div>
        <select class="statut-select" onchange="changerStatutRdv('${r.id}', this.value)" title="Statut du rendez-vous">
          ${STATUTS_RDV.map(s => `<option ${s === r.statut ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>`;
    }
    contenu += `</div>`;
  }
  if (!liste.length) {
    contenu = `<div class="card vide"><div class="ico">🗓</div><div class="titre">Aucun rendez-vous dans cette période</div>Planifiez un rendez-vous avec le bouton ci-dessus.</div>`;
  }

  $("#view-rendezvous").innerHTML = `
    <div class="toolbar">
      <div class="onglets">
        <button class="${filtreRdv === "aujourdhui" ? "active" : ""}" onclick="filtreRdv='aujourdhui';rendreRendezvous()">Aujourd'hui</button>
        <button class="${filtreRdv === "avenir" ? "active" : ""}" onclick="filtreRdv='avenir';rendreRendezvous()">À venir</button>
        <button class="${filtreRdv === "passes" ? "active" : ""}" onclick="filtreRdv='passes';rendreRendezvous()">Passés</button>
        <button class="${filtreRdv === "tous" ? "active" : ""}" onclick="filtreRdv='tous';rendreRendezvous()">Tous</button>
      </div>
      <span class="spacer"></span>
      <span class="compteur">${liste.length} rendez-vous</span>
      <button class="btn btn-primary" onclick="remplirSelectPatients();ouvrirModale('modalRdv')">+ Nouveau rendez-vous</button>
    </div>
    ${contenu}`;
}

function changerStatutRdv(id, statut) {
  const r = db.rendezvous.find(x => x.id === id);
  r.statut = statut;
  sauvegarder();
  toast(`Rendez-vous mis à jour : ${statut}`);
  mettreAJourBadges();
}

/* ============================================================
   VUE — LABORATOIRE EXTERNE
   ============================================================ */
let filtreLaboStatut = "tous";

function rendreLaboratoire() {
  let liste = [...db.travauxLabo].sort((a, b) => b.dateEnvoi.localeCompare(a.dateEnvoi));
  if (filtreLaboStatut === "retards") liste = liste.filter(travailEnRetard);
  else if (filtreLaboStatut !== "tous") liste = liste.filter(t => t.statut === filtreLaboStatut);

  const lignes = liste.map(t => {
    const p = patientParId(t.patientId);
    const labo = laboParId(t.laboratoireId);
    const retard = travailEnRetard(t);
    const ecart = ecartJours(t.dateRetourPrevue);
    let retourTexte;
    if (t.dateRetour) retourTexte = `Reçu le ${formaterDate(t.dateRetour)}`;
    else if (retard) retourTexte = `<span class="retard-texte">${formaterDate(t.dateRetourPrevue)} — en retard de ${Math.abs(ecart)} j</span>`;
    else if (ecart === 0) retourTexte = `${formaterDate(t.dateRetourPrevue)} — aujourd'hui`;
    else retourTexte = `${formaterDate(t.dateRetourPrevue)} (dans ${ecart} j)`;

    return `<tr>
      <td><strong>${echapper(t.reference)}</strong><div class="texte-doux texte-petit">Teinte ${echapper(t.teinte || "—")}</div></td>
      <td><div class="cellule-patient">${p ? avatar(p) : ""}<div><div class="nom" style="cursor:pointer" onclick="ouvrirPatient('${t.patientId}')">${echapper(p ? p.nom : "")}</div><div class="numero">${echapper(p ? p.numero : "")}</div></div></div></td>
      <td>${echapper(t.travail)}${t.notes ? `<div class="texte-doux texte-petit">${echapper(t.notes)}</div>` : ""}</td>
      <td class="texte-doux">${echapper(labo ? labo.nom : "")}<div class="texte-petit">${echapper(labo ? labo.ville : "")}</div></td>
      <td class="texte-doux">Envoyé le ${formaterDate(t.dateEnvoi)}</td>
      <td>${retourTexte}</td>
      <td>
        <select class="statut-select" onchange="changerStatutLabo('${t.id}', this.value)">
          ${STATUTS_LABO.map(s => `<option ${s === t.statut ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        ${retard ? `<div style="margin-top:5px">${badge("En retard", "rouge")}</div>` : ""}
      </td>
    </tr>`;
  }).join("");

  const nbRetards = db.travauxLabo.filter(travailEnRetard).length;
  const nbEnCours = db.travauxLabo.filter(t => !t.dateRetour && t.statut !== "Travaux terminés").length;

  $("#view-laboratoire").innerHTML = `
    <div class="toolbar">
      <select id="filtreLabo">
        <option value="tous">Tous les travaux</option>
        <option value="retards" ${filtreLaboStatut === "retards" ? "selected" : ""}>⚠ En retard uniquement (${nbRetards})</option>
        ${STATUTS_LABO.map(s => `<option value="${echapper(s)}" ${filtreLaboStatut === s ? "selected" : ""}>${echapper(s)}</option>`).join("")}
      </select>
      <span class="compteur">${nbEnCours} travaux actuellement chez les prothésistes externes</span>
      <span class="spacer"></span>
      <button class="btn btn-primary" onclick="preparerEnvoiLabo()">+ Nouvel envoi</button>
    </div>
    <div class="card" style="padding:8px 10px">
      ${liste.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Référence</th><th>Patient</th><th>Travail demandé</th><th>Laboratoire</th><th>Envoi</th><th>Retour</th><th>Statut</th></tr></thead>
        <tbody>${lignes}</tbody></table></div>`
      : `<div class="vide"><div class="ico">📦</div><div class="titre">Aucun travail dans cette catégorie</div></div>`}
    </div>
    <p class="texte-doux texte-petit" style="margin-top:12px">Laboratoires partenaires : ${db.laboratoires.map(l => `${echapper(l.nom)} (${echapper(l.ville)})`).join(" · ")}</p>`;

  $("#filtreLabo").addEventListener("change", e => { filtreLaboStatut = e.target.value; rendreLaboratoire(); });
}

function changerStatutLabo(id, statut) {
  const t = db.travauxLabo.find(x => x.id === id);
  t.statut = statut;
  if ((statut === "Retourné au service" || statut === "Travaux terminés") && !t.dateRetour) t.dateRetour = aujourdhui();
  if (statut === "Envoyé au laboratoire" || statut === "En cours de fabrication") t.dateRetour = null;
  sauvegarder();
  toast(`${t.reference} : ${statut}`);
  rendreLaboratoire();
  mettreAJourBadges();
}

function preparerEnvoiLabo() {
  remplirSelectPatients();
  $("#selectLabo").innerHTML = db.laboratoires.map(l => `<option value="${l.id}">${echapper(l.nom)} — ${echapper(l.ville)}</option>`).join("");
  const form = $("#formLabo");
  form.elements.dateEnvoi.value = aujourdhui();
  const retour = new Date(); retour.setDate(retour.getDate() + 10);
  form.elements.dateRetourPrevue.value = retour.toISOString().slice(0, 10);
  ouvrirModale("modalLabo");
}

/* ============================================================
   VUE — POSES & CONTRÔLES
   ============================================================ */
function rendrePoses() {
  const aVenir = db.suivis.filter(s => s.statut.startsWith("Programmé")).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const aPlanifier = db.suivis.filter(s => s.statut === "À planifier");
  const realises = db.suivis.filter(s => s.statut.startsWith("Réalis")).sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const carteSuivi = (s, avecActions) => {
    const p = patientParId(s.patientId);
    const estPose = s.type.toLowerCase().includes("pose");
    const ecart = s.date ? ecartJours(s.date) : null;
    let dateTexte = "Date à définir";
    if (s.date) {
      dateTexte = formaterDate(s.date);
      if (s.statut.startsWith("Programmé")) {
        dateTexte += ecart === 0 ? " — aujourd'hui" : ecart === 1 ? " — demain" : ` — dans ${ecart} j`;
      }
    }
    return `<div class="ligne-rdv">
      ${p ? avatar(p) : ""}
      <div class="rdv-infos">
        <div class="nom" style="cursor:pointer" onclick="ouvrirPatient('${s.patientId}')">${echapper(p ? p.nom : "")}</div>
        <div class="motif">${echapper(p ? p.typeProthese : "")}</div>
        <div class="texte-doux texte-petit">${echapper(s.observations || "")}</div>
      </div>
      <div class="rdv-meta">${dateTexte}</div>
      ${badge(s.type, estPose ? "sauge" : "violet")}
      ${avecActions ? `<button class="btn btn-ghost btn-petit" onclick="marquerSuiviRealise('${s.id}')">Marquer comme fait</button>` : ""}
      ${s.statut === "À planifier" ? `<button class="btn btn-bleu btn-petit" onclick="planifierControle('${s.id}')">Planifier un RDV</button>` : ""}
    </div>`;
  };

  $("#view-poses").innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><div><h3>Poses et contrôles à venir</h3><div class="sous-titre">Échéances programmées du service</div></div></div>
        ${aVenir.length ? aVenir.map(s => carteSuivi(s, true)).join("") : `<div class="vide"><div class="ico">🗓</div><div class="titre">Rien de programmé</div></div>`}
        ${aPlanifier.length ? `<div style="margin-top:16px"><h3 style="font-size:14px;margin-bottom:6px">⚠ À planifier</h3>${aPlanifier.map(s => carteSuivi(s, false)).join("")}</div>` : ""}
      </div>
      <div class="card">
        <div class="card-head"><div><h3>Historique récent</h3><div class="sous-titre">Poses effectuées et contrôles réalisés</div></div></div>
        ${realises.length ? realises.map(s => carteSuivi(s, false)).join("") : `<p class="texte-doux">Aucun suivi réalisé pour le moment.</p>`}
      </div>
    </div>`;
}

function marquerSuiviRealise(id) {
  const s = db.suivis.find(x => x.id === id);
  s.statut = s.type.toLowerCase().includes("pose") ? "Réalisée" : "Réalisé";
  if (!s.date || ecartJours(s.date) > 0) s.date = aujourdhui();

  if (s.type.toLowerCase().includes("pose") && !s.type.toLowerCase().includes("provisoire")) {
    const p = patientParId(s.patientId);
    if (p && p.statut !== "Traitement terminé") p.statut = "Pose effectuée – en contrôle";
    db.suivis.push({ id: nouvelId("sui"), patientId: s.patientId, type: "Contrôle J+7", date: null, statut: "À planifier", observations: "Contrôle post-insertion à programmer." });
    toast("Pose enregistrée — un contrôle J+7 a été ajouté à planifier");
  } else {
    toast("Suivi marqué comme réalisé");
  }
  sauvegarder();
  rendrePoses();
  mettreAJourBadges();
}

function planifierControle(suiviId) {
  const s = db.suivis.find(x => x.id === suiviId);
  remplirSelectPatients();
  $("#selectPatientRdv").value = s.patientId;
  $("#formRdv").elements.motif.value = s.type;
  $("#formRdv").dataset.suiviId = suiviId;
  ouvrirModale("modalRdv");
}

/* ============================================================
   MODALES ET FORMULAIRES
   ============================================================ */
function ouvrirModale(id) { $("#" + id).classList.add("ouvert"); }
function fermerModale(id) {
  $("#" + id).classList.remove("ouvert");
  if (id === "modalRdv") delete $("#formRdv").dataset.suiviId;
}

function remplirSelectPatients() {
  const options = [...db.patients].sort((a, b) => a.nom.localeCompare(b.nom))
    .map(p => `<option value="${p.id}">${echapper(p.nom)} — ${echapper(p.numero)}</option>`).join("");
  $("#selectPatientRdv").innerHTML = options;
  $("#selectPatientLabo").innerHTML = options;
}

function remplirSelectsEquipe() {
  $("#selectEtudiantPatient").innerHTML = db.etudiants.map(e => `<option value="${e.id}">${echapper(e.nom)} (${echapper(e.niveau)})</option>`).join("");
  $("#selectEnseignantPatient").innerHTML = db.enseignants.map(e => `<option value="${e.id}">${echapper(e.nom)}</option>`).join("");
}

/* Étapes types selon le genre de traitement (pour les nouveaux dossiers) */
function planParDefaut(typeProthese) {
  if (typeProthese.includes("amovible complète")) return [
    "Examen clinique et radiologique", "Empreintes primaires", "Empreintes secondaires",
    "Enregistrement de la relation intermaxillaire", "Essayage du montage des dents",
    "Mise en moufle et polymérisation (laboratoire)", "Pose et équilibration occlusale", "Contrôle à 7 jours puis 1 mois"
  ];
  if (typeProthese.includes("amovible partielle")) return [
    "Examen clinique et analyse des modèles", "Aménagements pré-prothétiques", "Empreinte de travail",
    "Essayage du châssis métallique", "Montage des dents et essayage", "Pose de la prothèse", "Contrôles d'adaptation"
  ];
  if (typeProthese.includes("implant")) return [
    "Bilan clinique et radiologique", "Empreinte des implants", "Confection prothétique au laboratoire",
    "Pose et réglages", "Contrôle à 7 jours puis 1 mois"
  ];
  return [
    "Examen clinique", "Préparation dentaire", "Empreinte de précision",
    "Essayage de l'infrastructure", "Essayage final et choix de teinte", "Scellement / collage définitif", "Contrôle à 1 mois"
  ];
}

document.addEventListener("DOMContentLoaded", () => {
  $("#topbarDate").textContent = formaterDate(aujourdhui(), true);
  remplirSelectsEquipe();

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => afficherVue(item.dataset.view));
  });

  $("#btnNouveauPatient").addEventListener("click", () => ouvrirModale("modalPatient"));

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
      numero,
      nom: f.elements.nom.value.trim(),
      age: parseInt(f.elements.age.value, 10) || 0,
      sexe: f.elements.sexe.value,
      telephone: f.elements.telephone.value.trim() || "—",
      adresse: "—",
      typeProthese: f.elements.typeProthese.value,
      dents: [], arcade: "À préciser après examen",
      statut: "En cours de traitement",
      etudiantId: f.elements.etudiantId.value,
      enseignantId: f.elements.enseignantId.value,
      dateAdmission: aujourdhui(),
      motif: f.elements.motif.value.trim() || "À compléter lors de la première consultation.",
      antecedents: "À recueillir lors de l'interrogatoire.",
      allergies: "À vérifier",
      plan: planParDefaut(f.elements.typeProthese.value).map((etape, i) => ({
        etape, statut: i === 0 ? "En cours" : "À venir", date: i === 0 ? aujourdhui() : null
      })),
      historique: [{
        date: aujourdhui(), titre: "Ouverture du dossier",
        texte: "Dossier créé et attribué pour prise en charge au service de prothèse.",
        auteur: etudiantParId(f.elements.etudiantId.value)?.nom || "Service"
      }]
    };
    db.patients.push(nouveau);
    sauvegarder();
    fermerModale("modalPatient");
    f.reset();
    toast(`Dossier ${numero} créé pour ${nouveau.nom}`);
    ouvrirPatient(nouveau.id);
  });

  /* --- Création d'un rendez-vous --- */
  const formRdv = $("#formRdv");
  formRdv.elements.date.value = aujourdhui();
  formRdv.addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const p = patientParId(f.elements.patientId.value);
    db.rendezvous.push({
      id: nouvelId("rdv"),
      patientId: f.elements.patientId.value,
      date: f.elements.date.value,
      heure: f.elements.heure.value,
      duree: parseInt(f.elements.duree.value, 10),
      motif: f.elements.motif.value.trim(),
      etudiantId: p ? p.etudiantId : db.etudiants[0].id,
      box: f.elements.box.value,
      statut: "Confirmé"
    });
    /* Si ce RDV planifie un contrôle en attente, on met le suivi à jour. */
    if (f.dataset.suiviId) {
      const s = db.suivis.find(x => x.id === f.dataset.suiviId);
      if (s) { s.statut = s.type.toLowerCase().includes("pose") ? "Programmée" : "Programmé"; s.date = f.elements.date.value; }
      delete f.dataset.suiviId;
    }
    sauvegarder();
    fermerModale("modalRdv");
    f.reset(); f.elements.date.value = aujourdhui();
    toast(`Rendez-vous planifié pour ${p ? p.nom : ""} le ${formaterDate(db.rendezvous[db.rendezvous.length - 1].date)}`);
    if (vueActuelle === "rendezvous") rendreRendezvous();
    if (vueActuelle === "poses") rendrePoses();
    if (vueActuelle === "patient" && patientOuvertId) rendreFichePatient(patientOuvertId);
    if (vueActuelle === "dashboard") rendreDashboard();
    mettreAJourBadges();
  });

  /* --- Nouvel envoi au laboratoire --- */
  $("#formLabo").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const reference = "LAB-" + (1072 + db.travauxLabo.length);
    db.travauxLabo.push({
      id: nouvelId("lab"),
      reference,
      patientId: f.elements.patientId.value,
      laboratoireId: f.elements.laboratoireId.value,
      travail: f.elements.travail.value.trim(),
      dateEnvoi: f.elements.dateEnvoi.value,
      dateRetourPrevue: f.elements.dateRetourPrevue.value,
      dateRetour: null,
      statut: "Envoyé au laboratoire",
      teinte: f.elements.teinte.value.trim() || "—",
      notes: f.elements.notes.value.trim()
    });
    const p = patientParId(f.elements.patientId.value);
    if (p && p.statut === "En cours de traitement") p.statut = "En attente laboratoire";
    sauvegarder();
    fermerModale("modalLabo");
    f.reset();
    toast(`Envoi ${reference} enregistré`);
    if (vueActuelle === "laboratoire") rendreLaboratoire();
    mettreAJourBadges();
  });

  /* --- Réinitialisation de la démo --- */
  $("#btnReset").addEventListener("click", () => {
    if (confirm("Réinitialiser toutes les données de démonstration ? Vos modifications seront perdues.")) {
      db = copieProfonde(DONNEES_INITIALES);
      sauvegarder();
      patientOuvertId = null;
      afficherVue("dashboard");
      toast("Données de démonstration réinitialisées");
    }
  });

  afficherVue("dashboard");
});
