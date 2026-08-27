# PROGRESSION PÉDAGOGIQUE — BTS SIO 1re année — Bloc 1 « DEV »
## Semestre 1 · Fil rouge « Du code au service : les 4 cultures Ops »

**Formation** : BTS SIO 1re année — Option SLAM (Développement)
**Bloc** : Bloc 1 — DEV (dénomination établissement) · adossé aux compétences B1C2, B1C4, B3C1, B3C2
**Volume** : 1 h / semaine × 14 semaines = 14 h
**Modalités** : salle informatique (machine) **ou** salle banalisée (papier) — chaque séance propose les deux variantes
**Enseignant** : G. Gaillard — Lycée Simone Weil, Saint-Priest-en-Jarez
**Année** : 2026-2027

---

## 1. Intention pédagogique

Ce semestre pose le **socle de culture applicative** de la 1re année et fait **découvrir les grandes familles de métiers** du numérique moderne. Le fil rouge est volontairement organisé autour des **4 cultures « Ops »**, qui structurent aujourd'hui l'industrie et les débouchés des étudiants SLAM :

| Culture | Question centrale | Métier phare |
|---------|-------------------|--------------|
| **DevOps** | Comment livrer du code vite **et** bien ? | Développeur / Ingénieur DevOps |
| **DevSecOps** | Comment livrer du code **sécurisé** dès la conception ? | Développeur sécurité / DevSecOps |
| **DataOps** | Comment industrialiser la **donnée** ? | Data Engineer / DataOps |
| **MLOps** | Comment mettre l'**IA** en production de façon responsable ? | ML Engineer / MLOps |

La **sécurité est intégrée** (secure by design), pas ajoutée à la fin : elle irrigue tout l'acte DevSecOps et se prolonge en conformité (RGPD, AI Act).

### Principes de conduite
- **1 h = 1 idée forte.** Chaque séance vise un seul concept-clé exploitable immédiatement.
- **Alternance cours / atelier.** Théorie et mise en situation « mission » s'enchaînent (approche déjà éprouvée dans les supports existants).
- **Entreprise fictive fil rouge.** On réutilise **DevSecure** (SaaS gestion de projets) et **MetalPrecision** comme terrains d'analyse récurrents.
- **Papier ⇄ machine.** La progression reste jouable sans salle info : les variantes papier sont explicites.
- **Évaluation scannable + correction IA.** Toutes les évaluations notées utilisent une **feuille-réponse standardisée** conçue pour être scannée puis corrigée avec l'aide d'une IA (barème structuré fourni). Objectif : correction rapide, régulière et homogène.

---

## 2. Vue d'ensemble (14 semaines)

| S | Acte | Thème de la séance | Modalité dominante | Livrable / éval |
|---|------|--------------------|--------------------|-----------------|
| **1** | Cadrage | « 03 h 47 » — enquête : métiers du dev & 5 composants du SI | 💻 En ligne | Auto-évaluation |
| **2** | Cadrage | Applications web modernes : du statique au temps réel | 💻 Machine | — |
| **3** | Cadrage | Données & écosystèmes : SQL, NoSQL, Data Lake/Warehouse | 💻/📄 | — |
| **4** | **DevOps** | Culture DevOps, cycle de vie & versioning Git | 💻/📄 | — |
| **5** | **DevOps** | Intégration continue & conteneurisation (CI/CD, Docker) | 📄/💻 | — |
| **6** | **DevOps** | Atelier : mini-pipeline sur le projet fil rouge | 💻 | **TP formatif noté** |
| **7** | **DevSecOps** | Sécurité applicative : OWASP Top 10, vuln./menace/risque | 📄 | — |
| **8** | **DevSecOps** | Mission audit DevSecure : cartographie des vulnérabilités | 💻/📄 | **Cartographie (formative)** |
| **9** | **DevSecOps** | Remédiation & conformité : auth, RGPD, AI Act, NIS2 | 📄 | — |
| **10** | Bilan | Évaluation sommative mi-semestre (« Bilan ») | 📄 | **DS sommatif n°1** |
| **11** | **DataOps** | Industrialiser la donnée : pipelines, ETL/ELT, qualité | 💻/📄 | — |
| **12** | **DataOps** | Mission Data (« Sauver Doctolib ») | 💻/📄 | Mission (formative) |
| **13** | **MLOps** | Mettre l'IA en production & IA responsable (AI Act) | 📄 | — |
| **14** | Synthèse | Les 4 Ops en miroir + orientation métiers | 📄 | **Éval sommative n°2 + oral** |

> **Repères de calendrier** : 3 semaines de cadrage (S1-S3), puis 4 actes métiers, avec un jalon sommatif à mi-parcours (S10, « bilan de Noël ») et un jalon final (S14). Prévoir des semaines-tampon en cas de fériés/absences ; la progression tolère de décaler S12 (atelier) sans casser la logique.

---

## 3. Compétences visées sur le semestre

Codes repris des supports existants (fiche enseignant SLAM, README), complétés par les activités du référentiel BTS SIO.

| Code | Compétence | Séances principales |
|------|------------|---------------------|
| **B1C2** | Développer des solutions applicatives | S2, S4, S6, S8 |
| **B1C4** | Sécuriser les applications | S7, S8, S9 |
| **B3C1** | Analyser un risque informatique | S7, S8, S10 |
| **B3C2** | Appliquer les mesures de sécurité | S9, S10 |
| Transversal | Veille, esprit critique, choix technologiques justifiés | S1, S13, S14 |
| A1.2.1 / A1.3.2 | Dossier de choix de solution / d'architecture | S5, S14 |
| A4.1.3 | Conception / adaptation de la base de données | S3, S11 |
| A4.1.9 / A5.1.1 | Rédaction & mise à jour de documentation technique | S6, S12 |

---

## 4. Progression détaillée, séance par séance

Chaque fiche suit le même canevas : **objectif** · **notions-clés** · **déroulé 1 h** · **variante papier / machine** · **supports** (♻ = support déjà existant) · **lien métiers**.

---

### ACTE 0 — CADRAGE & CULTURE (S1 → S3)

#### Séance 1 — « 03 h 47 » : enquête sur la nuit où DevSecure a cessé d'exister
- **Objectif** : situer le développeur dans un SI complet ; découvrir la carte des métiers (DevOps, DevSecOps, DataOps, MLOps) qui servira de fil rouge.
- **Notions-clés** : modèle de Laudon (M-L-D-P-P « MLDPP » : Matériel, Logiciel, Données, Procédures, Personnel), chaîne de causalité d'un incident, panorama des 4 Ops, débouchés & salaires.
- **Déroulé (1 h)** : cold open « 03 h 47 » (5’) → Acte I *la scène de crime* : les 5 composants (13’) → Acte II *quatre experts arrivent* : les 4 cultures Ops incarnées (17’) → Acte III *le retournement* : la chaîne remonte à 11 semaines (12’) → Acte IV *et vous ?* (3’) → **auto-évaluation** en ligne (10’).
- **💻 Tout en ligne** : la fiche de séance contient l'énoncé, les indices, les corrigés dépliables et l'auto-évaluation. Rien à imprimer.
- **Évaluation** : **aucune note, aucun ramassage** — auto-positionnement en 4 parties (quiz corrigé, restitution des 5 composants, grille « où en suis-je ? », choix d'orientation relu en S14).
- **Lien métiers** : ouverture sur les 4 Ops — « à la fin du semestre, vous saurez lequel vous attire ».

#### Séance 2 — Applications web modernes : du statique au temps réel
- **Objectif** : comprendre l'architecture client-serveur et l'évolution web (1.0 → temps réel) qui conditionne tout le reste.
- **Notions-clés** : client-serveur, API REST, AJAX vs WebSocket, PWA, responsive / mobile-first.
- **Déroulé (1 h)** : frise historique du web (10’) → démo live AJAX (Gmail) & WebSocket (Discord 2 onglets) (20’) → API REST : requête/réponse (15’) → mini-analyse d'une app qu'ils utilisent (10’) → synthèse (5’).
- **💻 Machine** : démos navigateur + inspecteur réseau (F12). **📄 Papier** : captures d'écran + schéma requête/réponse à tracer.
- **Supports** : ♻ *Support Enseignant — Applications Web Modernes* (18 slides + notes), ♻ *QCM Applications Web Modernes*.
- **Lien métiers** : le « produit » que les Ops vont industrialiser.

#### Séance 3 — Données & écosystèmes : SQL, NoSQL, Data Lake/Warehouse
- **Objectif** : distinguer les grands modèles de données et où elles vivent, pré-requis de l'acte DataOps.
- **Notions-clés** : relationnel (SQL, clé primaire/étrangère), NoSQL (documents, clé-valeur), Data Lake / Warehouse / Lakehouse, BDD managées.
- **Déroulé (1 h)** : histoire éclair « de l'argile aux algorithmes » (10’) → relationnel vs NoSQL, cas d'usage (20’) → écosystèmes Data Lake/Warehouse (15’) → mini-exercice modélisation (10’) → synthèse (5’).
- **💻 Machine** : quelques requêtes SQL `SELECT` sur base d'exemple. **📄 Papier** : modéliser un schéma relationnel simple (2-3 tables) + choisir SQL/NoSQL selon 4 scénarios.
- **Supports** : ♻ *Cours bases de données BTS SIO* (pptx/pdf), ♻ *Écosystèmes Digitaux et Données*, ♻ *De l'argile aux algorithmes*.
- **Lien métiers** : socle du Data Engineer (DataOps).

---

### ACTE 1 — DevOps : INDUSTRIALISER LE CODE (S4 → S6)

#### Séance 4 — Culture DevOps, cycle de vie & versioning Git
- **Objectif** : comprendre pourquoi DevOps rapproche Dev et Ops, et manipuler la notion de versioning.
- **Notions-clés** : cycles cascade / V / agile, culture DevOps (automatisation, mesure, collaboration), Git (commit, branche, merge, pull request).
- **Déroulé (1 h)** : « qui a déjà perdu du code ? » (5’) → cycles de vie comparés (15’) → principes DevOps (10’) → Git en pratique : workflow feature branch (25’) → synthèse (5’).
- **💻 Machine** : `git init / add / commit / branch / merge` sur un mini-dépôt local. **📄 Papier** : dérouler un workflow Git sur schéma (cartes « commits » à ordonner), rédiger 3 messages de commit.
- **Supports** : ♻ *CDT — Séance DevOps (Git, CI/CD)*, ressources Git officielles.
- **Lien métiers** : cœur du métier Ingénieur DevOps.

#### Séance 5 — Intégration continue & conteneurisation
- **Objectif** : saisir l'enchaînement build → test → déploiement automatisé et le rôle des conteneurs.
- **Notions-clés** : CI/CD, pipeline, tests automatisés (unitaires/intégration/E2E), Docker (image, conteneur, Dockerfile), staging vs prod.
- **Déroulé (1 h)** : rappel « déployer à la main = risque » (5’, écho à l'incident DevSecure de la séance 1) → anatomie d'un pipeline (20’) → Docker : analogie « conteneur = colis standardisé » (15’) → lecture guidée d'un fichier CI (`.github/workflows`) (15’) → synthèse (5’).
- **📄 Papier** : reconstituer les étapes d'un pipeline dans le désordre + annoter un Dockerfile. **💻 Machine** : lire/lancer un pipeline de démo (GitHub Actions) ou Play-with-Docker.
- **Supports** : ♻ *CDT — Séance DevOps*, doc GitHub Actions, labs.play-with-docker.com.
- **Lien métiers** : passerelle Dev → Ops ; introduit le dossier de choix d'architecture (A1.3.2).

#### Séance 6 — Atelier : mini-pipeline sur le projet fil rouge  ⭐ TP noté (formatif)
- **Objectif** : mettre en œuvre concrètement un enchaînement versioning → test → « déploiement » sur un petit projet.
- **Notions-clés** : réinvestissement S4-S5, qualité logicielle, documentation technique.
- **Déroulé (1 h)** : consignes + constitution binômes (5’) → réalisation guidée (40’) → mise en commun & auto-évaluation (10’) → dépôt du livrable (5’).
- **💻 Machine** : workflow Git + pipeline simplifié sur projet (type BiblioTech / DevSecure). **📄 Papier** : « pipeline sur table » — concevoir et documenter le pipeline complet d'une app donnée (étapes, tests, rollback).
- **Évaluation** : **grille TP Bloc 1** (♻ *Grille_Evaluation_TP_Bloc1_v2*). Noté formatif, compte dans la moyenne de suivi.
- **Lien métiers** : première production « à la DevOps ».

---

### ACTE 2 — DevSecOps : SÉCURISER DÈS LA CONCEPTION (S7 → S9)

#### Séance 7 — Sécurité applicative : OWASP Top 10 & analyse de risque
- **Objectif** : reconnaître les grandes familles de vulnérabilités et poser le vocabulaire vulnérabilité / menace / risque.
- **Notions-clés** : OWASP Top 10, injection SQL, XSS, CSRF, IDOR, formule `RISQUE = Vraisemblance × Impact`, secure by design, SPOF.
- **Déroulé (1 h)** : accroche incident **Log4Shell** (10’) → OWASP Top 10 en images (15’) → vuln./menace/risque + matrice EBIOS simplifiée (20’) → repérage de failles sur 2 extraits de code DevSecure (10’) → synthèse (5’).
- **📄 Papier** : classer 8 failles par catégorie OWASP + composant Laudon ; démo projetée d'injection SQL. **💻 Machine** : parcours guidé DVWA / WebGoat (optionnel).
- **Supports** : ♻ *SI fictif DevSecure* (extraits de code), ♻ *Grille d'identification des vulnérabilités*, ♻ *Support de cours SLAM* (OWASP + Secure Coding).
- **Lien métiers** : entrée dans le DevSecOps ; compétences B1C4 + B3C1.

#### Séance 8 — Mission audit DevSecure : cartographie des vulnérabilités  ⭐ Cartographie (formative)
- **Objectif** : réaliser un audit structuré (Blue Team) du SI DevSecure et produire une cartographie des risques.
- **Notions-clés** : cartographie Laudon × OWASP × SPOF, matrice de criticité, RTO/RPO, différenciation par niveau.
- **Déroulé (1 h)** : rappel mission + distribution template (5’) → audit en binôme du SI + code DevSecure (40’) → mise en commun des SPOF & risques critiques (10’) → dépôt (5’).
- **Différenciation** (reprise des 3 profils de différenciation) : *accompagné* (template pré-rempli, ≥10 vuln./2 SPOF) · *standard* (≥15 vuln./3 SPOF) · *avancé* (extension API, 20 vuln. + RTO/RPO).
- **💻 Machine** : audit + saisie de la cartographie. **📄 Papier** : template cartographie imprimé + grille (dispositif 100 % papier prévu dans les supports existants).
- **Supports** : ♻ *SI fictif DevSecure*, ♻ *Template cartographie SLAM/risques*, ♻ *Template pré-rempli*, ♻ *Extension API Security*, ♻ *Scénario NotebookLM DevSecure* (accroche audio).
- **Lien métiers** : le geste-clé du DevSecOps ; capitalise sur les missions « Du Code à la Crise » et « DevSecOps Blackout ».

#### Séance 9 — Remédiation & conformité : auth, RGPD, AI Act, NIS2
- **Objectif** : transformer les failles en remédiations et situer le cadre réglementaire.
- **Notions-clés** : hachage des mots de passe, JWT / OAuth 2.0, gestion des sessions, RGPD (notification 72 h, DPO), NIS2, AI Act (introduction), 4 piliers de la résilience.
- **Déroulé (1 h)** : « comment corriger les failles de DevSecure ? » (20’) → authentification sécurisée (15’) → cadre RGPD / NIS2 / AI Act (20’) → synthèse & message clé « votre code impacte tout le SI » (5’).
- **📄 Papier** : proposer une remédiation pour 5 failles ; étude de cas conformité. **💻 Machine** : comparer un stockage de mot de passe en clair vs haché (démo).
- **Supports** : ♻ *Corrigé SLAM*, ♻ *Support de cours SLAM* (Secure Coding), ♻ *Mission Conformité SLAM* (pptx + notes présentateur), ♻ *TD Scoring Social & AI Act*.
- **Lien métiers** : DevSecOps + conformité ; prépare le DS de S10.

---

### JALON — BILAN MI-SEMESTRE (S10)

#### Séance 10 — Évaluation sommative n°1 (« Bilan de Noël »)  ⭐ DS sommatif
- **Objectif** : évaluer la maîtrise du socle (culture applicative + DevOps + DevSecOps).
- **Format (1 h)** : étude de cas type — analyser un SI, repérer 3-4 vulnérabilités, proposer des remédiations, justifier un choix technique/architectural.
- **📄 Papier** : DS individuel sur table. **💻 Machine** : possible sur cas support fourni si salle disponible.
- **Supports** : ♻ *Évaluation Conception Applicative* + *Correction* + *fiche de correction*, ♻ *Missions Bilan Noël*.
- **Couverture** : B1C2, B1C4, B3C1, B3C2.

---

### ACTE 3 — DataOps : INDUSTRIALISER LA DONNÉE (S11 → S12)

#### Séance 11 — Industrialiser la donnée : pipelines, ETL/ELT, qualité
- **Objectif** : comprendre le cycle de vie de la donnée et le rôle du Data Engineer.
- **Notions-clés** : pipeline de données, ETL vs ELT, qualité & gouvernance des données, BI / visualisation, parallèle DevOps → DataOps.
- **Déroulé (1 h)** : de la donnée brute à la décision (10’) → ETL/ELT expliqué (20’) → qualité & gouvernance (15’) → mini-exercice « concevoir un pipeline data » (10’) → synthèse (5’).
- **📄 Papier** : schématiser un pipeline data (sources → transfo → dashboard) + repérer 3 risques qualité. **💻 Machine** : manipulation d'un jeu de données (tri/filtre/agrégation) tableur ou SQL.
- **Supports** : ♻ *Écosystèmes Digitaux et Données*, ♻ *Scénario Data Scientist*, cours BDD.
- **Lien métiers** : Data Engineer / DataOps.

#### Séance 12 — Mission Data « Sauver Doctolib »
- **Objectif** : appliquer la démarche DataOps à une mission concrète.
- **Notions-clés** : diagnostic données, priorisation, proposition argumentée, documentation.
- **Déroulé (1 h)** : brief mission (5’) → travail en binôme (40’) → restitution (10’) → dépôt (5’).
- **💻 Machine** : exploitation de données + livrable numérique. **📄 Papier** : dossier d'analyse et de recommandations sur cas fourni.
- **Supports** : ♻ *Mission Data — Sauver Doctolib* (pptx), ♻ *Scénario Data Scientist*.
- **Lien métiers** : mise en situation DataOps ; documentation technique (A4.1.9).

---

### ACTE 4 — MLOps : INDUSTRIALISER L'IA (S13)

#### Séance 13 — Mettre l'IA en production & IA responsable
- **Objectif** : découvrir le cycle de vie d'un modèle ML « du notebook à la prod » et les enjeux éthiques/réglementaires.
- **Notions-clés** : cycle ML (données → entraînement → déploiement → monitoring), notion de MLOps, dérive de modèle, IA responsable, AI Act (systèmes à risque, scoring social interdit).
- **Déroulé (1 h)** : IA déjà partout (Copilot, reco Netflix) (10’) → cycle de vie d'un modèle & MLOps (20’) → cas éthique : scoring social & AI Act (20’) → synthèse « les 4 Ops se ressemblent » (10’).
- **📄 Papier** : positionner un cas d'usage IA sur l'échelle de risque de l'AI Act ; débat encadré. **💻 Machine** : démonstration d'un modèle simple + monitoring (facultatif).
- **Supports** : ♻ *TD Scoring Social & AI Act*, ♻ *Rapport IA France — Chiffres clés*, section IA du cours.
- **Lien métiers** : ML Engineer / MLOps ; boucle avec DevOps (mêmes principes, objet différent).

---

### SYNTHÈSE & ORIENTATION (S14)

#### Séance 14 — Les 4 Ops en miroir + évaluation & orientation  ⭐ Sommatif n°2 + oral
- **Objectif** : consolider la vision d'ensemble et amener chaque étudiant à se projeter dans une orientation métier.
- **Notions-clés** : tableau comparatif DevOps / DevSecOps / DataOps / MLOps (objet, outils, métiers, risques), posture professionnelle.
- **Déroulé (1 h)** : synthèse comparative des 4 Ops (15’) → **évaluation** (QCM/étude de cas transversale) (25’) → **mini-oral** « quelle culture Ops m'attire et pourquoi » (15’) → clôture semestre & perspectives S2 (5’).
- **📄 Papier** : évaluation transversale + fiche d'orientation à compléter. **💻 Machine** : QCM final en ligne.
- **Couverture** : transversal (veille, choix justifiés) + rappel B1/B3.
- **Perspective S2** : approfondir un ou deux actes (ex. TP CI/CD complet, projet sécurisé fil rouge), méthodes agiles, architecture microservices.

---

## 5. Dispositif d'évaluation du semestre — « papier scannable + correction IA »

### 5.1 Principe
Les étudiants répondent **sur une feuille-réponse standardisée**. L'enseignant **scanne** les copies (photocopieur multifonction ou appli mobile → 1 PDF), puis les fait **corriger avec l'aide d'une IA** à partir d'un **corrigé + barème structuré**. L'enseignant garde la main : il valide et ajuste les notes.

**Gain** : correction en quelques minutes pour toute une classe, notation homogène, et retour individualisé possible (points ratés + conseil).

### 5.2 Planning des évaluations

| Moment | Type | Support (format scannable) | Compétences |
|--------|------|----------------------------|-------------|
| S1 | **Auto-évaluation** (aucune note, aucun ramassage) | En ligne, dans la fiche de séance | — |
| S6 | Formatif noté | Feuille-réponse TP + grille Bloc 1 | B1C2 |
| S8 | Formatif noté | Cartographie DevSecure (grille structurée) | B1C4, B3C1 |
| **S10** | **Sommatif n°1** | Feuille-réponse : QCM + étude de cas courte | B1C2, B1C4, B3C1, B3C2 |
| S12 | Formatif | Mission Data (dossier + grille) | A4.1.3, A4.1.9 |
| **S14** | **Sommatif n°2 + oral** | Feuille-réponse transversale + grille orale | Transversal + B1/B3 |

### 5.3 Feuille-réponse standardisée (gabarit à réutiliser)
Un seul recto, structuré pour le scan :

1. **Zone identité** (en haut) : NOM · PRÉNOM · CLASSE · N° — en **MAJUSCULES**, une lettre par case si possible. *(Variante anonyme : code à 4 chiffres pour une correction en aveugle.)*
2. **Partie A — QCM** : une **grille de réponses**. Pour chaque question numérotée, cases **A B C D** à **noircir** (une seule par ligne). C'est la partie la plus fiable au scan.
3. **Partie B — Réponses courtes** : **cadres délimités** avec limite indiquée (« 2 lignes max »), les **mots-clés attendus en MAJUSCULES** pour fiabiliser la lecture.
4. **Barème visible** en marge de chaque question + **case Total /20** en pied de page.

> Règle de conception : privilégier **QCM + réponses à mots-clés courts** (lecture quasi parfaite au scan) et limiter le texte libre long (plus risqué en reconnaissance d'écriture). Toujours fournir le **corrigé + barème** avec les scans.

### 5.4 Workflow de correction IA (5 étapes)
1. Les étudiants répondent sur la feuille-réponse.
2. **Scan** de toutes les copies en un PDF (ou photos nettes, bien cadrées, contrastées).
3. Dépôt du PDF, accompagné du **corrigé + barème structuré**, auprès de l'assistant IA de correction.
4. L'IA lit chaque copie, applique le barème et renvoie : **note /20 par élève**, points ratés, court commentaire, **tableau récap de la classe** (CSV/xlsx) + **taux de réussite par question**.
5. L'enseignant **relit et valide** (les cas d'écriture ambiguë sont signalés pour vérification).

**Fiabilité** : les grilles QCM sont lues de façon quasi certaine ; le texte manuscrit libre est plus incertain → l'IA **signale les doutes** plutôt que de trancher seule. La correction finale reste sous la responsabilité de l'enseignant.

### 5.5 Participation continue
QCM courts en ligne (Google Forms) réutilisables en fin d'acte pour l'engagement, dans l'esprit des QCM existants (01 à 04). Les mêmes banques de questions servent aux versions papier scannables.

---

## 6. Matériel & pré-requis par modalité

| Modalité | Besoins |
|----------|---------|
| **Machine** | Salle info, navigateur récent (F12), éditeur (VS Code), Git, accès Play-with-Docker / GitHub, Google Forms |
| **Papier** | Templates imprimés (cartographie, grille vuln., pipeline), jeux de cartes « commits », études de cas |
| **Commun** | Vidéoprojecteur, supports pptx/pdf existants, entreprise fictive DevSecure / MetalPrecision |

> **Bascule papier ↔ machine** : les séances 5, 7, 9, 10, 13, 14 fonctionnent intégralement sur papier (la séance 1 est, elle, 100 % en ligne) ; les séances 2, 3, 4, 6, 8, 11, 12 gagnent à être sur machine mais disposent toutes d'une variante papier ci-dessus.

---

## 7. Correspondance avec les supports existants

| Séance | Supports Drive / Projet réutilisables |
|--------|----------------------------------------|
| S1 | Fiche enseignant SLAM · QCM Gouvernance SI |
| S2 | Support Applications Web Modernes · QCM Web moderne |
| S3 | Cours BDD BTS SIO · Écosystèmes Digitaux · De l'argile aux algorithmes |
| S4-S6 | CDT (séance DevOps Git/CI-CD) · Grille Évaluation TP Bloc 1 |
| S7-S9 | SI DevSecure · Grille vulnérabilités · Templates cartographie · Extension API · Corrigé SLAM · Support de cours SLAM · Mission Conformité · TD Scoring/AI Act · NotebookLM DevSecure |
| S10 | Évaluation Conception Applicative + corrections · Missions Bilan Noël |
| S11-S12 | Mission Data Doctolib · Scénario Data Scientist · Écosystèmes Données |
| S13 | TD Scoring Social & AI Act · Rapport IA France |
| S14 | QCM transversal (à composer à partir des QCM 01-04) |

---

*Progression construite à partir du cahier de textes 2025-2026 et des supports du projet BTS1 SIO Bloc 1. Ajustable : les actes DataOps (S11-S12) et MLOps (S13) peuvent être resserrés ou étendus selon le rythme réel de la classe.*
