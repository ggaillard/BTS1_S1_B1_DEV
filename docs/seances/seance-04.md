---
title: "SÉANCE 4 — « Ça marche sur mon poste »"
seance: 4
duree: "1 h"
notee: false
---

# SÉANCE 4 — « Ça marche sur mon poste »
### Qui a écrit quoi, quand, avec quoi — et comment revenir en arrière

> **Séance 4 / 14** · Acte 1 — DevOps : industrialiser le code · **Durée : 1 h** · **100 % en ligne**
> Fil rouge du semestre : *Du code au service — les 4 cultures Ops*

---

## 👉 Le jour de la séance, tout se passe ici

# **[ggaillard.github.io/portail-bts](https://ggaillard.github.io/portail-bts/)**

**Une seule adresse, toute l'année.** Vous vous identifiez une fois — code classe,
numéro, code à quatre chiffres — puis vous ouvrez le cours depuis le portail.
C'est ce passage qui enregistre votre présence et votre progression : entrer
par une autre porte, c'est travailler sans que rien ne soit compté.

1. Ouvrez **le portail** dans le navigateur du poste.
2. Répondez à la question du jour, puis ouvrez la séance depuis « Vos projets ».
3. Avancez **acte par acte** : vous lisez, vous répondez, vous passez au suivant.

**Aucune note ne sera mise.** Répondre faux ne coûte rien, ne pas répondre, si.

> Cette page-ci est la **trace écrite** de la séance : elle sert à **réviser après**,
> ou à rattraper si vous étiez absent.

---

## 🎬 COLD OPEN — six jours, quatre fichiers, un assistant

Vous vous souvenez du 47 de l'entrepôt ? Il était faux. Pas le chiffre : le
**code** qui le calculait. Voici le dossier partagé de l'équipe, lundi matin :

```
calcul_avancement.py
calcul_avancement_v2.py
calcul_avancement_v2_OK.py
calcul_avancement_final_VRAI_thomas.py
```

Thomas avait corrigé le calcul lundi. Six jours plus tard, le rapport de la
direction affiche toujours le mauvais chiffre. Léa l'interroge.

> — *« Je l'ai corrigé, je te jure. Je l'ai même testé : **ça marche sur mon
> poste**. »*

Maya ouvre les quatre fichiers. Deux se ressemblent à une ligne près. Personne
ne sait lequel tourne en production, ni depuis quand, ni ce que contenait la
version d'avant.

Et ce n'est pas le seul témoin qui se trompe. Depuis la rentrée, l'équipe a un
**assistant** : on lui pose une question en français, il cherche dans les
comptes rendus et il répond. Léa essaie :

```
> Le nouveau site, on en est où ?
Assistant : « D'après le compte rendu du 13 septembre,
              la refonte du site est avancée à 47 %. »
```

Elle n'a écrit ni « refonte », ni « projet 42 » — et il a pourtant trouvé le
bon document. Mais il répète le mauvais chiffre. Noah soupire :
*« Son index date d'avant la correction. Et depuis, j'ai changé de modèle… je
crois. »*

**Le code change tous les jours — et maintenant, les données qui font parler
l'assistant aussi. La question est de savoir qui a changé quoi, quand, avec
quoi — et comment revenir en arrière.** C'est l'objet de cette heure.

!!! info "Votre rôle aujourd'hui"
    Vous devez expliquer à la direction **pourquoi la correction de Thomas n'est
    jamais arrivée**, et **pourquoi l'assistant répète un vieux chiffre**. À la fin
    de l'heure, vous saurez que personne n'a menti — et ce qui manquait à
    l'équipe.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| 🔁 | Comparer les **cycles de vie** : cascade, V, agile | Indice n° 1 |
| 🤝 | Dire ce que la **culture DevOps** change dans une équipe | Indice n° 2 |
| 📸 | Expliquer ce qu'est un **commit** et ce qu'il contient | Acte III |
| 🌿 | Dérouler un travail sur **branche** jusqu'à la **pull request** | Indice n° 3 |
| 🔴 | Expliquer pourquoi « ça marche sur mon poste » ne prouve rien | Acte III |
| 🧭 | Dire ce que fait une **base vectorielle**, et pourquoi son index se versionne | Indice n° 4 |

*Compétence visée : **B1C2** — développer des solutions applicatives, en gérant leurs versions.*
*Prérequis : la séance 3. Si vous étiez absent, lisez d'abord « 60, 47, 72 ».*

---

## 🔁 ACTE I — TROIS FAÇONS DE MENER UN PROJET *(≈ 9 min)*

Avant de parler d'outils, une question plus ancienne : **dans quel ordre fait-on
les choses** quand on fabrique un logiciel ? Trois réponses ont marqué le métier.

### La cascade

Les étapes s'enchaînent, chacune finie avant la suivante, comme l'eau qui
descend d'une marche à l'autre :

```
Besoin → Conception → Développement → Tests → Livraison
```

C'est clair, c'est facile à planifier. Le défaut est au bout : le client voit
le produit **à la fin**. S'il s'était mal exprimé au début — ou si on l'avait
mal compris — on le découvre quand tout est déjà construit.

### Le cycle en V

La même descente, mais chaque étape de conception a son **test en miroir**, préparé
dès le départ :

```
Besoin ─────────────────────────── Recette par le client
   Conception ─────────────── Tests d'intégration
      Détail ──────────── Tests unitaires
              Développement
```

On sait dès le début **comment on vérifiera** chaque étape. C'est plus sûr — mais
le client ne voit toujours le produit qu'en haut de la branche de droite.

### L'agile

Une **méthode agile** renverse la logique : elle cherche à livrer souvent. Au lieu
d'une grande livraison, **de petites itérations**
de deux à quatre semaines — on les appelle souvent des *sprints*. À la fin de
chacune, un morceau qui fonctionne, montré au client.

L'erreur de besoin est découverte **au bout de deux semaines**, pas au bout d'un an.
Elle coûte deux semaines.

> 🔑 **Plus on livre souvent, plus on se trompe tôt — donc moins cher.** Mais
> livrer toutes les deux semaines pose un nouveau problème : il faut que le code
> passe du poste du développeur à la production, **sans se perdre en route**.

### 🧪 Indice n° 1 — à vous

| # | Situation | Cascade, V ou agile ? |
|---|---|---|
| a | Un logiciel de pilotage d'avion, où chaque étape doit être prouvée | ? |
| b | Une appli dont le client change d'avis chaque mois | ? |
| c | Un projet court et parfaitement connu, fait une seule fois | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Choix | Pourquoi |
    |---|---|---|
    | a | **Cycle en V** | Chaque étape a sa vérification prévue d'avance. Quand une erreur peut coûter des vies, on veut la preuve avant d'avancer. |
    | b | **Agile** | Le besoin bouge : on livre souvent pour que chaque changement coûte peu. |
    | c | **Cascade** | Rien ne bouge, tout est connu. Le plan tient, pourquoi s'en priver ? |

    **Le piège** : croire que l'agile est « le meilleur ». Encore le raisonnement
    des séances 1 et 3 : **choisir selon l'usage, pas selon la mode.**

---

## 🤝 ACTE II — LE MUR ENTRE DEUX ÉQUIPES *(≈ 8 min)*

Retour à Thomas. Dans son entreprise, deux équipes :

| | Les **Dev** | Les **Ops** |
|---|---|---|
| Leur métier | écrire le code | le faire tourner en production |
| Ce qu'ils veulent | **changer** vite | que **rien ne casse** |
| Ce qu'ils disent de l'autre | « ils bloquent tout » | « ils cassent tout » |

Entre les deux, un mur. Le développeur « lance son code par-dessus », l'Ops le
récupère… quand il le trouve. Le dossier aux quatre fichiers, c'est ce mur.

**DevOps** — Dev plus Ops, vous l'avez vu en séance 1 — n'est pas un logiciel.
C'est une **culture** qui abat ce mur, par trois gestes :

| Geste | Ce que ça veut dire | Ce qui a manqué à l'équipe de Thomas |
|---|---|---|
| **Automatiser** | Ce qui se répète est fait par une machine, pareil à chaque fois | La mise en production était un copier-coller à la main |
| **Mesurer** | On sait ce qui tourne, depuis quand, et si ça va | Six jours sans que personne ne voie le mauvais chiffre |
| **Collaborer** | Une seule source du code, partagée par tous | La correction vivait sur un seul poste |

> 🔑 **DevOps rend le changement sans danger.** Pas en changeant moins : en
> sachant toujours ce qui a changé, et en pouvant revenir en arrière.

### 🧪 Indice n° 2 — quel geste ?

| # | Pratique observée | Automatiser, mesurer ou collaborer ? |
|---|---|---|
| a | Chaque modification déclenche les tests toute seule | ? |
| b | Un tableau affiche les erreurs de la production en direct | ? |
| c | Dev et Ops préparent ensemble la mise en production | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Geste | Pourquoi |
    |---|---|---|
    | a | **Automatiser** | Personne n'oublie de lancer les tests : la machine le fait à chaque fois. |
    | b | **Mesurer** | On voit la panne avant le client — le contraire des six jours de Thomas. |
    | c | **Collaborer** | Le mur tombe quand ceux qui écrivent et ceux qui font tourner travaillent ensemble. |

    Retenez que les trois se tiennent. Automatiser sans mesurer, c'est se tromper
    plus vite. Et aucun des trois ne marche sans **une source unique du code** —
    c'est l'acte suivant.

---

## 📸 ACTE III — GIT, LA MÉMOIRE DU CODE *(≈ 14 min)*

La source unique a un nom : un **dépôt Git**. Git est un **gestionnaire de
versions** : il garde toute l'histoire du code, et il sait dire qui a écrit quoi,
quand et pourquoi.

### Le commit : un instantané

On ne renomme plus les fichiers en « final_VRAI ». On enregistre un **commit** :
un instantané du projet, qui porte quatre choses.

```
commit 7f3a9c2
Auteur : Thomas <thomas@devsecure.fr>
Date   : lundi 14 septembre, 10:42
    Corrige le calcul de l'avancement : les tâches annulées ne comptent plus
```

| Il contient | À quoi ça sert |
|---|---|
| un **identifiant** (7f3a9c2) | désigner cette version sans ambiguïté |
| un **auteur** | savoir à qui poser la question |
| une **date** | savoir depuis quand |
| un **message** | savoir pourquoi — pour le lecteur de dans six mois |

Un bon message dit **ce que fait** le changement : « Corrige le calcul de
l'avancement », pas « modif » ni « ça marche ».

### La branche : travailler à côté

La version principale s'appelle en général **main**. C'est elle qui part en
production. Pour corriger sans risquer de la casser, on ouvre une **branche** :
une copie de travail, à côté.

```
main    ──●────●──────────────●──   ← la production
            \                /
correctif    ●────●────●────      ← le travail de Thomas
```

Quand le travail est prêt, on le **fusionne** dans main : c'est le **merge**.

### La pull request : faire relire avant de fusionner

Dans une équipe, on ne fusionne pas seul. On ouvre une **pull request** : une
demande de fusion, que quelqu'un **relit** et discute avant de l'accepter. Quatre
yeux valent mieux que deux, et la décision reste écrite dans l'histoire.

### Les gestes, en ligne de commande

```bash
git init                      # créer le dépôt
git add calcul.py             # choisir ce qu'on enregistre
git commit -m "Corrige le calcul de l'avancement"
git switch -c correctif       # ouvrir une branche et y aller
git switch main               # revenir sur la version principale
git merge correctif           # fusionner la branche
git push                      # envoyer ses commits au dépôt partagé
git revert 7f3a9c2            # défaire un commit, par un nouveau commit
```

Le dernier est le filet de sécurité : **revenir en arrière** ne réécrit pas
l'histoire, cela ajoute un commit qui défait le précédent. On sait donc aussi
qui est revenu en arrière, et pourquoi.

> 🎯 **Le twist** : Thomas n'a pas menti. Il avait bien fait un commit — sur son
> poste. Il ne l'a **jamais poussé**. Un commit reste sur la machine où il est
> né tant qu'un `push` ne l'envoie pas au dépôt partagé. **« Ça marche sur mon
> poste » était vrai, et ne prouvait rien** : la production ne tourne pas avec ce
> qui est sur le poste de Thomas, elle tourne avec ce qui est dans main.

### 🧪 Indice n° 3 — remettez dans l'ordre

Six cartes, mélangées. Reconstituez le trajet de la correction de Thomas, du
poste à la production.

`merge dans main` · `commit` · `création de la branche` · `pull request relue` · `modification du fichier` · `push de la branche`

??? question "🔓 Ouvrir le rapport d'expertise"

    1. **Création de la branche** — on travaille à côté de main.
    2. **Modification du fichier** — la correction elle-même.
    3. **Commit** — l'instantané, avec son message.
    4. **Push de la branche** — sans lui, tout reste sur le poste. C'est l'étape
       qui a manqué à Thomas.
    5. **Pull request relue** — un collègue vérifie avant la fusion.
    6. **Merge dans main** — la correction rejoint la version principale.

    **Le piège** : mettre le merge avant la relecture. Relire après avoir
    fusionné, c'est relire ce qui est déjà en production.

---

## 🧲 ACTE IV — LA BASE QUI CHERCHE PAR LE SENS *(≈ 9 min)*

Reste l'assistant. Il ne cherche pas comme les bases de la séance 3.

### Chercher un mot, chercher un sens

Une requête SQL cherche ce qui est **égal** : le nom exact, l'identifiant exact.
Demandez « le nouveau site » à la table des projets : elle ne trouve rien, aucune
ligne ne s'appelle ainsi. Léa, elle, a été comprise.

### Transformer un texte en nombres

Un **modèle d'embedding** — un petit modèle d'IA — lit un texte et le transforme
en **vecteur** : une liste de plusieurs centaines de nombres. Deux textes qui
veulent dire la même chose donnent deux vecteurs **proches**, même sans un seul
mot en commun.

```
« Le nouveau site, on en est où ? »          → [ 0.12, -0.48, 0.91, … ]
« Refonte du site : avancement 47 % »        → [ 0.10, -0.51, 0.88, … ]  proche
« Contrat de maintenance des imprimantes »   → [-0.73,  0.22, 0.05, … ]  loin
```

### La base de données vectorielle

Elle range ces vecteurs, avec le texte d'origine. Et elle sait répondre très
vite à une seule question : **quels sont les plus proches de celui-ci ?** C'est la
**recherche par similarité** — pas « égal ou différent », mais un classement du
plus proche au plus lointain.

| | Base relationnelle | Base vectorielle |
|---|---|---|
| Elle range | des lignes et des colonnes | des vecteurs, avec leur texte |
| Elle répond à | « qu'est-ce qui est **égal** à… ? » | « qu'est-ce qui **ressemble** à… ? » |
| Exemple | le projet n° 42 | les trois comptes rendus les plus proches |

C'est une famille de plus à côté de celles de la séance 3 — parfois une simple
extension : **pgvector** ajoute les vecteurs à PostgreSQL. L'assistant de Léa
travaille en deux temps : la base vectorielle retrouve les passages les plus
proches, puis un modèle de langage rédige la réponse à partir d'eux. On appelle
cela le **RAG**, la génération augmentée par la recherche.

### Pourquoi c'est une affaire de versions

L'**index** — l'ensemble des vecteurs rangés dans la base — n'est écrit par
personne : il est **fabriqué** par un script, avec un modèle. Deux conséquences :

- l'index a une **date** : il ne connaît que les documents qu'on lui a donnés.
  Celui de Léa a été construit avant la correction — d'où le 47 ;
- deux modèles ne donnent pas les mêmes nombres. Changer de modèle sans **tout
  recalculer**, c'est comparer des vecteurs qui ne parlent pas la même langue :
  les résultats deviennent absurdes, sans le moindre message d'erreur.

> 🔑 **Ce qui fabrique l'index se versionne comme le code** : le script
> d'indexation dans Git, le nom et la version du modèle dans un fichier commité,
> la date de construction notée avec l'index. Alors « quel modèle répond, et
> depuis quand ? » a une réponse : un commit.

### 🧪 Indice n° 4 — l'assistant qui se trompe

| # | Question | Votre réponse |
|---|---|---|
| a | Comment l'assistant a-t-il trouvé le bon document sans le mot « refonte » ? | ? |
| b | Pourquoi répond-il 47 et non 60 ? | ? |
| c | Noah a changé de modèle sans reconstruire l'index. Que risque-t-il ? | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Réponse | Pourquoi |
    |---|---|---|
    | a | **Par le sens** | La question et le compte rendu donnent des vecteurs proches. La base compare des vecteurs, pas des mots. |
    | b | **Son index est ancien** | Il répète fidèlement un document d'avant la correction. Le calcul n'y est pour rien : le chiffre était dans les données. |
    | c | **Des résultats absurdes, en silence** | Vecteurs de deux modèles mélangés. Il faut tout recalculer avec un seul modèle — et noter lequel, dans Git. |

    **Le piège** : croire que l'assistant « sait ». Il ne sait que ce que
    contient son index, à la date où on l'a construit. Encore un chiffre sans
    date ni source — la leçon de la séance 3.

---

## 🧭 ACTE V — OUVREZ LE CAPOT *(≈ 2 min)*

Sur GitHub, ouvrez n'importe quel projet public et cliquez sur **Commits**.

1. Qui a fait le **dernier commit**, et quand ?
2. Trouvez un message **clair** et un message **vague**. Lequel aimeriez-vous lire
   dans six mois ?
3. Combien de **branches** le projet compte-t-il ?

> C'est le geste n° 5 du métier : **une version se désigne par son identifiant,
> jamais par « la dernière » ni par « la finale »** — qu'il s'agisse du code, du
> modèle ou de l'index.

---

## ✅ ÉPILOGUE — DANS L'APPLICATION

> Comme les semaines précédentes : dix questions, la correction s'affiche dès
> l'envoi, et le tableau de la classe se construit en direct.
>
> **Pas de note. Pas de copie à rendre.**

---

## 📚 Réviser après la séance

Les dix questions, pour vous re-tester chez vous. **Répondez d'abord, ouvrez les
réponses ensuite** — dans cet ordre, sinon ça ne sert à rien.

**1.** Dans un cycle en cascade, quand découvre-t-on le plus souvent qu'on s'est trompé de besoin ?
`A` au moment d'écrire le cahier des charges avec le client · `B` à la fin, quand le client voit enfin le produit · `C` à chaque itération de deux semaines · `D` dès la première ligne de code écrite

**2.** Une méthode agile cherche à :
`A` livrer souvent, par petits morceaux, pour corriger tôt · `B` livrer une seule fois, quand tout est entièrement terminé · `C` suivre un plan fixé d'avance sans jamais le modifier · `D` supprimer les réunions avec le client pour aller plus vite

**3.** Les trois gestes de la culture DevOps vus dans cette séance :
`A` coder, tester, documenter · `B` planifier, livrer, facturer · `C` automatiser, mesurer, collaborer · `D` sécuriser, chiffrer, sauvegarder chaque soir

**4.** Un commit, c'est :
`A` une copie du dossier envoyée par courriel à l'équipe · `B` un instantané du projet, avec un auteur, une date et un message · `C` une sauvegarde automatique du poste faite chaque nuit · `D` un fichier renommé « version finale » dans le dossier partagé

**5.** Une pull request sert à :
`A` copier le dépôt d'un autre sur son propre poste · `B` supprimer une branche devenue inutile · `C` envoyer le code directement en production, sans passer par main · `D` faire relire des changements avant de les fusionner

**6.** Thomas avait bien fait un commit de sa correction, et pourtant la production ne l'avait pas. Pourquoi ?
`A` la production refuse tout commit fait le lundi · `B` Git avait effacé la correction pendant la nuit · `C` le commit était resté sur son poste, jamais poussé · `D` la correction contenait elle-même une erreur de calcul

**7.** Pour annuler un commit déjà partagé sans réécrire l'historique, on :
`A` crée un nouveau commit qui défait le précédent · `B` supprime le dépôt et on le recrée depuis zéro · `C` modifie le fichier directement sur le serveur · `D` demande à chacun d'effacer sa copie locale du dépôt

**8.** Une base de données vectorielle retrouve un document parce que :
`A` il contient exactement les mêmes mots que la question · `B` son vecteur est proche de celui de la question · `C` il a été ajouté le plus récemment dans la base · `D` son identifiant est égal à celui qu'on demande

**9.** On change de modèle d'embedding. Que faut-il faire de l'index vectoriel ?
`A` ne rien faire, les anciens vecteurs restent valables · `B` recalculer seulement les documents ajoutés depuis · `C` supprimer les documents les plus anciens de la base · `D` recalculer tous les vecteurs avec le nouveau modèle

**10.** Pourquoi « ça marche sur mon poste » ne prouve-t-il rien ?
`A` parce que les postes des développeurs sont moins puissants que les serveurs · `B` parce que Git ne fonctionne que sur un serveur · `C` parce que les tests sont toujours faux sur un poste · `D` parce que la production ne tourne pas avec ce qui est sur le poste

??? question "🔓 Vérifier mes réponses"

    | Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
    |---|---|---|---|---|---|---|---|---|---|----|
    | **Rép.** | B | A | C | B | D | C | A | B | D | D |

    - **8 à 10** — Vous savez ce qu'est une version et comment elle voyage — celle
      du code comme celle d'un index. En S5, on regardera la machine qui la
      **teste et la livre toute seule**.
    - **5 à 7** — Commit, push, merge se mélangent encore. Reprenez les six cartes
      de l'indice n° 3 : tout le trajet y est.
    - **0 à 4** — Retenez **deux** choses : un commit est un instantané daté et
      signé, qui reste sur le poste tant qu'on ne l'a pas poussé ; on travaille sur
      une branche et on fait relire avant de fusionner. Et une base vectorielle
      compare des sens, pas des mots. Le reste s'accroche là.

### Le test des trois messages

Voici trois messages de commit trouvés dans un dépôt : « modif », « ça marche
enfin », « truc de Thomas ». Réécrivez-les pour qu'ils disent **ce que fait** le
changement.

??? question "🔓 Comparer"

    Il n'y a pas une seule bonne réponse, mais un bon message commence par un
    **verbe** et nomme **ce qui change** : « Ajoute le tri par date », « Corrige
    l'arrondi de l'avancement », « Supprime l'ancien calcul ». Si le message ne
    sert à rien sans ouvrir le code, il ne sert à rien du tout.

---

## 📝 À retenir de la séance 4

> Trois façons de mener un projet : la **cascade** découvre ses erreurs à la fin,
> le **cycle en V** prépare un test pour chaque étape, l'**agile** livre souvent pour
> se tromper tôt. Livrer souvent exige la culture **DevOps** : automatiser, mesurer,
> collaborer autour d'une source unique du code. Cette source est un dépôt **Git** :
> un **commit** est un instantané daté, signé et expliqué ; on travaille sur une
> **branche**, on fait relire par une **pull request**, on **fusionne** dans main — et
> on peut toujours **revenir en arrière**. Une **base vectorielle** range des textes
> transformés en vecteurs par un modèle, et retrouve ce qui a le **même sens** ; son
> index est fabriqué, daté, et se versionne avec le modèle qui l'a produit.

Thomas avait raison : ça marchait sur son poste. Mais une correction qui n'a pas
quitté le poste n'existe pour personne d'autre. Désormais, quand on vous dira
« ça marche sur mon poste », vous saurez quoi répondre : **montre-moi le commit,
et dis-moi s'il est dans main.** Et à l'assistant qui répond avec assurance :
**de quand date ton index, et avec quel modèle ?**

---

## 🎓 Concepts à connaître

*La liste qu'on projette à la fin de l'heure. Pour chacun, une seule question :
**sauriez-vous l'expliquer à voix haute, sans regarder ?** C'est aussi sur ces
concepts que portera le contrôle d'entrée de la séance suivante.*

1. **Les cycles de vie** — la cascade découvre ses erreurs à la fin, le V met un test
   en face de chaque étape, l'agile livre souvent pour corriger tôt. [1 2]
2. **La culture DevOps** — automatiser, mesurer, collaborer : abattre le mur entre ceux
   qui écrivent le code et ceux qui le font tourner. [3 10]
3. **Le commit** — un instantané daté, signé et expliqué, qui reste sur le poste tant
   qu'on ne l'a pas poussé. [4 6 10]
4. **Branche, pull request, retour en arrière** — on travaille à côté, on fait relire, on
   fusionne ; un nouveau commit défait le précédent sans effacer l'histoire. [5 7]
5. **Une base vectorielle** — elle compare des sens, pas des mots ; son index est fabriqué
   par un modèle, daté, et se versionne avec lui. [8 9]

---

## ⏭️ TEASER — SÉANCE 5

La correction de Thomas est enfin dans main. Mardi, elle part en production…
et casse la page d'accueil. Personne n'avait relancé les tests : « on n'avait pas
le temps ». L'assistant, lui, répond toujours 47 : personne n'a reconstruit son
index. Et si ce n'était pas à un humain de s'en souvenir ?

**Séance 5 : la machine qui teste et qui livre — et la boîte qui fait tourner le
code partout pareil.**
