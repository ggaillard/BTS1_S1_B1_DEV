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
  /* Initialisation                                                       */
  /* ------------------------------------------------------------------ */

  async function init() {
    const numero = numeroSeanceCourante();
    if (!numero) return; // pas une page de séance : rien à faire

    const racine = document.querySelector("article") || document.querySelector(".md-content") || document.body;
    const questions = extraireQuestions(racine);
    if (questions.length === 0) return; // pas de quiz sur cette page

    // Session anonyme
    const { data: sessionData } = await sb.auth.getSession();
    if (!sessionData || !sessionData.session) {
      const { error } = await sb.auth.signInAnonymously();
      if (error) {
        console.error("[suivi] connexion anonyme impossible", error);
        return;
      }
    }

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
