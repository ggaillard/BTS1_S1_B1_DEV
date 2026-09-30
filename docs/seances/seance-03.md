---
title: "SÉANCE 3 — « 60, 47, 72 »"
seance: 3
duree: "1 h"
notee: false
---

# SÉANCE 3 — « 60, 47, 72 »
### Trois systèmes, une seule question, trois réponses différentes

> **Séance 3 / 14** · Acte 0 — Cadrage · **Durée : 1 h** · **100 % en ligne**
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

## 🎬 COLD OPEN — le même projet, trois chiffres

La semaine dernière, vous avez suivi une requête jusqu'au serveur. Elle est
revenue avec ceci :

```json
{ "id": 42, "nom": "Refonte du site", "avancement": 60 }
```

Ce matin, Léa arrive en réunion avec trois écrans ouverts. La même question à
chacun : **où en est le projet 42 ?**

```
Tableau de bord de l'application     avancement : 60 %
Rapport hebdomadaire de la direction avancement : 47 %
Modèle de prévision de Noah          avancement projeté : 72 %
```

Thomas tranche : *« Il y a un bug quelque part. Deux de ces chiffres sont faux. »*

Maya pose son stylo.

> — *« Non. Les trois sont justes. Ils ne répondent simplement pas à la même
> question, et ils ne parlent pas du même moment. Tant que vous ne savez pas
> **où vit** chaque chiffre, vous ne pouvez pas savoir ce qu'il veut dire. »*

**Un même fait, stocké à trois endroits, ne raconte pas la même histoire.**
C'est l'objet de cette heure.

!!! info "Votre rôle aujourd'hui"
    Vous êtes chargé de dire à la direction **lequel des trois chiffres mettre
    dans le rapport**. À la fin de l'heure, vous saurez que ce n'est pas la bonne
    question — et vous saurez poser la bonne.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| 🗃️ | Décrire une **base relationnelle** : table, clé, jointure | Indice n° 1 |
| 🧩 | Dire quand un **schéma souple** vaut mieux qu'un tableau | Acte II |
| 🔀 | Choisir entre **SQL et NoSQL** selon l'usage | Indice n° 2 |
| 🏞️ | Distinguer un **lac** d'un **entrepôt** de données | Acte III |
| 🧲 | Dire ce que fait une **base vectorielle** et quand elle sert | Indice n° 4 |
| 🔴 | Expliquer pourquoi 60, 47 et 72 sont tous les trois justes | Indice n° 3 |

*Compétence visée : **A4.1.3** — exploiter des données à des fins d'analyse.*
*Prérequis : la séance 2. Si vous étiez absent, lisez d'abord « À la seconde près ».*

---

## 🗃️ ACTE I — LE TABLEAU QUI TIENT DEBOUT *(≈ 13 min)*

Le 60 vient de la base de l'application. C'est une **base relationnelle** : le
plus ancien des trois systèmes, et de loin le plus répandu.

### L'idée tient en un dessin

Des **tables**. Une table par sorte de chose. Une **ligne** par chose, une
**colonne** par information.

```
TABLE projets                          TABLE taches
id | nom              | avancement     id | projet_id | libelle        | faite
---|------------------|-----------     ---|-----------|----------------|------
42 | Refonte du site  | 60             7  | 42        | Maquettes      | oui
43 | Migration mail   | 15             8  | 42        | Intégration    | non
```

Deux mots à retenir :

| Mot | Ce que c'est | Dans le dessin |
|---|---|---|
| **Clé primaire** | La colonne qui identifie une ligne, sans doublon possible | `id` |
| **Clé étrangère** | Une colonne qui pointe vers la clé primaire d'une autre table | `projet_id` |

C'est cette flèche entre les deux tables qu'on appelle une **relation** — d'où
le nom. Et l'opération qui suit la flèche pour recoller les deux tables s'appelle
une **jointure**.

### Ce que le relationnel garantit

Un schéma **décidé d'avance**. On déclare les tables, les colonnes et leur type
avant d'écrire la première ligne. Une donnée qui ne rentre pas dans le moule est
**refusée**, pas rangée n'importe où.

Et surtout, les **transactions** : un virement retire d'un compte *et* ajoute à
l'autre, ou ne fait ni l'un ni l'autre. Jamais la moitié.

> 🔑 **Le relationnel est fait pour l'exactitude à l'instant présent.** Il répond
> parfaitement à « quel est l'état de la chose, là, maintenant ». Le 60 de Léa,
> c'est cela : l'état du projet 42 à la seconde où on a demandé.

### 🧪 Indice n° 1 — à vous

DevSecure veut afficher, pour chaque projet, le nom du projet **et** le nombre
de tâches restantes. Répondez sans écrire de code :

| # | Question | Votre réponse |
|---|---|---|
| a | Combien de tables sont concernées ? | ? |
| b | Quelle colonne relie les deux ? | ? |
| c | Comment s'appelle l'opération qui les recolle ? | ? |
| d | Si on supprime le projet 42, que deviennent ses tâches ? | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Réponse | Pourquoi |
    |---|---|---|
    | a | **Deux** — projets et tâches | Une table par sorte de chose. Une tâche n'est pas un projet. |
    | b | **projet_id**, dans la table des tâches | C'est la clé étrangère : elle pointe vers la clé primaire des projets. |
    | c | Une **jointure** | Elle suit la flèche pour présenter les deux tables comme une seule. |
    | d | **Ça dépend de ce qu'on a déclaré** | Soit la base refuse la suppression, soit elle supprime les tâches en cascade. Ce n'est pas au hasard : c'est décidé à la création. |

    **Le piège du d** : beaucoup répondent « elles restent ». Des tâches qui
    pointent vers un projet disparu, ce sont des **orphelines** — et c'est
    exactement ce que le relationnel est fait pour empêcher.

!!! tip "Ce qui vient de se jouer"
    Vous venez de lire un **modèle de données**. Avant d'écrire la moindre ligne
    de code, un développeur dessine ces tables et ces flèches. Une application se
    construit sur son modèle, pas l'inverse.

---

## 🧩 ACTE II — QUAND LE TABLEAU NE SUFFIT PLUS *(≈ 14 min)*

Le relationnel est excellent. Il a pourtant deux limites, et elles sont
devenues gênantes vers 2005, quand les applications ont commencé à recevoir des
millions d'événements par jour.

### Limite n° 1 — le moule est rigide

Ajouter une colonne à une table de trois cents millions de lignes, c'est une
opération lourde. Or les journaux d'événements ne se ressemblent pas :

```
Un clic          : page, utilisateur, date
Une erreur       : message, pile d'appels, version, serveur, date
Une connexion    : adresse IP, appareil, navigateur, date
```

Trois formes différentes. Dans un tableau, il faudrait autant de colonnes que
la réunion de tous les cas — et laisser vides les trois quarts.

### Limite n° 2 — la jointure coûte cher

Recoller cinq tables, c'est peu de travail sur mille lignes. Sur trois cents
millions, réparties sur vingt machines, c'est un problème.

### La réponse : NoSQL

Non pas « pas de SQL », mais **pas seulement du relationnel**. Quatre familles,
selon la forme de ce qu'on range :

| Famille | On range… | Bon pour |
|---|---|---|
| **Clé-valeur** | Une étiquette, une valeur | Un panier, une session, un cache |
| **Document** | Des fiches libres, souvent en JSON | Des objets de formes variées |
| **Colonnes** | Des colonnes par groupes | De très gros volumes d'événements |
| **Graphe** | Des points et des liens | Des réseaux, des recommandations |

Une cinquième famille, la base **vectorielle**, est arrivée avec l'IA : elle a
son propre acte, plus loin.

La plus courante est la **base documentaire**. Chaque enregistrement est une
fiche complète, qui n'a pas besoin de ressembler à sa voisine :

```json
{ "type": "erreur", "message": "disque plein", "serveur": "web-03",
  "version": "2.4.1", "date": "2026-09-03T03:47:12" }
```

Deux conséquences, et il faut assumer les deux :

- **Schéma souple** — on ajoute un champ sans prévenir personne. Pratique le jour
  où le besoin change ; dangereux le jour où plus personne ne sait ce que
  contiennent les fiches.
- **On recopie plutôt qu'on ne joint** — le nom du serveur est écrit dans chaque
  fiche. C'est la **dénormalisation** : on accepte de répéter pour éviter la
  jointure. Le prix : si le nom change, il faut le changer partout.

> 🔑 **Le relationnel refuse ce qui ne rentre pas ; le NoSQL accepte et vous fait
> confiance.** Ce n'est pas un progrès, c'est un échange : on troque une garantie
> contre de la souplesse et de la vitesse.

### 🧪 Indice n° 2 — le bon rangement

| # | Ce qu'on veut ranger | Relationnel ou NoSQL ? |
|---|---|---|
| a | Les salaires et les contrats du personnel | ? |
| b | Trois cents millions de lignes de journal par mois | ? |
| c | Le panier d'un client, le temps de sa visite | ? |
| d | « Qui connaît qui » dans un réseau professionnel | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Choix | Pourquoi |
    |---|---|---|
    | a | **Relationnel** | Des règles strictes, des montants exacts, des transactions. On ne veut surtout pas de souplesse ici. |
    | b | **NoSQL, orienté colonnes** | Volume énorme, formes variables, et aucune transaction à garantir : une ligne de journal perdue n'est pas un virement perdu. |
    | c | **NoSQL, clé-valeur** | Une étiquette, un contenu, une durée de vie courte. La jointure n'a aucun intérêt. |
    | d | **NoSQL, graphe** | La question porte sur les **liens**, pas sur les fiches. En relationnel, « les amis des amis des amis » demande trois jointures ; en graphe, c'est un parcours. |

    **La question qui décide** : *ai-je besoin d'une garantie, ou de souplesse et
    de volume ?* Les deux ne s'obtiennent pas ensemble. Et dans une vraie
    application, **les deux cohabitent** — comme AJAX et WebSocket la semaine
    dernière.

!!! tip "Le motif caché"
    Encore le raisonnement de la séance 1 : **choisir selon l'usage, pas selon la
    mode.** Un développeur qui met tout en NoSQL parce que c'est moderne perd les
    garanties dont son métier a besoin.

---

## 🏞️ ACTE III — LE LAC ET L'ENTREPÔT *(≈ 10 min)*

Reste le 47 et le 72. Ni l'un ni l'autre ne sort de la base de l'application.

### Le lac de données

Tout ce que produit l'entreprise, **brut**, versé au même endroit : journaux,
exports, fichiers, mesures. Sans schéma, sans tri, sans question préalable.

On y verse **au cas où** : on ne sait pas encore ce qu'on cherchera. C'est
là-dedans que Noah a entraîné son modèle — d'où le **72**, qui n'est pas un
constat mais une **prévision**.

> ⚠️ Un lac dans lequel personne ne range devient un **marécage** : des téraoctets
> dont plus personne ne sait d'où ils viennent ni ce qu'ils valent. C'est le
> risque principal, et il est d'organisation, pas de technique.

### L'entrepôt de données

L'inverse. On décide **d'avance** des questions qu'on posera, on nettoie, on
recalcule, on range. Les chiffres y sont **stables et comparables** — mais
recalculés à intervalle fixe, souvent la nuit.

D'où le **47** : l'entrepôt a calculé l'avancement du projet 42 **sur la semaine
close**, dimanche soir. Depuis, deux tâches ont été terminées.

### Les trois chiffres, côte à côte

| | 60 | 47 | 72 |
|---|---|---|---|
| **D'où il vient** | base relationnelle | entrepôt | modèle entraîné sur le lac |
| **De quand il parle** | maintenant | dimanche dernier | dans trois semaines |
| **Ce qu'il est** | un **constat** | un **constat consolidé** | une **prévision** |
| **Bon pour** | piloter aujourd'hui | comparer les semaines | anticiper |

> 🎯 **Le twist** : la question de Thomas — *lequel est faux ?* — n'a pas de
> réponse, parce qu'elle est mal posée. Aucun n'est faux. La bonne question est
> **« de quand et de quoi parle ce chiffre ? »**. Un chiffre sans sa date et sans
> sa source n'est pas une information : c'est une opinion avec des décimales.

### 🧪 Indice n° 3 — reliez à la séance 1

Souvenez-vous des cinq composants (**MLDPP**). Ces trois systèmes sont trois
façons de traiter le **D**. Nommez **deux autres composants** engagés par le
choix « on monte un lac de données », et dites en une phrase pourquoi.

??? question "🔓 Ouvrir les pistes des enquêteurs"

    - **Matériel** — stocker tout, au cas où, se paie au téraoctet, tous les mois,
      y compris pour ce qu'on ne lira jamais.
    - **Procédures** — sans catalogue ni règle de nommage, le lac devient un
      marécage en six mois. Ranger est une procédure, pas un logiciel.
    - **Humain** — quelqu'un doit savoir répondre à « d'où vient ce chiffre ? ».
      Sans cette personne, les trois écrans de Léa se contredisent pour toujours.
    - **Logiciel** — et le RGPD s'applique aussi au lac : des données personnelles
      versées « au cas où » restent des données personnelles.

    **La leçon** : le développeur agit sur le **L**, mais ranger la donnée engage
    les quatre autres lettres. C'est le même raisonnement qu'en séance 1 — appliqué
    cette fois à ce qu'on garde, pas à ce qu'on écrit.

---

## 🧲 ACTE IV — LA BASE QUI CHERCHE PAR LE SENS *(≈ 7 min)*

La réunion n'est pas finie. Léa ouvre un quatrième écran : l'**assistant** de
l'équipe. On lui pose une question en français, il cherche dans les documents
de l'entreprise et il répond.

```
> Le nouveau site, on en est où ?
Assistant : « D'après le rapport hebdomadaire du 27 septembre,
              la refonte du site est avancée à 47 %. »
```

Léa n'a écrit ni « refonte », ni « projet 42 ». Et il a pourtant trouvé le bon
document.

### Chercher un mot, chercher un sens

Une requête SQL cherche ce qui est **égal** : `nom = 'nouveau site'` ne trouve
rien, aucune ligne ne s'appelle ainsi.

### Transformer un texte en nombres

Un **modèle d'embedding** — un petit modèle d'IA — lit un texte et le
transforme en **vecteur** : une liste de plusieurs centaines de nombres. Deux
textes qui veulent dire la même chose donnent deux vecteurs **proches**, même
sans un seul mot en commun.

```
« Le nouveau site, on en est où ? »          → [ 0.12, -0.48, 0.91, … ]
« Refonte du site : avancement 47 % »        → [ 0.10, -0.51, 0.88, … ]  proche
« Contrat de maintenance des imprimantes »   → [-0.73,  0.22, 0.05, … ]  loin
```

### La base de données vectorielle

Elle range ces vecteurs, avec le texte d'origine. Et elle sait répondre très
vite à une seule question : **quels sont les plus proches de celui-ci ?** C'est
la **recherche par similarité** — pas « égal ou différent », mais un classement
du plus proche au plus lointain.

| | Base relationnelle | Base vectorielle |
|---|---|---|
| Elle range | des lignes et des colonnes | des vecteurs, avec leur texte |
| Elle répond à | « qu'est-ce qui est **égal** à… ? » | « qu'est-ce qui **ressemble** à… ? » |
| Exemple | le projet n° 42 | les trois documents les plus proches de la question |

C'est parfois une simple extension : **pgvector** ajoute les vecteurs à
PostgreSQL. L'assistant de Léa travaille en deux temps : la base retrouve les
passages les plus proches, puis un modèle de langage rédige la réponse à partir
d'eux. C'est le **RAG**, la génération augmentée par la recherche.

> 🔑 **Encore la même leçon.** L'assistant ne « sait » rien : il répète le
> document retrouvé. Son 47 vient du rapport de la direction — donc de
> l'entrepôt, calculé dimanche soir. Un chiffre qui sort d'une IA se lit, lui
> aussi, **avec sa date et sa source**.

### 🧪 Indice n° 4 — égal ou ressemble ?

| # | La question posée | Relationnelle ou vectorielle ? |
|---|---|---|
| a | « Donne-moi la fiche du client n° 1207 » | ? |
| b | « Retrouve les tickets d'incident qui parlent du même problème que celui-ci » | ? |
| c | « Quels comptes rendus parlent de retard de livraison ? », sans savoir quels mots ils emploient | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Choix | Pourquoi |
    |---|---|---|
    | a | **Relationnelle** | On cherche un identifiant exact. Rien ne « ressemble » au client 1207 : c'est lui ou ce n'est pas lui. |
    | b | **Vectorielle** | Deux personnes décrivent la même panne avec des mots différents. On cherche un sens proche. |
    | c | **Vectorielle** | « Retard », « livraison décalée », « on a glissé de deux semaines » : trois façons de dire la même chose. |

    **La question qui décide** : *est-ce que je cherche ce qui est **égal**, ou ce
    qui **ressemble** ?* Et dans une vraie application, les deux cohabitent —
    souvent dans la même base, grâce à pgvector.

---

## 🧭 ACTE V — OUVREZ LE CAPOT *(≈ 3 min)*

Reprenez le geste de la semaine dernière — **F12**, onglet **Réseau** — sur une
application que vous utilisez. Cliquez sur une ligne qui renvoie du JSON.

Trois questions, à chaque fois :

1. **Combien de champs** la réponse contient-elle, et combien sont réellement
   affichés à l'écran ?
2. Voyez-vous des informations **répétées** d'une fiche à l'autre — un nom, une
   catégorie ? C'est de la dénormalisation.
3. Trouvez-vous une **date** dans la réponse ? Si oui, de quand parle-t-elle : de
   la création de la chose, ou du calcul du chiffre ?

> C'est le geste n° 4 du métier : **un chiffre se lit avec sa date et sa source,
> jamais tout seul.**

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

**1.** Dans une base relationnelle, la colonne qui identifie une ligne sans doublon possible s'appelle :
`A` la clé étrangère · `B` la jointure · `C` la clé primaire · `D` l'index

**2.** L'opération qui recolle deux tables reliées entre elles s'appelle :
`A` une jointure · `B` une transaction · `C` une agrégation · `D` une migration

**3.** Ce qu'une transaction garantit :
`A` que la requête sera exécutée en moins d'une seconde · `B` que les données seront compressées avant d'être écrites · `C` que la base acceptera n'importe quelle forme de données · `D` que l'opération se fait entièrement, ou pas du tout

**4.** Le principal atout d'une base documentaire par rapport au relationnel :
`A` elle répond toujours plus vite, quel que soit le volume · `B` chaque fiche peut avoir sa propre forme · `C` elle garantit mieux l'exactitude des données liées · `D` elle occupe beaucoup moins de place sur le disque

**5.** La famille NoSQL adaptée pour répondre à « qui connaît qui » dans un réseau :
`A` clé-valeur · `B` document · `C` graphe · `D` colonnes

**6.** La dénormalisation consiste à :
`A` supprimer les doublons d'une table pour gagner de la place en base · `B` accepter de répéter une information pour éviter une jointure · `C` chiffrer les données sensibles avant de les enregistrer · `D` répartir la base sur plusieurs machines pour tenir la charge

**7.** Un lac de données contient :
`A` uniquement des tables nettoyées et déjà rangées · `B` seulement les données de l'année en cours · `C` les seuls chiffres validés par la direction · `D` des données brutes, versées sans schéma préalable

**8.** Un entrepôt de données se distingue d'un lac parce que :
`A` on décide d'avance des questions et on range en conséquence · `B` il contient toujours beaucoup moins de données · `C` il n'accepte que des fichiers au format JSON · `D` il ne conserve jamais rien plus de trois mois

**9.** Une base de données vectorielle sert d'abord à répondre à :
`A` « quelle ligne porte exactement cet identifiant ? » · `B` « quelles tables faut-il relier par une jointure ? » · `C` « quel chiffre a été recalculé dimanche soir ? » · `D` « quels textes ressemblent le plus à celui-ci ? »

**10.** Pourquoi 60, 47 et 72 peuvent-ils être justes tous les trois ?
`A` parce que les trois systèmes sont mal synchronisés · `B` parce qu'ils ne parlent ni du même moment ni de la même chose · `C` parce que deux d'entre eux ne sont que des estimations · `D` parce que l'un des trois chiffres a été arrondi

??? question "🔓 Vérifier mes réponses"

    | Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
    |---|---|---|---|---|---|---|---|---|---|----|
    | **Rép.** | C | A | D | B | C | B | D | A | D | B |

    - **8 à 10** — Vous savez où vit une donnée et ce que cela change. En S4, on
      regardera comment le **code** qui la manipule est versionné.
    - **5 à 7** — Les familles se mélangent encore. Reprenez le tableau des trois
      chiffres : c'est lui qui contient tout le raisonnement.
    - **0 à 4** — Retenez **deux** choses : le relationnel refuse ce qui ne rentre
      pas, le NoSQL accepte et vous fait confiance ; le lac garde brut, l'entrepôt
      range à l'avance. Le reste s'accroche là-dessus — y compris la base
      vectorielle, qui cherche ce qui ressemble plutôt que ce qui est égal.

### Le test du chiffre orphelin

On vous montre un écran qui affiche « satisfaction client : 82 % ». Écrivez les
**trois questions** à poser avant d'y croire.

??? question "🔓 Comparer"

    1. **D'où vient-il ?** Base de l'application, entrepôt, ou modèle ?
    2. **De quand parle-t-il ?** Aujourd'hui, la semaine close, ou une projection ?
    3. **Sur qui est-il calculé ?** Tous les clients, ou ceux qui ont répondu ?

    Vous avez écrit « est-ce que le calcul est bon ? » ? C'est légitime, mais c'est
    la quatrième question. Les trois premières éliminent la plupart des désaccords
    avant même de vérifier une formule — c'est exactement ce qui s'est passé en
    réunion ce matin.

---

## 📝 À retenir de la séance 3

> Une base **relationnelle** range dans des tables reliées par des clés, refuse ce
> qui ne rentre pas dans le moule, et garantit l'exactitude à l'instant présent.
> Le **NoSQL** accepte des formes variables et évite les jointures en acceptant de
> répéter — souplesse et volume contre garanties. Un **lac** garde tout brut, au
> cas où ; un **entrepôt** range à l'avance les réponses aux questions qu'on sait
> déjà poser. Une base **vectorielle** range des textes changés en nombres par un
> modèle, et répond à « qu'est-ce qui ressemble à… ? » plutôt qu'à « qu'est-ce qui
> est égal à… ? ». Et un chiffre se lit **avec sa date et sa source** — y compris
> quand c'est une IA qui le donne : sans elles, ce n'est pas une information.

---

## 🎓 Concepts à connaître

*La liste qu'on projette à la fin de l'heure. Pour chacun, une seule question :
**sauriez-vous l'expliquer à voix haute, sans regarder ?** C'est aussi sur ces
concepts que portera le contrôle d'entrée de la séance suivante.*

1. **Une base relationnelle** — des tables, une **clé** qui identifie chaque ligne, des
   **jointures** pour les relier. Elle refuse ce qui ne rentre pas dans le moule : c'est
   son défaut, et c'est surtout sa garantie. [1 2 3]
2. **Un schéma souple (NoSQL)** — on accepte des formes variables et on **répète** plutôt
   que de joindre. Souplesse et volume d'un côté, garanties de l'autre : on choisit. [4 5 6]
3. **Choisir entre SQL et NoSQL** — la question n'est jamais « lequel est le meilleur »,
   mais **« qu'est-ce qui doit être garanti ici ? »**. [4 6]
4. **Lac et entrepôt** — le **lac** garde tout, brut, au cas où ; l'**entrepôt** range à
   l'avance les réponses aux questions qu'on sait déjà poser. [7 8]
5. **Une base vectorielle** — un modèle change chaque texte en vecteur ; la base répond à
   « qu'est-ce qui **ressemble** à… ? », pas à « qu'est-ce qui est égal à… ? ». [9]
6. **Un chiffre sans date ni source n'est pas une information** — 60, 47 et 72 étaient
   justes tous les trois, et le 47 de l'assistant venait de l'entrepôt. La bonne question
   n'était pas « lequel est faux ». [10]

---

## ⏭️ TEASER — SÉANCE 4

Le 47 de l'entrepôt était faux pendant six jours. Pas le calcul : le code du
calcul. Quelqu'un l'avait corrigé lundi… sur son poste, et jamais ailleurs.
Thomas jure qu'il a « poussé la version ». Personne ne sait laquelle tourne en
production, ni depuis quand. Et l'assistant, lui, continue de répéter 47 :
son index date d'avant la correction.

**Séance 4 : qui a écrit quoi, quand, et comment revenir en arrière.**
