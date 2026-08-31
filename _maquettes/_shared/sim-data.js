/* ============================================================
 * SOURCE UNIQUE DE VÉRITÉ — simulateur local de l'API Trace In
 * ------------------------------------------------------------
 * Chargé par TOUTES les pages du jalon 0 qui affichent des véhicules,
 * remorques, missions ou alertes (Live Tracking, Remorques, et les
 * écrans à venir). Aucune page ne redéfinit vehicles/alerts localement
 * — chacune lit exclusivement window.SIM et les fonctions exposées ici.
 * C'est la garantie structurelle, pas seulement documentaire, que
 * "Live Tracking : C-027 -> Ibrahim Traoré -> RQ-133" et
 * "Remorques : RQ-133 -> C-027 -> Ibrahim Traoré" restent la même donnée :
 * il n'existe qu'un seul exemplaire de cette donnée dans tout le jalon 0.
 *
 * Convention d'identifiant : `id` reste TR-xxx (convention actuelle des
 * maquettes). `display_id` est prévu pour recevoir la convention réelle
 * Cxxx dès qu'elle sera confirmée par le commanditaire — aucune valeur
 * Cxxx n'est devinée ici (voir CADRAGE_V0_PILOTE §7 point 3, encore sans
 * réponse). displayId(vehicle) est la SEULE fonction à utiliser pour
 * afficher un identifiant camion à l'écran ; le jour où display_id est
 * renseigné pour les 7 véhicules, toutes les pages basculent ensemble
 * sans autre changement de code.
 *
 * Point d'évolution vers l'architecture cible (cf. demande du 30/08/2026,
 * §11) : ce fichier est le seul endroit qui construit SIM.vehicles /
 * SIM.alerts. Remplacer plus tard ce bloc par un appel au connecteur
 * Trace In réel (fetch/WebSocket) qui retourne la même forme de données
 * suffira à brancher l'API — aucune page consommatrice n'aura à changer.
 * C'est aussi la coupe naturelle pour un futur découpage en composants
 * React/Next.js : SIM devient un store partagé (contexte / état global),
 * les fonctions de rendu de chaque écran deviennent des composants qui
 * le lisent, comme elles le font déjà ici via de simples appels de
 * fonction.
 * ============================================================ */
(function (global) {
  'use strict';

  function displayId(v) { return (v && v.display_id) ? v.display_id : (v ? v.id : '—'); }

  var SIM = {

    vehicles: [
      {
        id: 'TR-014', display_id: null, trailer_id: 'RQ-108', trailer_type: "20'", site: 'Nord',
        map: { x: 575, y: 97, labelX: 575, labelY: 82, dwellX: 575, dwellY: 112, anchor: 'middle', shortLabel: "N'Guessan" },
        statut: 'proposee', statutLabel: 'Proposée',
        driver: { name: "Koffi N'Guessan", confirmed: true },
        sources: { guerite: 'ok', tag: 'ok', gps: 'ok' },
        mission: { heure: '08:10', type: 'Livraison-Récup', client: 'Nestlé CI', from: 'Site Nord', to: 'Nestlé CI', site: 'Nord' },
        geofence: { zone: 'Site Nord', events: [{ type: 'enter', time: '09:44' }] },
        note: 'Temps de conduite continue dépassé (2h32, seuil 2h15) — voir les alertes.'
      },
      {
        id: 'TR-041', display_id: null, trailer_id: 'RQ-149', trailer_type: "20'", site: 'Sud',
        map: { x: 518, y: 273, labelX: 518, labelY: 258, dwellX: 518, dwellY: 288, anchor: 'middle', shortLabel: 'Bamba' },
        statut: 'proposee', statutLabel: 'Proposée',
        driver: { name: 'Serge Bamba', confirmed: true },
        sources: { guerite: 'ok', tag: 'missing', gps: 'ok' },
        mission: { heure: '07:05', type: 'Livraison-Récup', client: null, from: 'Port d’Abidjan', to: '« Client non identifié »', site: 'Sud' },
        geofence: { zone: 'Site Sud', events: [{ type: 'enter', time: '09:48' }, { type: 'exit', time: '09:53' }, { type: 'enter', time: '09:58' }], graceDemo: true },
        note: "Tag iButton non remonté depuis le début du service (07:05). Courte sortie 09:53→09:58 sans effet sur le compteur (règle des 15 min)."
      },
      {
        id: 'TR-055', display_id: null, trailer_id: 'RQ-116', trailer_type: null, site: 'Sud',
        map: { x: 632, y: 273, labelX: 632, labelY: 258, dwellX: 632, dwellY: 288, anchor: 'middle', shortLabel: 'Diabaté' },
        statut: 'validee', statutLabel: 'Validée',
        driver: { name: 'Moussa Diabaté', confirmed: true },
        sources: { guerite: 'attn', tag: 'ok', gps: 'ok' },
        mission: { heure: '07:00', type: 'Mission client', client: 'CFAO Motors', from: 'Site Sud', to: 'CFAO Motors', site: 'Sud' },
        geofence: { zone: 'Site Sud', events: [{ type: 'enter', time: '09:40' }] },
        note: 'Passage guérite manquant en entrée (09:40) et fin de service anticipée (prévue ≈ 11:15).',
        container: { code: 'MSCU 778812-4', qrToChange: true }
      },
      {
        id: 'TR-027', display_id: null, trailer_id: 'RQ-133', trailer_type: "40'", site: 'Nord',
        map: { x: 300, y: 120, labelX: 311, labelY: 118, dwellX: 311, dwellY: 131, anchor: 'start', shortLabel: 'Traoré' },
        statut: 'rapprochee', statutLabel: 'Rapprochée',
        driver: { name: 'Ibrahim Traoré', confirmed: true },
        sources: { guerite: 'ok', tag: 'ok', gps: 'ok' },
        mission: { heure: '06:00', type: 'Transfert', client: null, from: "Port d’Abidjan", to: 'Site Nord (plein)', site: 'Nord' },
        geofence: { zone: 'Site Nord', events: [{ type: 'enter', time: '09:30' }] },
        note: 'Survitesse : 3 événements sur le shift (dernier 10:15, 92 km/h / limite 70).'
      },
      {
        id: 'TR-021', display_id: null, trailer_id: 'RQ-162', trailer_type: "40'", site: 'Sud',
        map: { x: 358, y: 222, labelX: 369, labelY: 220, dwellX: 369, dwellY: 233, anchor: 'start', shortLabel: 'Cissé ⚠', pulse: true },
        statut: 'anomalie', statutLabel: 'Anomalie',
        driver: { name: 'Fatou Cissé (déclarée guérite) / Ibrahim Traoré (tag)', confirmed: false, contested: true },
        sources: { guerite: 'mismatch', tag: 'mismatch', gps: 'ok' },
        mission: { heure: '08:20', type: 'Livraison-Récup', client: 'Groupe Sifca', from: "Port d’Abidjan", to: 'Groupe Sifca', site: 'Sud' },
        geofence: { zone: 'Groupe Sifca (client)', events: [{ type: 'enter', time: '10:00' }] },
        note: '⚠ Preuves incohérentes — la guérite et le tag ne désignent pas le même chauffeur.',
        container: { code: 'CMAU 112233-4' }
      },
      {
        id: 'TR-063', display_id: null, trailer_id: 'RQ-190', trailer_type: null, site: 'Sud',
        map: { x: 278, y: 197, labelX: 234, labelY: 212, dwellX: null, dwellY: null, anchor: 'start', shortLabel: 'non confirmé' },
        statut: 'detectee', statutLabel: 'Détectée',
        driver: { name: 'Non confirmé', confirmed: false },
        sources: { guerite: 'missing', tag: 'missing', gps: 'missing' },
        mission: { heure: '08:45', type: null, client: null, from: null, to: 'Aucune ligne planifiée ne correspond', site: 'Sud' },
        geofence: null,
        note: 'GPS non remonté depuis 2h12 (dernière émission 08:30). Chauffeur non confirmé. Statut déclaré : en mission (Sud).'
      },
      {
        id: 'TR-058', display_id: null, trailer_id: null, trailer_type: null, site: 'Nord',
        map: { x: 390, y: 300, labelX: 337, labelY: 298, dwellX: null, dwellY: null, anchor: 'start', shortLabel: 'sans mission/chauffeur', pulse: true },
        statut: 'detectee', statutLabel: 'Détectée',
        driver: { name: 'Non identifié', confirmed: false },
        sources: { guerite: 'missing', tag: 'missing', gps: 'ok' },
        mission: { heure: '10:30', type: null, client: null, from: null, to: 'Aucune ligne planifiée ne correspond', site: 'Nord' },
        geofence: null,
        note: '⚠ Camion en mouvement (GPS actif depuis 10:18) sans mission planifiée ni chauffeur confirmé.'
      }
    ],

    // Alertes actives : chaque alerte référence vehicle_id, type(s),
    // severity, timestamp, description, detail — jamais un camion hors
    // référentiel (règle établie le 30/08/2026, réaffirmée à chaque écran).
    alerts: [
      {
        id: 'al-01', vehicle_id: 'TR-058', types: ['sans_mission', 'sans_chauffeur'], severity: 'critique',
        timestamp: '10:18', title: 'Camion en mouvement sans mission ni chauffeur',
        description: 'GPS actif, camion en déplacement (Nord) depuis 10:18, aucune mission planifiée ne correspond, aucun chauffeur confirmé.',
        meta: 'détectée 10:18', resolveNote: "se résout à l'affectation d'une mission et d'un chauffeur confirmé",
        detail: { compare: { guerite: '—', tag: '—', gps: 'actif, en mouvement' }, note: "Cas à examiner en priorité : aucune preuve d'identité, camion non stationnaire." }
      },
      {
        id: 'al-02', vehicle_id: 'TR-021', types: ['identite_divergente'], severity: 'critique',
        title: 'Preuves incohérentes', sourceTag: 'Guérite ≠ Tag',
        description: 'Tag/iButton (Ibrahim Traoré) ≠ déclaration guérite (Fatou Cissé).',
        timestamp: '08:16', meta: 'détectée 08:16', resolveNote: "se résout à la résolution de l'anomalie en File de validation",
        detail: { compare: { guerite: 'Fatou Cissé', tag: 'Ibrahim Traoré', gps: 'cohérent avec Ibrahim Traoré' }, note: 'L’agent doit comparer les trois sources avant validation — même logique de comparaison que dans Planning et File de validation.' }
      },
      {
        id: 'al-03', vehicle_id: 'TR-063', types: ['gps_silencieux'], severity: 'critique',
        title: 'GPS non remonté', sourceTag: 'Source : GPS',
        description: 'Aucune émission depuis 2h12 (dernière position connue 08:30). Statut déclaré : en mission (Sud).',
        timestamp: '08:30', meta: 'seuil : > 2h', resolveNote: "se résout à la reprise d'émission",
        detail: { compare: { guerite: '—', tag: '—', gps: 'silencieux depuis 08:30' }, note: 'Camion également signalé en mouvement sans mission/chauffeur confirmé sur un autre véhicule du référentiel (TR-058) — cas distinct.' }
      },
      {
        id: 'al-04', vehicle_id: 'TR-027', types: ['temps_travail'], severity: 'important',
        title: 'Temps de travail dépassé',
        description: 'Ibrahim Traoré — 53h30 cumulées sur les 6 derniers jours, seuil hebdomadaire 52h dépassé de 1h30.',
        timestamp: null, meta: 'seuil : 52h / semaine', resolveNote: 'se résout au renouvellement de la semaine de suivi',
        detail: { note: 'Cumul glissant sur 6 jours, suivi automatique — indépendant des heures du shift en cours.' }
      },
      {
        id: 'al-05', vehicle_id: 'TR-014', types: ['conduite_continue'], severity: 'important',
        title: 'Temps de conduite continue dépassé',
        description: "Koffi N'Guessan (TR-014) — 2h32 de conduite continue sans pause détectée, seuil 2h15 dépassé de 17 min.",
        timestamp: null, meta: 'seuil : 2h15', resolveNote: 'se résout à la première pause détectée',
        detail: { note: 'Conduite continue depuis 08:10 (début de mission TR-014), aucune pause détectée depuis.' }
      },
      {
        id: 'al-06', vehicle_id: 'TR-027', types: ['survitesse'], severity: 'important',
        title: 'Survitesse',
        description: 'Ibrahim Traoré (TR-027) — 3 survitesses détectées sur le shift, dernière à 10:15 (92 km/h / limite 70).',
        timestamp: '10:15', meta: 'seuil : ≥ 3 événements', resolveNote: 'se résout en fin de shift si non répété',
        detail: { note: 'Événements à 07:48, 09:02 et 10:15. Source : GPS/télématique.' }
      },
      {
        id: 'al-07', vehicle_id: 'TR-055', types: ['fin_anticipee'], severity: 'important',
        title: 'Fin anticipée',
        description: 'Moussa Diabaté (TR-055) — fin de service détectée à 09:40, alors que la mission prévoit une fin vers 11:15 (écart 1h35).',
        timestamp: '09:40', meta: 'écart : 1h35', resolveNote: "se résout à la confirmation par l'agent",
        detail: { note: 'Retour en geofence Site Sud à 09:40 sans passage guérite associé — voir aussi « Guérite sans signal ».' }
      },
      {
        id: 'al-08', vehicle_id: 'TR-041', types: ['sans_ibutton'], severity: 'surveiller',
        title: 'Camion sans clé iButton', sourceTag: 'Source : Tag / iButton',
        description: 'TR-041 — Serge Bamba identifié par la guérite, aucune lecture iButton depuis le début du service (07:05).',
        timestamp: '07:05', meta: 'seuil : depuis le début de service', resolveNote: 'se résout à la première lecture iButton',
        detail: { compare: { guerite: 'Serge Bamba', tag: '—', gps: 'cohérent' } }
      },
      {
        id: 'al-09', vehicle_id: 'TR-055', types: ['guerite_sans_signal'], severity: 'surveiller',
        title: 'Guérite sans signal', sourceTag: 'Source : Guérite',
        description: 'TR-055 — entrée détectée par GPS dans Site Sud à 09:40, aucun passage guérite enregistré pour ce retour.',
        timestamp: '09:40', meta: 'détectée 09:40', resolveNote: 'se résout à la régularisation du passage guérite',
        detail: { compare: { guerite: 'aucun passage enregistré', tag: 'cohérent', gps: 'entrée Site Sud 09:40' }, note: 'Voir aussi « Fin anticipée » : même retour anticipé côté Site Sud.' }
      },
      {
        id: 'al-10', vehicle_id: 'TR-014', types: ['sixieme_jour'], severity: 'surveiller',
        title: '6ᵉ jour consécutif',
        description: "Koffi N'Guessan — aucun jour de repos depuis 6 jours de travail.",
        timestamp: null, meta: 'suivi automatique', resolveNote: 'se résout au prochain jour de repos',
        detail: { note: 'Dernier jour de repos enregistré il y a 6 jours ouvrés.' }
      }
    ],

    // Catégories du filtre anomalies — la liste existe même quand aucune
    // alerte active de ce type n'est présente dans le référentiel actuel
    // (0 n'est pas une absence de la catégorie, seulement une absence de
    // cas actif à ce jour).
    alertTypes: [
      { key: 'gps_silencieux', label: 'GPS silencieux' },
      { key: 'guerite_sans_signal', label: 'Guérite sans signal' },
      { key: 'sans_ibutton', label: 'Camion sans clé iButton' },
      { key: 'attente_20min', label: "Temps d'attente > 20 min" },
      { key: 'arret_non_identifie', label: 'Arrêt non identifié' },
      { key: 'retard_shift', label: 'Retard début de shift' },
      { key: 'faible_rotation', label: 'Faible rotation' },
      { key: 'survitesse', label: 'Survitesse' },
      { key: 'mauvaise_conduite', label: 'Mauvaise conduite' },
      { key: 'fin_anticipee', label: 'Fin anticipée' },
      { key: 'conduite_continue', label: 'Temps de conduite continue dépassé' },
      { key: 'temps_travail', label: 'Temps de travail dépassé' },
      { key: 'sixieme_jour', label: '6ᵉ jour consécutif' },
      { key: 'identite_divergente', label: 'Identité divergente' },
      { key: 'sans_mission', label: 'Véhicule sans mission' },
      { key: 'sans_chauffeur', label: 'Véhicule sans chauffeur' }
    ],

    // Objectifs de rotation validés le 29/07/2026 — SPEC_PRESET_TRANSPORT
    // §6 / WORKFLOW_TRANSPORT_A_Z §6. Cités tels quels depuis les README,
    // aucun objectif supplémentaire n'est inventé. "target: null" = objectif
    // défini au cas par cas à la création de chaque mission (pas un chiffre
    // global), conformément au cahier des charges.
    rotationObjectives: [
      { key: 'livraison_recup_nord', family: 'Livraison-Récup', site: 'Nord', label: 'Livraison-Récup · Nord', target: 5 },
      { key: 'livraison_recup_sud', family: 'Livraison-Récup', site: 'Sud', label: 'Livraison-Récup · Sud', target: 3 },
      { key: 'transfert', family: 'Transfert', site: null, label: 'Transfert', target: 3 },
      { key: 'mission_client', family: 'Mission client', site: null, label: 'Mission client', target: null }
    ],

    // Véhicules référencés par les données sources d'origine (missions,
    // géofences, alertes) mais absents du référentiel actif de la carte.
    // Conservés pour un futur modèle global, JAMAIS rendus dans les blocs
    // actifs d'aucune page (Live Tracking, Remorques, ...).
    outOfScope: {
      ids: ['TR-009', 'TR-032', 'TR-018'],
      note: "TR-009 (2 segments, Aya Kouassi puis Paul Kouadio), TR-032 (Aya Kouassi) et TR-018 (Jean-Baptiste Yao, Travaux sur site) apparaissaient dans les missions, la présence en géofence et/ou les alertes d'origine, sans jamais avoir de position sur la carte. Exclus des blocs actifs de la simulation ; données préservées ici, non affichées.",
      missions: [
        { vehicle_id: 'TR-009', heure: '07:35', driver: 'Aya Kouassi', trailer_id: 'RQ-175', type: 'Mission client', client: 'Unilever CI', site: 'Nord', statut: 'proposee' },
        { vehicle_id: 'TR-009', heure: '10:00', driver: 'Paul Kouadio', trailer_id: 'RQ-175', type: 'Mission client', client: 'SIVAC', site: 'Nord', statut: 'validee' },
        { vehicle_id: 'TR-032', heure: '06:30', driver: 'Aya Kouassi', trailer_id: 'RQ-201+202', type: 'Transfert', client: null, site: 'Sud', statut: 'planifiee' },
        { vehicle_id: 'TR-018', heure: '09:00', driver: 'Jean-Baptiste Yao', trailer_id: 'RQ-140', type: 'Travaux sur site', client: null, site: 'Nord', statut: 'planifiee' }
      ],
      geofence: [{ vehicle_id: 'TR-009', zone: 'SIVAC (client · Nord)', events: [{ type: 'enter', time: '10:24' }] }],
      alerts: [
        { vehicle_id: 'TR-009', type: 'mauvaise_conduite', title: 'Mauvaise conduite', description: 'Paul Kouadio (TR-009, segment 2/2) — freinages brusques et accélérations rapides répétés (4 événements en 20 min).' },
        { vehicle_id: 'TR-018', type: 'retard_shift', title: 'Retard de début de shift', description: "Jean-Baptiste Yao — aucune activité détectée à 9h35, au-delà de 30 min après l'heure de référence (9h Nord)." },
        { vehicle_id: 'TR-032', type: 'faible_rotation', title: 'Faible rotation', description: 'Aya Kouassi — 1 rotation à 10h30 pour un objectif Nord de 5 ; segments TR-032 (06:30) puis TR-009 (07:35→).' }
      ]
    },

    clientOptions: ['SOCACI', 'Nestlé CI', 'CFAO Motors', 'Groupe Sifca', 'SIVAC', 'Unilever CI']
  };

  // Horloge de référence commune à toute la simulation (utilisée par le
  // calcul des durées de présence en géofence — règle des 15 minutes).
  var NOW = '10:42';

  // ---------- utilitaires temps ----------
  function toMin(hhmm) { var p = hhmm.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function computeDwell(events, nowStr, graceMin) {
    graceMin = graceMin || 15;
    var evs = events.map(function (e) { return { type: e.type, m: toMin(e.time) }; }).sort(function (a, b) { return a.m - b.m; });
    var anchor = null, lastExit = null;
    evs.forEach(function (e) {
      if (e.type === 'enter') {
        if (anchor === null) anchor = e.m;
        else if (lastExit !== null && (e.m - lastExit) >= graceMin) anchor = e.m;
        lastExit = null;
      } else if (e.type === 'exit') { lastExit = e.m; }
    });
    var now = toMin(nowStr);
    return { anchorMin: anchor, elapsedMin: (anchor === null ? null : now - anchor) };
  }
  function formatDwell(min) {
    if (min === null || min < 0) return '—';
    min = Math.round(min);
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60), m = min % 60;
    return h + ' h ' + (m < 10 ? '0' : '') + m;
  }
  function minToClock(min) {
    if (min === null) return '—';
    var h = Math.floor(min / 60) % 24, m = min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function srcLabel(v) { return v === 'ok' ? 'cohérent' : v === 'attn' ? 'à vérifier' : v === 'mismatch' ? 'incohérent' : 'non remonté'; }
  function srcClass(v) { return v === 'ok' ? 'ok' : v === 'attn' ? 'attn' : v === 'mismatch' ? 'mismatch' : 'missing'; }

  // ---------- accès au référentiel ----------
  function getVehicle(id) {
    for (var i = 0; i < SIM.vehicles.length; i++) if (SIM.vehicles[i].id === id) return SIM.vehicles[i];
    return null;
  }
  function alertsFor(vehicleFilter, typeFilter) {
    return SIM.alerts.filter(function (a) {
      if (vehicleFilter && vehicleFilter !== 'all' && a.vehicle_id !== vehicleFilter) return false;
      if (typeFilter && typeFilter !== 'all' && a.types.indexOf(typeFilter) === -1) return false;
      return true;
    });
  }
  function alertCountForType(key) {
    return SIM.alerts.filter(function (a) { return a.types.indexOf(key) !== -1; }).length;
  }
  function alertsForVehicle(id) {
    return SIM.alerts.filter(function (a) { return a.vehicle_id === id; });
  }

  // Position = donnée dérivée du référentiel (zone de géofence si connue,
  // sinon le trajet de la mission en cours) — jamais une coordonnée ou un
  // texte inventé pour l'occasion.
  function derivedPosition(v) {
    if (v.geofence) return esc(v.geofence.zone);
    if (v.mission.from && v.mission.to) return 'En route (' + esc(v.mission.from) + ' → ' + esc(v.mission.to) + ')';
    return 'Hors géofence connue (en transit ou non rattaché)';
  }
  // Dernière position connue = l'horodatage le plus récent réellement
  // présent dans le référentiel (dernier événement géofence, sinon
  // l'heure de la mission) — dérivé, pas fabriqué.
  function lastKnownTime(v) {
    var times = [v.mission.heure];
    if (v.geofence) v.geofence.events.forEach(function (e) { times.push(e.time); });
    times = times.filter(Boolean).sort();
    return times.length ? times[times.length - 1] : '—';
  }

  // Historique dérivé (réutilisé par Live Tracking ET Remorques) : combine
  // l'heure de mission, les événements de géofence et les alertes du
  // véhicule en une seule frise chronologique triée — aucune donnée créée
  // pour l'occasion, uniquement des champs déjà présents dans SIM.
  function vehicleHistory(v) {
    var entries = [];
    entries.push({ time: v.mission.heure, label: 'Début de mission — ' + (v.mission.type || 'type non défini') + (v.mission.client ? ' · ' + v.mission.client : ''), alert: false });
    if (v.geofence) {
      v.geofence.events.forEach(function (e) {
        entries.push({ time: e.time, label: (e.type === 'enter' ? 'Entrée géofence ' : 'Sortie géofence ') + v.geofence.zone, alert: false });
      });
    }
    alertsForVehicle(v.id).forEach(function (a) {
      entries.push({ time: a.timestamp || a.meta || '—', label: 'Alerte — ' + a.title, alert: true });
    });
    entries.sort(function (a, b) { return String(a.time).localeCompare(String(b.time)); });
    return entries;
  }

  /* ============================================================
   * FONCTIONS DE CALCUL PURES (agrégations) — ajoutées pour l'écran
   * Dashboard, réutilisables par tout futur écran d'analyse. Toutes ne
   * lisent que SIM ; aucune ne touche au DOM. C'est délibéré (cf. demande
   * du 30/08/2026 §20) : au moment de la migration React/Next.js, chacune
   * devient directement un selector/hook sans changement de logique — le
   * rendu (dashboard.html) reste seul responsable du HTML.
   * ============================================================ */

  // Même définition de "véhicule utilisé" que Live Tracking (renderFleet) :
  // un véhicule est utilisé s'il porte une mission (type ou destination),
  // jamais une deuxième définition inventée pour le Dashboard.
  function fleetStats() {
    var total = SIM.vehicles.length;
    var used = SIM.vehicles.filter(function (v) { return v.mission && (v.mission.type || v.mission.to); }).length;
    return { total: total, used: used, unused: total - used };
  }

  function alertsByType() {
    return SIM.alertTypes.map(function (t) {
      return { key: t.key, label: t.label, count: alertCountForType(t.key) };
    });
  }

  // Rattache la mission en cours d'un véhicule à un objectif de rotation
  // du preset (familles/zones citées telles quelles depuis les README).
  // "Travaux sur site" ne rattache à aucun objectif (pas de rotation —
  // question ouverte du cahier des charges, non tranchée ici).
  function rotationBucketForVehicle(v) {
    var m = v.mission;
    if (!m || !m.type) return null;
    if (m.type === 'Livraison-Récup') {
      if (m.site === 'Nord') return 'livraison_recup_nord';
      if (m.site === 'Sud') return 'livraison_recup_sud';
      return null;
    }
    if (m.type === 'Transfert') return 'transfert';
    if (m.type === 'Mission client') return 'mission_client';
    return null;
  }

  // Aperçu figé (10:42) des missions actives par objectif — PAS un
  // cumul de rotations sur la journée : SIM ne stocke qu'une mission par
  // véhicule (une seule photo du shift), donc "actives ce shift" est la
  // grandeur honnête, jamais présentée comme "rotations réalisées
  // aujourd'hui" (que rien dans SIM ne permet de compter).
  function rotationsSnapshot() {
    return SIM.rotationObjectives.map(function (obj) {
      var vehicles = SIM.vehicles.filter(function (v) { return rotationBucketForVehicle(v) === obj.key; });
      var anomalie = vehicles.filter(function (v) { return v.statut === 'anomalie'; });
      return {
        key: obj.key, label: obj.label, target: obj.target,
        active: vehicles.length, anomalie: anomalie.length,
        vehicleIds: vehicles.map(function (v) { return v.id; }),
        anomalieVehicleIds: anomalie.map(function (v) { return v.id; })
      };
    });
  }

  // Temps cumulé en géofence par zone — PROXY du "temps d'attente" : ce
  // concept n'est pas formellement défini/mesuré dans les README à ce
  // jour (durée de présence ≠ nécessairement attente improductive).
  // Fonction volontairement transparente sur cette limite.
  function dwellBySite() {
    var zones = {};
    SIM.vehicles.forEach(function (v) {
      if (!v.geofence) return;
      var d = computeDwell(v.geofence.events, NOW, 15);
      var zone = v.geofence.zone;
      if (!zones[zone]) zones[zone] = { zone: zone, totalMin: 0, vehicles: [] };
      zones[zone].totalMin += (d.elapsedMin || 0);
      zones[zone].vehicles.push({ id: v.id, elapsedMin: d.elapsedMin });
    });
    return Object.keys(zones).map(function (z) { return zones[z]; }).sort(function (a, b) { return b.totalMin - a.totalMin; });
  }

  // Véhicules dont la présence en géofence dépasse le seuil déjà nommé
  // dans SIM.alertTypes ("Temps d'attente > 20 min") — seuil repris tel
  // quel, jamais un nouveau chiffre inventé pour le Dashboard.
  function dwellThresholdVehicles(thresholdMin) {
    thresholdMin = thresholdMin || 20;
    var out = [];
    SIM.vehicles.forEach(function (v) {
      if (!v.geofence) return;
      var d = computeDwell(v.geofence.events, NOW, 15);
      if (d.elapsedMin !== null && d.elapsedMin > thresholdMin) out.push({ id: v.id, elapsedMin: d.elapsedMin, zone: v.geofence.zone });
    });
    return out;
  }

  // Répartition horaire des événements horodatés RÉELLEMENT présents
  // dans SIM (début de mission, entrée/sortie géofence, déclenchement
  // d'alerte) — décrit l'activité DE CE SHIFT UNIQUEMENT. SIM ne conserve
  // qu'un instantané figé à 10:42 : aucune série historique multi-jours
  // n'existe, donc aucune "tendance" au sens propre n'est représentée ici.
  function hourlyActivity() {
    var buckets = {};
    function addEvent(time, kind) {
      if (!time || !/^\d{2}:\d{2}$/.test(time)) return;
      var hour = time.slice(0, 2) + 'h';
      if (!buckets[hour]) buckets[hour] = { hour: hour, missions: 0, geofence: 0, alerts: 0, total: 0 };
      buckets[hour][kind]++;
      buckets[hour].total++;
    }
    SIM.vehicles.forEach(function (v) {
      if (v.mission && v.mission.heure) addEvent(v.mission.heure, 'missions');
      if (v.geofence) v.geofence.events.forEach(function (e) { addEvent(e.time, 'geofence'); });
    });
    SIM.alerts.forEach(function (a) { if (a.timestamp) addEvent(a.timestamp, 'alerts'); });
    return Object.keys(buckets).sort().map(function (h) { return buckets[h]; });
  }

  // Points d'attention = chaque alerte réelle de SIM.alerts (jamais une
  // alerte inventée) + les véhicules au-delà du seuil de présence en
  // géofence. Triés par gravité.
  function attentionPoints() {
    var points = [];
    SIM.alerts.forEach(function (a) {
      points.push({ severity: a.severity, vehicle_id: a.vehicle_id, title: a.title, description: a.description, source: 'alert', alertId: a.id });
    });
    dwellThresholdVehicles(20).forEach(function (dv) {
      points.push({
        severity: 'surveiller', vehicle_id: dv.id, source: 'dwell',
        title: 'Présence prolongée en géofence',
        description: displayId(getVehicle(dv.id)) + ' — ' + formatDwell(dv.elapsedMin) + ' en continu dans ' + dv.zone + ' (comparaison au seuil de 20 min).'
      });
    });
    var order = { critique: 0, important: 1, surveiller: 2 };
    points.sort(function (a, b) { return order[a.severity] - order[b.severity]; });
    return points;
  }

  // Même liste de chauffeurs que Live Tracking (identités confirmées +
  // Fatou Cissé en identité contestée) — logique dupliquée intentionnel-
  // lement ici plutôt que de modifier live-tracking.html hors périmètre
  // de cette étape ; à unifier lors d'un prochain passage (voir rapport).
  function driverRoster() {
    var byName = {};
    SIM.vehicles.forEach(function (v) {
      if (!v.driver.confirmed && !v.driver.contested) return;
      var key = v.driver.contested ? 'Fatou Cissé' : v.driver.name;
      if (!byName[key]) byName[key] = { name: key, vehicles: [], contested: !!v.driver.contested };
      byName[key].vehicles.push(v.id);
    });
    if (byName['Fatou Cissé'] && !byName['Ibrahim Traoré']) {
      var trV = getVehicle('TR-027');
      if (trV) byName['Ibrahim Traoré'] = { name: 'Ibrahim Traoré', vehicles: [trV.id], contested: false };
    }
    return Object.keys(byName).map(function (k) { return byName[k]; });
  }

  // Gabarit HTML du détail véhicule, identique à celui de Live Tracking —
  // dupliqué ici pour la même raison que driverRoster() ci-dessus.
  function vehicleDetailHTML(v) {
    var geo;
    if (v.geofence) {
      var d = computeDwell(v.geofence.events, NOW, 15);
      geo = esc(v.geofence.zone) + ' · entrée il y a ' + formatDwell(d.elapsedMin);
    } else {
      geo = 'Hors géofence connue (en transit ou non rattaché)';
    }
    var missionLabel = v.mission.client ? (v.mission.type + ' · ' + v.mission.client + ' · ' + v.mission.site) : (v.mission.type ? v.mission.type + ' · ' + v.mission.to + ' · ' + v.mission.site : v.mission.to + ' · ' + v.mission.site);
    return (
      '<div class="td-head"><span class="td-title">' + esc(displayId(v)) + '</span>' +
        '<span class="statut-chip st-' + v.statut + '"><span class="dot"></span>' + esc(v.statutLabel) + '</span></div>' +
      '<div class="td-grid">' +
        '<div class="td-row"><dt>Chauffeur</dt><dd>' + esc(v.driver.name) + '</dd></div>' +
        '<div class="td-row"><dt>Remorque</dt><dd>' + esc(v.trailer_id || '—') + (v.trailer_type ? ' · ' + esc(v.trailer_type) : '') + '</dd></div>' +
        '<div class="td-row"><dt>Mission</dt><dd>' + esc(missionLabel) + '</dd></div>' +
        '<div class="td-row"><dt>Géofence</dt><dd>' + geo + '</dd></div>' +
        '<div class="td-row"><dt>Preuves</dt><dd><span class="proof-row">' +
          '<span class="proof-badge ' + srcClass(v.sources.guerite) + '" title="Guérite : ' + srcLabel(v.sources.guerite) + '">G</span>' +
          '<span class="proof-badge ' + srcClass(v.sources.tag) + '" title="Tag / iButton : ' + srcLabel(v.sources.tag) + '">TAG</span>' +
          '<span class="proof-badge ' + srcClass(v.sources.gps) + '" title="GPS : ' + srcLabel(v.sources.gps) + '">GPS</span>' +
        '</span></dd></div>' +
      '</div>' +
      '<p class="popover-note" style="margin-top:8px; margin-bottom:0;">' + esc(v.note) + '</p>'
    );
  }

  /* ============================================================
   * CONTENEURS — dérivés de SIM.vehicles (aucune liste de conteneurs
   * indépendante). Seuls les véhicules qui portent un `container` dans
   * le référentiel simulé sont des conteneurs actifs. Ajouté pour les
   * écrans Fiche conteneur / File de validation / Rapport de shift —
   * même règle qu'ailleurs dans ce fichier : une seule fonction, lue
   * par tous les écrans qui en ont besoin, jamais un second tableau.
   * ============================================================ */

  // Armateur déduit du préfixe propriétaire (4 premières lettres du n°
  // conteneur) — table de correspondance éditable en principe (cahier des
  // charges Conteneurs §2.1) ; ici réduite aux préfixes réellement présents
  // dans le référentiel simulé, pas une liste mondiale inventée.
  function armateurFromCode(code) {
    var prefix = (code || '').slice(0, 4).toUpperCase();
    var map = { 'CMAU': 'CMA CGM', 'MAEU': 'Maersk', 'MSCU': 'MSC' };
    return map[prefix] || null;
  }

  // Validation du chiffre de contrôle ISO 6346 (cahier des charges
  // Conteneurs §2.1 : "le module DOIT valider le chiffre de contrôle à
  // chaque saisie/lecture"). Implémentation de l'algorithme normalisé :
  // 4 lettres + 6 chiffres, valeurs numériques pondérées par 2^position,
  // somme mod 11 (10 -> 0) = chiffre de contrôle attendu. Un numéro
  // fictif de la simulation qui ne satisfait pas ce calcul est un signal
  // réel du métier ("à vérifier"), pas un bug d'affichage.
  var ISO6346_LETTER_VALUES = { A:10,B:12,C:13,D:14,E:15,F:16,G:17,H:18,I:19,J:20,K:21,L:23,M:24,N:25,O:26,P:27,Q:28,R:29,S:30,T:31,U:32,V:34,W:35,X:36,Y:37,Z:38 };
  function iso6346Check(code) {
    var digits = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (digits.length !== 11) return { applicable: false };
    var chars = digits.slice(0, 10).split('');
    var given = +digits.charAt(10);
    var sum = 0;
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      var val = /[0-9]/.test(ch) ? +ch : ISO6346_LETTER_VALUES[ch];
      if (val === undefined) return { applicable: false };
      sum += val * Math.pow(2, i);
    }
    var expected = sum % 11;
    if (expected === 10) expected = 0;
    return { applicable: true, expected: expected, given: given, valid: expected === given };
  }

  // Même règle de déduction que Remorques (containerState) : transfert
  // port -> site = plein, site -> port = vide, déduite du texte de
  // destination déjà présent dans la mission (aucun champ dédié dans SIM).
  function containerChargeState(v) {
    var to = v.mission && v.mission.to;
    if (!to) return null;
    if (/\(plein\)/i.test(to)) return 'Plein';
    if (/\(vide\)/i.test(to)) return 'Vide';
    return null;
  }

  // Résumé de mission court, identique à celui de Remorques (dupliqué
  // intentionnellement, même raison que driverRoster()/vehicleDetailHTML()
  // ci-dessus : ne pas modifier remorques.html hors périmètre de cette
  // étape).
  function missionSummary(v) {
    var m = v.mission;
    if (!m || (!m.type && !m.to)) return null;
    return m.client ? (m.type + ' · ' + m.client) : (m.type ? m.type + ' · ' + m.to : m.to);
  }

  function containersFromVehicles() {
    return SIM.vehicles.filter(function (v) { return !!v.container; }).map(function (v) {
      return {
        code: v.container.code,
        qrToChange: !!v.container.qrToChange,
        armateur: armateurFromCode(v.container.code),
        chargeState: containerChargeState(v),
        vehicle: v
      };
    });
  }

  // Répartition des missions actives par site/guérite (Nord/Sud) — compte
  // simple des véhicules du référentiel actif par v.site, réutilisé par
  // File de validation et Rapport de shift. Pas une mesure de temps
  // (contrairement à dwellBySite) : un dénombrement de missions.
  function siteMissionCounts() {
    var sites = {};
    SIM.vehicles.forEach(function (v) {
      var site = v.site || 'Non renseigné';
      if (!sites[site]) sites[site] = { site: site, count: 0, vehicleIds: [] };
      sites[site].count++;
      sites[site].vehicleIds.push(v.id);
    });
    return Object.keys(sites).map(function (s) { return sites[s]; }).sort(function (a, b) { return b.count - a.count; });
  }

  global.SIM = SIM;
  global.NOW = NOW;
  global.displayId = displayId;
  global.esc = esc;
  global.srcLabel = srcLabel;
  global.srcClass = srcClass;
  global.toMin = toMin;
  global.computeDwell = computeDwell;
  global.formatDwell = formatDwell;
  global.minToClock = minToClock;
  global.getVehicle = getVehicle;
  global.alertsFor = alertsFor;
  global.alertCountForType = alertCountForType;
  global.alertsForVehicle = alertsForVehicle;
  global.derivedPosition = derivedPosition;
  global.lastKnownTime = lastKnownTime;
  global.vehicleHistory = vehicleHistory;

  // ---------- exports : fonctions de calcul pures (Dashboard) ----------
  global.fleetStats = fleetStats;
  global.alertsByType = alertsByType;
  global.rotationBucketForVehicle = rotationBucketForVehicle;
  global.rotationsSnapshot = rotationsSnapshot;
  global.dwellBySite = dwellBySite;
  global.dwellThresholdVehicles = dwellThresholdVehicles;
  global.hourlyActivity = hourlyActivity;
  global.attentionPoints = attentionPoints;
  global.driverRoster = driverRoster;
  global.vehicleDetailHTML = vehicleDetailHTML;

  // ---------- exports : conteneurs / preset (File de validation, Fiche conteneur, Rapport de shift) ----------
  global.armateurFromCode = armateurFromCode;
  global.iso6346Check = iso6346Check;
  global.containerChargeState = containerChargeState;
  global.missionSummary = missionSummary;
  global.containersFromVehicles = containersFromVehicles;
  global.siteMissionCounts = siteMissionCounts;

})(window);
