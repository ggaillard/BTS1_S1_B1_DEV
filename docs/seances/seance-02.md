---
title: "SÉANCE 2 — « À la seconde près »"
seance: 2
duree: "1 h"
notee: false
---

# SÉANCE 2 — « À la seconde près »
### Pourquoi 9 400 personnes ont vu la même panne au même instant

> **Séance 2 / 14** · Acte 0 — Cadrage · **Durée : 1 h** · **100 % en ligne**
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

**Aucune note ne sera mise.** Comme la semaine dernière : répondre faux ne coûte
rien, ne pas répondre, si.

> Cette page-ci est la **trace écrite** de la séance : elle sert à **réviser après**,
> ou à rattraper si vous étiez absent.

---

## 🎬 COLD OPEN — le détail que personne n'avait relevé

La semaine dernière, DevSecure est tombée à 3 h 47. Vous avez trouvé la chaîne :
une ligne de code écrite sans vision système, un disque qui se remplit, une alerte
que personne ne lit, un déploiement à la main.

Le service est rétabli. Mais dans le rapport d'incident, Maya a entouré une ligne
au stylo rouge :

```
03:48:00   9 400 sessions fermées
03:48:00   9 400 sessions fermées   ← même seconde
03:48:00   ...
03:48:01   0 connexion active
```

> — *« Neuf mille quatre cents personnes. La même seconde. Vous trouvez ça normal ? »*

Thomas hausse les épaules : *« Le serveur est tombé, tout le monde l'a vu. »*

> — *« Non. Sur un site classique, personne ne voit rien tant qu'il ne clique pas.
> Là, ils l'ont su **sans rien faire**. Ça, ça veut dire que quelque chose était
> **ouvert en permanence** entre eux et nous. »*

**Il y a une chose que votre application fait, et que vous ne savez pas encore
nommer.** C'est l'objet de cette heure.

!!! info "Votre rôle aujourd'hui"
    Vous êtes l'équipe technique qui relit le rapport. À la fin de l'heure, vous
    saurez décrire **le trajet exact** d'une information entre un navigateur et un
    serveur — et pourquoi ce trajet explique la ligne entourée en rouge.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| 🔁 | Décrire l'**aller-retour** entre un client et un serveur | Vous lirez une requête (Acte I) |
| 🔢 | Lire un **code de statut** HTTP et dire qui est en tort | Indice n° 1 |
| 📡 | Distinguer **page complète, AJAX et WebSocket** | Vous choisirez la bonne technique (Acte II) |
| 🧩 | Expliquer ce qu'une **API REST** renvoie, et à qui | Indice n° 3 |
| 🔴 | Répondre à la question du rapport d'incident | Acte III |

*Compétence visée : **B1C2** — développer des solutions applicatives.*
*Prérequis : la séance 1. Si vous étiez absent, lisez d'abord « 03 h 47 ».*

---

## 🔁 ACTE I — LE TRAJET D'UNE REQUÊTE *(≈ 13 min)*

Ouvrez n'importe quel site. Ce que vous voyez n'est pas *dans* votre ordinateur :
il est allé le chercher. Chaque page est le résultat d'une **conversation**.

### Deux rôles, jamais plus

| | Rôle | Qui c'est | Ce qu'il fait |
|---|---|---|---|
| 🖥️ | **Le client** | Votre navigateur | Il **demande**. Toujours lui qui commence. |
| 🗄️ | **Le serveur** | La machine en face | Il **répond**. Il ne parle jamais le premier. |

Retenez cette dernière phrase, elle va se retourner contre nous à l'acte III.

### Ce que contient une demande

Une requête HTTP tient en trois choses :

```
GET  /api/projets/42      ← la MÉTHODE et l'ADRESSE de ce qu'on veut
Host: devsecure.fr
Authorization: Bearer …   ← qui demande
```

| Méthode | Ce qu'elle veut dire | En français |
|---|---|---|
| `GET` | Donne-moi | *lire* |
| `POST` | Voilà du nouveau | *créer* |
| `PUT` | Remplace par ceci | *modifier* |
| `DELETE` | Supprime | *supprimer* |

### Ce que contient la réponse

Le serveur répond avec un **code de statut** — trois chiffres qui disent en un
coup d'œil ce qui s'est passé.

| Famille | Sens | Exemple |
|---|---|---|
| **2xx** | Ça a marché | `200 OK` |
| **3xx** | C'est ailleurs | `301` déplacé |
| **4xx** | **Le client** a mal demandé | `404` introuvable, `401` non autorisé |
| **5xx** | **Le serveur** s'est planté | `500` erreur interne |

> 🔑 **Le chiffre des centaines dit qui est en tort.** `4xx`, c'est vous.
> `5xx`, c'est eux. Un développeur qui confond les deux cherche le bug du
> mauvais côté pendant une heure.

### 🧪 Indice n° 1 — à vous

La nuit du 3 h 47, quatre lignes sont remontées. Pour chacune, **quel code
de statut** le serveur a-t-il renvoyé ?

| # | Ce qui s'est passé | Code ? |
|---|---|---|
| a | L'application demande `/api/projets`, tout va bien | ? |
| b | Un utilisateur demande `/api/projets/99999`, ce projet n'existe pas | ? |
| c | La base est à terre, le serveur n'arrive pas à répondre | ? |
| d | Quelqu'un demande `/api/admin` sans être connecté | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Code | Pourquoi |
    |---|---|---|
    | a | **200 OK** | La demande est valide et la réponse part. |
    | b | **404 Not Found** | La ressource demandée n'existe pas — c'est le client qui se trompe d'adresse. |
    | c | **500 Internal Server Error** | Rien à reprocher au client : c'est le serveur qui échoue. |
    | d | **401 Unauthorized** | Le client n'a pas prouvé qui il est. Demande mal formée, donc `4xx`. |

    **Le piège du b et du d** : dans les deux cas l'utilisateur n'obtient rien,
    mais la cause est opposée. En `404` la chose n'existe pas ; en `401` elle
    existe et on vous la refuse. Confondre les deux, c'est chercher un bug
    inexistant.

!!! tip "Ce qui vient de se jouer"
    Vous venez d'apprendre le geste n° 2 du métier : **avant de corriger, lire le
    code de statut.** Il vous dit de quel côté de la conversation chercher.

---

## 📡 ACTE II — TROIS FAÇONS DE PARLER *(≈ 17 min)*

Le web n'a pas toujours su faire ce que fait Discord. Trois techniques se sont
empilées, et **les trois cohabitent aujourd'hui** dans la même application.

### 🕰️ 1993 — la page complète

```
Vous cliquez  →  requête  →  le serveur renvoie TOUTE la page  →  écran blanc  →  affichage
```

Chaque clic recharge tout. Un formulaire mal rempli ? On recharge, et vous
ressaisissez tout. C'est le web des débuts : **une page, un clic, un rechargement**.

### 🕰️ 2005 — AJAX, ou recharger un morceau

Le navigateur apprend à redemander **une partie** de la page, en arrière-plan,
sans écran blanc. Le fil d'une messagerie qui s'allonge, une liste qui se filtre
pendant que vous tapez : c'est ça.

```
Vous tapez  →  petite requête en arrière-plan  →  le serveur renvoie 3 lignes  →  la page se met à jour
```

**Mais c'est toujours le client qui demande.** Toutes les deux secondes,
s'il le faut. Le serveur, lui, se tait.

### 🕰️ 2011 — WebSocket, ou laisser la ligne ouverte

Le navigateur ouvre une connexion et **la garde ouverte**. Les deux côtés peuvent
alors parler quand ils veulent.

```
Ouverture  →  ═══ ligne ouverte en permanence ═══
              le serveur pousse    →  message reçu, sans rien demander
              vous envoyez         →  reçu de l'autre côté
```

C'est ce qui permet à un message d'apparaître **sans que vous ayez rien fait**.

| | Page complète | AJAX | WebSocket |
|---|---|---|---|
| Qui parle en premier | le client | le client | **les deux** |
| La connexion | fermée après chaque réponse | fermée après chaque réponse | **reste ouverte** |
| L'écran | recharge tout | met à jour un bout | met à jour un bout |
| Bon pour | une page qui ne bouge pas | une recherche, un formulaire | un chat, une notification, un cours en direct |

### 🧪 Indice n° 2 — la bonne technique

| # | Ce qu'on veut faire | Quelle technique ? |
|---|---|---|
| a | Afficher les mentions légales du site | ? |
| b | Proposer des villes pendant que l'utilisateur tape son adresse | ? |
| c | Faire apparaître un message dans une conversation, sans clic | ? |
| d | Afficher le tableau de la classe qui se remplit pendant la séance | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Technique | Pourquoi |
    |---|---|---|
    | a | **Page complète** | Rien ne bouge, personne n'attend de mise à jour. Le plus simple gagne. |
    | b | **AJAX** | Le client demande à chaque frappe. Court, ponctuel, déclenché par l'utilisateur. |
    | c | **WebSocket** | Le message vient de quelqu'un d'autre : le client ne peut pas savoir qu'il doit demander. |
    | d | **WebSocket** | Même raison. C'est l'autre qui agit, pas vous. |

    **La règle qui décide** : demandez-vous *qui sait qu'il y a du nouveau*. Si
    c'est le client, AJAX suffit. Si c'est le serveur, il faut une ligne ouverte.

### Et l'API REST, dans tout ça ?

Quand une page demande un morceau de données au lieu d'une page entière, elle
s'adresse à une **API REST**. Trois idées, pas une de plus :

1. **Chaque chose a une adresse.** `/api/projets/42`, c'est le projet 42.
2. **La méthode dit l'intention.** `GET` pour lire, `DELETE` pour supprimer — la
   même adresse, quatre verbes.
3. **La réponse est de la donnée, pas une page.** Du **JSON** en général :

```json
{ "id": 42, "nom": "Refonte du site", "avancement": 60, "responsable": "Léa" }
```

> 🔑 **Une API ne renvoie pas ce qu'on voit, elle renvoie ce qu'on sait.**
> La mise en forme, c'est le travail du client. C'est ce qui permet à un site,
> une appli mobile et une montre connectée de partager le même serveur.

!!! tip "Le motif caché"
    Vous reconnaissez le raisonnement de la séance 1 ? **Séparer les
    responsabilités.** Le serveur détient la donnée, le client la met en forme.
    Chaque côté fait une chose, et on peut changer l'un sans casser l'autre.

---

## 🌀 ACTE III — LE RETOURNEMENT *(≈ 12 min)*

Revenons à la ligne entourée en rouge.

```
03:48:00   9 400 sessions fermées   ← toutes à la même seconde
```

Vous avez maintenant de quoi répondre.

DevSecure affiche les projets **en temps réel** : quand un collègue déplace une
tâche, elle bouge sur votre écran sans que vous rechargiez. Donc chacun des
9 400 utilisateurs avait une **connexion WebSocket ouverte** vers le serveur.

Une ligne ouverte est une ligne qui se **coupe**. Quand le serveur s'est arrêté :

```
Site classique (page complète)     personne ne voit rien
                                   jusqu'au prochain clic → panne découverte peu à peu

DevSecure (WebSocket)              9 400 lignes coupées d'un coup
                                   → 9 400 écrans qui affichent « déconnecté », à la seconde
```

> 🎯 **Le twist** : ce n'est pas un défaut, c'est **le prix du confort**. Le temps
> réel qui fait la qualité de l'application est exactement ce qui a rendu la panne
> instantanée et totale. Toute fonctionnalité a un coût le jour où ça casse.

### 🧪 Indice n° 3 — reliez à la séance 1

Souvenez-vous des cinq composants (**MLDPP**). Le choix « on fait du temps réel »
est un choix de **Logiciel**. Nommez **deux autres composants** qu'il engage, et
dites en une phrase pourquoi.

??? question "🔓 Ouvrir les pistes des enquêteurs"

    - **Matériel** — 9 400 connexions maintenues ouvertes en permanence, ce n'est pas
      la même machine que 9 400 clics répartis dans la journée. Le temps réel se paie
      en serveurs.
    - **Procédures** — il faut prévoir la reconnexion automatique côté client, et
      tester ce qui se passe quand le serveur repart. Sinon 9 400 personnes rechargent
      la page en même temps, et le serveur retombe.
    - **Humain** — l'utilisateur qui voit « déconnecté » appelle le support. Neuf mille
      quatre cents appels potentiels, c'est une décision d'organisation, pas de code.
    - **Données** — un message envoyé pendant la coupure, il devient quoi ?

    **La leçon, la même que la semaine dernière** : le développeur agit sur le **L**,
    et ses choix engagent les quatre autres lettres. Sauf que cette fois, c'est vous
    qui l'avez montré.

---

## 🧭 ACTE IV — OUVREZ LE CAPOT *(≈ 3 min)*

Une application que vous utilisez tous les jours, et trente secondes :

1. Ouvrez-la dans un navigateur.
2. Touche **F12**, onglet **Réseau** (ou *Network*).
3. Rechargez, puis cliquez dans l'application **sans recharger**.

Vous voyez passer les requêtes en direct. Cherchez :

- une ligne avec un code **200** — et une avec un code **4xx**, il y en a presque toujours ;
- des requêtes qui partent **alors que vous n'avez pas rechargé** — c'est de l'AJAX ;
- dans le filtre **WS**, une ligne unique qui reste ouverte — c'est un WebSocket.

> C'est le geste n° 3 du métier : **on n'imagine pas ce qu'une application fait,
> on le regarde.**

---

## ✅ ÉPILOGUE — DANS L'APPLICATION

> Comme la semaine dernière : dix questions, la correction s'affiche dès l'envoi,
> et le tableau de la classe se construit en direct.
>
> **Pas de note. Pas de copie à rendre.**

---

## 📚 Réviser après la séance

Les dix questions, pour vous re-tester chez vous. **Répondez d'abord, ouvrez les
réponses ensuite** — dans cet ordre, sinon ça ne sert à rien.

**1.** Dans une conversation entre un navigateur et un serveur, qui parle en premier ?
`A` Le serveur · `B` Le client · `C` L'un ou l'autre · `D` Le réseau

**2.** La méthode HTTP qui sert à **créer** une ressource :
`A` GET · `B` DELETE · `C` POST · `D` PUT

**3.** Un code de statut qui commence par **5** signifie que le problème vient :
`A` du serveur · `B` du client · `C` du navigateur · `D` du mot de passe

**4.** Une page demandée n'existe pas. Le serveur renvoie :
`A` 200 · `B` 500 · `C` 301 · `D` 404

**5.** Vous demandez une page réservée sans être connecté. Le serveur renvoie :
`A` 401 · `B` 404 · `C` 200 · `D` 500

**6.** **AJAX** permet de :
`A` garder une connexion ouverte en permanence · `B` mettre à jour une partie de la page sans la recharger · `C` sécuriser les mots de passe · `D` stocker des données sur le serveur

**7.** La technique adaptée pour qu'un message apparaisse **sans que l'utilisateur clique** :
`A` la page complète · `B` AJAX · `C` WebSocket · `D` le responsive

**8.** Une **API REST** renvoie le plus souvent :
`A` une page HTML complète · `B` une image · `C` un fichier à télécharger · `D` de la donnée en JSON

**9.** Dans une API REST, l'adresse **/api/projets/42** désigne :
`A` la 42ᵉ page du site · `B` une ressource précise, le projet 42 · `C` une erreur · `D` un dossier sur le serveur

**10.** Pourquoi les 9 400 utilisateurs de DevSecure ont-ils vu la panne à la même seconde ?
`A` Ils rechargeaient tous la page au même moment · `B` Le serveur leur a envoyé un mail · `C` Chacun avait une connexion ouverte en permanence, coupée d'un coup · `D` C'est une coïncidence

??? question "🔓 Vérifier mes réponses"

    | Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
    |---|---|---|---|---|---|---|---|---|---|----|
    | **Rép.** | B | C | A | D | A | B | C | D | B | C |

    - **8 à 10** — Vous lisez une conversation client-serveur. En S3, on regardera
      *où vit* la donnée que l'API renvoie.
    - **5 à 7** — Le trajet est compris, les trois techniques se mélangent encore.
      Reprenez le tableau de l'acte II : la question qui décide est *qui sait qu'il
      y a du nouveau*.
    - **0 à 4** — Retenez **deux** choses : le client demande toujours le premier,
      sauf en WebSocket ; et `4xx` c'est le client, `5xx` c'est le serveur. Le reste
      s'accroche là-dessus.

### Le test de la conversation

Sans rien regarder, écrivez ce qui part et ce qui revient quand vous cliquez sur
un bouton « Supprimer ce projet ».

??? question "🔓 Comparer"

    **Ce qui part** : une requête `DELETE /api/projets/42`, avec de quoi prouver
    qui vous êtes.
    **Ce qui revient** : un code de statut. `200` si c'est fait, `401` si vous
    n'avez pas le droit, `404` si le projet n'existe plus, `500` si le serveur
    échoue.

    Vous avez écrit « le projet disparaît de l'écran » ? C'est vrai, mais c'est le
    **client** qui le fait, après avoir lu le code de statut. Le serveur, lui, n'a
    renvoyé que trois chiffres.

---

## 📝 À retenir de la séance 2

> Le **client demande**, le **serveur répond** — sauf en **WebSocket**, où la ligne
> reste ouverte et où le serveur peut parler le premier. Une réponse porte un **code
> de statut** : `4xx` le client s'est trompé, `5xx` le serveur a échoué. Une **API
> REST** donne une adresse à chaque chose et renvoie de la **donnée**, pas une page.
> Et le temps réel se paie : il rend l'application vivante, et la panne instantanée.

---

## ⏭️ TEASER — SÉANCE 3

L'API a renvoyé `{ "avancement": 60 }`. Mais ce 60, il était **rangé où** ?

Chez DevSecure, les projets sont dans une base relationnelle, les logs dans un
entrepôt, et le modèle de reco de Noah s'entraîne sur un troisième stock encore.
Trois endroits, trois façons de ranger — et Léa affirme qu'ils ne disent pas tous
la même chose.

**Séance 3 : où vit la donnée — SQL, NoSQL, et le lac où l'on se noie.**

---

## 🎁 Pour aller plus loin *(facultatif)*

- **Si vous avez fini avant les autres** : dans l'onglet Réseau, trouvez une requête
  qui renvoie du JSON et lisez-la. Combien de champs ? Lesquels sont affichés à
  l'écran, lesquels ne le sont pas ? Un serveur en dit souvent plus que la page.
- **Cette semaine** : repérez une application que vous utilisez et qui n'a **pas**
  de temps réel alors qu'elle en gagnerait — et une qui en a alors qu'elle n'en a
  pas besoin. On s'en resservira en S5, quand on parlera du coût de ce qu'on ajoute.
