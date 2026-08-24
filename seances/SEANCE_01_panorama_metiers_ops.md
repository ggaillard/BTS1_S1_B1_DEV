# FICHE DE SÉANCE DÉTAILLÉE — SÉANCE 1
## « Panorama des métiers du dev & les 5 composants du SI »

**Progression** : BTS SIO 1re année — Bloc 1 DEV — Semestre 1 (fil rouge « les 4 cultures Ops »)
**Séance** : 1 / 14 · Acte 0 — Cadrage
**Durée** : 1 h · **Modalité** : 📄 papier (salle banalisée) — 💻 variante machine possible (QCM en ligne)
**Enseignant** : G. Gaillard — Lycée Simone Weil

---

## 1. Objectifs

| Type | Objectif | Indicateur de réussite |
|------|----------|------------------------|
| Cognitif | Nommer les **5 composants du SI** (modèle de Laudon) | 5 composants restitués (Q11) |
| Cognitif | Situer les **4 cultures Ops** (DevOps, DevSecOps, DataOps, MLOps) | Association culture ↔ mission correcte (QCM) |
| Métier | Relier une culture Ops à un **métier** et à un débouché | Q12 renseignée avec cohérence |
| Attitude | Se **projeter** dans le fil rouge du semestre | Participation + choix d'orientation exprimé |

**Compétences visées** : B1C2 (situer le développement dans le SI) · transversal (culture, veille, orientation).

**Prérequis** : aucun — séance d'ouverture. Usage quotidien d'applis web suffit.

---

## 2. Matériel

| Modalité | Besoins |
|----------|---------|
| Commun | Vidéoprojecteur, slides « Panorama 4 Ops », **feuille-réponse** imprimée (1/élève), **fiche support élève** (schéma Laudon + carte des métiers à annoter) |
| 📄 Papier | Feuilles-réponses + fiches support imprimées |
| 💻 Machine | Version Google Forms du QCM (mêmes questions) pour un rendu automatique |

---

## 3. Déroulé minuté (1 h = 60 min)

| Temps | Phase | Activité enseignant | Activité étudiant | Support |
|-------|-------|---------------------|-------------------|---------|
| **0-5’** | Accroche | « À quoi ressemble une journée d'un développeur en 2026 ? » — 3 photos/mots-clés projetés | Réagissent, mains levées | Slide 1-2 |
| **5-20’** | Le SI, un tout | Présenter les **5 composants de Laudon** (MLDPP) avec exemples DevSecure | Complètent le **schéma Laudon** de la fiche support | Fiche support §A |
| **20-40’** | Carte des 4 Ops | Dérouler la **carte des métiers** : DevOps → DevSecOps → DataOps → MLOps (mission, outil, métier, salaire) | Annotent la **carte des métiers** | Fiche support §B |
| **40-55’** | Diagnostic | Distribuer + cadrer le **QCM diagnostic** (feuille-réponse) | Répondent seuls, au stylo | Feuille-réponse |
| **55-60’** | Clôture | Annoncer le fil rouge du semestre + ramasser les copies | Rendent la feuille-réponse | — |

> **Gestion du temps** : si l'accroche déborde, réduire §B à DevOps + une autre culture et renvoyer le reste en S4/S11/S13.

---

## 4. Contenu notionnel (l'essentiel à transmettre)

### A. Les 5 composants du SI — modèle de Laudon (« MLDPP »)

| Composant | Définition courte | Exemple chez DevSecure |
|-----------|-------------------|------------------------|
| **M** — Matériel | Serveurs, réseau, cloud, postes | Serveurs AWS, base MongoDB |
| **L** — Logiciel | Code, frameworks, API | L'application Node/React |
| **D** — Données | BDD, fichiers, logs, sauvegardes | Projets et données clients |
| **P** — Procédures | Façons de faire : CI/CD, revue de code, docs | Déploiement, tests |
| **H** — Personnel (Humain) | Les personnes : devs, ops, utilisateurs | Thomas, le lead dev |

> 🔑 Mnémonique : **MLDPP** = « Ma Ligne De Protection Permanente ». Message : *le développeur agit surtout sur le Logiciel, mais ses choix impactent tout le reste.*

### B. La carte des 4 cultures « Ops »

| Culture | Mission (la question) | Outils typiques | Métier phare | Ordre de grandeur salaire (débutant/confirmé, France) |
|---------|-----------------------|-----------------|--------------|--------------------------------------------------------|
| **DevOps** | Livrer du code **vite et bien** | Git, CI/CD, Docker | Ingénieur DevOps | ~35-55 k€ |
| **DevSecOps** | Livrer du code **sécurisé dès la conception** | OWASP, SAST, scanners | Dev sécurité / DevSecOps | ~38-60 k€ |
| **DataOps** | Industrialiser la **donnée** | ETL/ELT, pipelines data | Data Engineer | ~38-58 k€ |
| **MLOps** | Mettre l'**IA** en production, de façon fiable et responsable | ML, monitoring de modèles | ML Engineer | ~42-65 k€ |

> Fourchettes indicatives, à présenter comme des repères et non des promesses (à réactualiser). Fil conducteur : *ce sont les mêmes réflexes d'industrialisation, appliqués à des objets différents (code, sécurité, données, IA).*

---

## 5. Support élève à distribuer (papier)

**Fiche support — recto :**
- **§A. Schéma de Laudon à compléter** : 5 cases vides reliées au centre « SI » ; l'élève écrit M/L/D/P/H + un exemple par case.
- **§B. Carte des métiers à annoter** : 4 blocs (DevOps, DevSecOps, DataOps, MLOps) avec, pour chacun, 3 champs à remplir pendant le cours : *mission · outil · métier*.

*(Je peux générer cette fiche support prête à imprimer si vous le souhaitez.)*

---

## 6. ÉVALUATION — QCM diagnostic (feuille-réponse scannable)

**Nature** : diagnostic de positionnement, **non noté** (sert à mesurer le point de départ de la classe et à ouvrir l'orientation). Corrigé via le workflow scan + IA pour obtenir en 5 min une **photo des acquis de la classe**.

### 6.1 Énoncé (projeté ou au dos de la feuille-réponse)

**Partie A — QCM (1 seule réponse par question) :**

1. Le modèle de Laudon décrit un SI en 5 composants. Lequel n'en fait **pas** partie ?
   A) Matériel  B) Logiciel  C) Données  D) Bénéfice
2. Dans ce modèle, le **code** d'une application relève du composant :
   A) Matériel  B) Logiciel  C) Données  D) Procédures
3. Le mot **DevOps** rapproche deux mondes :
   A) Design + Operations  B) Développement + Operations  C) Data + Options  D) Développement + Design
4. La culture qui intègre la **sécurité dès la conception** s'appelle :
   A) DataOps  B) MLOps  C) DevSecOps  D) SecuWeb
5. « Industrialiser la **donnée** » (pipelines, ETL, qualité) correspond à :
   A) DevOps  B) DataOps  C) MLOps  D) DevSecOps
6. Mettre un **modèle d'IA** en production de façon fiable relève de :
   A) MLOps  B) DevOps  C) DataOps  D) WebOps
7. Une **API REST** sert principalement à :
   A) dessiner des interfaces  B) faire communiquer des applications  C) stocker des mots de passe  D) compiler du code
8. **Git** est un outil de :
   A) gestion de versions  B) base de données  C) messagerie  D) conteneurisation
9. Le **RGPD** concerne avant tout :
   A) la performance des serveurs  B) la protection des données personnelles  C) le référencement web  D) la vitesse du code
10. Parmi ces métiers, lequel est le plus lié à la **donnée** ?
    A) Data Engineer  B) Développeur Frontend  C) Scrum Master  D) Community Manager

**Partie B — Réponses courtes (mots-clés en MAJUSCULES) :**

11. Citez les **5 composants** d'un SI (modèle de Laudon).
12. Parmi les 4 cultures Ops, laquelle vous attire le plus aujourd'hui, **en une phrase** ? *(positionnement, non noté)*

### 6.2 Gabarit de la FEUILLE-RÉPONSE (à imprimer, 1 recto)

```
┌───────────────────────────────────────────────────────────────┐
│  BTS SIO 1 — DEV — SÉANCE 1 — QCM DIAGNOSTIC (non noté)         │
│  NOM : [_][_][_][_][_][_][_]   PRÉNOM : [_][_][_][_][_]         │
│  CLASSE : [___]   N° : [__]                                     │
├───────────────────────────────────────────────────────────────┤
│  PARTIE A — Noircir UNE case par ligne :                       │
│      A   B   C   D                A   B   C   D                 │
│  Q1  ▢   ▢   ▢   ▢            Q6  ▢   ▢   ▢   ▢                  │
│  Q2  ▢   ▢   ▢   ▢            Q7  ▢   ▢   ▢   ▢                  │
│  Q3  ▢   ▢   ▢   ▢            Q8  ▢   ▢   ▢   ▢                  │
│  Q4  ▢   ▢   ▢   ▢            Q9  ▢   ▢   ▢   ▢                  │
│  Q5  ▢   ▢   ▢   ▢            Q10 ▢   ▢   ▢   ▢                  │
├───────────────────────────────────────────────────────────────┤
│  PARTIE B —                                                    │
│  Q11 (5 composants, MAJUSCULES) :                              │
│   1:__________  2:__________  3:__________                     │
│   4:__________  5:__________                                   │
│  Q12 (une phrase) :                                            │
│   ____________________________________________________         │
├───────────────────────────────────────────────────────────────┤
│  Réservé correction :  A ___/10   B(Q11) ___/5   TOTAL ___/15  │
└───────────────────────────────────────────────────────────────┘
```

*(Je peux produire ce gabarit en PDF prêt à imprimer, avec de vraies cases à noircir.)*

### 6.3 Corrigé + barème structuré (à fournir à l'IA avec les scans)

**Partie A — 1 point par bonne réponse (10 pts) :**

| Q | Réponse | Q | Réponse |
|---|---------|---|---------|
| 1 | **D** | 6 | **A** |
| 2 | **B** | 7 | **B** |
| 3 | **B** | 8 | **A** |
| 4 | **C** | 9 | **B** |
| 5 | **B** | 10 | **A** |

**Partie B :**
- **Q11 (5 pts)** : 1 pt par composant correct parmi **MATÉRIEL, LOGICIEL, DONNÉES, PROCÉDURES, PERSONNEL** (accepter « Humain » pour Personnel, « Matériels/Hardware », « Software », etc.).
- **Q12 (0 pt — diagnostic)** : non noté ; **classer** la réponse dans DevOps / DevSecOps / DataOps / MLOps / Indécis pour la statistique d'orientation.

**Total noté indicatif : /15** (diagnostic, non comptabilisé — sert de point de repère).

### 6.4 Ce que l'IA vous renvoie après scan
- **Note /15 par élève** (A + Q11) et statut de Q12 (orientation choisie).
- **Taux de réussite par question** (ex. « Q4 DevSecOps : 45 % » → à retravailler).
- **Carte d'orientation de la classe** : combien attirés par DevOps / DevSecOps / DataOps / MLOps.
- **Tableau récap** exportable (CSV/xlsx) + copies à écriture ambiguë **signalées** pour relecture.

> Pour ce diagnostic, l'intérêt n'est pas la note mais la **photo instantanée de la classe** : elle vous dit sur quoi insister dans les actes suivants.

---

## 7. Différenciation & prolongement
- **Élève rapide** : au dos, « proposez un 5ᵉ Ops qui pourrait exister » (créativité, ex. « GreenOps »).
- **Élève en difficulté** : la fiche support reste sous les yeux pendant le QCM (diagnostic, pas d'enjeu de note).
- **Prolongement (facultatif, maison)** : repérer dans une offre d'emploi réelle (LinkedIn/France Travail) à quelle culture Ops elle se rattache — amorce de veille pour la S14.

---

## 8. Trace écrite (à noter par les élèves, 2 lignes)
> « Un SI = 5 composants (MLDPP). Le développeur agit sur le **Logiciel**, mais impacte tout le SI. Ce semestre : 4 cultures pour industrialiser le code (**DevOps**), la sécurité (**DevSecOps**), la donnée (**DataOps**) et l'IA (**MLOps**). »

---

*Fiche construite pour la progression S1 2026-2027. Les fourchettes de salaires et le prolongement veille sont à réactualiser chaque année.*
