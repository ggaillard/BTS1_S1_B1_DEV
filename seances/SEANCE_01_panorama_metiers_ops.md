# SÉANCE 1 — « 03 h 47 »
### Enquête sur la nuit où DevSecure a cessé d'exister

> **Séance 1 / 14** · Acte 0 — Cadrage · **Durée : 1 h** · **100 % en ligne**
> Fil rouge du semestre : *Du code au service — les 4 cultures Ops*

---

## 🎬 COLD OPEN — 03 h 47

```
03:47:12   ALERTE  ─  api-prod-01  ─  health check FAILED
03:47:13   ALERTE  ─  api-prod-02  ─  health check FAILED
03:47:19   ALERTE  ─  base clients ─  connexion refusée
03:48:00   9 400 utilisateurs déconnectés
03:52:41   Thomas, lead dev, décroche son téléphone.
```

**DevSecure** est une PME de 40 personnes. Elle édite un SaaS de gestion de projets
utilisé par 9 400 personnes chaque matin. À 3 h 47, tout s'est arrêté.

Personne ne sait pourquoi.

À 8 h 00, les clients arrivent au bureau. **Il vous reste une heure.**

> 🕵️ **Votre rôle aujourd'hui** : vous êtes l'équipe d'enquête.
> À la fin de cette heure, vous saurez **où** chercher une panne, **qui** dans une
> entreprise sait la réparer — et lequel de ces métiers pourrait devenir le vôtre.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| 🧩 | Décomposer n'importe quel système en **5 composants** | Vous localiserez la panne (Acte I) |
| 🗺️ | Distinguer les **4 cultures Ops** et leurs métiers | Vous identifierez le bon expert (Acte II) |
| 🔗 | Expliquer pourquoi un choix de code impacte **toute** l'entreprise | Vous reconstituerez la chaîne (Acte III) |
| 🧭 | Situer **votre** intérêt dans cette carte des métiers | Auto-évaluation (Épilogue) |

*Compétence visée : **B1C2** — situer le développement dans le système d'information.*
*Prérequis : aucun. Si vous utilisez des applis, vous en savez déjà assez pour commencer.*

---

## 🔍 ACTE I — LA SCÈNE DE CRIME *(≈ 13 min)*

Thomas ouvre son ordinateur portable et lâche la première phrase de l'enquête :

> — *« C'est forcément le code. On a déployé hier soir. »*

**C'est le premier réflexe. Et c'est presque toujours faux.**

Un système d'information n'est pas un tas de code. C'est un **écosystème à 5 composants**
(modèle de Laudon). Une panne peut venir de n'importe lequel — et les 4 autres
vont amplifier la casse.

### Les 5 pièces du puzzle

| | Composant | Ce que c'est | Chez DevSecure |
|---|---|---|---|
| **M** | **Matériel** | Serveurs, réseau, cloud, postes | 2 serveurs AWS, 1 base MongoDB |
| **L** | **Logiciel** | Le code, les frameworks, les API | L'application Node / React |
| **D** | **Données** | Bases, fichiers, logs, sauvegardes | Les projets et clients des 9 400 users |
| **P** | **Procédures** | Les façons de faire : CI/CD, revue de code, docs | Le déploiement, les tests |
| **H** | **Humain** | Les gens : devs, ops, utilisateurs | Thomas… et les 39 autres |

> 🔑 **MLDPP** — *« Ma Ligne De Protection Permanente »*.
> Retenez surtout ceci : **le développeur agit sur le L. Ses choix touchent les 4 autres lettres.**

### 🧪 Indice n°1 — à vous

Voici les **quatre premiers éléments du dossier**. Pour chacun, dites de quel composant il relève.

| # | Élément trouvé dans le dossier | Composant ? |
|---|---|---|
| a | Le disque du serveur `api-prod-01` était plein à 100 % | ? |
| b | Aucune sauvegarde de la base n'a été testée depuis 8 mois | ? |
| c | Le déploiement de 22 h 30 a été fait à la main, sans test | ? |
| d | Une seule personne connaît la procédure de redémarrage | ? |

<details>
<summary>🔓 <b>Ouvrir le rapport d'expertise</b></summary>

| # | Composant | Pourquoi |
|---|---|---|
| a | **Matériel** | Ressource physique saturée — rien à voir avec la qualité du code |
| b | **Données** | Une sauvegarde jamais testée est une sauvegarde qui n'existe pas |
| c | **Procédures** | Le geste était manuel : aucune barrière automatique n'a pu l'arrêter |
| d | **Humain** | Un seul détenteur du savoir = un point de rupture (on dit un *SPOF*) |

**Et le Logiciel dans tout ça ?** Le code n'apparaît pas encore. Thomas s'est trompé de piste.
Gardez ça en tête : *nous n'avons pas fini avec lui.*
</details>

> 💡 **Ce qui vient de se jouer** : vous venez d'apprendre le geste n°1 du métier —
> **avant de corriger, on localise.** Un dev qui ne regarde que son code répare 20 % des pannes.

---

## 🕴️ ACTE II — QUATRE EXPERTS ARRIVENT *(≈ 17 min)*

05 h 10. Thomas a appelé du renfort. Quatre personnes entrent, quatre façons de voir le même écran.

Elles ne travaillent pas dans la même culture. Ce sont les **4 cultures « Ops »** — les
quatre grandes familles qui structurent aujourd'hui les métiers du développement.

---

### 🟦 Témoin 1 — MAYA, ingénieure **DevOps**

> — *« Vous avez déployé à la main à 22 h 30 ? Voilà votre coupable.
> Chez moi, aucun humain ne touche la production. La machine déploie, la machine teste,
> la machine annule si ça casse. »*

**Sa question** : *comment livrer du code vite **et** sans casse ?*
**Ses outils** : Git, CI/CD, Docker · **Son métier** : Ingénieur DevOps · **Repère salaire** : ~35–55 k€

---

### 🟥 Témoin 2 — SAMI, expert **DevSecOps**

> — *« Moi je ne cherche pas la panne. Je cherche qui en a profité.
> Un système à terre, c'est aussi une porte ouverte. Vous avez regardé les logs de connexion ? »*

**Sa question** : *comment livrer du code **sécurisé dès la conception** ?*
**Ses outils** : OWASP, analyse statique, scanners · **Son métier** : Développeur sécurité / DevSecOps · **Repère salaire** : ~38–60 k€

---

### 🟩 Témoin 3 — LÉA, **Data Engineer** (DataOps)

> — *« La question n'est pas de redémarrer. C'est : qu'est-ce qu'on a perdu ?
> Vos données de la nuit sont-elles complètes, cohérentes, récupérables ? »*

**Sa question** : *comment industrialiser la **donnée** ?*
**Ses outils** : pipelines, ETL / ELT, qualité de données · **Son métier** : Data Engineer · **Repère salaire** : ~38–58 k€

---

### 🟪 Témoin 4 — NOAH, **ML Engineer** (MLOps)

> — *« Petit détail : votre moteur de recommandation tourne sur un modèle d'IA
> entraîné sur ces données. Si elles sont corrompues, le modèle apprendra du bruit.
> Vous aurez un système debout… qui dit n'importe quoi. »*

**Sa question** : *comment mettre l'**IA** en production de façon fiable et responsable ?*
**Ses outils** : ML, monitoring de modèles, AI Act · **Son métier** : ML Engineer · **Repère salaire** : ~42–65 k€

---

> ⚠️ Fourchettes de salaires **indicatives** (France, débutant → confirmé) : des repères
> pour se situer, pas des promesses.

### 🧪 Indice n°2 — qui appelez-vous ?

Quatre nouvelles alertes tombent. **Un seul expert par ligne.**

| # | L'alerte | Vous appelez… |
|---|---|---|
| a | « Le modèle de reco renvoie des résultats absurdes depuis la reprise » | ? |
| b | « 4 000 lignes ont disparu entre la base et le tableau de bord » | ? |
| c | « Un compte admin s'est connecté depuis Singapour à 03 h 44 » | ? |
| d | « On remet en prod, mais on n'a aucun moyen d'annuler si ça re-casse » | ? |

<details>
<summary>🔓 <b>Ouvrir le rapport d'expertise</b></summary>

| # | Expert | Culture |
|---|---|---|
| a | Noah | **MLOps** — dérive du modèle |
| b | Léa | **DataOps** — perte d'intégrité dans le pipeline |
| c | Sami | **DevSecOps** — intrusion probable |
| d | Maya | **DevOps** — absence de rollback automatisé |

</details>

> 💡 **Le motif caché** : les quatre disent en réalité **la même chose**.
> *Automatiser, tester, surveiller, pouvoir revenir en arrière.*
> Seul l'**objet** change : le code (DevOps), la sécurité (DevSecOps), la donnée (DataOps), l'IA (MLOps).
> C'est exactement le plan de votre semestre.

---

## 🌀 ACTE III — LE RETOURNEMENT *(≈ 12 min)*

06 h 30. Sami revient avec les logs. Silence dans la pièce.

> — *« La panne n'a pas commencé cette nuit. Elle a commencé il y a onze semaines. »*

### La chaîne des événements

```
SEMAINE -11   Un dev ajoute une fonctionnalité. Elle écrit un log par action utilisateur.
              Le code marche. Les tests passent. Personne ne dit rien.            [ L ]
                              ↓
SEMAINE -6    Les fichiers de logs grossissent. Le disque se remplit doucement.   [ M ]
                              ↓
SEMAINE -2    Une alerte « disque à 85 % » part par mail. Personne n'est
              d'astreinte la nuit. Le mail n'est pas lu.                          [ H ]
                              ↓
HIER 22:30    Déploiement manuel, sans test, en fin de journée.                   [ P ]
                              ↓
CETTE NUIT    Disque plein → écriture impossible → base à terre → 9 400 users.    [ D ]
```

**Cinq composants. Cinq maillons. Une seule ligne de code au départ.**

> 🎯 **Le twist** : le développeur n'a pas écrit de mauvais code.
> Il a écrit du code **sans voir le reste du système**.
> C'est précisément ce que ce semestre va vous apprendre à ne plus faire.

### 🧪 Indice n°3 — refaites l'histoire

Reprenez la chaîne. **À quel maillon un seul geste aurait tout empêché ?**
Il n'y a pas une seule bonne réponse — il y a une bonne façon de raisonner.

<details>
<summary>🔓 <b>Ouvrir les pistes des enquêteurs</b></summary>

- **En -11 (Logiciel)** : une revue de code demande « ce log, il grossit de combien par mois ? »
- **En -6 (Matériel)** : une rotation automatique des logs supprime les anciens fichiers.
- **En -2 (Humain)** : l'alerte part sur un canal réellement surveillé, pas un mail.
- **Hier (Procédures)** : un pipeline refuse tout déploiement non testé après 20 h.

**La vraie leçon** : plus on intervient **tôt** dans la chaîne, moins ça coûte.
Corriger en semaine -11 = 10 minutes de discussion. Corriger cette nuit = 9 400 clients perdus.
C'est le principe fondateur des quatre cultures Ops.
</details>

---

## 🧭 ACTE IV — ET VOUS, DANS CETTE HISTOIRE ? *(≈ 3 min)*

08 h 02. Le service est rétabli. Maya, Sami, Léa et Noah repartent chacun vers leur écran.

Dans quatre ans, l'un d'eux, ce sera peut-être vous.

Ce semestre suit exactement leur parcours :

| Actes | Ce qu'on industrialise | Vous devenez… |
|---|---|---|
| **S1 → S3** · Cadrage | Le terrain : SI, web, données | Capable de lire un système |
| **S4 → S6** · DevOps | **Le code** | Maya |
| **S7 → S9** · DevSecOps | **La sécurité** | Sami |
| **S11 → S12** · DataOps | **La donnée** | Léa |
| **S13** · MLOps | **L'IA** | Noah |
| **S14** · Synthèse | Votre choix | Vous |

---

## ✅ ÉPILOGUE — AUTO-ÉVALUATION *(≈ 12 min)*

> **Pas de note. Pas de copie à rendre. Rien à imprimer.**
> Cette page sert **à vous**, pour savoir où vous en êtes en sortant. Répondez d'abord,
> ouvrez les réponses ensuite — dans cet ordre, sinon ça ne sert à rien.

> 📡 **Version interactive** — la même auto-évaluation se fait en ligne dans la
> [**Tour de contrôle**](https://claude.ai/code/artifact/f7a89996-1e0c-4441-ac77-de457220aca8) :
> correction immédiate, et la **carte d'orientation de la classe** se construit en direct sous vos yeux.
> Les questions ci-dessous sont identiques — utilisez l'une ou l'autre.

### Partie 1 — Le dossier d'enquête (10 questions)

**1.** Le modèle de Laudon décrit un SI en 5 composants. Lequel n'en fait **pas** partie ?
`A` Matériel · `B` Logiciel · `C` Données · `D` Bénéfice

**2.** Le **code** d'une application relève du composant :
`A` Matériel · `B` Logiciel · `C` Données · `D` Procédures

**3.** « Une seule personne connaît la procédure de redémarrage » relève de :
`A` Matériel · `B` Humain · `C` Données · `D` Logiciel

**4.** **DevOps** rapproche deux mondes :
`A` Design + Operations · `B` Développement + Operations · `C` Data + Options · `D` Développement + Design

**5.** La culture qui intègre la **sécurité dès la conception** :
`A` DataOps · `B` MLOps · `C` DevSecOps · `D` SecuWeb

**6.** « Industrialiser la donnée » (pipelines, ETL, qualité) :
`A` DevOps · `B` DataOps · `C` MLOps · `D` DevSecOps

**7.** Mettre un **modèle d'IA** en production de façon fiable :
`A` MLOps · `B` DevOps · `C` DataOps · `D` WebOps

**8.** **Git** est un outil de :
`A` gestion de versions · `B` base de données · `C` messagerie · `D` conteneurisation

**9.** Dans l'enquête, la cause **première** de la panne était :
`A` une attaque · `B` un serveur défectueux · `C` une ligne de code écrite sans vision système · `D` une erreur de la base

**10.** Le point commun des 4 cultures Ops :
`A` elles utilisent Docker · `B` automatiser, tester, surveiller, pouvoir revenir en arrière · `C` elles concernent la sécurité · `D` elles sont réservées aux grandes entreprises

<details>
<summary>🔓 <b>Vérifier mes réponses</b></summary>

| Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| **Rép.** | D | B | B | B | C | B | A | A | C | B |

**Comptez vos bonnes réponses :**

- **8 à 10** — Vous avez la carte en tête. En S2, poussez : demandez le *pourquoi* derrière chaque outil.
- **5 à 7** — Le socle est là, les 4 Ops se mélangent encore. Relisez l'Acte II : une culture = une question.
- **0 à 4** — Normal, c'est la séance 1 et rien n'est joué. Retenez **deux** choses pour aujourd'hui :
  *MLDPP* et *« le développeur agit sur L, mais impacte tout »*. Le reste viendra par la pratique.
</details>

---

### Partie 2 — Le test des 5 composants

Sans rien regarder, écrivez les **5 composants** du modèle de Laudon, avec **un exemple** pour chacun.

<details>
<summary>🔓 <b>Comparer</b></summary>

**Matériel · Logiciel · Données · Procédures · Humain** *(personnel)*

Un exemple juste par composant = vous savez vous en servir. Un composant oublié ?
Notez lequel : c'est souvent celui-là qu'on oublie aussi… en situation réelle.
</details>

---

### Partie 3 — Où en suis-je ? *(sincérité > performance)*

Cochez mentalement — ou notez dans votre fichier de suivi.

| Je suis capable de… | 🔴 Pas encore | 🟠 À peu près | 🟢 Oui, clairement |
|---|:---:|:---:|:---:|
| Citer les 5 composants d'un SI | ☐ | ☐ | ☐ |
| Expliquer ce que fait un ingénieur DevOps | ☐ | ☐ | ☐ |
| Différencier DevSecOps et DataOps | ☐ | ☐ | ☐ |
| Dire pourquoi le code impacte tout le SI | ☐ | ☐ | ☐ |
| Nommer un métier qui m'intéresse | ☐ | ☐ | ☐ |

**Une ligne rouge n'est pas un problème — c'est une adresse.**
Notez-la : vous vérifierez à la S14 qu'elle est passée au vert.

---

### Partie 4 — Votre choix (personnel, sans bonne réponse)

> **Parmi Maya (DevOps), Sami (DevSecOps), Léa (DataOps) et Noah (MLOps) :
> lequel avez-vous eu envie d'être ? En une phrase, pourquoi ?**

Gardez cette phrase quelque part. On la relira **en séance 14**.
Le semestre entier consiste à vous donner de vraies raisons de la confirmer… ou d'en changer.

---

## 📝 À retenir de la séance 1

> Un SI = **5 composants** (MLDPP). Le développeur agit sur le **Logiciel**, mais ses choix
> impactent les quatre autres. Ce semestre, on apprend à industrialiser
> le **code** (DevOps), la **sécurité** (DevSecOps), la **donnée** (DataOps) et l'**IA** (MLOps).
> Même réflexe à chaque fois : **automatiser, tester, surveiller, pouvoir revenir en arrière.**

---

## ⏭️ TEASER — SÉANCE 2

DevSecure est de nouveau en ligne. Mais une question reste ouverte dans le rapport d'incident :

> *« Pourquoi 9 400 personnes ont-elles vu la panne en même temps, à la seconde près ? »*

La réponse tient à la façon dont une application web moderne parle à ses utilisateurs.
**Séance 2 : du web statique au temps réel.**

---

## 🧑‍🏫 Notes de conduite *(enseignant)*

| Temps | Acte | Conduite |
|---|---|---|
| 0–5' | Cold open | Projeter le bloc de logs **en silence** 10 s avant de parler. L'effet vient du silence. |
| 5–18' | Acte I | Laisser 3 min sur l'indice n°1 **avant** d'ouvrir le rapport. Faire voter à main levée. |
| 18–35' | Acte II | Incarner les 4 témoins (changer de position dans la salle). Indice n°2 en binômes. |
| 35–47' | Acte III | Dérouler la chaîne **un maillon à la fois**. Ne pas dévoiler la fin d'avance. |
| 47–48' | Acte IV | Court : c'est une respiration avant l'auto-évaluation. |
| 48–60' | Épilogue | Silence complet. Insister : aucune note, aucun ramassage. Projeter la **Tour de contrôle** pendant qu'ils répondent : voir la carte d'orientation se remplir en direct est le meilleur final possible. Clore sur le teaser S2. |

**Si vous êtes en retard** : couper l'Acte IV et la Partie 2 de l'auto-évaluation.
Ne jamais couper l'Acte III — c'est lui qui donne son sens à toute la séance.

**Différenciation**
- *Rapide* : « inventez un 5ᵉ Ops crédible et justifiez-le » (ex. GreenOps, FinOps).
- *En difficulté* : les tableaux restent ouverts pendant l'auto-évaluation — rien n'est noté.
- *Prolongement* : trouver une offre d'emploi réelle et l'affecter à l'une des 4 cultures.

*Les fourchettes de salaires sont à réactualiser chaque année.*
