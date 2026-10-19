/*
 * Tour de contrôle — suivi élève
 * ------------------------------------------------------------------
 * Composant autonome, sans framework, en français, accessible au clavier.
 * S'appuie sur window.TDC_CONFIG = { url, cle, classeCode } et sur
 * supabase-js v2 chargé globalement (voir mkdocs.yml, extra_javascript).
 *
 * Étapes :
 *   1. Session anonyme Supabase (signInAnonymously), réutilisée au rechargement
 *   2. Identité reprise du portail (qui_suis_je) — jamais de saisie ici
 *   3. Détection de la séance courante depuis l'URL (seances/seance-NN/)
 *   4. Extraction du quiz de révision présent dans la page (10 questions
 *      "**N.** énoncé `A` … · `B` … · `C` … · `D` …")
 *   5. Séance ouverte : le PARCOURS GUIDÉ (19/10/2026) — chaque question est
 *      posée à son ancre <div class="tdc-ici" data-q="N">, juste après la
 *      notion qu'elle vérifie, les points de passage à la fin des actes, et
 *      la suite de la page attend la réponse. Voir « LE PARCOURS GUIDÉ ».
 *   6. Séance fermée ou élève non identifié : la page est la trace écrite,
 *      tout est lisible, rien n'est verrouillé.
 */
(function () {
  "use strict";

  const CFG = window.TDC_CONFIG;
  if (!CFG || !CFG.url || !CFG.cle || !CFG.classeCode) {
    console.warn("[suivi] window.TDC_CONFIG absent ou incomplet — composant désactivé.");
    return;
  }
  if (!window.supabase || !window.supabase.createClient) {
    console.warn("[suivi] supabase-js non chargé — composant désactivé.");
    return;
  }

  const sb = window.supabase.createClient(CFG.url, CFG.cle, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

  const STORAGE_KEY = "tdc_eleve_" + CFG.classeCode;

  // Portail commun. Même origine que ce site : la session y est partagée,
  // l'élève ne saisit donc son numéro qu'une fois par poste.
  const PORTAIL = "/portail-bts/";

  const AVATARS = [
    "🦊", "🐢", "🦉", "🐙", "🦁", "🐺", "🦄", "🐝", "🐬", "🦋",
    "🐧", "🦔", "🐳", "🦅", "🐨", "🦝", "🐸", "🦖", "🐿️", "🦩",
    "🐍", "🦎", "🐊", "🦦", "🐼", "🦒", "🐯", "🦓", "🐘", "🦥",
    "🐐", "🐿️", "🦡", "🐇", "🦭", "🐺", "🦈", "🐴", "🦌", "🐡"
  ];

  /* ------------------------------------------------------------------ */
  /* Utilitaires                                                         */
  /* ------------------------------------------------------------------ */

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach((c) => {
      if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* Lire avant de répondre (02/10/2026). Les options restent grisées le
   * temps de lire la question : 3,5 mots par seconde, entre 4 et 25 s. La
   * MÊME formule vit dans le portail (js/lecture.js) et dans la base
   * (temps_lecture()), qui compte les réponses passées trop vite malgré tout.
   * Changer l'une, c'est changer les trois. */
  function tempsLecture(intitule, options) {
    const t = String(intitule || "").trim();
    if (!t) return 0;
    const mots = (t + " " + (options || []).join(" ")).trim().split(/\s+/).length;
    return Math.min(25, Math.max(4, Math.ceil(mots / 3.5)));
  }

  // Une question redessinée garde son heure de fin : ni zéro (contournement),
  // ni tout recommencer (relire ce qu'on vient de lire).
  const finLecture = {};
  function verrouillerLecture(cle, intitule, options, champs, zone) {
    if (!(cle in finLecture)) finLecture[cle] = Date.now() + tempsLecture(intitule, options) * 1000;
    // Recalculé sur l'heure à chaque tic : un onglet en arrière-plan voit ses
    // minuteurs ralentis, un décompte compté à la main y prendrait du retard.
    const reste = () => Math.ceil((finLecture[cle] - Date.now()) / 1000);
    if (reste() <= 0) return;
    champs.forEach((c) => { c.disabled = true; });
    const ecrire = () => { zone.textContent = "Prenez le temps de lire… " + reste() + " s"; };
    zone.className = "tdc-lecture";
    ecrire();
    const tic = setInterval(() => {
      if (reste() > 0) { ecrire(); return; }
      clearInterval(tic);
      champs.forEach((c) => { c.disabled = false; });
      zone.textContent = "";
    }, 1000);
  }

  function lireEleve() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function ecrireEleve(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* stockage indisponible : on continue sans persistance locale */
    }
  }

  function numeroSeanceCourante() {
    const m = window.location.pathname.match(/seance-(\d+)/i);
    return m ? parseInt(m[1], 10) : null;
  }

  /* ------------------------------------------------------------------ */
  /* Extraction du quiz depuis le contenu Markdown déjà rendu            */
  /* ------------------------------------------------------------------ */

  function extraireQuestions(racine) {
    const questions = [];
    const paragraphes = racine.querySelectorAll("p");
    paragraphes.forEach((p) => {
      const strong = p.querySelector("strong");
      if (!strong) return;
      const mNum = strong.textContent.trim().match(/^(\d+)\.$/);
      if (!mNum) return;
      const codes = Array.from(p.querySelectorAll("code"));
      if (codes.length < 2) return;

      // Texte de la question : on accumule les nœuds du paragraphe jusqu'au
      // premier <code> (début des options), en sautant le numéro initial.
      const premierCode = codes[0];
      let texte = "";
      let apresNumero = false;
      for (const noeud of p.childNodes) {
        if (noeud === premierCode) break;
        if (!apresNumero) {
          if (noeud === strong) { apresNumero = true; }
          continue;
        }
        texte += noeud.textContent;
      }
      texte = texte.trim().replace(/:\s*$/, "").trim();

      const options = codes.map((c) => {
        const lettre = c.textContent.trim();
        // le libellé suit le code dans le texte du paragraphe, séparé par des espaces / ' · '
        let apres = c.nextSibling ? c.nextSibling.textContent : "";
        apres = apres.replace(/^[\s·-]+/, "");
        apres = apres.split(" · ")[0].split("`")[0].trim();
        return { lettre, libelle: apres || lettre };
      });

      questions.push({
        id: "q" + mNum[1],
        numero: parseInt(mNum[1], 10),
        texte,
        options,
        paragraphe: p
      });
    });
    return questions.sort((a, b) => a.numero - b.numero);
  }

  function masquerContenuStatique(questions, racine) {
    // Cache les paragraphes de questions et le bloc de correction statique
    questions.forEach((q) => {
      q.paragraphe.setAttribute("hidden", "hidden");
    });
    racine.querySelectorAll("details").forEach((d) => {
      const resume = d.querySelector("summary");
      if (resume && /vérifier mes réponses/i.test(resume.textContent)) {
        d.setAttribute("hidden", "hidden");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Widget                                                               */
  /* ------------------------------------------------------------------ */

  function creerWidget() {
    const widget = el("section", {
      class: "tdc-widget",
      "aria-live": "polite",
      role: "region",
      "aria-label": "Suivi de séance"
    });
    return widget;
  }

  function vider(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* ---- Écran 1 : identification --------------------------------------- */

  async function ecranIdentification(widget, onValide) {
    vider(widget);

    const { data: prisData } = await sb.rpc("avatars_pris", { p_classe_code: CFG.classeCode });
    const pris = new Set((prisData || []).map((r) => r.avatar));
    const disponibles = AVATARS.filter((a) => !pris.has(a));

    let avatarChoisi = null;

    const titre = el("h2", { class: "tdc-titre" }, ["Rejoindre la séance"]);
    const form = el("form", { class: "tdc-form" });

    const labelNumero = el("label", { for: "tdc-numero" }, ["Votre numéro"]);
    const champNumero = el("input", {
      id: "tdc-numero",
      name: "numero",
      type: "text",
      inputmode: "numeric",
      pattern: "[0-9]*",
      autocomplete: "off",
      required: "required",
      class: "tdc-input"
    });

    const legendeAvatar = el("legend", {}, ["Choisissez votre avatar"]);
    const grilleAvatars = el("div", {
      class: "tdc-avatars",
      role: "radiogroup",
      "aria-label": "Choix de l'avatar"
    });
    disponibles.forEach((a, i) => {
      const bouton = el("button", {
        type: "button",
        class: "tdc-avatar-btn",
        "aria-pressed": "false",
        "aria-label": "Avatar " + a
      }, [a]);
      bouton.addEventListener("click", () => {
        grilleAvatars.querySelectorAll(".tdc-avatar-btn").forEach((b) => {
          b.setAttribute("aria-pressed", "false");
          b.classList.remove("tdc-avatar-choisi");
        });
        bouton.setAttribute("aria-pressed", "true");
        bouton.classList.add("tdc-avatar-choisi");
        avatarChoisi = a;
      });
      grilleAvatars.appendChild(bouton);
    });
    const fieldsetAvatar = el("fieldset", { class: "tdc-fieldset" }, [legendeAvatar, grilleAvatars]);

    const messageErreur = el("p", { class: "tdc-erreur", role: "alert" });

    const boutonValider = el("button", { type: "submit", class: "tdc-bouton tdc-bouton-principal" }, ["Rejoindre"]);

    form.appendChild(labelNumero);
    form.appendChild(champNumero);
    form.appendChild(fieldsetAvatar);
    form.appendChild(messageErreur);
    form.appendChild(boutonValider);

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      vider(messageErreur);
      const numero = champNumero.value.trim().padStart(2, "0");
      if (!numero) {
        messageErreur.textContent = "Merci de saisir votre numéro.";
        return;
      }
      boutonValider.disabled = true;
      boutonValider.textContent = "Connexion…";
      try {
        const { data, error } = await sb.rpc("rejoindre", {
          p_classe_code: CFG.classeCode,
          p_numero: numero,
          p_avatar: avatarChoisi
        });
        if (error) throw error;
        ecrireEleve({
          eleve_id: data.eleve_id,
          numero: data.numero,
          avatar: data.avatar,
          classeCode: CFG.classeCode
        });
        onValide(data);
      } catch (err) {
        messageErreur.textContent = messageLisible(err);
        boutonValider.disabled = false;
        boutonValider.textContent = "Rejoindre";
      }
    });

    widget.appendChild(titre);
    widget.appendChild(form);
  }

  function messageLisible(err) {
    const msg = (err && err.message) || "";
    if (/introuvable/i.test(msg)) return "Numéro introuvable dans cette classe. Vérifiez auprès de votre enseignant.";
    if (/deja pris|déjà pris/i.test(msg)) return "Cet avatar est déjà pris, choisissez-en un autre.";
    if (/classe inconnue/i.test(msg)) return "Classe inconnue. Vérifiez l'adresse ou contactez votre enseignant.";
    return "Une erreur est survenue. Réessayez dans un instant.";
  }

  /* ------------------------------------------------------------------ */
  /* Renvoi vers le portail                                              */
  /* ------------------------------------------------------------------ */

  function ecranPortail(widget) {
    vider(widget);
    widget.appendChild(el("h2", { class: "tdc-titre" }, ["Identifiez-vous pour participer"]));
    widget.appendChild(el("p", {}, [
      "Vos réponses s'enregistrent depuis le portail commun. Connectez-vous une " +
      "seule fois avec votre numéro et votre code, puis revenez : cette page vous " +
      "reconnaîtra automatiquement, ici comme sur vos autres projets."
    ]));
    widget.appendChild(el("p", {}, [
      el("a", { class: "tdc-bouton tdc-bouton-principal", href: PORTAIL }, ["Ouvrir le portail"])
    ]));
    widget.appendChild(el("p", { class: "tdc-note" }, [
      "Le texte de la séance reste lisible ci-dessous sans identification."
    ]));
  }

  function bandeauConnecte(numero) {
    return el("p", { class: "tdc-note tdc-connecte" }, [
      "Connecté, numéro " + numero + ". ",
      el("a", { href: PORTAIL }, ["Ce n'est pas moi"])
    ]);
  }

  /* ================================================================== */
  /* LE PARCOURS GUIDÉ (19/10/2026)                                      */
  /* ================================================================== */
  /* Ce qui se passait jusqu'ici, mesuré sur la séance 4 à 390 px : la
   * PREMIÈRE chose qu'un étudiant voyait en ouvrant la séance était
   * « Question 1 / 10 » du quiz de fin — avant le cold open, avant le
   * moindre acte. Les points de passage étaient bien à la fin de chaque
   * acte, mais rien n'empêchait de défiler au-delà : on pouvait lire toute
   * la page sans répondre à rien, ou répondre à tout sans rien lire.
   *
   * Désormais la séance est une suite d'ÉTAPES, dans l'ordre de la page :
   *
   *   · les questions du quiz, chacune posée JUSTE APRÈS le passage qui
   *     l'enseigne — la trace marque l'endroit par une ancre
   *     <div class="tdc-ici" data-q="3"></div> ; une question sans ancre
   *     (séances 1 à 4) est posée à l'épilogue, jamais en tête de page ;
   *   · les points de passage, à la fin de chaque acte (en base).
   *
   * La suite de la page reste masquée tant que l'étape en cours n'a pas de
   * réponse. Répondre FAUX ne bloque pas : l'explication s'affiche, avec
   * l'idée clé du passage à relire, et « J'ai compris » ouvre la suite
   * après le temps de la lire. Ne PAS répondre, si.
   *
   * Trois soupapes, pour que personne ne reste coincé par l'outil :
   *   · le repli est PERMISSIF — séance fermée, élève non identifié,
   *     fonction absente en base, erreur réseau au chargement : tout est
   *     lisible, comme avant ;
   *   · « Clore la séance » rouvre tout, y compris chez l'élève en train de
   *     répondre (refus « fermée » → la page se déverrouille) ;
   *   · au bout de six minutes sur la même étape, la page propose « Je
   *     bloque » plutôt que de laisser l'étudiant seul.
   *
   * Et deux garde-fous contre « je demande la réponse à une IA » :
   *   · sortir de la page PENDANT une question (onglet, application) est
   *     noté et dit à l'étudiant, puis remonte à l'enseignant dans
   *     « À aller voir » (signaler_sortie) — l'étudiant le sait d'avance ;
   *   · on ne copie pas le texte d'une question. Contournable, bien sûr :
   *     le but est que la triche demande un effort, pas qu'elle soit
   *     impossible. Le vrai rempart est ailleurs — des questions ancrées
   *     dans le cas de la séance, et aucune grille de réponses dans la page
   *     depuis la séance 5. */

  // Six minutes sur la même étape : au-delà, on propose la main levée.
  const RELANCE_MS = 6 * 60 * 1000;
  // Une sortie de moins de deux secondes est un geste parasite (une
  // notification qu'on écarte), pas une recherche.
  const SORTIE_MIN_S = 2;

  function texteSansEmoji(t) {
    return String(t || "")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "")
      .replace(/\s+/g, " ").trim();
  }

  // Le titre lisible d'un acte : « ACTE II — LE MUR ENTRE DEUX ÉQUIPES
  // (≈ 8 min) » → « Acte II — Le mur entre deux équipes ».
  function titreActe(h2) {
    const t = texteSansEmoji(h2.textContent).replace(/\(\s*≈.*?\)/, "").trim();
    const m = t.match(/^ACTE\s+([IVX]+)\s*[—-]\s*(.+)$/i);
    if (!m) return t;
    const reste = m[2].toLowerCase();
    return "Acte " + m[1] + " — " + reste.charAt(0).toUpperCase() + reste.slice(1);
  }

  // Le numéro de l'acte qui contient un nœud de premier niveau : 0 avant le
  // premier acte, 99 après l'épilogue.
  function acteDe(noeud) {
    let n = noeud;
    while (n) {
      if (n.tagName === "H2") {
        const r = n.textContent.match(/ACTE\s+([IVX]+)\b/);
        if (r && ROMAINS[r[1]]) return { num: ROMAINS[r[1]], h2: n };
        if (/ÉPILOGUE|EPILOGUE|Réviser après/i.test(n.textContent)) return { num: 99, h2: n };
        if (/COLD OPEN/i.test(n.textContent)) return { num: 0, h2: n };
      }
      n = n.previousElementSibling;
    }
    return { num: 0, h2: null };
  }

  function apres(a, b) {   // a vient-il après b dans la page ?
    return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  // L'idée clé à relire après une erreur : le dernier encadré « 🔑 » entre
  // le titre de l'acte et l'étape. À défaut, le titre de l'acte lui-même.
  function ideeCle(noeud, h2) {
    let n = noeud.previousElementSibling;
    while (n && n !== h2) {
      if (n.tagName === "BLOCKQUOTE" && n.textContent.indexOf("🔑") !== -1) return n;
      n = n.previousElementSibling;
    }
    return null;
  }

  function surligner(cible) {
    if (!cible) return;
    cible.scrollIntoView({ behavior: "smooth", block: "center" });
    cible.classList.remove("tdc-relire");
    void cible.offsetWidth;   // relancer l'animation si on reclique
    cible.classList.add("tdc-relire");
  }

  // La section qui suit un titre h2, titre compris, jusqu'au h2 suivant.
  function sectionDe(h2) {
    const out = [h2];
    let n = h2.nextElementSibling;
    while (n && n.tagName !== "H2") { out.push(n); n = n.nextElementSibling; }
    // Le trait qui sépare de la section suivante appartient à celle-ci.
    return out;
  }

  /* ---- Les étapes ------------------------------------------------------ */

  function construireEtapes(racine, questions, points, faits) {
    const etapes = [];

    // 1. Les questions ancrées dans les actes.
    const ancrees = new Set();
    racine.querySelectorAll(".tdc-ici[data-q]").forEach((ancre) => {
      const num = parseInt(ancre.getAttribute("data-q"), 10);
      const q = questions.find((x) => x.numero === num);
      if (!q || ancrees.has(num)) return;
      ancrees.add(num);
      etapes.push({ type: "q", cle: q.id, q: q, place: ancre, avant: false });
    });

    // 2. Les points de passage, à la fin de chaque acte.
    const actes = titresActes(racine);
    (points || []).forEach((point) => {
      const h = actes.get(point.acte);
      if (!h) return;
      const fin = finDActe(h);
      etapes.push({ type: "p", cle: "acte-" + point.acte, point: point,
                    place: fin || h, avant: !!fin, finDePage: !fin });
    });

    // 3. Les questions sans ancre : à l'épilogue, jamais en tête de page.
    const reviser = Array.from(racine.querySelectorAll("h2"))
      .find((h) => /Réviser après/i.test(h.textContent));
    let repere = reviser || (questions[0] && questions[0].paragraphe);
    if (repere && repere.previousElementSibling && repere.previousElementSibling.tagName === "HR") {
      repere = repere.previousElementSibling;
    }
    questions.filter((q) => !ancrees.has(q.numero)).forEach((q) => {
      etapes.push({ type: "q", cle: q.id, q: q, place: repere, avant: true, fin: true });
    });

    // Chaque étape devient une carte, posée à sa place.
    etapes.forEach((e) => {
      e.fait = faits.get(e.cle) || null;
      e.carte = el("section", { class: "tdc-etape", "data-cle": e.cle });
      if (e.place && e.place.classList && e.place.classList.contains("tdc-ici")) {
        e.place.replaceWith(e.carte);
      } else if (e.finDePage) {
        racine.appendChild(e.carte);
      } else if (e.avant && e.place && e.place.parentNode) {
        e.place.parentNode.insertBefore(e.carte, e.place);
      } else if (e.place && e.place.parentNode) {
        e.place.parentNode.insertBefore(e.carte, e.place.nextSibling);
      } else {
        racine.appendChild(e.carte);
      }
      e.acte = acteDe(e.carte);
    });

    // L'ordre de la page fait foi : deux questions à l'épilogue gardent leur
    // ordre d'insertion, une ancre placée plus haut passe avant.
    etapes.sort((a, b) => (a.carte === b.carte ? 0 : apres(a.carte, b.carte) ? 1 : -1));
    etapes.forEach((e, i) => { e.rang = i + 1; });
    return etapes;
  }

  /* ---- Le parcours ----------------------------------------------------- */

  async function parcoursGuide(widget, eleve, seance, questions, racine) {
    // Ce qui est déjà fait : les réponses au quiz, et les points passés.
    const faits = new Map();
    try {
      const { data } = await sb.from("reponses")
        .select("question, reponse, correct")
        .eq("eleve_id", eleve.eleve_id).eq("seance_id", seance.id);
      (data || []).forEach((r) => {
        if (/^q\d+$/.test(r.question)) faits.set(r.question, { reponse: r.reponse, correct: r.correct });
      });
    } catch (e) { /* on repartira de zéro : au pire, une question redemandée */ }

    let pp = null;
    try {
      const r = await sb.rpc("mes_points_passage", { p_seance_id: seance.id });
      if (!r.error && r.data && r.data.ok) pp = r.data;
    } catch (e) { pp = null; }
    (pp && pp.points || []).forEach((p) => {
      if (p.fait) faits.set("acte-" + p.acte, { reponse: p.reponse, correct: p.correct,
                                                bonne: p.bonne, explication: p.explication });
    });

    const etapes = construireEtapes(racine, questions, pp && pp.points, faits);
    if (!etapes.length) return;

    // La section « Réviser après la séance » parle de demain : pendant
    // l'heure, elle laisse la place au bilan du parcours.
    const reviser = Array.from(racine.querySelectorAll("h2"))
      .find((h) => /Réviser après/i.test(h.textContent));
    const bilan = el("section", { class: "tdc-bilan", "aria-live": "polite", hidden: "hidden" });
    if (reviser) {
      sectionDe(reviser).forEach((n) => {
        if (n.classList.contains("tdc-etape")) return;
        n.setAttribute("data-tdc-revision", "1");
        n.hidden = true;
      });
      reviser.parentNode.insertBefore(bilan, reviser);
    } else {
      racine.appendChild(bilan);
    }

    const etat = { seance, etapes, courant: null, depuis: Date.now(), pp, bilan, ferme: false };

    // Le fil : où j'en suis, ce qui reste, et le rythme de la classe.
    // Le fil est un enfant direct de la page, pas du widget : un élément
    // collant ne colle qu'à l'intérieur de son parent.
    const fil = filDuParcours(etat);
    vider(widget);
    widget.classList.add("tdc-widget-emploi");
    widget.appendChild(modeDEmploi());
    widget.parentNode.insertBefore(fil.noeud, widget);
    etat.fil = fil;

    etapes.forEach((e) => rendreEtape(etat, e));
    verrouillerRapports(etat);
    appliquerVerrou(etat, false);
    surveillerSorties(etat);
    relance(etat);

    if (pp && pp.ouverte) document.body.appendChild(boutonMain(seance, titresActes(racine), pp.main || null));
  }

  // Le mode d'emploi, dit une fois, replié ensuite.
  function modeDEmploi() {
    const d = el("details", { class: "tdc-emploi" });
    let vu = false;
    try { vu = localStorage.getItem("tdc_emploi_vu") === "1"; } catch (e) { vu = false; }
    if (!vu) d.setAttribute("open", "open");
    d.addEventListener("toggle", () => {
      try { localStorage.setItem("tdc_emploi_vu", "1"); } catch (e) { /* sans mémoire, tant pis */ }
    });
    d.appendChild(el("summary", {}, ["Comment se passe la séance"]));
    d.appendChild(el("ul", {}, [
      el("li", {}, ["Vous lisez. Une question arrive ", el("strong", {}, ["juste après la notion qu'elle vérifie"]), "."]),
      el("li", {}, [el("strong", {}, ["La suite s'affiche quand vous avez répondu."]),
                    " Une réponse fausse ne bloque pas : vous lisez l'explication, et vous continuez."]),
      el("li", {}, ["Vos réponses doivent venir de vous : ", el("strong", {}, ["quitter la page pendant une question est signalé"]),
                    " à l'enseignant. Se tromper ne coûte rien, et dit ce qu'il faut reprendre."]),
      el("li", {}, ["Coincé ? Le bouton ", el("strong", {}, ["✋ Je bloque"]), ", en bas à droite."])
    ]));
    return d;
  }

  /* ---- Le fil du parcours (en haut, collant) --------------------------- */

  function filDuParcours(etat) {
    const noeud = el("div", { class: "tdc-fil", role: "group", "aria-label": "Votre avancement dans la séance" });
    const ligne = el("div", { class: "tdc-fil-ligne" });
    const ou = el("p", { class: "tdc-fil-ou", "aria-live": "polite" });
    // Un seul geste dans le fil : revenir à la question qui attend. Une
    // flèche de 44 px plutôt qu'une phrase : sur un téléphone, le fil doit
    // tenir sur deux lignes, il colle en haut de l'écran pendant toute l'heure.
    const aller = el("button", { type: "button", class: "tdc-fil-aller",
      "aria-label": "Aller à la question en cours", title: "Aller à la question en cours" }, ["↓"]);
    ligne.appendChild(ou);
    ligne.appendChild(aller);
    const barre = el("div", { class: "tdc-fil-barre", "aria-hidden": "true" });
    etat.etapes.forEach(() => barre.appendChild(el("span", {})));
    const rythme = el("p", { class: "tdc-fil-rythme" });
    aller.addEventListener("click", () => {
      const e = etat.courant;
      if (e) { e.carte.scrollIntoView({ behavior: "smooth", block: "start" }); const f = e.carte.querySelector("input, button"); if (f) setTimeout(() => f.focus({ preventScroll: true }), 400); }
    });
    noeud.appendChild(ligne);
    noeud.appendChild(barre);
    noeud.appendChild(rythme);

    function maj() {
      const n = etat.etapes.length;
      const faites = etat.etapes.filter((e) => e.fait).length;
      const e = etat.courant;
      Array.from(barre.children).forEach((li, i) => {
        const x = etat.etapes[i];
        li.className = x.fait ? (x.fait.correct === false ? "faux" : "fait") : (x === e ? "ici" : "");
      });
      rythme.hidden = true;
      if (etat.ferme) {
        ou.textContent = "Séance close — tout est lisible.";
        rythme.textContent = "";
        aller.hidden = true;
        return;
      }
      if (!e) {
        ou.textContent = "✅ Parcours terminé — " + faites + " étape" + (faites > 1 ? "s" : "") + " sur " + n;
        rythme.textContent = "";
        aller.hidden = true;
        return;
      }
      const lieu = e.acte.num === 99 ? "Épilogue" : e.acte.h2 && e.acte.num ? titreActe(e.acte.h2) : "";
      ou.textContent = "Étape " + e.rang + " / " + n + (lieu ? " · " + lieu : "");
      aller.hidden = false;
      const r = rythmeDe(etat, e);
      rythme.textContent = r ? r.texte : "";
      rythme.className = "tdc-fil-rythme" + (r ? " " + r.classe : "");
      rythme.hidden = !r;
    }
    return { noeud, maj };
  }

  // Le rythme de la classe, lu sur l'heure de démarrage et les fins d'actes
  // prévues (points_passage.fin_min) : la même règle que « retard d'acte »
  // côté enseignant, dite à l'étudiant avant qu'elle ne le désigne.
  function rythmeDe(etat, e) {
    const pp = etat.pp;
    if (!pp || !pp.demarree_le || !(pp.points || []).length) return null;
    const min = (Date.now() - new Date(pp.demarree_le).getTime()) / 60000;
    if (!(min >= 0) || min > (pp.duree_min || 55) + 30) return null;
    const pts = pp.points.slice().sort((a, b) => a.acte - b.acte);
    const attendu = pts.find((p) => p.fin_min >= min);
    if (!attendu) return { classe: "retard", texte: "⏱ Les actes sont finis : terminez vos questions." };
    if (e.acte.num !== 99 && e.acte.num < attendu.acte) {
      return { classe: "retard", texte: "⏱ La classe devrait être à l'acte " + Object.keys(ROMAINS)[attendu.acte - 1] + " : avancez." };
    }
    return { classe: "ok", texte: "⏱ Dans le rythme" };
  }

  /* ---- Une étape : la carte, la réponse, le verdict -------------------- */

  function rendreEtape(etat, e) {
    const c = e.carte;
    vider(c);
    c.setAttribute("aria-labelledby", "tdc-t-" + e.cle);
    const titre = e.type === "q"
      ? "❓ Question " + e.q.numero + (e.fin ? "" : " — sur ce que vous venez de lire")
      : "📍 Point de passage — fin de l'acte " + Object.keys(ROMAINS)[e.point.acte - 1];
    c.appendChild(el("p", { class: "tdc-etape-titre", id: "tdc-t-" + e.cle }, [titre]));

    const intitule = e.type === "q" ? e.q.texte : e.point.intitule;
    const options = e.type === "q" ? e.q.options.map((o) => o.libelle) : (e.point.options || []);

    if (e.fait) return rendreFaite(etat, e, intitule, options, null);

    c.removeAttribute("data-fait");
    const form = el("form", { class: "tdc-form" });
    const lecture = el("p", { class: "tdc-lecture", "aria-live": "polite" });
    form.appendChild(lecture);
    let groupe = null;
    if (intitule) {
      groupe = el("div", { class: "tdc-options", role: "radiogroup", "aria-label": intitule });
      options.forEach((o, i) => {
        const lettre = "ABCD"[i];
        const id = "tdc-o-" + e.cle + "-" + lettre;
        groupe.appendChild(el("label", { class: "tdc-option", for: id }, [
          el("input", { type: "radio", name: "r-" + e.cle, id: id, value: lettre }),
          el("span", {}, [lettre + " — " + o])
        ]));
      });
      form.appendChild(el("fieldset", { class: "tdc-fieldset" }, [
        el("legend", { class: "tdc-question-texte" }, [intitule]), groupe]));
    }
    const retour = el("div", { class: "tdc-retour", "aria-live": "polite" });
    const bouton = el("button", { type: "submit", class: "tdc-bouton tdc-bouton-principal" },
      [intitule ? "Valider ma réponse" : "J'ai fini cet acte"]);
    form.appendChild(retour);
    form.appendChild(bouton);
    c.appendChild(form);
    antiCopie(c);

    // Le décompte de lecture ne part qu'une fois la carte À L'ÉCRAN : une
    // question révélée en bas de page ne se lit pas en arrivant dessus.
    const champs = Array.from(form.querySelectorAll("input, button[type=submit]"));
    if (intitule) {
      champs.forEach((x) => { x.disabled = true; });
      lecture.textContent = "Faites défiler jusqu'ici, puis prenez le temps de lire.";
      quandVisible(c, () => {
        e.vue = true;
        champs.forEach((x) => { x.disabled = false; });
        lecture.textContent = "";
        verrouillerLecture(e.cle + "-" + etat.seance.id, intitule, options, champs, lecture);
      });
    } else {
      quandVisible(c, () => { e.vue = true; });
    }

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      let rep = null;
      if (groupe) {
        const x = form.querySelector("input:checked");
        if (!x) { vider(retour); retour.appendChild(el("p", { class: "tdc-erreur", role: "alert" }, ["Choisissez une réponse."])); return; }
        rep = x.value;
      }
      bouton.disabled = true;
      try {
        let r;
        if (e.type === "q") {
          const { data, error } = await sb.rpc("repondre", { p_seance_id: etat.seance.id, p_question: e.q.id, p_reponse: rep });
          if (error) throw error;
          r = { reponse: rep, correct: typeof data.correct === "boolean" ? data.correct : null,
                bonne: data.bonne_reponse, explication: data.explication };
        } else {
          const { data, error } = await sb.rpc("passer_acte", { p_seance_id: etat.seance.id, p_acte: e.point.acte, p_reponse: rep });
          if (error) throw error;
          if (!data || !data.ok) throw new Error(data && data.motif === "fermee" ? "Seance fermee" : "Réponse non enregistrée.");
          r = { reponse: data.reponse, correct: data.correct, bonne: data.bonne, explication: data.explication };
        }
        e.fait = r;
        if (!intitule) {
          // « J'ai fini cet acte » : rien à expliquer, on passe à la suite.
          rendreFaite(etat, e, intitule, options, null);
          verrouillerRapports(etat);
          appliquerVerrou(etat, true);
          return;
        }
        rendreFaite(etat, e, intitule, options, r);
      } catch (err) {
        if (/ferm/i.test((err && err.message) || "")) return seanceClose(etat);
        vider(retour);
        retour.appendChild(el("p", { class: "tdc-erreur", role: "alert" }, [messageLisible(err)]));
        bouton.disabled = false;
      }
    });
  }

  // Une étape répondue. `frais` : la réponse vient d'être donnée, on
  // explique et on attend « Continuer » ; sinon (rechargement), une ligne.
  function rendreFaite(etat, e, intitule, options, frais) {
    const c = e.carte;
    const r = e.fait;
    vider(c);
    c.setAttribute("data-fait", r.correct === false ? "faux" : "oui");
    const lettre = r.reponse && /^[A-D]$/.test(r.reponse) ? r.reponse : null;
    const libelle = (l) => (l && options["ABCD".indexOf(l)]) ? l + " — " + options["ABCD".indexOf(l)] : l;

    const tete = e.type === "q" ? "Question " + e.q.numero : "Point de passage, acte " + Object.keys(ROMAINS)[e.point.acte - 1];
    if (!frais) {
      // Le résumé d'une étape déjà passée : de quoi s'y retrouver, sans
      // reprendre la place d'une carte active.
      const verdict = !intitule ? "✅ fait" : r.correct === true ? "✅ juste" : r.correct === false ? "❌ à revoir" : "✔ enregistré";
      c.appendChild(el("p", { class: "tdc-etape-resume" }, [
        el("span", {}, [tete + " · " + verdict]),
        intitule ? el("span", { class: "tdc-note" }, [" — " + intitule + (lettre ? " Votre réponse : " + libelle(lettre) + "." : "")]) : null
      ]));
      return;
    }

    c.appendChild(el("p", { class: "tdc-etape-titre" }, [tete]));
    if (intitule) c.appendChild(el("p", { class: "tdc-question-texte" }, [intitule]));
    const retour = el("div", { class: "tdc-retour", "aria-live": "polite", tabindex: "-1" });
    c.appendChild(retour);
    let attente = 0;
    if (!intitule) {
      retour.appendChild(el("p", { class: "tdc-correct" }, ["✅ C'est noté."]));
    } else if (r.correct === true) {
      retour.appendChild(el("p", { class: "tdc-correct" }, ["✅ Juste : " + libelle(lettre) + "."]));
      if (r.explication) retour.appendChild(el("p", { class: "tdc-explication" }, [r.explication]));
    } else if (r.correct === false) {
      retour.appendChild(el("p", { class: "tdc-incorrect" }, [
        "❌ Pas tout à fait. Vous avez répondu " + libelle(lettre) + "."]));
      retour.appendChild(el("p", {}, [el("strong", {}, ["La bonne réponse : " + libelle(r.bonne) + "."])]));
      if (r.explication) retour.appendChild(el("p", { class: "tdc-explication" }, [r.explication]));
      // L'idée clé du passage, et de quoi y remonter : se tromper doit
      // ramener au texte, pas seulement à la lettre juste.
      // Une question posée à l'épilogue n'a pas de passage à elle : rien à
      // relire de plus que l'explication.
      const dansActe = e.acte.num > 0 && e.acte.num < 99;
      const cle = dansActe ? ideeCle(c, e.acte.h2) : null;
      if (cle) retour.appendChild(el("blockquote", { class: "tdc-cle" }, [texteSansEmoji(cle.textContent)]));
      if (dansActe) {
        const relire = el("button", { type: "button", class: "tdc-lien" }, [cle ? "↑ Relire ce passage dans la page" : "↑ Relire le début de l'acte"]);
        relire.addEventListener("click", () => surligner(cle || e.acte.h2));
        retour.appendChild(el("p", {}, [relire]));
      }
      e.texteExplication = (r.explication || "") + " " + (cle ? cle.textContent : "");
      attente = tempsLecture(e.texteExplication, []);
    } else {
      retour.appendChild(el("p", {}, ["Réponse enregistrée."]));
    }

    const suite = el("button", { type: "button", class: "tdc-bouton tdc-bouton-principal" },
      [r.correct === false ? "J'ai compris, je continue" : "Continuer"]);
    c.appendChild(suite);
    if (attente > 0) {
      // On ne passe pas à la suite sans avoir lu pourquoi : c'est là que
      // l'erreur sert à quelque chose.
      const z = el("p", { class: "tdc-lecture" });
      c.insertBefore(z, suite);
      verrouillerLecture("ex-" + e.cle + "-" + etat.seance.id, e.texteExplication, [], [suite], z);
    }
    suite.addEventListener("click", () => {
      rendreFaite(etat, e, intitule, options, null);
      verrouillerRapports(etat);
      appliquerVerrou(etat, true);
    });
    retour.focus({ preventScroll: true });
    etat.fil.maj();
  }

  function quandVisible(noeud, f) {
    if (!("IntersectionObserver" in window)) { f(); return; }
    const obs = new IntersectionObserver((ent) => {
      if (ent.some((x) => x.isIntersecting)) { obs.disconnect(); f(); }
    }, { threshold: 0.5 });
    setTimeout(() => obs.observe(noeud), 0);
  }

  /* ---- Le verrou : la suite attend la réponse -------------------------- */

  function appliquerVerrou(etat, avancer) {
    if (etat.ferme) return;
    const premier = etat.etapes.find((e) => !e.fait) || null;
    const change = premier !== etat.courant;
    etat.courant = premier;
    if (change) etat.depuis = Date.now();

    const racine = (premier || etat.etapes[0]).carte.parentNode;
    let masquer = false;
    let premierRevele = null;
    Array.from(racine.children).forEach((n) => {
      if (n.classList.contains("tdc-suite")) { n.remove(); return; }
      if (n === etat.bilan) { if (premier) n.setAttribute("hidden", "hidden"); return; }
      if (n.hasAttribute("data-tdc-revision") || n.hasAttribute("data-tdc-statique")) return;
      if (masquer) {
        if (!n.hasAttribute("data-tdc-verrou")) n.setAttribute("data-tdc-verrou", n.hidden ? "deja" : "1");
        n.hidden = true;
      } else if (n.hasAttribute("data-tdc-verrou")) {
        if (n.getAttribute("data-tdc-verrou") !== "deja") n.hidden = false;
        n.removeAttribute("data-tdc-verrou");
        if (!premierRevele && n.tagName !== "HR") premierRevele = n;
      }
      if (premier && n === premier.carte) masquer = true;
    });

    if (premier) {
      const note = el("p", { class: "tdc-suite", role: "status" }, [
        "🔒 La suite de la séance s'affiche dès que vous avez répondu à la question ci-dessus."]);
      premier.carte.after(note);
      etat.note = note;
    } else {
      afficherBilan(etat);
    }
    etat.fil.maj();
    if (avancer && premierRevele) {
      if (!premierRevele.hasAttribute("tabindex")) premierRevele.setAttribute("tabindex", "-1");
      premierRevele.scrollIntoView({ behavior: "smooth", block: "start" });
      premierRevele.focus({ preventScroll: true });
    }
  }

  // La séance a été close pendant qu'on répondait : on rend tout, et on dit
  // pourquoi. Le contraire d'une impasse.
  function seanceClose(etat) {
    etat.ferme = true;
    document.querySelectorAll("[data-tdc-verrou]").forEach((n) => {
      if (n.getAttribute("data-tdc-verrou") !== "deja") n.hidden = false;
      n.removeAttribute("data-tdc-verrou");
    });
    document.querySelectorAll(".tdc-suite").forEach((n) => n.remove());
    // La trace de révision revient, questions statiques comprises.
    document.querySelectorAll("[data-tdc-revision]").forEach((n) => { n.hidden = false; n.removeAttribute("data-tdc-revision"); });
    document.querySelectorAll("details.tdc-verrouille").forEach((d) => d.classList.remove("tdc-verrouille"));
    etat.etapes.forEach((e) => {
      if (e.fait) return;
      const f = e.carte.querySelector("form");
      if (f) f.querySelectorAll("input, button").forEach((x) => { x.disabled = true; });
      e.carte.appendChild(el("p", { class: "tdc-note" }, ["La séance est close : cette question ne prend plus de réponse."]));
    });
    etat.fil.maj();
  }

  function afficherBilan(etat) {
    const b = etat.bilan;
    vider(b);
    const qs = etat.etapes.filter((e) => e.type === "q");
    const justes = qs.filter((e) => e.fait && e.fait.correct === true).length;
    const notees = qs.filter((e) => e.fait && typeof e.fait.correct === "boolean").length;
    const pts = etat.etapes.filter((e) => e.type === "p");
    b.appendChild(el("h2", { class: "tdc-titre" }, ["🎉 Parcours terminé"]));
    b.appendChild(el("p", {}, [
      notees ? justes + " réponse" + (justes > 1 ? "s" : "") + " juste" + (justes > 1 ? "s" : "") + " sur " + notees + " au quiz" : "Toutes vos réponses sont enregistrées",
      pts.length ? ", " + pts.length + " point" + (pts.length > 1 ? "s" : "") + " de passage franchi" + (pts.length > 1 ? "s" : "") + "." : "."
    ]));
    const aRevoir = qs.filter((e) => e.fait && e.fait.correct === false).map((e) => e.q.numero);
    if (aRevoir.length) {
      b.appendChild(el("p", {}, ["À relire avant la prochaine séance : question" + (aRevoir.length > 1 ? "s " : " ") + aRevoir.join(", ") + "."]));
    }
    b.appendChild(el("p", { class: "tdc-note" }, [
      "Lisez « À retenir » et les concepts ci-dessous : c'est sur eux que portera le contrôle d'entrée de la prochaine séance. " +
      "Pour vous re-tester, la révision de la séance est proposée sur le portail après l'heure."]));
    b.hidden = false;
  }

  /* ---- Le rapport d'expertise attend votre propre essai ----------------- */
  /* Le corrigé d'un indice est dans un bloc replié. Tant que le point de
   * passage de l'acte n'a pas de réponse, il reste fermé : chercher d'abord,
   * vérifier ensuite. */
  function verrouillerRapports(etat) {
    const parActe = new Map();
    etat.etapes.forEach((e) => { if (e.type === "p") parActe.set(e.point.acte, e); });
    document.querySelectorAll("article details").forEach((d) => {
      const s = d.querySelector("summary");
      if (!s || !/rapport d'expertise/i.test(s.textContent)) return;
      const a = acteDe(d.closest("article > *") || d);
      const p = parActe.get(a.num);
      const ferme = !etat.ferme && p && !p.fait;
      d.classList.toggle("tdc-verrouille", !!ferme);
      if (ferme) d.removeAttribute("open");
      if (!d.dataset.tdcBranche) {
        d.dataset.tdcBranche = "1";
        s.addEventListener("click", (ev) => {
          if (!d.classList.contains("tdc-verrouille")) return;
          ev.preventDefault();
          let m = d.nextElementSibling;
          if (!m || !m.classList.contains("tdc-verrou-msg")) {
            m = el("p", { class: "tdc-verrou-msg", role: "status" });
            d.after(m);
          }
          m.textContent = "🔒 Le rapport s'ouvre quand vous aurez répondu au point de passage de cet acte. Cherchez d'abord : c'est l'essai qui fait retenir.";
        });
      }
      if (!ferme) {
        const m = d.nextElementSibling;
        if (m && m.classList.contains("tdc-verrou-msg")) m.remove();
      }
    });
  }

  /* ---- Ne pas copier une question --------------------------------------- */
  function antiCopie(carte) {
    const dire = (ev) => {
      ev.preventDefault();
      let m = carte.querySelector(".tdc-copie");
      if (!m) { m = el("p", { class: "tdc-note tdc-copie", role: "status" }); carte.appendChild(m); }
      m.textContent = "Copie désactivée sur les questions : la réponse doit venir de vous.";
    };
    ["copy", "cut", "contextmenu", "dragstart"].forEach((t) => carte.addEventListener(t, dire));
  }

  /* ---- Quitter la page pendant une question ----------------------------- */
  /* Seulement pendant une question VUE et sans réponse : sortir pendant
   * qu'on lit l'acte n'est rien. L'étudiant le lit sur la carte au retour —
   * on ne signale jamais dans son dos. */
  function surveillerSorties(etat) {
    let parti = null;
    const actif = () => {
      const e = etat.courant;
      if (etat.ferme || !e || !e.vue || e.fait) return null;
      if (e.type === "p" && !e.point.intitule) return null;   // « J'ai fini cet acte »
      return e;
    };
    const partir = () => { if (!parti && actif()) parti = { e: actif(), t: Date.now() }; };
    const revenir = () => {
      if (!parti) return;
      const p = parti; parti = null;
      const s = Math.round((Date.now() - p.t) / 1000);
      if (s < SORTIE_MIN_S || p.e.fait) return;
      p.e.sorties = (p.e.sorties || 0) + s;
      let m = p.e.carte.querySelector(".tdc-sortie");
      if (!m) { m = el("p", { class: "tdc-sortie", role: "status" }); const f = p.e.carte.querySelector("form"); p.e.carte.insertBefore(m, f); }
      m.textContent = "↗ Vous avez quitté la page " + p.e.sorties + " s pendant cette question. C'est signalé à l'enseignant — " +
        "ce n'est pas une faute, mais votre réponse doit venir de vous.";
      try { sb.rpc("signaler_sortie", { p_seance_id: etat.seance.id, p_cle: p.e.cle, p_secondes: s }).then(() => {}, () => {}); }
      catch (e) { /* fonction pas encore en base : la carte l'a dit, cela suffit */ }
    };
    document.addEventListener("visibilitychange", () => { if (document.hidden) partir(); else revenir(); });
    window.addEventListener("blur", partir);
    window.addEventListener("focus", revenir);
  }

  /* ---- Six minutes sur la même étape ------------------------------------ */
  function relance(etat) {
    setInterval(() => {
      const e = etat.courant;
      if (etat.ferme || !e || !etat.note || !etat.note.isConnected) return;
      if (Date.now() - etat.depuis < RELANCE_MS || etat.note.querySelector("button")) return;
      const b = el("button", { type: "button", class: "tdc-lien" }, ["✋ Je bloque"]);
      b.addEventListener("click", () => {
        const m = document.querySelector(".tdc-main-bouton");
        if (m) { m.click(); m.scrollIntoView({ block: "nearest" }); }
      });
      etat.note.appendChild(el("span", {}, [" Toujours sur cette question ? Relisez le passage juste au-dessus — ou "]));
      etat.note.appendChild(b);
      etat.note.appendChild(el("span", {}, [" : l'enseignant le verra."]));
    }, 20000);
  }

  /* ------------------------------------------------------------------ */
  /* Points de passage et main levée (24/09/2026)                        */
  /* ------------------------------------------------------------------ */
  /* Les points vivent EN BASE (points_passage), comme le contrôle d'entrée :
   * la page ne porte ni la question ni la bonne réponse. Depuis le 19/10,
   * ce sont des étapes du parcours guidé, comme les questions du quiz. */

  const ROMAINS = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };

  function titresActes(racine) {
    const m = new Map();
    racine.querySelectorAll("h2").forEach((h) => {
      const r = h.textContent.match(/ACTE\s+([IVX]+)\b/);
      if (r && ROMAINS[r[1]]) m.set(ROMAINS[r[1]], h);
    });
    return m;
  }

  // La fin d'un acte : juste avant le trait (---) qui précède le titre
  // suivant, ou juste avant ce titre s'il n'y a pas de trait.
  function finDActe(h2) {
    let n = h2.nextElementSibling, dernierHr = null;
    while (n && n.tagName !== "H2") {
      dernierHr = n.tagName === "HR" ? n : (n.tagName === "P" && !n.textContent.trim() ? dernierHr : null);
      n = n.nextElementSibling;
    }
    return dernierHr || n;   // null : fin de page
  }

  function acteCourant(actes) {
    let courant = null;
    const milieu = window.innerHeight / 2;
    actes.forEach((h, num) => {
      if (!h.hidden && h.getBoundingClientRect().top < milieu && (!courant || num > courant)) courant = num;
    });
    return courant;
  }

  function boutonMain(seance, actes, etat) {
    const zone = el("div", { class: "tdc-main", role: "region", "aria-label": "Demander de l'aide" });
    const statut = el("p", { class: "tdc-main-statut", "aria-live": "polite" });
    const panneau = el("form", { class: "tdc-main-panneau", hidden: "hidden" });
    const mot = el("input", { type: "text", class: "tdc-input", maxlength: "140",
      placeholder: "Où bloquez-vous ? (facultatif)", "aria-label": "Où bloquez-vous ?" });
    const lever = el("button", { type: "submit", class: "tdc-bouton tdc-bouton-principal" }, ["Lever la main"]);
    const annuler = el("button", { type: "button", class: "tdc-bouton" }, ["Annuler"]);
    panneau.appendChild(mot);
    panneau.appendChild(el("div", { class: "tdc-main-actions" }, [lever, annuler]));
    const bouton = el("button", { type: "button", class: "tdc-bouton tdc-main-bouton", "aria-expanded": "false" });
    zone.appendChild(statut);
    zone.appendChild(panneau);
    zone.appendChild(bouton);

    let main = etat;   // la main levée en cours, ou null
    let minuteur = null;
    function afficher() {
      panneau.setAttribute("hidden", "hidden");
      bouton.setAttribute("aria-expanded", "false");
      // Sur un téléphone, seule l'icône reste à l'écran (le libellé reste lu
      // par les lecteurs d'écran) : la bulle ne recouvre plus le bouton
      // « Valider » d'une carte posée en bas de l'écran.
      const libelle = !main ? "Je bloque" : main.vue ? "Vu — baisser la main" : "Main levée — la baisser";
      vider(bouton);
      bouton.appendChild(el("span", { "aria-hidden": "true" }, [main && main.vue ? "👀" : "✋"]));
      bouton.appendChild(el("span", { class: "tdc-main-texte" }, [" " + libelle]));
      bouton.setAttribute("aria-label", libelle);
      bouton.classList.toggle("levee", !!main);
      statut.textContent = !main ? "" : main.vue
        ? "👀 L'enseignant a vu votre demande."
        : "Votre demande est envoyée. Continuez à lire en attendant.";
      // La bulle dit que c'est parti, puis s'efface : elle ne doit pas rester
      // posée sur le texte qu'on continue de lire. Le bouton garde l'état.
      statut.hidden = !main;
      clearTimeout(minuteur);
      if (main) minuteur = setTimeout(() => { statut.hidden = true; }, 6000);
    }
    bouton.addEventListener("click", async () => {
      if (main) {
        bouton.disabled = true;
        await sb.rpc("baisser_main", { p_seance_id: seance.id });
        bouton.disabled = false;
        main = null;
        return afficher();
      }
      const ouvert = !panneau.hasAttribute("hidden");
      if (ouvert) return afficher();
      panneau.removeAttribute("hidden");
      bouton.setAttribute("aria-expanded", "true");
      mot.focus();
    });
    annuler.addEventListener("click", afficher);
    panneau.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      lever.disabled = true;
      const acte = acteCourant(actes);
      const { data, error } = await sb.rpc("lever_main", {
        p_seance_id: seance.id, p_acte: acte, p_mot: mot.value || ""
      });
      lever.disabled = false;
      if (error || !data || !data.ok) {
        statut.hidden = false;
        statut.textContent = "La demande n'est pas partie. Réessayez dans un instant.";
        return;
      }
      main = { id: data.id, acte: acte, vue: false };
      mot.value = "";
      afficher();
    });
    afficher();

    // « Vu » arrive de l'enseignant : on relit toutes les vingt secondes tant
    // qu'une main est levée, et seulement dans ce cas.
    setInterval(async () => {
      if (!main || main.vue || document.hidden) return;
      const { data } = await sb.rpc("mes_points_passage", { p_seance_id: seance.id });
      if (data && data.ok) {
        const avant = main && main.vue;
        main = data.main || null;
        if (!main || main.vue !== avant) afficher();
      }
    }, 20000);
    return zone;
  }

  /* ------------------------------------------------------------------ */
  /* Publication : ce que la classe a le droit de lire                     */
  /* ------------------------------------------------------------------ */
  /* Deux notions distinctes, longtemps confondues :
   *   ouverte — la séance accepte des réponses (pendant l'heure) ;
   *   publiee — les étudiants ont le droit de la LIRE.
   * Le 09/09, la séance 2 était lisible le jour de la séance 1 : le sommaire
   * de MkDocs liste tout ce qui est écrit, et rien ne l'en empêchait.
   * L'enseignant décide depuis le portail ; ce fichier ne fait qu'obéir. */

  async function seancesPubliees() {
    const { data, error } = await sb
      .from("seances")
      .select("numero, publiee, classes!inner(code)")
      .eq("classes.code", CFG.classeCode);
    if (error || !data) return null;   // colonne absente : on ne cache rien
    const m = new Map();
    data.forEach((s) => m.set(Number(s.numero), s.publiee !== false));
    return m;
  }

  /* Retire du sommaire les séances que la classe ne doit pas encore voir.
   * Sans cela, la page serait bien vide mais son titre resterait affiché
   * dans le menu — ce qui revient à annoncer ce qu'on voulait cacher. */
  function elaguerSommaire(publiees) {
    document.querySelectorAll('a[href*="seance-"]').forEach((a) => {
      const m = a.getAttribute("href").match(/seance-(\d+)/i);
      if (!m) return;
      const n = Number(m[1]);
      if (publiees.has(n) && publiees.get(n) === false) {
        const li = a.closest("li");
        (li || a).setAttribute("hidden", "hidden");
      }
    });
  }

  /* La séance n'est pas publiée : on retire le contenu de la page et on dit
   * pourquoi. Laisser lire « le contenu ci-dessous reste consultable », comme
   * le faisait la séance fermée, dévoilerait exactement ce qu'on protège. */
  function pageNonPubliee(racine, numero) {
    const garder = racine.querySelector("h1");
    Array.from(racine.children).forEach((n) => {
      if (n !== garder) n.setAttribute("hidden", "hidden");
    });
    const bloc = el("div", { class: "tdc-widget" }, [
      el("h2", { class: "tdc-titre" }, ["Séance pas encore ouverte"]),
      el("p", {}, [
        "Cette séance n'a pas encore eu lieu. Elle s'ouvrira le jour venu, " +
        "et restera consultable ensuite pour réviser."
      ]),
      el("p", {}, [
        el("a", { href: PORTAIL }, ["Retour au portail"])
      ])
    ]);
    if (garder && garder.parentNode) garder.parentNode.insertBefore(bloc, garder.nextSibling);
    else racine.insertBefore(bloc, racine.firstChild);
  }

  async function assurerSession() {
    const { data } = await sb.auth.getSession();
    if (data && data.session) return true;
    const { error } = await sb.auth.signInAnonymously();
    if (error) { console.error("[suivi] connexion anonyme impossible", error); return false; }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Initialisation                                                       */
  /* ------------------------------------------------------------------ */

  async function init() {
    const numero = numeroSeanceCourante();

    // La session vient AVANT la lecture des publications. Sans elle, la
    // requête peut échouer, seancesPubliees() rend null, et on n'élague rien :
    // le défaut qu'on corrige reviendrait exactement comme avant.
    await assurerSession();

    // Le sommaire s'élague sur TOUTES les pages du site, pas seulement sur
    // celles de séance : c'est là qu'on clique pour aller voir trop loin.
    const publiees = await seancesPubliees();
    if (publiees) elaguerSommaire(publiees);

    if (!numero) return; // pas une page de séance : rien de plus à faire

    if (publiees && publiees.has(numero) && publiees.get(numero) === false) {
      const r = document.querySelector("article") ||
                document.querySelector(".md-content") || document.body;
      pageNonPubliee(r, numero);
      return;
    }

    const racine = document.querySelector("article") || document.querySelector(".md-content") || document.body;
    // Les ancres de questions ne servent qu'au parcours : hors parcours, elles
    // restent des blocs vides, invisibles.
    const questions = extraireQuestions(racine);
    if (questions.length === 0) return; // pas de quiz sur cette page

    // Séance courante
    const { data: seance, error: erreurSeance } = await sb
      .from("seances")
      .select("id, notee, ouverte, classes!inner(code)")
      .eq("classes.code", CFG.classeCode)
      .eq("numero", numero)
      .maybeSingle();

    if (erreurSeance || !seance) {
      console.error("[suivi] séance introuvable", erreurSeance);
      return;
    }

    const widget = creerWidget();
    const premierTitre = racine.querySelector("h1");
    if (premierTitre && premierTitre.parentNode) {
      premierTitre.parentNode.insertBefore(widget, premierTitre.nextSibling);
    } else {
      racine.insertBefore(widget, racine.firstChild);
    }

    // Séance fermée : c'est la trace de révision. Les dix questions restent
    // à leur place, lisibles — jusqu'au 19/10 elles étaient masquées ici
    // aussi, et « Réviser après la séance » n'avait plus rien à réviser.
    if (!seance.ouverte) {
      vider(widget);
      widget.classList.add("tdc-widget-discret");
      widget.appendChild(el("p", { class: "tdc-note" }, [
        "Séance close : cette page est la trace écrite, pour réviser ou rattraper. " +
        "Les questions de fin de page sont là pour vous re-tester ; la correction est proposée sur le portail."
      ]));
      return;
    }

    // Identité ouverte sur le portail : on la reprend sans rien redemander.
    let moi = null;
    try {
      const { data } = await sb.rpc("qui_suis_je");
      if (data && data.classe_code === CFG.classeCode) moi = data;
    } catch (e) {
      // Portail pas encore déployé : on retombe sur l'ancien parcours.
    }

    // qui_suis_je() renvoie classe_code ; le stockage local utilise classeCode.
    if (moi) {
      moi = {
        eleve_id: moi.eleve_id,
        avatar: moi.avatar,
        numero: moi.numero,
        classeCode: moi.classe_code
      };
      ecrireEleve(moi);
    }

    const eleve = moi || lireEleve();
    if (eleve && eleve.classeCode === CFG.classeCode) {
      if (eleve.numero) {
        widget.parentNode.insertBefore(bandeauConnecte(eleve.numero), widget);
      }
      // Pendant l'heure, les questions statiques de fin de page sont
      // remplacées par les étapes du parcours.
      masquerContenuStatique(questions, racine);
      try {
        await parcoursGuide(widget, eleve, seance, questions, racine);
      } catch (err) {
        // Repli permissif : une erreur ici ne doit jamais laisser une page
        // à moitié verrouillée. On rend tout, et on le dit dans la console.
        console.error("[suivi] parcours guidé indisponible", err);
        document.querySelectorAll("[data-tdc-verrou]").forEach((n) => { n.hidden = false; n.removeAttribute("data-tdc-verrou"); });
        document.querySelectorAll(".tdc-suite").forEach((n) => n.remove());
        document.querySelectorAll("[data-tdc-revision]").forEach((n) => { n.hidden = false; n.removeAttribute("data-tdc-revision"); });
        questions.forEach((q) => q.paragraphe.removeAttribute("hidden"));
      }
    } else {
      ecranPortail(widget);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
