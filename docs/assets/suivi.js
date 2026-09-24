/*
 * Tour de contrôle — suivi élève
 * ------------------------------------------------------------------
 * Composant autonome, sans framework, en français, accessible au clavier.
 * S'appuie sur window.TDC_CONFIG = { url, cle, classeCode } et sur
 * supabase-js v2 chargé globalement (voir mkdocs.yml, extra_javascript).
 *
 * Étapes :
 *   1. Session anonyme Supabase (signInAnonymously), réutilisée au rechargement
 *   2. Identification : numéro + avatar -> rejoindre()
 *   3. Détection de la séance courante depuis l'URL (seances/seance-NN/)
 *   4. Extraction du quiz de révision présent dans la page (10 questions
 *      "**N.** énoncé `A` … · `B` … · `C` … · `D` …") et remplacement par
 *      un questionnaire interactif, acte par acte (une question à la fois)
 *   5. Chaque réponse est envoyée via repondre(seance_id, question, reponse)
 *   6. Reprise automatique : les questions déjà répondues sont sautées
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

  /* ---- Écran 2 : questionnaire ----------------------------------------- */

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
      el("a", { class: "tdc-bouton", href: PORTAIL }, ["Ouvrir le portail"])
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

  async function ecranQuestionnaire(widget, eleve, seance, questions) {
    // Progression déjà enregistrée pour cette séance
    const { data: reponsesExistantes } = await sb
      .from("reponses")
      .select("question")
      .eq("eleve_id", eleve.eleve_id)
      .eq("seance_id", seance.id);
    const dejaRepondu = new Set((reponsesExistantes || []).map((r) => r.question));

    let index = questions.findIndex((q) => !dejaRepondu.has(q.id));
    if (index === -1) index = questions.length; // tout est fait

    function afficherFin() {
      vider(widget);
      const nom = eleve.avatar || (eleve.numero ? "numéro " + eleve.numero : "");
      widget.appendChild(el("h2", { class: "tdc-titre" }, ["Bravo, " + nom + " !"]));
      widget.appendChild(el("p", {}, [
        "Vous avez répondu aux " + questions.length + " questions de cette séance."
      ]));
    }

    function afficherQuestion() {
      if (index >= questions.length) {
        afficherFin();
        return;
      }
      const q = questions[index];
      vider(widget);

      const entete = el("p", { class: "tdc-progression" }, [
        "Question " + (index + 1) + " / " + questions.length
      ]);

      const form = el("form", { class: "tdc-form" });
      const legende = el("legend", { class: "tdc-question-texte" }, [q.texte]);
      const groupe = el("div", { class: "tdc-options", role: "radiogroup", "aria-label": q.texte });

      q.options.forEach((opt) => {
        const idOpt = "tdc-opt-" + q.id + "-" + opt.lettre;
        const label = el("label", { class: "tdc-option", for: idOpt }, [
          el("input", { type: "radio", name: "reponse", id: idOpt, value: opt.lettre }),
          el("span", {}, [opt.lettre + " — " + opt.libelle])
        ]);
        groupe.appendChild(label);
      });

      const fieldset = el("fieldset", { class: "tdc-fieldset" }, [legende, groupe]);
      const zoneRetour = el("div", { class: "tdc-retour", "aria-live": "polite" });
      const boutonValider = el("button", { type: "submit", class: "tdc-bouton tdc-bouton-principal" }, ["Valider"]);

      form.appendChild(fieldset);
      form.appendChild(zoneRetour);
      form.appendChild(boutonValider);

      form.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const choix = form.querySelector('input[name="reponse"]:checked');
        if (!choix) {
          zoneRetour.innerHTML = "";
          zoneRetour.appendChild(el("p", { class: "tdc-erreur", role: "alert" }, ["Choisissez une réponse avant de valider."]));
          return;
        }
        boutonValider.disabled = true;
        try {
          const { data, error } = await sb.rpc("repondre", {
            p_seance_id: seance.id,
            p_question: q.id,
            p_reponse: choix.value
          });
          if (error) throw error;

          vider(zoneRetour);
          if (typeof data.correct === "boolean") {
            const bonne = data.correct
              ? el("p", { class: "tdc-correct" }, ["✅ Bonne réponse !"])
              : el("p", { class: "tdc-incorrect" }, [
                  "❌ Ce n'était pas ça. Bonne réponse : " + data.bonne_reponse + "."
                ]);
            zoneRetour.appendChild(bonne);
            if (data.explication) {
              zoneRetour.appendChild(el("p", { class: "tdc-explication" }, [data.explication]));
            }
          } else {
            zoneRetour.appendChild(el("p", {}, ["Réponse enregistrée."]));
          }

          boutonValider.setAttribute("hidden", "hidden");
          const boutonSuivant = el("button", { type: "button", class: "tdc-bouton tdc-bouton-principal" }, [
            index + 1 < questions.length ? "Question suivante" : "Terminer"
          ]);
          boutonSuivant.addEventListener("click", () => {
            index += 1;
            afficherQuestion();
          });
          form.appendChild(boutonSuivant);
          boutonSuivant.focus();
        } catch (err) {
          vider(zoneRetour);
          zoneRetour.appendChild(el("p", { class: "tdc-erreur", role: "alert" }, [messageLisible(err)]));
          boutonValider.disabled = false;
        }
      });

      widget.appendChild(entete);
      widget.appendChild(form);
      const premierChamp = form.querySelector('input[type="radio"]');
      if (premierChamp) premierChamp.focus();
    }

    afficherQuestion();
  }


  /* ------------------------------------------------------------------ */
  /* Points de passage et main levée (24/09/2026)                        */
  /* ------------------------------------------------------------------ */
  /* Le quiz est à la fin de la trace : pendant les actes, l'enseignant ne
   * voyait rien. Un point de passage à la fin de chaque acte dit où en est
   * chacun pendant l'heure — une question courte, ou un simple « j'ai fini ».
   * Et « Je bloque » remplace la main levée qu'un cours en ligne n'a pas.
   *
   * Les points vivent EN BASE (points_passage), comme le contrôle d'entrée :
   * la page ne porte ni la question ni la bonne réponse. Si la fonction
   * n'existe pas encore en base, rien n'apparaît et la page reste ce
   * qu'elle était. */

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
      if (h.getBoundingClientRect().top < milieu && (!courant || num > courant)) courant = num;
    });
    return courant;
  }

  function blocPassage(seance, point) {
    const bloc = el("section", { class: "tdc-passage", "aria-label": "Point de passage, acte " + point.acte });
    bloc.appendChild(el("p", { class: "tdc-passage-titre" }, [
      "📍 Point de passage — fin de l'acte " + Object.keys(ROMAINS)[point.acte - 1]
    ]));
    const retour = el("div", { class: "tdc-retour", "aria-live": "polite" });

    function montrerResultat(r) {
      vider(retour);
      if (point.intitule && typeof r.correct === "boolean") {
        retour.appendChild(el("p", { class: r.correct ? "tdc-correct" : "tdc-incorrect" }, [
          r.correct ? "✅ Juste. Passez à la suite." : "❌ Pas tout à fait — la bonne réponse était " + r.bonne + "."
        ]));
        if (r.explication) retour.appendChild(el("p", { class: "tdc-explication" }, [r.explication]));
      } else {
        retour.appendChild(el("p", { class: "tdc-correct" }, ["✅ C'est noté. Passez à la suite."]));
      }
    }

    if (point.fait) {
      if (point.intitule) bloc.appendChild(el("p", { class: "tdc-question-texte" }, [point.intitule]));
      bloc.appendChild(retour);
      montrerResultat(point);
      return bloc;
    }

    const form = el("form", { class: "tdc-form" });
    let groupe = null;
    if (point.intitule) {
      groupe = el("div", { class: "tdc-options", role: "radiogroup", "aria-label": point.intitule });
      (point.options || []).forEach((o, i) => {
        const lettre = "ABCD"[i];
        const id = "tdc-pp-" + point.acte + "-" + lettre;
        groupe.appendChild(el("label", { class: "tdc-option", for: id }, [
          el("input", { type: "radio", name: "pp-" + point.acte, id: id, value: lettre }),
          el("span", {}, [lettre + " — " + o])
        ]));
      });
      form.appendChild(el("fieldset", { class: "tdc-fieldset" }, [
        el("legend", { class: "tdc-question-texte" }, [point.intitule]), groupe]));
    }
    const bouton = el("button", { type: "submit", class: "tdc-bouton tdc-bouton-principal" }, [
      point.intitule ? "Valider et continuer" : "J'ai fini cet acte"
    ]);
    form.appendChild(retour);
    form.appendChild(bouton);
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      let rep = null;
      if (groupe) {
        const c = form.querySelector("input:checked");
        if (!c) {
          vider(retour);
          retour.appendChild(el("p", { class: "tdc-erreur", role: "alert" }, ["Choisissez une réponse."]));
          return;
        }
        rep = c.value;
      }
      bouton.disabled = true;
      try {
        const { data, error } = await sb.rpc("passer_acte", {
          p_seance_id: seance.id, p_acte: point.acte, p_reponse: rep
        });
        if (error) throw error;
        if (!data || !data.ok) throw new Error(data && data.motif === "fermee"
          ? "La séance est fermée." : "Réponse non enregistrée.");
        form.querySelectorAll("input").forEach((i) => { i.disabled = true; });
        bouton.setAttribute("hidden", "hidden");
        montrerResultat(data);
      } catch (err) {
        vider(retour);
        retour.appendChild(el("p", { class: "tdc-erreur", role: "alert" }, [messageLisible(err)]));
        bouton.disabled = false;
      }
    });
    bloc.appendChild(form);
    return bloc;
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
      bouton.textContent = !main ? "✋ Je bloque"
        : main.vue ? "👀 Vu — baisser la main" : "✋ Main levée — la baisser";
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

  async function initPassages(seance, racine) {
    let data;
    try {
      const r = await sb.rpc("mes_points_passage", { p_seance_id: seance.id });
      if (r.error) return;           // fonction pas encore en base
      data = r.data;
    } catch (e) { return; }
    if (!data || !data.ok) return;

    const actes = titresActes(racine);
    (data.points || []).forEach((point) => {
      const h = actes.get(point.acte);
      if (!h) return;
      const fin = finDActe(h);
      const bloc = blocPassage(seance, point);
      if (fin && fin.parentNode) fin.parentNode.insertBefore(bloc, fin);
      else h.parentNode.appendChild(bloc);
    });
    if (data.ouverte) document.body.appendChild(boutonMain(seance, actes, data.main || null));
  }

  /* ------------------------------------------------------------------ */
  /* Initialisation                                                       */
  /* ------------------------------------------------------------------ */

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

    masquerContenuStatique(questions, racine);

    const widget = creerWidget();
    const premierTitre = racine.querySelector("h1");
    if (premierTitre && premierTitre.parentNode) {
      premierTitre.parentNode.insertBefore(widget, premierTitre.nextSibling);
    } else {
      racine.insertBefore(widget, racine.firstChild);
    }

    if (!seance.ouverte) {
      vider(widget);
      widget.appendChild(el("h2", { class: "tdc-titre" }, ["Séance fermée"]));
      widget.appendChild(el("p", {}, [
        "Cette séance n'est pas encore ouverte, ou elle est terminée. Le contenu ci-dessous reste consultable."
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
      ecranQuestionnaire(widget, eleve, seance, questions);
      initPassages(seance, racine);
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
