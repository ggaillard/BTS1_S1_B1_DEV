---
title: "SÉANCE 4 — « Ça marche sur mon poste »"
seance: 4
duree: "1 h"
notee: false
---

# SÉANCE 4 — « Ça marche sur mon poste »
### Qui a écrit quoi, quand — et comment revenir en arrière

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

## 🎬 COLD OPEN — six jours, trois fichiers

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

**Le code change tous les jours. La question est de savoir qui l'a changé,
quand, pourquoi — et comment revenir en arrière.** C'est l'objet de cette heure.

!!! info "Votre rôle aujourd'hui"
    Vous devez expliquer à la direction **pourquoi la correction de Thomas n'est
    jamais arrivée**. À la fin de l'heure, vous saurez que Thomas n'a pas menti —
    et vous saurez ce qui manquait à l'équipe.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| 🔁 | Comparer les **cycles de vie** : cascade, V, agile | Indice n° 1 |
| 🤝 | Dire ce que la **culture DevOps** change dans une équipe | Indice n° 2 |
| 📸 | Expliquer ce qu'est un **commit** et ce qu'il contient | Acte III |
| 🌿 | Dérouler un travail sur **branche** jusqu'à la **pull request** | Indice n° 3 |
| 🔴 | Expliquer pourquoi « ça marche sur mon poste » ne prouve rien | Acte III |

*Compétence visée : **B1C2** — développer des solutions applicatives, en gérant leurs versions.*
*Prérequis : la séance 3. Si vous étiez absent, lisez d'abord « 60, 47, 72 ».*

---

## 🔁 ACTE I — TROIS FAÇONS DE MENER UN PROJET *(≈ 13 min)*

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

## 🤝 ACTE II — LE MUR ENTRE DEUX ÉQUIPES *(≈ 12 min)*

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

## 📸 ACTE III — GIT, LA MÉMOIRE DU CODE *(≈ 20 min)*

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

## 🧭 ACTE IV — OUVREZ LE CAPOT *(≈ 3 min)*

Sur GitHub, ouvrez n'importe quel projet public et cliquez sur **Commits**.

1. Qui a fait le **dernier commit**, et quand ?
2. Trouvez un message **clair** et un message **vague**. Lequel aimeriez-vous lire
   dans six mois ?
3. Combien de **branches** le projet compte-t-il ?

> C'est le geste n° 5 du métier : **une version se désigne par son identifiant,
> jamais par « la dernière » ni par « la finale ».**

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

**2.** Ce qui distingue le cycle en V de la cascade :
`A` il supprime complètement l'étape des tests · `B` il livre une nouvelle version toutes les deux semaines · `C` il confie la conception entière au client · `D` chaque étape de conception a son test en miroir

**3.** Une méthode agile cherche à :
`A` livrer souvent, par petits morceaux, pour corriger tôt · `B` livrer une seule fois, quand tout est entièrement terminé · `C` suivre un plan fixé d'avance sans jamais le modifier · `D` supprimer les réunions avec le client pour aller plus vite

**4.** Les trois gestes de la culture DevOps vus dans cette séance :
`A` coder, tester, documenter · `B` planifier, livrer, facturer · `C` automatiser, mesurer, collaborer · `D` sécuriser, chiffrer, sauvegarder chaque soir

**5.** Un commit, c'est :
`A` une copie du dossier envoyée par courriel à l'équipe · `B` un instantané du projet, avec un auteur, une date et un message · `C` une sauvegarde automatique du poste faite chaque nuit · `D` un fichier renommé « version finale » dans le dossier partagé

**6.** Pourquoi travailler sur une branche ?
`A` pour avancer sans toucher à la version principale · `B` pour que le code s'exécute plus vite en production · `C` pour empêcher les collègues de lire son travail · `D` pour ne plus avoir besoin d'écrire de messages

**7.** Une pull request sert à :
`A` copier le dépôt d'un autre sur son propre poste · `B` supprimer une branche devenue inutile · `C` envoyer le code directement en production, sans passer par main · `D` faire relire des changements avant de les fusionner

**8.** Thomas avait bien fait un commit de sa correction, et pourtant la production ne l'avait pas. Pourquoi ?
`A` la production refuse tout commit fait le lundi · `B` Git avait effacé la correction pendant la nuit · `C` le commit était resté sur son poste, jamais poussé · `D` la correction contenait elle-même une erreur de calcul

**9.** Pour annuler un commit déjà partagé sans réécrire l'historique, on :
`A` crée un nouveau commit qui défait le précédent · `B` supprime le dépôt et on le recrée depuis zéro · `C` modifie le fichier directement sur le serveur · `D` demande à chacun d'effacer sa copie locale du dépôt

**10.** Pourquoi « ça marche sur mon poste » ne prouve-t-il rien ?
`A` parce que les postes des développeurs sont moins puissants que les serveurs · `B` parce que Git ne fonctionne que sur un serveur · `C` parce que les tests sont toujours faux sur un poste · `D` parce que la production ne tourne pas avec ce qui est sur le poste

??? question "🔓 Vérifier mes réponses"

    | Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
    |---|---|---|---|---|---|---|---|---|---|----|
    | **Rép.** | B | D | A | C | B | A | D | C | A | D |

    - **8 à 10** — Vous savez ce qu'est une version et comment elle voyage. En S5,
      on regardera la machine qui la **teste et la livre toute seule**.
    - **5 à 7** — Commit, push, merge se mélangent encore. Reprenez les six cartes
      de l'indice n° 3 : tout le trajet y est.
    - **0 à 4** — Retenez **deux** choses : un commit est un instantané daté et
      signé, qui reste sur le poste tant qu'on ne l'a pas poussé ; on travaille sur
      une branche et on fait relire avant de fusionner. Le reste s'accroche là.

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
> on peut toujours **revenir en arrière**.

Thomas avait raison : ça marchait sur son poste. Mais une correction qui n'a pas
quitté le poste n'existe pour personne d'autre. Désormais, quand on vous dira
« ça marche sur mon poste », vous saurez quoi répondre : **montre-moi le commit,
et dis-moi s'il est dans main.**

---

## 🎓 Concepts à connaître

*La liste qu'on projette à la fin de l'heure. Pour chacun, une seule question :
**sauriez-vous l'expliquer à voix haute, sans regarder ?** C'est aussi sur ces
concepts que portera le contrôle d'entrée de la séance suivante.*

1. **Les cycles de vie** — la cascade découvre ses erreurs à la fin, le V met un test
   en face de chaque étape, l'agile livre souvent pour corriger tôt. [1 2 3]
2. **La culture DevOps** — automatiser, mesurer, collaborer : abattre le mur entre ceux
   qui écrivent le code et ceux qui le font tourner. [4 10]
3. **Le commit** — un instantané daté, signé et expliqué, qui reste sur le poste tant
   qu'on ne l'a pas poussé. [5 8 10]
4. **Branche, pull request, fusion** — on travaille à côté, on fait relire, puis on
   fusionne dans la version principale. [6 7]
5. **Revenir en arrière** — un nouveau commit qui défait le précédent, sans effacer
   l'histoire : c'est ce qui rend le changement sans danger. [9]

---

## ⏭️ TEASER — SÉANCE 5

La correction de Thomas est enfin dans main. Mardi, elle part en production…
et casse la page d'accueil. Personne n'avait relancé les tests : « on n'avait pas
le temps ». Et si ce n'était pas à un humain de s'en souvenir ?

**Séance 5 : la machine qui teste et qui livre — et la boîte qui fait tourner le
code partout pareil.**
