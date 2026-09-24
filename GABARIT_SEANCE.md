# Fabriquer une séance — le gabarit

*Écrit le 14 septembre 2026, à partir des séances 1 à 3, une fois qu'elles ont
été relues par les contrôles automatiques.*

Une séance n'est pas un document libre : c'est un **contrat en trois exemplaires**
qui doivent dire la même chose.

| Exemplaire | Où il vit | Ce dont il fait foi |
|---|---|---|
| La **trace écrite** | `docs/seances/seance-NN.md`, dépôt public | l'énoncé et **l'ordre des options** |
| Les **corrigés** | `portail-bts/supabase/migrations/…_bts1_seanceNN.sql` | la **bonne réponse** |
| Les **concepts** | `portail-bts/supabase/migrations/…_debriefing.sql` | ce que le portail **projette** |

Aucun ne se déduit des deux autres. Permuter deux options dans la trace oblige à
changer la `bonne_reponse` du SQL ; renommer un concept dans la trace oblige à le
renommer dans la migration. C'est exactement ce que vérifie
`portail-bts/outils/controler.py`.

**Avant de pousser, on rejoue les contrôles chez soi** — trois commandes,
quelques secondes :

```bash
cd ../portail-bts
python3 outils/controler.py coherence --supports ../BTS1_S1_B1_DEV
python3 outils/controler.py fiche     --supports ../BTS1_S1_B1_DEV
python3 outils/controler.py pedagogie --supports ../BTS1_S1_B1_DEV
```

---

## 1. L'ossature de la trace

Elle est la même depuis la séance 1, et les contrôles la supposent. Les parties
entre chevrons sont à remplir ; tout le reste se recopie tel quel.

````markdown
---
title: "SÉANCE <NN> — « <titre de récit> »"
seance: <NN>
duree: "1 h"
notee: false
---

# SÉANCE <NN> — « <titre de récit> »
### <sous-titre : la promesse de l'heure, en une ligne>

> **Séance <NN> / 14** · <Acte du semestre> · **Durée : 1 h** · **100 % en ligne**
> Fil rouge du semestre : *Du code au service — les 4 cultures Ops*

---

## 👉 Le jour de la séance, tout se passe ici

# **[ggaillard.github.io/portail-bts](https://ggaillard.github.io/portail-bts/)**

<le bloc d'entrée, recopié de la séance précédente sans y toucher>

---

## 🎬 COLD OPEN — <l'accroche, 3 à 6 phrases>

<Une scène, pas une définition. Elle pose une question à laquelle la classe ne
peut pas répondre en arrivant, et à laquelle elle saura répondre en sortant.
Le titre de récit se trouve ici.>

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| … | … | Indice n° 1 |

*Compétence visée : **<code du référentiel>**.*
*Prérequis : la séance <NN-1>. Si vous étiez absent, lisez d'abord « <titre de récit de NN-1> ».*

---

## <emoji> ACTE I — <TITRE> *(≈ 13 min)*
## <emoji> ACTE II — <TITRE> *(≈ 17 min)*
## <emoji> ACTE III — <TITRE> *(≈ 12 min)*
## 🧭 ACTE IV — <TITRE> *(≈ 3 min)*

<Chacun se termine par un « 🧪 Indice n° N — à vous », suivi d'un bloc replié :>

??? question "🔓 Ouvrir le rapport d'expertise"

    <le corrigé, avec le piège nommé>

---

## ✅ ÉPILOGUE — DANS L'APPLICATION
## 📚 Réviser après la séance

**1.** <énoncé, sans aucun accent grave>
`A` … · `B` … · `C` … · `D` …

<… dix questions …>

??? question "🔓 Vérifier mes réponses"

    | Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
    |---|---|---|---|---|---|---|---|---|---|----|
    | **Rép.** | … | … | … | … | … | … | … | … | … | … |

---

## 📝 À retenir de la séance <NN>

> <le paragraphe qu'on relit avant le contrôle d'entrée de la séance suivante>

<La phrase qui referme la boucle du cold open, et qui reprend le titre de récit.>

---

## 🎓 Concepts à connaître

1. **<Intitulé>** — <détail>. [<numéros des questions qui le mesurent>]
<… cinq concepts …>

---

## ⏭️ TEASER — SÉANCE <NN+1>

<L'accroche de la semaine suivante : une question restée ouverte.>
````

---

## 2. Les huit règles que les contrôles font respecter

Elles ne sont pas des préférences de style : chacune vient d'un défaut constaté.

| # | La règle | Ce qui arrive sinon |
|---|---|---|
| 1 | **La trace se lit en ≤ 14 min** — du cold open à la fin des actes, à 200 mots/min | Elle ne peut pas cohabiter avec quatre actes et un quiz dans la même heure |
| 2 | **Les actes totalisent 35 à 52 min** | Plus de place pour le cold open ni le quiz |
| 3 | **Le prérequis nomme la séance d'avant**, par son titre de récit | Un absent ne sait pas quoi rattraper |
| 4 | **Le quiz ne demande que ce que l'heure a dit** | On évalue ce qu'on n'a pas enseigné |
| 5 | **La bonne réponse ne se devine pas à sa longueur** — jamais la plus longue plus de 6 fois sur 10 | Un élève qui n'a rien suivi coche la plus longue. Mesuré à 7/10 sur la séance 3 avant correction |
| 6 | **Chaque question sert un concept** — ses crochets `[…]` | Le débriefing de fin d'heure n'en dira rien |
| 7 | **La boucle du cold open se referme** — le titre de récit revient après les actes | L'heure s'arrête sans conclure. C'était le cas des séances 1 et 2 |
| 8 | **Les deux blocs d'une migration s'accordent** — `insert` puis `update` de rattrapage | Le rattrapage remet l'ancienne version au rejeu suivant, en silence |

Et trois règles de forme, vérifiées par la fiche :

- **pas d'accent grave dans un énoncé** de question — le parseur de `suivi.js`
  prend le premier `<code>` du paragraphe pour le début des options ;
- **une même lettre bonne 4 fois au plus** sur dix — une classe repère un motif
  en trois questions ;
- **aucune adresse hors portail**, jamais `suivi.gaillard42.workers.dev`.

---

## 3. Le corrigé SQL

Une migration par séance, nommée `AAAAMMJJHHMMSS_bts1_seanceNN.sql`, et le glob
des contrôles la trouve seul. Quatre sections, dans cet ordre :

1. **le titre de récit** — `update public.seances … set titre = 'Seance NN - …'` ;
2. **les dix corrigés** — `with q (numero, cle, bonne, intitule, options, explication)` ;
3. **le rattrapage** — le même tuple, pour un corrigé créé à la main et resté vide ;
4. **le contrôle d'entrée** de la séance — les `pre-NN` : une question par
   concept de la séance précédente, plus sa certitude `pre-NN-c`. Par `insert`,
   jamais par `creer_controle()` (voir plus bas), et créé fermé ;
5. **le contrôle** — un `do $$` qui refuse : dix corrigés, quatre options non
   nulles, jamais plus de trois fois la même lettre.

**Le bloc 3 se recopie du bloc 2, il ne se réécrit pas.** C'est en le ressaisissant
que la séance 3 a fini avec deux jeux d'options différents dans le même fichier —
sept questions sur dix divergeaient, et le prochain rejeu aurait remis les
anciennes.

Les intitulés du SQL sont **interrogatifs et lisibles seuls** : ils sont projetés
au tableau, là où la page n'est pas affichée. Les options, elles, sont recopiées
de la page — **avec leurs accents** depuis le 18/09 : c'est ce que les étudiants
lisent sur leur téléphone.

Depuis la séance 4, les deux migrations sont **produites par un script** depuis
une seule liste Python (questions, contrôle d'entrée, concepts) : le bloc 3 ne
peut plus diverger du bloc 2, puisque personne ne le tape.

**Jamais d'appel à une fonction gardée par `est_enseignant()` dans une
migration.** Sous le rôle de la migration, elle répond « refus », et un
`perform` jette la réponse sans la lire : la migration est verte, et rien n'est
écrit. En CI, `est_enseignant()` est bouchonnée à vrai — le défaut n'y apparaît
pas. C'est ce qui a privé la base des concepts des séances 1 à 3 jusqu'au 24/09.

---

## 4. Les concepts et le débriefing

Les cinq concepts d'une séance sont **exactement ce que testera le contrôle
d'entrée de la suivante**. Écrire les uns, c'est écrire l'autre.

Le format d'une ligne est le même dans la trace et dans le SQL :

```
Les codes de statut — 4xx le client s'est trompé, 5xx le serveur a échoué. [3 4 5]
```

Les crochets disent sur quelles questions le concept se mesure. **Les dix
questions doivent être couvertes** ; un concept peut partager une question avec
un autre.

---

## 5. L'ordre des gestes, une séance à produire

1. Écrire la trace à partir de ce gabarit — cold open d'abord, quiz en dernier.
2. Ajouter la ligne au `nav:` de `mkdocs.yml`.
3. Écrire la migration des corrigés, **options recopiées de la page**.
4. Écrire les cinq concepts dans une migration `…_debriefing.sql` par
   `migration_definir_concepts()`, en **lisant** sa réponse.
5. Écrire les **points de passage** — un par acte, dans `…_passages.sql` :
   une question courte sur l'acte (ou aucune, pour un acte d'observation).
   L'heure attendue de fin d'acte se déduit des durées de la trace ; la bonne
   lettre reste en base, jamais dans la page. `fiche` refuse une séance, à
   partir de la 4, dont un acte n'a pas son point : pendant les actes, c'est
   la seule chose que le portail voit.
6. Rejouer les trois contrôles en local ; corriger jusqu'au vert.
7. Pousser les deux dépôts. La migration s'applique toute seule.
8. Le jour J : « Démarrer la séance » — qui ouvre, publie et lance le chrono.
